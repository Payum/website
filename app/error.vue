<script setup lang="ts">
import type { NuxtError } from '#app'

// Without this, a 404 rendered Nuxt's stock light-themed page — a different
// website, in a palette this site doesn't own.
const { error } = defineProps<{
  error: NuxtError
}>()

const isMissing = computed(() => error.statusCode === 404)
const title = computed(() => (isMissing.value ? 'Page not found' : 'Something went wrong'))

useHead({
  title: `${title.value} — Payum`
})
</script>

<template>
  <UApp>
    <SiteHeader />

    <main
      id="main"
      class="shell grid min-h-[52vh] place-items-start pt-[clamp(64px,10vw,120px)]"
    >
      <div class="max-w-[52ch]">
        <p class="font-mono text-[13px] text-payum-400">
          {{ error.statusCode }}
        </p>

        <h1 class="mt-4 text-[clamp(34px,4.4vw,52px)] leading-[1.06] tracking-[-0.03em]">
          {{ title }}
        </h1>

        <p class="mt-[20px] text-[17px] leading-[1.6] text-ink/76">
          <template v-if="isMissing">
            That URL isn't part of this site. The reference documentation lives on a separate domain — it's the likeliest place you were headed.
          </template>
          <template v-else>
            The page failed to render. Nothing you did caused it; try again, or head for the documentation in the meantime.
          </template>
        </p>

        <div class="mt-[32px] flex flex-wrap gap-3">
          <NuxtLink
            to="/"
            class="btn btn-primary px-5 py-[13px] text-[15px]"
            @click="clearError({ redirect: '/' })"
          >Back to the homepage</NuxtLink>
          <a
            :href="GET_STARTED_URL"
            rel="noopener"
            class="btn btn-secondary px-5 py-[13px] text-[15px]"
          >
            Read the docs
            <UIcon
              name="i-lucide-arrow-up-right"
              aria-hidden="true"
              class="size-4"
            />
            <span class="sr-only">, external link</span>
          </a>
        </div>
      </div>
    </main>

    <SiteFooter />
  </UApp>
</template>
