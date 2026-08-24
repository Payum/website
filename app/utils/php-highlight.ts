/**
 * The syntax highlighter from the design: a single-pass regex tokenizer, good
 * enough for the hand-picked PHP samples on the landing page and small enough
 * to run during prerender instead of shipping a highlighter to the browser.
 */

export type CodeTokenKind
  = | 'plain'
    | 'keyword'
    | 'string'
    | 'comment'
    | 'variable'
    | 'number'
    | 'symbol'
    | 'punctuation'

export interface CodeToken {
  text: string
  kind: CodeTokenKind
}

export const CODE_TOKEN_CLASS: Record<CodeTokenKind, string> = {
  plain: 'text-code-plain',
  keyword: 'text-code-keyword',
  string: 'text-code-string',
  comment: 'text-code-comment',
  variable: 'text-code-variable',
  number: 'text-code-number',
  symbol: 'text-code-symbol',
  punctuation: 'text-code-punctuation'
}

const KEYWORDS = [
  'use',
  'new',
  'return',
  'function',
  'class',
  'public',
  'private',
  'header',
  'true',
  'false',
  'null',
  'env',
  'getenv',
  'Route'
]

/** Strings, comments, variables, words, numbers, runs of space, then anything else. */
const TOKEN_RE = /('[^']*'|"[^"]*"|\/\/.*$|#.*$|\$[A-Za-z_]\w*|\b[A-Za-z_]\w*\b|\d+|\s+|[^\s\w])/g

function classify(token: string): CodeTokenKind {
  if (/^['"]/.test(token)) return 'string'
  if (/^(\/\/|#)/.test(token)) return 'comment'
  if (token.startsWith('$')) return 'variable'
  if (/^\d+$/.test(token)) return 'number'
  if (KEYWORDS.includes(token)) return 'keyword'
  // Capitalised identifiers are class names and factories in every sample.
  if (/^[A-Z]/.test(token)) return 'symbol'
  return /^(\s+|\w+)$/.test(token) ? 'plain' : 'punctuation'
}

export function highlightPhp(source: string): CodeToken[][] {
  return source.split('\n').map((line) => {
    const trimmed = line.trim()

    if (trimmed.startsWith('//') || trimmed.startsWith('#')) {
      return [{ text: line, kind: 'comment' as const }]
    }

    const tokens: CodeToken[] = []
    const re = new RegExp(TOKEN_RE)
    let match: RegExpExecArray | null

    while ((match = re.exec(line))) {
      tokens.push({ text: match[0], kind: classify(match[0]) })
    }

    // Blank lines still need to occupy a row.
    return tokens.length ? tokens : [{ text: ' ', kind: 'plain' as const }]
  })
}
