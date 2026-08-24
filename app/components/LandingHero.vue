<script setup lang="ts">
// The headline says "One API. Every gateway." This lets a visitor check it by
// hand: pick a processor, watch the tinted block change, and see the rest of
// the file stay exactly where it was. Every factory name offered here already
// appears verbatim elsewhere on the page, so the swapper cannot put a gateway
// on screen that isn't real.
const active = ref(0)

const gateway = computed(() => HERO_GATEWAYS[active.value]!)
const code = computed(() => `${HERO_HEAD}\n${gateway.value.block}\n${HERO_TAIL}`)

// Derived, not hardcoded: the block starts right after the head and runs its
// own length, so a longer head or block can never desync the tint.
const headLines = HERO_HEAD.split('\n').length
const highlight = computed<[number, number]>(() => [
  headLines + 1,
  headLines + gateway.value.block.split('\n').length
])

const tabs = ref<HTMLButtonElement[]>([])

function onKeydown(event: KeyboardEvent, index: number) {
  const last = HERO_GATEWAYS.length - 1
  const next = {
    ArrowRight: index === last ? 0 : index + 1,
    ArrowLeft: index === 0 ? last : index - 1,
    Home: 0,
    End: last
  }[event.key]

  if (next === undefined) {
    return
  }

  event.preventDefault()
  active.value = next
  tabs.value[next]?.focus()
}
</script>

<template>
  <section class="shell pt-[clamp(48px,7vw,88px)]">
    <div class="grid grid-cols-1 items-center gap-[clamp(36px,5vw,72px)] lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)]">
      <div>
        <h1
          data-reveal
          class="text-[clamp(44px,5.2vw,64px)] leading-[1.04] tracking-[-0.033em]"
        >
          One API.<br><span class="text-payum-300">Every gateway.</span>
        </h1>

        <p
          data-reveal
          style="--reveal-delay: 70ms"
          class="mt-[24px] max-w-[46ch] text-[19px] leading-[1.6] text-ink/76"
        >
          Payum is a unified payment processing library for PHP. Capture, authorize, refund, cancel and pay out across <strong class="font-medium text-ink">50+ payment processors worldwide</strong> — without writing a line of gateway-specific plumbing.
        </p>

        <!-- The install command is the highest-intent action for a developer
             mid-project, so it sits level with the docs link rather than
             whispering underneath it. The old second button ("See it in code")
             pointed at a section the hero already shows. -->
        <div
          data-reveal
          style="--reveal-delay: 140ms"
          class="mt-[32px] flex flex-wrap items-center gap-3"
        >
          <a
            :href="GET_STARTED_URL"
            rel="noopener"
            class="btn btn-primary px-5 py-[13px] text-[15px]"
          >
            Read the docs
            <UIcon
              name="i-lucide-arrow-up-right"
              aria-hidden="true"
              class="size-4"
            />
            <span class="sr-only">, external link</span>
          </a>

          <CommandLine
            command="composer require payum/payum"
            tone="panel"
          />
        </div>
      </div>

      <div
        data-reveal
        style="--reveal-delay: 210ms"
      >
        <div
          role="tablist"
          aria-label="Gateway"
          class="mb-3 flex flex-wrap gap-1.5"
        >
          <button
            v-for="(item, index) in HERO_GATEWAYS"
            :id="`hero-gw-${index}`"
            :key="item.name"
            ref="tabs"
            type="button"
            role="tab"
            :aria-selected="index === active"
            aria-controls="hero-code"
            :tabindex="index === active ? 0 : -1"
            class="min-h-11 cursor-pointer rounded-md border px-3.5 py-2.5 text-[12.5px] font-medium transition-colors hover:border-payum"
            :class="index === active
              ? 'border-payum bg-payum/16 text-payum-300'
              : 'border-ink/14 text-ink/68'"
            @click="active = index"
            @keydown="onKeydown($event, index)"
          >
            {{ item.name }}
          </button>
        </div>

        <div
          id="hero-code"
          role="tabpanel"
          :aria-labelledby="`hero-gw-${active}`"
        >
          <CodeWindow
            dots
            file="checkout.php"
            :code="code"
            :highlight="highlight"
          />
        </div>

        <!-- The tint is the argument, this line just names it. -->
        <p class="mt-3.5 px-1 text-[13.5px] leading-[1.6] text-ink/68">
          <span class="text-ink">Only the tinted block changes.</span> Everything below it — the payment, the token, the redirect — is identical for all 50+ processors.
        </p>
      </div>
    </div>

    <!-- Promoted out of its own section and up into the hero: it is the most
         product-specific element on the page and it answers "is this alive?",
         which is one of the two questions the visitor arrives with. Every
         value links to the source it came from, so a sceptic verifies in one
         click instead of trusting a number I typed. -->
    <dl
      data-reveal
      style="--reveal-delay: 290ms"
      class="mt-[clamp(40px,5vw,64px)] flex flex-wrap items-center gap-x-7 gap-y-2 rounded-md border border-ink/9 bg-sunken/60 px-[22px] py-2.5 font-mono text-[13px]"
    >
      <div class="flex items-baseline gap-2">
        <dt class="sr-only">
          package
        </dt>
        <dd class="text-payum-300">
          payum/payum
        </dd>
      </div>

      <div
        v-for="fact in FACTS"
        :key="fact.label"
        class="flex items-baseline gap-2"
      >
        <dt class="text-ink/58">
          {{ fact.label }}
        </dt>
        <dd>
          <a
            :href="fact.href"
            rel="noopener"
            class="-mx-1.5 px-1.5 py-3.5 md:py-2 text-ink underline decoration-ink/25 underline-offset-4 transition-colors hover:decoration-payum-400"
          >{{ fact.value }}<span class="sr-only">, source, external link</span></a>
        </dd>
      </div>
    </dl>

    <p
      data-reveal
      style="--reveal-delay: 350ms"
      class="mt-4 max-w-[62ch] px-1 text-[14.5px] leading-[1.6] text-ink/78"
    >
      Built into <span class="font-medium text-ink">{{ ADOPTERS.join(' and ') }}</span>, and depended on by
      <a
        :href="`${PACKAGIST_URL}/dependents`"
        rel="noopener"
      >{{ RELEASE.dependents }} published packages<span class="sr-only">, on Packagist, external link</span></a>.
    </p>
  </section>
</template>
