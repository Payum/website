<script setup lang="ts">
// The page's one authored motion. An accent cursor inspects the STATUS_*
// constants in turn, so the section performs the claim in its own heading.
// It runs only while the list is on screen, and CSS drops it entirely under
// `prefers-reduced-motion` — no information lives in the movement.
const STATUS_TONE = {
  new: 'text-state-new',
  pending: 'text-state-pending',
  settled: 'text-state-settled',
  ended: 'text-state-ended'
} as const

const machine = ref<HTMLElement | null>(null)
const running = ref(false)
let observer: IntersectionObserver | undefined

onMounted(() => {
  if (!machine.value || typeof IntersectionObserver === 'undefined') {
    return
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      running.value = entry?.isIntersecting ?? false
    },
    { threshold: 0.3 }
  )

  observer.observe(machine.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <section class="shell mt-[clamp(80px,10vw,130px)]">
    <div class="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-[clamp(28px,4vw,56px)]">
      <div data-reveal>
        <h2 class="text-[clamp(28px,3vw,38px)] leading-[1.12] tracking-[-0.026em]">
          Every payment is a state machine you can inspect.
        </h2>
        <p class="mt-[18px] text-[16px] leading-[1.65] text-ink/72">
          Payum persists the payment and its security tokens, so an interrupted redirect, a duplicated webhook or a delayed notification all resolve to a single, known status — never a guess.
        </p>

        <!-- The page proved configuration everywhere and execution nowhere:
             every other sample is a builder or a YAML file. This is the request
             object actually running, and it sits beside the constants it
             returns so the claim and its proof are read together. -->
        <CodeWindow
          file="done.php"
          :code="DONE_SNIPPET"
          class="mt-7"
        />

        <p class="mt-3.5 px-1 text-[13.5px] leading-[1.6] text-ink/68">
          One call, one answer — the same seven request classes work against every gateway.
          <a
            :href="OMNIPAY_URL"
            rel="noopener"
          >How that compares to Omnipay<span class="sr-only">, external link</span></a>.
        </p>
      </div>

      <dl
        ref="machine"
        class="status-machine flex flex-col"
        :data-running="running"
      >
        <div
          v-for="(status, index) in STATUSES"
          :key="status.code"
          class="status-row grid grid-cols-1 items-baseline gap-x-5 gap-y-1 sm:grid-cols-[9rem_minmax(0,1fr)] border-b border-ink/8 px-2.5 py-[15px]"
          :style="{ '--i': index }"
        >
          <dt>
            <code
              class="font-mono text-[13px]"
              :class="STATUS_TONE[status.tone]"
            >{{ status.code }}</code>
          </dt>
          <dd class="text-[13.5px] leading-[1.5] text-ink/66">
            {{ status.text }}
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>
