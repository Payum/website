<script setup lang="ts">
const route = useRoute()
// nuxt-site-config's own resolver, so the canonical URL is built from the same
// `site.url` — and the same trailing-slash rule — that @nuxtjs/sitemap uses for
// its <loc> entries. The address the sitemap advertises and the one the page
// claims cannot drift apart.
const canonicalUrl = withSiteUrl(computed(() => route.path))

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    // The starter template's stock favicon is gone; these are the real mark.
    // Two PNG sizes rather than one .ico: browsers pick the right one, and a
    // 16px downscale of a 60px source stays crisper than letting the browser
    // squeeze the full-size image into the tab.
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' },
    // Now possible: the 200px source downscales to 180 cleanly, where the
    // original 60px one would have had to be upscaled and gone soft.
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'canonical', href: canonicalUrl }
  ],
  htmlAttrs: {
    lang: 'en'
  },
  script: [
    {
      // Arms the scroll-reveal hidden state before first paint, so revealed
      // content never flashes in and back out during hydration. It lives in
      // the head precisely so that a browser with JS disabled never runs it —
      // there, `[data-reveal]` is simply always visible.
      innerHTML: 'document.documentElement.classList.add("reveal-ready")',
      tagPosition: 'head'
    }
  ]
})

const title = 'Payum — one API, every payment gateway'
const description = 'Payum is a unified payment processing library for PHP. Capture, authorize, refund, cancel and pay out across 50+ payment processors worldwide, through one framework-agnostic interface.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: canonicalUrl,
  twitterCard: 'summary_large_image'
})

let observer: IntersectionObserver | undefined
let failsafe: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  const targets = [...document.querySelectorAll('[data-reveal]')]
  const revealAll = () => targets.forEach(el => el.classList.add('is-revealed'))

  // If the observer never fires — a browser without it, a script error after
  // the head class landed — content must not stay hidden.
  failsafe = setTimeout(revealAll, 2500)

  if (!('IntersectionObserver' in window)) {
    revealAll()
    return
  }

  observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed')
        observer?.unobserve(entry.target)
      }
    }
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.04 })

  targets.forEach(el => observer?.observe(el))
})

onBeforeUnmount(() => {
  observer?.disconnect()
  clearTimeout(failsafe)
})
</script>

<template>
  <UApp>
    <AppAtmosphere />
    <SiteHeader />

    <main id="main">
      <NuxtPage />
    </main>

    <SiteFooter />
  </UApp>
</template>
