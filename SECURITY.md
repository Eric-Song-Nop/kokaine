# Security policy

Please report vulnerabilities privately through
[GitHub security advisories](https://github.com/Eric-Song-Nop/kokaine/security/advisories/new)
rather than in a public issue. You should get a first response within a week.

In scope:

- escaping or validation bypasses in `kokaine/html`, `kokaine/ssr`, and
  `kokaine/dom` (for example markup injection, `on*` attributes, or URL schemes
  such as `javascript:` reaching a URL attribute without `unsafe-trusted-url`);
- the CLI's compiler download, checksum verification, and archive extraction;
- the Playground's sandboxing of previews and Workers.

Only the latest published versions receive fixes.
