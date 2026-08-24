<script setup lang="ts">
const route = useRoute()

// Route-aware, not bare fragments. These used to be hardcoded `#features`,
// which rendered on error.vue too and did nothing at all there — and
// PRODUCT.md warns to expect inbound traffic from the legacy
// payum.forma-pro.com URLs, i.e. people arriving straight onto a 404.
const links = [
  { label: 'Features', hash: '#features' },
  { label: 'Frameworks', hash: '#frameworks' },
  { label: 'Gateways', hash: '#gateways' }
]

const onHome = computed(() => route.path === '/')
const href = (hash: string) => (onHome.value ? hash : `/${hash}`)

const open = ref(false)

// Below `md` these links used to vanish with nothing in their place, leaving
// scrolling as the only navigation on a phone.
function close() {
  open.value = false
}

watch(() => route.fullPath, close)

onMounted(() => {
  const onKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && open.value) {
      close()
    }
  }
  window.addEventListener('keydown', onKey)
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
})
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-ink/8 bg-ground/78 backdrop-blur-[14px]">
    <a
      href="#main"
      class="btn btn-primary sr-only bg-ground focus-visible:not-sr-only focus-visible:absolute focus-visible:top-2 focus-visible:left-4 focus-visible:z-30 focus-visible:px-4 focus-visible:py-2.5"
    >Skip to content</a>

    <nav class="shell flex items-center gap-[26px] py-2.5">
      <NuxtLink
        to="/"
        class="mr-auto flex items-center py-2 text-ink"
      >
        <AppBrand />
      </NuxtLink>

      <div class="hidden items-center gap-[26px] md:flex">
        <a
          v-for="link in links"
          :key="link.hash"
          :href="href(link.hash)"
          class="py-3 text-[14px] text-ink/72 transition-colors hover:text-payum-300"
        >{{ link.label }}</a>
      </div>

      <a
        :href="href('#start')"
        class="btn btn-primary min-h-11 px-4 py-3"
      >Get started</a>

      <button
        type="button"
        class="-mr-2 grid size-11 shrink-0 cursor-pointer place-items-center rounded-md text-ink/72 transition-colors hover:text-ink md:hidden"
        :aria-expanded="open"
        aria-controls="site-nav-mobile"
        @click="open = !open"
      >
        <span class="sr-only">{{ open ? 'Close section menu' : 'Open section menu' }}</span>
        <UIcon
          :name="open ? 'i-lucide-x' : 'i-lucide-menu'"
          class="size-5"
        />
      </button>
    </nav>

    <!-- The open menu covers a third of a phone viewport. Without a scrim the
         page behind it reads as broken rather than layered, and there was no
         way out but the toggle: no Escape, no tap-outside. -->
    <Transition name="scrim">
      <div
        v-show="open"
        class="fixed inset-0 top-[var(--header-h,57px)] -z-10 bg-ground/70 md:hidden"
        aria-hidden="true"
        @click="close"
      />
    </Transition>

    <Transition name="menu">
      <div
        v-show="open"
        id="site-nav-mobile"
        class="shell border-t border-ink/8 bg-ground/95 pb-3 md:hidden"
      >
        <a
          v-for="link in links"
          :key="link.hash"
          :href="href(link.hash)"
          class="block border-b border-ink/6 py-3.5 text-[15px] text-ink/78 transition-colors last:border-b-0 hover:text-payum-300"
          @click="close"
        >{{ link.label }}</a>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
/* The panel and its scrim used to blink. Exit is faster than entrance so
   dismissing feels immediate rather than sticky. */
.menu-enter-active,
.menu-leave-active,
.scrim-enter-active,
.scrim-leave-active {
  transition: opacity 180ms cubic-bezier(0.16, 1, 0.3, 1), transform 180ms cubic-bezier(0.16, 1, 0.3, 1);
}

.menu-leave-active,
.scrim-leave-active {
  transition-duration: 120ms;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.scrim-enter-from,
.scrim-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .menu-enter-active,
  .menu-leave-active,
  .scrim-enter-active,
  .scrim-leave-active {
    transition: none;
  }

  .menu-enter-from,
  .menu-leave-to {
    transform: none;
  }
}
</style>
