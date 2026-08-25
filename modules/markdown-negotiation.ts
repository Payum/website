import { defineNuxtModule, useLogger } from '@nuxt/kit'

/** Paths that `server/middleware/markdown-negotiation.ts` can answer as markdown. */
const NEGOTIATED_PATHS = ['/']

/**
 * Fails the build if a negotiated path is also prerendered.
 *
 * Nitro composes its handlers as `[publicAssets, ...serverMiddleware, ...routes]`,
 * so a prerendered route is answered straight from `.output/public` and server
 * middleware never sees the request. Adding `prerender: true` back for `/` would
 * therefore disable markdown negotiation *silently* — the build succeeds, the
 * page still works in a browser, and only an agent sending
 * `Accept: text/markdown` would notice it now gets HTML. That is far too quiet a
 * failure to leave to a code comment.
 */
export default defineNuxtModule({
  meta: {
    name: 'markdown-negotiation-guard'
  },
  setup(_options, nuxt) {
    const logger = useLogger('markdown-negotiation')

    nuxt.hook('build:before', () => {
      const routeRules = nuxt.options.routeRules ?? {}
      const prerendered = nuxt.options.nitro?.prerender?.routes ?? []

      const conflicts = NEGOTIATED_PATHS.filter(
        path => routeRules[path]?.prerender || prerendered.includes(path)
      )

      if (conflicts.length) {
        const list = conflicts.join(', ')
        logger.error(
          `${list} is both prerendered and markdown-negotiated. Prerendered routes are served from .output/public before server middleware runs, so Accept: text/markdown would silently return HTML. Remove the prerender rule, or drop the path from NEGOTIATED_PATHS in modules/markdown-negotiation.ts.`
        )
        throw new Error(`markdown negotiation is unreachable for prerendered route(s): ${list}`)
      }
    })
  }
})
