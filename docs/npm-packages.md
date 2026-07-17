# npm packages and workspaces

Kokaine uses npm package identity and Node's installed dependency layout as its
only package-management layer. npm, pnpm, and Yarn installations that expose a
`node_modules` layout are supported. The CLI reads installed packages; it never
selects versions, modifies dependencies, or writes a lockfile. Yarn PnP is not
part of the initial contract.

## Applications

An application pins one exact Koka compiler and the `jsweb` target:

```json
{
  "scripts": {
    "dev": "kokaine dev",
    "build": "kokaine build",
    "check": "kokaine check",
    "doctor": "kokaine doctor"
  },
  "dependencies": {
    "@kokaine/core": "^0.1.0"
  },
  "devDependencies": {
    "@kokaine/cli": "^0.1.0",
    "vite": "^8.1.5"
  },
  "kokaine": {
    "schemaVersion": 1,
    "entry": "src/app/main.kk",
    "sources": ["src"],
    "compiler": "3.2.3",
    "target": "jsweb",
    "outDir": ".kokaine/generated",
    "buildDir": ".kokaine/build"
  }
}
```

`entry`, `sources`, `outDir`, and `buildDir` are relative to the application
root and may not escape it. `sources` defaults to the first directory in
`entry`; the generated template declares it explicitly. Compiler output is
staged and promoted only after a successful compile, so a failed development
rebuild leaves the last working modules available to Vite.

## Koka source packages

Any npm package can expose Koka sources with a `koka` field:

```json
{
  "name": "@example/kokaine-router",
  "version": "1.0.0",
  "files": ["src", "js"],
  "peerDependencies": {
    "@kokaine/core": "^0.1.0"
  },
  "koka": {
    "schemaVersion": 1,
    "sources": ["src"],
    "compiler": ">=3.2.3 <3.3.0",
    "targets": ["jsweb"]
  }
}
```

Source roots are canonicalized with `realpath`; a lexical path or symlink that
escapes the package root is rejected. Packages without a `koka` field remain
ordinary JavaScript packages and contribute no Koka include path. A package may
ship JavaScript bridge files beside its `.kk` sources, and Vite resolves their
bare npm imports from the same installed graph.

## Global module identity

Koka modules do not have package-qualified identities. Libraries should use a
stable global prefix such as `example/router/...`, and Kokaine extensions should
declare `@kokaine/core` as a peer dependency so the consumer selects one runtime
identity.

Before invoking Koka, the CLI rejects:

- multiple installed versions or unproven physical copies of one Koka package;
- duplicate `module ...` declarations across all discovered source roots;
- package compiler ranges that exclude the application's exact compiler;
- packages that do not declare support for `jsweb`.

Conflict diagnostics include every relevant npm dependency path, package root,
version, constraint, and source file. Include-path order is therefore never used
as an implicit conflict resolver.

## Workspaces and reproducibility

Dependencies are resolved from each parent package's context, so nested npm
installs, pnpm symlinks, hoisted peers, and workspace links preserve their real
dependency relationships. Equal symlinks are deduplicated by canonical package
root. Development watching uses only the discovered source roots, including the
real workspace directory behind a link.

The build fingerprint includes the application entry, compiler, target, flags,
and sorted Koka package metadata. With the same lockfile, CLI version, compiler,
and target, discovery and command construction are deterministic. Once the
compiler exists in the cache, `doctor`, `check`, `build`, and `dev` do not need
network access.

## Editor project configuration

The generated application includes a `koka.json` understood by
[`koka.nvim`](https://github.com/syaiful6/koka.nvim#project-configuration):

```json
{
  "target": "jsweb",
  "cwd": ".",
  "include_dirs": ["src", "node_modules/@kokaine/core/src"],
  "compiler_args": ["-j1"]
}
```

The official VS Code Koka extension does not read `koka.json`, so the generated
application also includes `.vscode/settings.json` with the equivalent compiler
arguments:

```json
{
  "koka.languageServer.compilerArguments": [
    "--target=jsweb",
    "--include=src",
    "--include=node_modules/@kokaine/core/src",
    "-j1"
  ]
}
```

These files give both editors the same application and core source roots as a
minimal CLI project. The VS Code extension still selects its compiler through
the `koka.languageServer.compiler` machine setting or its compiler commands;
an absolute, machine-specific compiler path is intentionally not generated.
Add direct editor-only source roots when introducing more Koka packages;
`kokaine doctor --json` remains the authoritative source for the full canonical
transitive graph used by builds.
