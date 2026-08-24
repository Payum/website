<script setup lang="ts">
// "Is my processor here?" is the job. The list is alphabetical, filterable and
// — after a drifting marquee briefly replaced it — static again.
//
// The marquee scrambled alphabetical order across three rows, drifted them in
// opposite directions and clipped names mid-word: measured, only 8 of 40 names
// were fully legible at 390px. It decorated the one section a comparison
// shopping developer most needs to read. Motion here now comes only from the
// filter responding to what the visitor typed.
const route = useRoute()
const router = useRouter()

const query = ref('')

const matches = computed(() => {
  const needle = query.value.trim().toLowerCase()
  return needle ? GATEWAYS.filter(name => name.toLowerCase().includes(needle)) : GATEWAYS
})

// The one match a visitor was looking for is the answer to their question, so
// it gets read as an answer rather than as one cell among forty.
const sole = computed(() => (matches.value.length === 1 ? matches.value[0] : null))

// A maintainer answering "do you support X?" should be able to send a link that
// proves it, the same way `?framework=` already works on the code section.
// Same prerender caveat: the query is absent on the mount tick and only lands
// once the router settles, so this watches rather than reading once.
onMounted(() => {
  watch(() => route.query.gateway, (asked) => {
    if (typeof asked === 'string' && asked !== query.value) {
      query.value = asked
    }
  }, { immediate: true })
})

let timer: ReturnType<typeof setTimeout> | undefined

watch(query, (value) => {
  // Debounced: typing "przelewy" should not push nine history entries.
  clearTimeout(timer)
  timer = setTimeout(() => {
    const next = { ...route.query }
    if (value.trim()) {
      next.gateway = value.trim()
    } else {
      delete next.gateway
    }
    router.replace({ query: next })
  }, 300)
})

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <section
    id="gateways"
    class="mt-[clamp(80px,10vw,140px)] scroll-mt-24 border-y border-ink/9 bg-surface/42 py-[clamp(56px,7vw,90px)]"
  >
    <div class="shell">
      <div
        data-reveal
        class="flex flex-wrap items-end justify-between gap-x-6 gap-y-5"
      >
        <h2 class="max-w-[24ch] text-[clamp(30px,3.4vw,42px)] leading-[1.1] tracking-[-0.028em]">
          Cards, wallets, bank transfer, crypto — worldwide.
        </h2>
        <p class="max-w-[34ch] text-[14.5px] leading-[1.6] text-ink/68">
          Official and community-maintained gateways, each a drop-in Composer package that speaks the same Payum interface.
        </p>
      </div>

      <div class="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2.5">
        <div class="relative">
          <label
            for="gateway-filter"
            class="sr-only"
          >Filter payment processors</label>
          <UIcon
            name="i-lucide-search"
            aria-hidden="true"
            class="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink/50"
          />
          <input
            id="gateway-filter"
            v-model="query"
            type="search"
            autocomplete="off"
            placeholder="Filter 40 processors…"
            aria-describedby="gateway-count"
            class="w-[min(20rem,100%)] rounded-md border border-ink/14 bg-sunken py-2.5 pr-3.5 pl-10 text-[14px] text-ink transition-colors placeholder:text-ink/64 hover:border-ink/24"
          >
        </div>

        <p
          id="gateway-count"
          role="status"
          aria-live="polite"
          class="text-[13.5px] text-ink/62"
        >
          {{ matches.length }} of {{ GATEWAYS.length }} shown
        </p>
      </div>

      <!-- Keyed on the query so the grid settles once per change: motion the
           visitor caused, which is the only kind that reads as responsive
           rather than as ambient decoration. -->
      <div
        v-if="matches.length"
        :key="query"
        class="grid-settle mt-6 grid grid-cols-[repeat(auto-fill,minmax(158px,1fr))] overflow-hidden rounded-md border border-ink/8 bg-sunken"
      >
        <div
          v-for="gateway in matches"
          :key="gateway"
          class="cell-rule-xy px-4 py-[17px] text-[13.5px] transition-colors hover:bg-surface hover:text-ink"
          :class="gateway === sole ? 'bg-payum/12 text-payum-200' : 'text-ink/76'"
        >
          {{ gateway }}
        </div>
      </div>

      <p
        v-else
        class="mt-6 rounded-md border border-ink/10 bg-sunken px-6 py-8 text-[14.5px] leading-[1.65] text-ink/72"
      >
        Nothing matches “<span class="text-ink">{{ query.trim() }}</span>”. Payum wraps any processor as a custom gateway — the same request objects, your API calls inside.
        <a
          :href="GATEWAYS_DOCS_URL"
          rel="noopener"
          class="whitespace-nowrap"
        >See the gateway docs →</a>
      </p>

      <p class="mt-4 text-[13.5px] text-ink/62">
        Not an exhaustive list — more ship with the framework bridges and the Omnipay bridge.
        <a
          :href="GATEWAYS_DOCS_URL"
          rel="noopener"
        >Browse every supported gateway →</a>
      </p>
    </div>
  </section>
</template>

<style scoped>
/* Declares a `from` only, so the grid is fully legible if it never runs. */
@media (prefers-reduced-motion: no-preference) {
  .grid-settle {
    animation: payum-grid-settle 200ms cubic-bezier(0.16, 1, 0.3, 1);
  }
}

@keyframes payum-grid-settle {
  from {
    opacity: 0.55;
    transform: translateY(3px);
  }
}
</style>
