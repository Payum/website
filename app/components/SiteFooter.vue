<script setup lang="ts">
const links = [
  { label: 'Docs', href: DOCS_URL },
  { label: 'GitHub', href: GITHUB_URL },
  { label: 'Gateways', href: GATEWAYS_DOCS_URL },
  // Was "Integrations" while the header called the same concept "Frameworks".
  { label: 'Framework docs', href: INTEGRATIONS_DOCS_URL }
]
</script>

<template>
  <footer class="shell mt-[clamp(64px,8vw,100px)] flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-t border-ink/9 pt-6 pb-12">
    <AppBrand
      small
      class="text-ink"
    />

    <div class="flex flex-wrap gap-x-6 text-[13.5px]">
      <a
        v-for="link in links"
        :key="link.label"
        :href="link.href"
        rel="noopener"
        class="inline-flex items-center gap-1 py-3 text-ink/62 transition-colors hover:text-payum-300"
      >
        {{ link.label }}
        <UIcon
          name="i-lucide-arrow-up-right"
          aria-hidden="true"
          class="size-3.5 opacity-70"
        />
        <span class="sr-only">, external link</span>
      </a>
    </div>

    <span class="text-[13px] text-ink/62">Open source under the MIT licence.</span>
  </footer>
</template>
