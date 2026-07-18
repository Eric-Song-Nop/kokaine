import type * as Monaco from 'monaco-editor';

export const KOKA_LANGUAGE_ID = 'koka';

/**
 * Monaco's language configuration equivalent of Koka's official VS Code
 * extension configuration:
 * support/vscode/koka.language-koka/koka-configuration.json
 */
export const KOKA_LANGUAGE_CONFIGURATION: Monaco.languages.LanguageConfiguration = {
  comments: {
    lineComment: '//',
    blockComment: ['/*', '*/'],
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '<', close: '>' },
    { open: '"', close: '"', notIn: ['string'] },
    { open: "'", close: "'", notIn: ['string'] },
    { open: '`', close: '`', notIn: ['string'] },
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '<', close: '>' },
    { open: "'", close: "'" },
    { open: '"', close: '"' },
  ],
  folding: { offSide: true },
  wordPattern: /[A-Za-z_](?:[0-9]|[A-Za-z_/](?:-[A-Za-z_])?)*'*/,
};

const identifier = String.raw`@?[a-z][\w\-@]*[']*`;
const declarationName = String.raw`(?:${identifier}|\([$%&*+@!/\\^~=.:\-?|<>]+\)|\[\]|"[^\s"]+")`;
const qualifier = String.raw`(?:[a-z@][\w\-@]*/#?)*`;
const moduleName = String.raw`[a-z][\w\-]*(?:/[a-z][\w\-]*)*`;

/**
 * A Monarch translation of the official Koka TextMate grammar. It preserves
 * the important context-sensitive parts (declaration names and type regions)
 * while remaining synchronous, so highlighting is present before the LSP has
 * connected.
 */
