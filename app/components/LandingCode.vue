<script setup lang="ts">
import type { FrameworkName } from '~/utils/landing'

const { defaultFramework = 'Symfony' } = defineProps<{
  defaultFramework?: FrameworkName
}>()

const route = useRoute()
const router = useRouter()

const slug = (name: FrameworkName) => name.toLowerCase().replace(/\s+/g, '-')

const active = ref<FrameworkName>(defaultFramework)
const snippet = computed(() => FRAMEWORK_SNIPPETS[active.value])
const tabs = ref<HTMLButtonElement[]>([])

// `/` is prerendered without a query, so reading the query during setup would
// fight hydration — hence the watcher inside `onMounted`. It has to be a
// watcher rather than a one-shot read: on the prerendered build the query is
// still absent on the mount tick and only lands once the router settles, so a
// single read sees `undefined` and the deep link silently does nothing.
onMounted(() => {
  watch(() => route.query.framework, (asked) => {
    const wanted = FRAMEWORK_NAMES.find(name => slug(name) === asked)
    if (wanted) {
      active.value = wanted
    }
  }, { immediate: true })
})

function select(name: FrameworkName) {
  active.value = name
  // `replace`, not `push`: a Laravel developer can share the URL, but flipping
  // through four tabs shouldn't cost four presses of the back button.
  router.replace({ query: { ...route.query, framework: slug(name) } })
}

function onKeydown(event: KeyboardEvent, index: number) {
  const last = FRAMEWORK_NAMES.length - 1
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
  select(FRAMEWORK_NAMES[next]!)
  tabs.value[next]?.focus()
}
</script>

<template>
  <section
    id="frameworks"
    class="shell mt-[clamp(80px,10vw,140px)] scroll-mt-24"
  >
    <div
      data-reveal
      class="max-w-[58ch]"
    >
      <h2 class="text-[clamp(30px,3.4vw,42px)] leading-[1.1] tracking-[-0.028em]">
        Native in the framework you already use.
      </h2>
      <p class="mt-[18px] text-[16.5px] leading-[1.65] text-ink/72">
        The core is framework-agnostic plain PHP. On top of it sit maintained bridges that hook into your container, config and routing.
      </p>
    </div>

    <!-- Was four `aria-pressed` buttons swapping a panel with nothing to
         announce it. A real tablist gives assistive tech the relationship,
         the selected state and arrow-key movement for free. -->
    <div
      role="tablist"
      aria-label="Framework"
      data-reveal
      style="--reveal-delay: 80ms"
      class="mt-9 flex flex-wrap gap-1.5"
    >
      <button
        v-for="(name, index) in FRAMEWORK_NAMES"
        :id="`tab-${slug(name)}`"
        :key="name"
        ref="tabs"
        type="button"
        role="tab"
        :aria-selected="name === active"
        :aria-controls="`panel-${slug(name)}`"
        :tabindex="name === active ? 0 : -1"
        class="cursor-pointer rounded-md border px-4 py-3 text-[13px] font-medium transition-colors hover:border-payum"
        :class="name === active
          ? 'border-payum bg-payum/16 text-payum-300'
          : 'border-ink/14 text-ink/68'"
        @click="select(name)"
        @keydown="onKeydown($event, index)"
      >
        {{ name }}
      </button>
    </div>

    <div
      :id="`panel-${slug(active)}`"
      :key="active"
      role="tabpanel"
      :aria-labelledby="`tab-${slug(active)}`"
      tabindex="0"
      class="panel-swap mt-6 grid grid-cols-1 items-start gap-[18px] lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)]"
    >
      <CodeWindow
        tall
        :file="snippet.file"
        :code="snippet.code"
      />

      <div class="flex flex-col gap-3.5">
        <div class="rounded-md border border-ink/11 p-[22px]">
          <h3 class="text-[16px]">
            {{ snippet.noteTitle }}
          </h3>
          <p class="mt-2 text-[14px] leading-[1.6] text-ink/68">
            {{ snippet.note }}
          </p>
          <!-- The install command used to live in a separate card grid ~1800px
               further down, so nobody ever saw a framework's config and the
               command that installs it at the same time. -->
          <CommandLine
            :command="snippet.install"
            :prompt="false"
            tone="accent"
            class="mt-4"
          />
        </div>

        <div class="rounded-md border border-ink/11 p-[22px]">
          <h3 class="mb-4 text-[16px]">
            The request pipeline
          </h3>
          <ol class="flex flex-col gap-[11px]">
            <li
              v-for="item in PIPELINE"
              :key="item.step"
              class="flex items-baseline gap-3"
            >
              <span
                aria-hidden="true"
                class="min-w-[18px] font-mono text-[11.5px] text-payum-400"
              >{{ item.step }}</span>
              <span class="text-[13.5px] text-ink/78">{{ item.text }}</span>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Acknowledges the panel actually swapped. The animation only declares a
   `from`, so the panel is fully visible if it never runs. */
@media (prefers-reduced-motion: no-preference) {
  .panel-swap {
    animation: payum-panel-in 220ms cubic-bezier(0.16, 1, 0.3, 1);
  }
}

@keyframes payum-panel-in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
}
</style>
