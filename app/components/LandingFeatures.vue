<script setup lang="ts">
import { FEATURE_GROUPS } from '~/utils/landing'
</script>

<template>
  <section
    id="features"
    class="shell mt-[clamp(80px,10vw,140px)] scroll-mt-24"
  >
    <div
      data-reveal
      class="max-w-[62ch]"
    >
      <h2 class="text-[clamp(32px,3.6vw,46px)] leading-[1.08] tracking-[-0.028em]">
        Payments as a domain, not a dependency.
      </h2>
      <p class="mt-[18px] text-[17px] leading-[1.65] text-ink/72">
        Every provider models money differently. Payum normalises them into one request/reply pipeline, so your checkout code stays the same whether you're charging a card in Berlin or a wallet in Jakarta.
      </p>
      <!-- The visitor arrives already comparing, and the project publishes its
           own Omnipay comparison — so the argument can be made concretely and
           the claim attributed to a document the reader can go check, rather
           than asserted here about someone else's library. -->
      <p class="mt-[14px] text-[17px] leading-[1.65] text-ink/72">
        Most PHP payment wrappers cover the charge well and hand the rest back to you: the redirect, the notification, the refund, the payout. Payum models the whole lifecycle, and does it the same way for every processor.
      </p>
      <p class="mt-[14px] text-[17px] leading-[1.65] text-ink/72">
        Coming from Omnipay? Swapping Stripe for PayPal there means changing your code, because the two want different things — a card on one side, return and cancel URLs on the other. Payum keeps that difference inside the gateway and generates the secure URLs itself.
        <a
          :href="OMNIPAY_URL"
          rel="noopener"
        >Read the full comparison<span class="sr-only">, external link</span></a>.
      </p>
    </div>

    <!-- A specification list, not a card grid. Six equal cards of glyph +
         heading + text was the page's most generic passage, and the glyphs were
         Unicode standing in for an icon system. The term/definition pairing is
         what the content actually is, and the hairline rules are the same grid
         language the manifest strip and gateway wall already use. -->
    <div
      v-for="group in FEATURE_GROUPS"
      :key="group.heading"
      data-reveal
      class="mt-[clamp(36px,4.5vw,56px)]"
    >
      <h3 class="text-[15px] font-medium text-payum-300">
        {{ group.heading }}
      </h3>

      <dl class="mt-4">
        <div
          v-for="feature in group.features"
          :key="feature.title"
          class="grid grid-cols-1 gap-x-10 gap-y-2 border-t border-ink/10 py-[clamp(20px,2.4vw,28px)] md:grid-cols-[minmax(0,16rem)_minmax(0,1fr)]"
        >
          <dt class="text-[17.5px] font-medium tracking-[-0.012em] text-ink">
            {{ feature.title }}
          </dt>
          <dd class="max-w-[60ch] text-[15px] leading-[1.65] text-ink/70">
            {{ feature.body }}
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>
