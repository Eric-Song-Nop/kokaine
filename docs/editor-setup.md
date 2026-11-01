# Editor setup

Generated applications include editor configuration beside their package
manifest:

- `koka.json` configures [`koka.nvim`](https://github.com/syaiful6/koka.nvim#project-configuration);
- `.vscode/settings.json` passes the equivalent `jsweb`, application source,
  and `@kokaine/core` source arguments to the official Koka extension for
  Visual Studio Code.

Open the generated application directory itself as the editor workspace. If
`.vscode/settings.json` is created or changed while Visual Studio Code is
already open, run **Developer: Reload Window** from the command palette. The
extension reads compiler arguments when it activates, so **Koka: Restart
Language Server** alone may reuse stale settings. After the reload, a missing
`kokaine/reactive` diagnostic should show both `src` and
`node_modules/@kokaine/core/src` in the compiler search path.

The generated settings deliberately do not contain
`koka.languageServer.compiler`, because the managed compiler path is specific
to the user's operating system and cache directory. Use the extension's Koka
compiler install/select commands, or run `kokaine doctor` and configure the
reported compiler binary as a personal machine setting. Do not commit that
absolute path.

The exact `koka.json` and `.vscode/settings.json` contents are listed under
[Editor project configuration](npm-packages.md#editor-project-configuration).
See [npm packages and workspaces](npm-packages.md) for the manifest contract,
peer-dependency convention, module namespace rules, and workspace behavior.
