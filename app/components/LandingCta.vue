<template>
  <section
    id="start"
    class="shell mt-[clamp(80px,10vw,140px)] scroll-mt-24"
  >
    <div
      data-reveal
      class="cta-panel rounded-lg p-[clamp(40px,5.5vw,72px)] text-center shadow-md"
    >
      <h2 class="text-[clamp(30px,3.6vw,46px)] leading-[1.08] tracking-[-0.03em]">
        Start charging in five minutes.
      </h2>
      <p class="mx-auto mt-[18px] max-w-[48ch] text-[17px] leading-[1.6] text-ink/76">
        Install the core, add a gateway package, point a token at your thank-you page. Everything else is your business logic.
      </p>

      <!-- Both actions here used to leave the site, which left the page with no
           on-page way to say "I've decided". Payum has nothing to sign up for,
           so the command IS the decisive action — it leads, and the two
           off-site links follow as text. -->
      <CommandLine
        command="composer require payum/payum payum/stripe"
        tone="panel"
        class="mx-auto mt-[30px] w-fit max-w-full text-left"
      />

      <p class="mx-auto mt-4 max-w-[48ch] text-[14px] leading-[1.6] text-ink/68">
        Swap <code class="font-mono text-payum-300">payum/stripe</code> for whichever processor you use —
        <a
          :href="GATEWAYS_DOCS_URL"
          rel="noopener"
        >every gateway package is listed in the docs<span class="sr-only">, external link</span></a>.
      </p>

      <div class="mt-[26px] flex flex-wrap justify-center gap-x-7 gap-y-2 text-[14.5px]">
        <a
          :href="GET_STARTED_URL"
          rel="noopener"
          class="inline-flex min-h-11 items-center gap-1 py-2"
        >
          Documentation
          <UIcon
            name="i-lucide-arrow-up-right"
            aria-hidden="true"
            class="size-3.5 opacity-70"
          />
          <span class="sr-only">, external link</span>
        </a>
        <a
          :href="GITHUB_URL"
          rel="noopener"
          class="inline-flex min-h-11 items-center gap-1 py-2"
        >
          Source on GitHub
          <UIcon
            name="i-lucide-arrow-up-right"
            aria-hidden="true"
            class="size-3.5 opacity-70"
          />
          <span class="sr-only">, external link</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* A bloom off the top edge, from the same glow the page ground uses. */
.cta-panel {
  background:
    radial-gradient(700px 320px at 50% -40px, var(--color-glow), transparent 70%),
    var(--color-surface);
}
</style>
