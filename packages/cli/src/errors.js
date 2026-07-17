export class KokaineError extends Error {
  constructor(code, message, details = []) {
    super(message);
    this.name = "KokaineError";
    this.code = code;
    this.details = details;
  }

  format() {
    const suffix = this.details.length === 0
      ? ""
      : `\n${this.details.map((detail) => `  ${detail}`).join("\n")}`;
    return `[${this.code}] ${this.message}${suffix}`;
  }
}

export function invariant(condition, code, message, details) {
  if (!condition) {
    throw new KokaineError(code, message, details);
  }
}