export const KOKA_MONARCH_LANGUAGE: Monaco.languages.IMonarchLanguage = {
  defaultToken: '',
  tokenPostfix: '.koka',

  declarationKeywords: [
    'alias', 'ambient', 'con', 'ctl', 'effect', 'extern', 'fn', 'fun',
    'handler', 'module', 'struct', 'type', 'val', 'var',
  ],
  controlKeywords: [
    'as', 'break', 'continue', 'elif', 'else', 'handle', 'if', 'import',
    'in', 'match', 'return', 'then', 'with',
  ],
  modifierKeywords: [
    'abstract', 'behind', 'co', 'ctx', 'exists', 'extend', 'fbip', 'final',
    'fip', 'forall', 'hole', 'infix', 'infixl', 'infixr', 'inject', 'inline',
    'lazy', 'linear', 'mask', 'named', 'noinline', 'open', 'override', 'pub',
    'raw', 'rec', 'reference', 'ref', 'scoped', 'some', 'tail', 'unsafe',
    'value',
  ],
  libraryKeywords: ['finally', 'initially', 'rcontext', 'resume', 'resume-shallow'],
  typeKeywords: ['exists', 'forall', 'iff', 'if', 'in', 'is', 'some', 'when', 'with'],

  operators: [
    '=', '=>', '->', '<-', '|', '.', ':', ':=', '::',
  ],

  tokenizer: {
    root: [
      // Preprocessor directives are line anchored in the official grammar.
      [/^\s*#.*$/, 'preprocessor'],
      { include: '@whitespace' },

      // Raw strings must precede regular strings. Koka's official grammar
      // currently recognizes zero, one, and two hash delimiters.
      [/r##"/, 'string.quote', '@rawString2'],
      [/r#"/, 'string.quote', '@rawString1'],
      [/r"/, 'string.quote', '@rawString'],
      [/"/, 'string.quote', '@string'],

      // Valid characters and escapes, followed by malformed-character cases.
      [/'[^'\\$]'/, 'string.char'],
      [/'\\(?:[abfnrtv0\\"'?]|x[\da-fA-F]{2}|u[\da-fA-F]{4}|U[\da-fA-F]{6})'/, 'string.char.escape'],
      [/'(?:[^'\\\n]|\\(?:.|x..|u....|U......))'|'$|''?/, 'invalid'],

      // This expression is kept in sync with the official TextMate grammar.
      [/-?(?:0[xX][\da-fA-F]+(?:_[\da-fA-F]+)*(?:\.[\da-fA-F]+(?:_[\da-fA-F]+)*)?(?:[pP][\-+]?\d+)?|0[bB][01][01_]*|(?:0|[1-9]\d*)(?:_\d+)*(?:\.\d+(?:_\d+)*(?:[eE][\-+]?\d+)?)?)/, 'number'],

      // Module/import declarations retain the official namespace distinction.
      [new RegExp(`(module)(\\s+)(interface)(\\s+)(${moduleName})`),
        ['keyword.declaration', 'white', 'keyword.modifier', 'white', 'namespace']],
      [new RegExp(`(module)(\\s+)(${moduleName})`),
        ['keyword.declaration', 'white', 'namespace']],
      [new RegExp(`(import)(\\s+)(${moduleName})(\\s+)(=)(\\s+)(${moduleName})`),
        ['keyword.control', 'white', 'namespace', 'white', 'operator', 'white', 'namespace']],
      [new RegExp(`(import)(\\s+)(${moduleName})`),
        ['keyword.control', 'white', 'namespace']],

      // Function declarations include the same modifiers and legal operator
      // names as the official grammar.
      [new RegExp(`((?:(?:inline|noinline)\\s+)?(?:tail\\s+)?(?:(?:fip|fbip)(?:\\(\\d+\\))?\\s+)?(?:fun|fn|ctl|ret))(\\s+)(${qualifier})(${declarationName})`),
        ['keyword.declaration', 'white', 'namespace', 'function']],
      [new RegExp(`((?:(?:inline|noinline)\\s+)?(?:(?:fip|fbip)(?:\\(\\d+\\))?\\s+)?extern)(\\s+)(${qualifier})(${declarationName})`),
        ['keyword.declaration', 'white', 'namespace', 'function']],
      [/(extern)(\s+)(import)(?![\w\-'])/, ['keyword.declaration', 'white', 'keyword.control']],
      [/(extern)(\s+)/, ['keyword.declaration', 'white']],

      // Type/effect/struct declarations use lower-case type constructors in
      // Koka, so they need declaration context rather than capitalization.
      [new RegExp(`((?:(?:value|reference|ref|open|extend|rec|co|lazy|named|scoped|linear)\\s+)*(?:type|effect|ambient|alias|struct))(\\s+)(${qualifier})(${identifier})`),
        ['keyword.declaration', 'white', 'namespace', 'type.identifier']],
      [/(val)(?=\s+\()/, 'keyword.declaration'],
      [new RegExp(`((?:(?:inline|noinline)\\s+)?val)(\\s+)(${qualifier})(${declarationName})`),
        ['keyword.declaration', 'white', 'namespace', 'variable.declaration']],
      [new RegExp(`(var)(\\s+)(${declarationName})`),
        ['keyword.declaration', 'white', 'variable.declaration']],
      [/(val|var)(\s+)/, ['keyword.declaration', 'white']],

      // Parameter names and annotations. The type state ends at the next
      // parameter/body delimiter and supports nested type applications.
      [new RegExp(`(${identifier})(\\s*)(?=:(?!:))`), ['parameter', 'white']],
      [/:(?![$%&*+@!\\^~=.:\-|<>])/, 'type.operator', '@typeAnnotation'],
      [/<(?![%&*+@!/\\^~=.:\-?|\s\d])/, 'type.delimiter', '@typeAngle'],

      // Qualified constructors/operators/identifiers must win over their
      // unqualified forms.
      [/((?:[a-z@][\w\-@]*\/#?)+)(@?[A-Z][\w\-@]*[']*)/, ['namespace', 'constructor']],
      [/([?]?(?:[a-z@][\w\-@]*\/#?)+)(\([^\n\r)]+\))/, ['namespace', 'operator']],
      [/([?]?(?:[a-z@][\w\-@]*\/#?)+)(@?[a-z][\w\-@]*[']*)/, ['namespace', 'identifier']],

      [/@?_[\w\-@]*[']*/, 'variable.predefined'],
      [/[A-Z@][\w\-@]*[']*/, 'constructor'],
      [/@?[a-z][\w\-@]*[']*/, {
        cases: {
          '@libraryKeywords': 'keyword.control',
          '@controlKeywords': 'keyword.control',
          '@declarationKeywords': 'keyword.declaration',
          '@modifierKeywords': 'keyword.modifier',
          '@default': 'identifier',
        },
      }],

      [/(=|=>|->|<-|\||\.|:|:=)(?![$%&*+!/\\^~=.:\-?|<>])/, 'keyword.operator'],
      [/-(?![$%&*+@!/\\^~=.:\-?|<>])/, 'operator'],
      [/[$%&*+@!/\\^~=.:\-?|<>]+/, 'operator'],
      [/[{}()[\];,]/, '@brackets'],
    ],

    whitespace: [
      [/[ \t\r\n]+/, 'white'],
      [/\/\//, 'comment', '@lineComment'],
      [/\/\*/, 'comment', '@blockComment'],
    ],

    lineComment: [
      [/`:[^`\n]+`/, 'comment.doc.type'],
      [/`module [^`\n]+`/, 'comment.doc.module'],
      [/`+[^`\n]*`+/, 'comment.doc.code'],
      [/\*[^*]*\*/, 'comment.doc.emphasis'],
      [/_[^_]*_/, 'comment.doc.emphasis'],
      [/.+$/, 'comment', '@pop'],
      [/$/, 'comment', '@pop'],
    ],

    // Koka block comments nest; @push preserves the complete state stack.
    blockComment: [
      [/\/\*/, 'comment', '@push'],
      [/\*\//, 'comment', '@pop'],
      [/[^/*]+/, 'comment'],
      [/[/*]/, 'comment'],
    ],

    string: [
      [/[^"\\]+$/, 'string.invalid', '@pop'],
      [/[^"\\]+/, 'string'],
      [/\\(?:[abfnrtvz0\\"'?]|x[\da-fA-F]{2}|u[\da-fA-F]{4}|U[\da-fA-F]{6})/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/\\$/, 'string.escape.invalid', '@pop'],
      [/"/, 'string.quote', '@pop'],
      [/$/, 'string.invalid', '@pop'],
    ],

    rawString: [
      [/[^"\n]+/, 'string.raw'],
      [/"/, 'string.quote', '@pop'],
    ],
    rawString1: [
      [/[^"\n]+/, 'string.raw'],
      [/"#/, 'string.quote', '@pop'],
      [/"/, 'string.raw'],
    ],
    rawString2: [
      [/[^"\n]+/, 'string.raw'],
      [/"##/, 'string.quote', '@pop'],
      [/"/, 'string.raw'],
    ],

    typeAnnotation: [
      [/[=,;{}]/, { token: '@rematch', next: '@pop' }],
      [/[)\]]/, { token: '@rematch', next: '@pop' }],
      { include: '@typeTokens' },
      [/$/, '', '@pop'],
    ],
    typeAngle: [
      [/<(?![=])/, 'type.delimiter', '@push'],
      [/>/, 'type.delimiter', '@pop'],
      { include: '@typeTokens' },
      [/$/, '', '@pop'],
    ],
    typeParen: [
      [/\(/, 'type.delimiter', '@push'],
      [/\)/, 'type.delimiter', '@pop'],
      { include: '@typeTokens' },
      [/$/, '', '@pop'],
    ],
    typeBracket: [
      [/\[/, 'type.delimiter', '@push'],
      [/\]/, 'type.delimiter', '@pop'],
      { include: '@typeTokens' },
      [/$/, '', '@pop'],
    ],
    typeTokens: [
      { include: '@whitespace' },
      [/\(/, 'type.delimiter', '@typeParen'],
      [/\[/, 'type.delimiter', '@typeBracket'],
      [/<(?![%&*+@!/\\^~=.:\-?|])/, 'type.delimiter', '@typeAngle'],
      [/(->|::?|\.)(?![$%&*+@!\\^~=.:\-?|<>])/, 'type.operator'],
      [/([a-z@][\w\-@]*[']*\/#?)+/, 'namespace'],
      [/[A-Z](?![\w\-])/, 'type.kind'],
      [/[_]?[a-z][0-9]*(?!\w)|_[\w\-]*[']*|self(?!\w)/, 'type.parameter'],
      [/[$]?[a-z@][\w\-@]*[']*/, {
        cases: {
          '@typeKeywords': 'keyword.modifier',
          '@default': 'type.identifier',
        },
      }],
      [/\d+/, 'number'],
      [/[;,]/, 'type.delimiter'],
      [/[$%&*+@!/\\^~=.:\-?|<>]+/, 'type.operator'],
    ],
  },
};

const lspDocuments = new Set<string>();
let registered = false;

/** Prevents fallback snippets from being mixed into genuine LSP completion. */
export function setKokaDocumentLspReady(documentUri: string, ready: boolean): void {
  if (ready) lspDocuments.add(documentUri);
  else lspDocuments.delete(documentUri);
}

export function registerKokaLanguage(monaco: typeof Monaco): void {
  if (registered) return;
  registered = true;

  if (!monaco.languages.getLanguages().some((language) => language.id === KOKA_LANGUAGE_ID)) {
    monaco.languages.register({
      id: KOKA_LANGUAGE_ID,
      aliases: ['Koka', 'koka-lang'],
      extensions: ['.kk', '.kki', '.kkc'],
    });
  }

  monaco.languages.setLanguageConfiguration(KOKA_LANGUAGE_ID, KOKA_LANGUAGE_CONFIGURATION);
  monaco.languages.setMonarchTokensProvider(KOKA_LANGUAGE_ID, KOKA_MONARCH_LANGUAGE);

  monaco.languages.registerCompletionItemProvider(KOKA_LANGUAGE_ID, {
    provideCompletionItems(model, position) {
      if (lspDocuments.has(model.uri.toString())) return { suggestions: [] };

      const word = model.getWordUntilPosition(position);
      const range: Monaco.IRange = {
        startLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endLineNumber: position.lineNumber,
        endColumn: word.endColumn,
      };
      const snippet = (
        label: string,
        insertText: string,
        detail: string,
      ): Monaco.languages.CompletionItem => ({
        label,
        detail,
        kind: monaco.languages.CompletionItemKind.Snippet,
        insertText,
        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
        range,
      });

      return {
        suggestions: [
          snippet('fun', 'fun ${1:name}(${2:args})\n  ${0:body}', 'Koka function'),
          snippet('match', 'match ${1:value}\n  ${2:pattern} -> ${0:result}', 'Koka pattern match'),
          snippet('effect', 'effect ${1:name}\n  ctl ${2:operation}(${3:args}) : ${0:result}', 'Koka effect'),
        ],
      };
    },
  });
}

export function registerKokaThemes(monaco: typeof Monaco): void {
  monaco.editor.defineTheme('kokaine-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword.control', foreground: 'D7A35D' },
      { token: 'keyword.declaration', foreground: 'C792EA' },
      { token: 'keyword.modifier', foreground: '82AAFF' },
      { token: 'function', foreground: '82D2CE' },
      { token: 'type', foreground: 'FFCB6B' },
      { token: 'constructor', foreground: 'FFCB6B' },
      { token: 'namespace', foreground: 'A6ACCD' },
      { token: 'parameter', foreground: 'F3C6A5' },
      { token: 'comment', foreground: '697487', fontStyle: 'italic' },
      { token: 'string', foreground: 'C3E88D' },
      { token: 'number', foreground: 'F78C6C' },
      { token: 'invalid', foreground: 'FFFFFF', background: 'C74E39' },
    ],
    colors: {
      'editor.background': '#15181D',
      'editor.foreground': '#D8DEE9',
      'editorLineNumber.foreground': '#505866',
      'editorLineNumber.activeForeground': '#AAB2C0',
      'editor.selectionBackground': '#31465F',
      'editor.inactiveSelectionBackground': '#26384D',
      'editorCursor.foreground': '#E7B86E',
      'editorIndentGuide.background1': '#252B34',
      'editorIndentGuide.activeBackground1': '#465160',
    },
  });

  monaco.editor.defineTheme('kokaine-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword.control', foreground: '8A5300' },
      { token: 'keyword.declaration', foreground: '7B2E99' },
      { token: 'keyword.modifier', foreground: '315BA6' },
      { token: 'function', foreground: '007F7A' },
      { token: 'type', foreground: '8B6400' },
      { token: 'constructor', foreground: '8B6400' },
      { token: 'namespace', foreground: '4D5968' },
      { token: 'parameter', foreground: '8D4A26' },
      { token: 'comment', foreground: '6A7685', fontStyle: 'italic' },
      { token: 'string', foreground: '3E6F17' },
      { token: 'number', foreground: 'A33A25' },
      { token: 'invalid', foreground: 'FFFFFF', background: 'B83232' },
    ],
    colors: {
      'editor.background': '#FBFCFD',
      'editor.foreground': '#20252C',
      'editorLineNumber.foreground': '#9AA4AF',
      'editorLineNumber.activeForeground': '#4A5562',
      'editor.selectionBackground': '#C9DDF4',
      'editor.inactiveSelectionBackground': '#DCE8F4',
      'editorCursor.foreground': '#7B4B00',
      'editorIndentGuide.background1': '#E8ECF0',
      'editorIndentGuide.activeBackground1': '#BAC3CC',
    },
  });
}
