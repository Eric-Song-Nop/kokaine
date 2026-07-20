import { mountKokaine } from "@kokaine/pocketjs";
// @ts-expect-error Koka emits ESM without a TypeScript declaration file.
import { main } from "./generated/app.mjs";

// Pocket's first pass scans TS/TSX rather than generated Koka modules. Keep
// the finite glyph set visible here; real applications should generate this
// sidecar together with image/sprite declarations.
const KOKAINE_GLYPHS = "Kokaine + PocketJS Count 0123456789 Increment";
void KOKAINE_GLYPHS;

export const dispose = mountKokaine(main);
