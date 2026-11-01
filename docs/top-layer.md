# Native dialog and Popover

Kokaine uses the browser's native top layer instead of relocating overlay DOM.
`dialog` and elements carrying `popover(...)` remain ordinary children of the
view which created them, so the existing owner, listener, cleanup, and SSR
rules apply unchanged. The browser supplies modal inertness, focus placement,
Escape handling, light dismiss, and popover stacking.

The DOM/SSR-neutral `kokaine/html` vocabulary includes:

- `dialog { ... }` and `dialog("text")` builders;
- `popover(Popover-auto|Popover-manual|Popover-hint)`;
- `popover-target(id)` and
  `popover-target-action(Popover-toggle|Popover-show|Popover-hide)`;
- `dialog-form-method()`, `autofocus()`, and
  `dialog-closed-by(Dialog-close-any|Dialog-close-request|Dialog-close-explicit)`.

These helpers serialize as ordinary HTML attributes. In particular, Kokaine
does not provide a live `open` attribute: a dialog or popover can also close
because of Escape, light dismiss, form submission, or another popover. Listen
for native `close`, `cancel`, `beforetoggle`, or `toggle` events and read the
browser's resulting state instead of treating it as a one-way signal.

The `kokaine/dom` command layer is deliberately thin:

```text
dialog/show(node)                 popover/show(node)
dialog/show-modal(node)           popover/hide(node)
dialog/close(node,result="")      popover/toggle(node) -> bool
dialog/request-close(node,result="")
dialog/is-open(node) -> bool      popover/set-open(node,bool)
dialog/is-modal(node) -> bool     popover/is-open(node) -> bool
dialog/return-value(node) -> string
```

Every command and state read above has a `<ui,exn>` effect row.
`toggle/state(event)` reads `ToggleEvent.newState`, and
`dialog/event-return-value(event)` reads the closing dialog's `returnValue`.
Targets and event shapes are validated, and native host failures cross the
same DOM-exception-to-Koka-`exn` boundary as the rest of the renderer.
`dialog/request-close` never falls back to `close`, because only the former
fires the cancelable `cancel` event first.

Browser support follows the platform: core [`<dialog>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog)
is widely available across browsers since March 2022, the core
[`popover` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover)
is Baseline 2024, and
[`requestClose()`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/requestClose)
is Baseline 2025. Applications supporting older engines should feature-detect
newer pieces independently; for example:

```js
const hasDialog = typeof HTMLDialogElement === "function";
const hasPopover =
  typeof HTMLElement === "function" &&
  "popover" in HTMLElement.prototype &&
  typeof HTMLElement.prototype.showPopover === "function" &&
  typeof CSS !== "undefined" &&
  typeof CSS.supports === "function" &&
  CSS.supports("selector(:popover-open)");
const hasRequestClose =
  hasDialog &&
  typeof HTMLDialogElement.prototype.requestClose === "function";
const hasClosedBy = hasDialog && "closedBy" in HTMLDialogElement.prototype;
let hasHintPopover = false;
if (hasPopover) {
  const hintProbe = document.createElement("div");
  hintProbe.popover = "hint";
  hasHintPopover = hintProbe.popover === "hint";
}
```

Unsupported command methods produce a clear Koka exception. Kokaine does not
silently install partial polyfills for `requestClose`, `closedby`, or hint
popover semantics.

## Example

Run the native top-layer example from a repository checkout:

```sh
make serve-top-layer
```

Open <http://127.0.0.1:4173/examples/top-layer/> to try a modal dialog with a
native `method="dialog"` form and an auto popover controlled entirely through
`popovertarget` attributes. The page also shows browser-driven close/toggle
state being written back through Kokaine event handlers.
