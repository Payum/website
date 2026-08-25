import { estimateTokens, renderLandingMarkdown } from '../utils/landing-markdown'

/** Pages that have a markdown representation, keyed by normalised path. */
const RENDERERS: Record<string, (title: string, description: string) => string> = {
  '/': renderLandingMarkdown
}

/**
 * Serves a markdown representation to agents that ask for one via
 * `Accept: text/markdown`, leaving HTML as the default for everyone else.
 *
 * This only works because `/` is *not* prerendered. Nitro composes its handler
 * list as `[publicAssets, ...serverMiddleware, ...routes]`, so a prerendered
 * route is answered from `.output/public` before any middleware runs and the
 * Accept header is never examined. Re-adding `prerender: true` for a route
 * silently disables negotiation for it — the request just returns HTML.
 */
export default defineEventHandler((event) => {
  if (event.method !== 'GET' && event.method !== 'HEAD') return

  const render = RENDERERS[normalisePath(event.path)]
  if (!render || !prefersMarkdown(getHeader(event, 'accept'))) return

  const markdown = render(
    'Payum — one API, every payment gateway',
    'Payum is a unified payment processing library for PHP. Capture, authorize, refund, cancel and pay out across 50+ payment processors worldwide, through one framework-agnostic interface.'
  )

  setResponseHeader(event, 'content-type', 'text/markdown; charset=utf-8')
  setResponseHeader(event, 'x-markdown-tokens', String(estimateTokens(markdown)))
  // Declares the negotiation for well-behaved caches. Cloudflare's free tier
  // does not key on Vary, so `no-store` is what actually stops a markdown body
  // being cached at the edge and then served to a browser asking for HTML.
  setResponseHeader(event, 'vary', 'Accept')
  setResponseHeader(event, 'cache-control', 'private, no-store')

  return markdown
})

/** `/about/?x=1` and `/about` are the same page; `/` stays `/`. */
function normalisePath(path: string): string {
  const pathname = path.split('?')[0] ?? '/'
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') || '/' : '/'
}

/**
 * True only when the client explicitly asked for markdown and did not rank HTML
 * above it. A bare wildcard Accept — what curl and most HTTP libraries send —
 * deliberately keeps returning HTML: it expresses no preference, and guessing
 * markdown from it would break ordinary clients.
 */
function prefersMarkdown(accept: string | undefined): boolean {
  if (!accept) return false

  let markdown = -1
  let html = -1

  for (const entry of accept.split(',')) {
    const [rawType = '', ...params] = entry.split(';')
    const type = rawType.trim().toLowerCase()

    let q = 1
    for (const param of params) {
      const match = /^\s*q=([\d.]+)\s*$/i.exec(param)
      if (match) q = Number.parseFloat(match[1] ?? '1') || 0
    }

    if (type === 'text/markdown') markdown = Math.max(markdown, q)
    else if (type === 'text/html' || type === 'application/xhtml+xml') html = Math.max(html, q)
  }

  return markdown > 0 && markdown >= html
}
