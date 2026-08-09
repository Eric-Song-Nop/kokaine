/*--------------------------------------------------------------------------
  Typed boundary between the Kokaine-owned workbench and browser-only services.
  Host notifications re-enter Koka through DOM events installed by the renderer;
  the TypeScript adapter never retains an application callback.
--------------------------------------------------------------------------*/
module playground/host

import kokaine/html

pub extern initial-source() : ui string
  js inline "globalThis.__kokainePlaygroundHost.initialSource"

pub extern initial-dark() : ui bool
  js inline "globalThis.__kokainePlaygroundHost.initialDark"

pub extern start() : ui ()
  js inline "(globalThis.__kokainePlaygroundHost.start(),1)"

pub extern run() : ui ()
  js inline "(globalThis.__kokainePlaygroundHost.run(),1)"

pub extern share() : ui ()
  js inline "(globalThis.__kokainePlaygroundHost.share(),1)"

pub extern reset() : ui ()
  js inline "(globalThis.__kokainePlaygroundHost.reset(),1)"

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

pub fun event-string(value : event, name : string) : ui string
  event-string-raw(value.original,name)

pub fun event-int(value : event, name : string) : ui int
  event-int-raw(value.original,name)

pub fun event-bool(value : event, name : string) : ui bool
  event-bool-raw(value.original,name)
