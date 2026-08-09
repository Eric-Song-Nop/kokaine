/*--------------------------------------------------------------------------
  Typed boundary between the Kokaine-owned workbench and browser capabilities.
  Project storage, Monaco, Workers, and sandbox execution stay in TypeScript;
  every visible state transition returns through renderer-owned DOM events.
--------------------------------------------------------------------------*/
module playground/host

import kokaine/html

pub extern initial-dark() : ui bool
  js inline "globalThis.__kokainePlaygroundHost.initialDark()"

pub extern start() : ui ()
  js inline "(globalThis.__kokainePlaygroundHost.start(),1)"

pub extern project-entry-count() : int
  js inline "globalThis.__kokainePlaygroundHost.projectEntryCount()"

pub extern project-entry-path(index : int) : string
  js inline "globalThis.__kokainePlaygroundHost.projectEntryPath(#1)"

pub extern project-entry-label(index : int) : string
  js inline "globalThis.__kokainePlaygroundHost.projectEntryLabel(#1)"

pub extern project-entry-kind(index : int) : string
  js inline "globalThis.__kokainePlaygroundHost.projectEntryKind(#1)"

pub extern project-entry-depth(index : int) : int
  js inline "globalThis.__kokainePlaygroundHost.projectEntryDepth(#1)"

pub extern project-entry-is-entry(index : int) : bool
  js inline "globalThis.__kokainePlaygroundHost.projectEntryIsEntry(#1)"

pub extern project-entry-is-selected(index : int) : bool
  js inline "globalThis.__kokainePlaygroundHost.projectEntryIsSelected(#1)"

pub extern open-project-entry(index : int) : ui ()
  js inline "(globalThis.__kokainePlaygroundHost.openProjectEntry(#1),1)"

pub extern open-tab-count() : int
  js inline "globalThis.__kokainePlaygroundHost.openTabCount()"

pub extern open-tab-path(index : int) : string
  js inline "globalThis.__kokainePlaygroundHost.openTabPath(#1)"

pub extern open-tab-label(index : int) : string
  js inline "globalThis.__kokainePlaygroundHost.openTabLabel(#1)"

pub extern open-tab-is-active(index : int) : bool
  js inline "globalThis.__kokainePlaygroundHost.openTabIsActive(#1)"

pub extern open-tab(index : int) : ui ()
  js inline "(globalThis.__kokainePlaygroundHost.openTab(#1),1)"

pub extern close-tab(index : int) : ui ()
  js inline "(globalThis.__kokainePlaygroundHost.closeTab(#1),1)"

pub extern create-file() : ui ()
  js inline "(globalThis.__kokainePlaygroundHost.createFile(),1)"

pub extern create-directory() : ui ()
  js inline "(globalThis.__kokainePlaygroundHost.createDirectory(),1)"

pub extern rename-selected() : ui ()
  js inline "(globalThis.__kokainePlaygroundHost.renameSelected(),1)"

pub extern delete-selected() : ui ()
  js inline "(globalThis.__kokainePlaygroundHost.deleteSelected(),1)"

pub extern set-selected-entry() : ui ()
  js inline "(globalThis.__kokainePlaygroundHost.setSelectedEntry(),1)"

pub extern run-project() : ui ()
  js inline "(globalThis.__kokainePlaygroundHost.runProject(),1)"

pub extern submit-repl(line : string) : ui ()
  js inline "(globalThis.__kokainePlaygroundHost.submitRepl(#1),1)"

pub extern repl-history(delta : int) : ui string
  js inline "globalThis.__kokainePlaygroundHost.replHistory(#1)"

pub extern clear-console() : ui ()
  js inline "(globalThis.__kokainePlaygroundHost.clearConsole(),1)"

pub extern reset-repl() : ui ()
  js inline "(globalThis.__kokainePlaygroundHost.resetRepl(),1)"

pub extern share-project() : ui ()
  js inline "(globalThis.__kokainePlaygroundHost.shareProject(),1)"

pub extern reset-project() : ui ()
  js inline "(globalThis.__kokainePlaygroundHost.resetProject(),1)"

pub extern set-theme(dark : bool) : ui ()
  js inline "(globalThis.__kokainePlaygroundHost.setTheme(#1),1)"

pub extern set-devtools(visible : bool) : ui ()
  js inline "(globalThis.__kokainePlaygroundHost.setDevtools(#1),1)"

pub extern reload-preview() : ui ()
  js inline "(globalThis.__kokainePlaygroundHost.reloadPreview(),1)"

pub extern set-device-width(value : string) : ui ()
  js inline "(globalThis.__kokainePlaygroundHost.setDeviceWidth(#1),1)"

pub extern copy-output(value : string) : ui ()
  js inline "(globalThis.__kokainePlaygroundHost.copyOutput(#1),1)"

extern event-string-raw(original : any, name : string) : ui string
  js inline "String(((#1 && (#1).detail) || {})[#2] ?? '')"

extern event-int-raw(original : any, name : string) : ui int
  js inline "Math.trunc(Number(((#1 && (#1).detail) || {})[#2] ?? 0))"

extern event-bool-raw(original : any, name : string) : ui bool
  js inline "!!(((#1 && (#1).detail) || {})[#2])"

extern event-shift-raw(original : any) : ui bool
  js inline "!!(#1 && (#1).shiftKey)"

pub fun event-string(value : event, name : string) : ui string
  event-string-raw(value.original,name)

pub fun event-int(value : event, name : string) : ui int
  event-int-raw(value.original,name)

pub fun event-bool(value : event, name : string) : ui bool
  event-bool-raw(value.original,name)

pub fun event-shift(value : event) : ui bool
  event-shift-raw(value.original)
