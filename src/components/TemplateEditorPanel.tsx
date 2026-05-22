import Editor, { type Monaco } from '@monaco-editor/react'

const TYPST_LANGUAGE_ID = 'typst'

function registerTypstLanguage(monaco: Monaco) {
  if (monaco.languages.getLanguages().some((language: { id: string }) => language.id === TYPST_LANGUAGE_ID)) {
    return
  }

  monaco.languages.register({
    id: TYPST_LANGUAGE_ID,
    extensions: ['.typ'],
    aliases: ['Typst', 'typst'],
  })

  monaco.languages.setLanguageConfiguration(TYPST_LANGUAGE_ID, {
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
      { open: '"', close: '"' },
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
    ],
  })

  monaco.languages.setMonarchTokensProvider(TYPST_LANGUAGE_ID, {
    defaultToken: '',
    keywords: [
      'and',
      'as',
      'auto',
      'break',
      'context',
      'else',
      'false',
      'for',
      'if',
      'import',
      'in',
      'include',
      'let',
      'none',
      'not',
      'or',
      'return',
      'set',
      'show',
      'true',
      'while',
    ],
    operators: [
      '=',
      '==',
      '!=',
      '<',
      '>',
      '<=',
      '>=',
      '+',
      '-',
      '*',
      '/',
      '=>',
    ],
    symbols: /[=><!~?:&|+\-*\/\^%]+/,
    escapes: /\\(?:[abfnrtv\\"'$]|x[0-9A-Fa-f]{2}|u\{[0-9A-Fa-f]+\})/,
    tokenizer: {
      root: [
        [/\/\*/, 'comment', '@comment'],
        [/\/\/.*/, 'comment'],
        [/"/, 'string.quote', '@string'],
        [/(#)([A-Za-z_][\w-]*)/, ['delimiter', 'keyword']],
        [/@[A-Za-z_][\w-]*/, 'tag'],
        [/<[A-Za-z_][\w-]*>/, 'tag'],
        [/[{}\[\]()]/, '@brackets'],
        [/[,:;\.]/, 'delimiter'],
        [/[-+]?(?:\d*\.\d+|\d+)(?:e[-+]?\d+)?(?:pt|mm|cm|in|em|fr|%)?\b/, 'number'],
        [/#?[0-9A-Fa-f]{6,8}\b/, 'number.hex'],
        [/[A-Za-z_][\w-]*(?=\s*\()/, 'type.identifier'],
        [/[A-Za-z_][\w-]*/, {
          cases: {
            '@keywords': 'keyword',
            '@default': 'identifier',
          },
        }],
        [/@symbols/, {
          cases: {
            '@operators': 'operator',
            '@default': 'operator',
          },
        }],
      ],
      comment: [
        [/[^/*]+/, 'comment'],
        [/\/\*/, 'comment', '@push'],
        [/\*\//, 'comment', '@pop'],
        [/[/*]/, 'comment'],
      ],
      string: [
        [/[^\\"$]+/, 'string'],
        [/@escapes/, 'string.escape'],
        [/\$[A-Za-z_][\w-]*/, 'variable'],
        [/\$\{/, 'delimiter.bracket', '@interpolation'],
        [/"/, 'string.quote', '@pop'],
      ],
      interpolation: [
        [/\}/, 'delimiter.bracket', '@pop'],
        { include: 'root' },
      ],
    },
  })
}

interface TemplateEditorPanelProps {
  value: string
  onChange: (value: string) => void
}

export default function TemplateEditorPanel(props: TemplateEditorPanelProps) {
  return (
    <div className="editorPanel">
      <Editor
        height="100%"
        beforeMount={registerTypstLanguage}
        defaultLanguage={TYPST_LANGUAGE_ID}
        language={TYPST_LANGUAGE_ID}
        value={props.value}
        onChange={(value) => props.onChange(value ?? '')}
        options={{
          automaticLayout: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          tabSize: 2,
        }}
      />
    </div>
  )
}