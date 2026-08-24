<script setup lang="ts">
const { file, code, dots = false, tall = false, highlight = null } = defineProps<{
  /** Filename shown in the window chrome. */
  file: string
  code: string
  /** The hero window wears the three traffic lights; the inline one doesn't. */
  dots?: boolean
  tall?: boolean
  /** Inclusive, 1-indexed line range to tint as the gateway-specific block. */
  highlight?: [number, number] | null
}>()

// Highlighting happens once per render — at prerender time for `/`, so no
// highlighter reaches the browser.
const lines = computed(() => highlightPhp(code))

const isHighlighted = (index: number) =>
  !!highlight && index + 1 >= highlight[0] && index + 1 <= highlight[1]

// Keying the highlighted lines by their own content makes the DOM enforce the
// claim the caption makes: swap the gateway and only these nodes are torn down
// and rebuilt, so only these can animate. Every other line keeps a stable key,
// is never re-created, and provably does not move. The motion is the argument,
// not decoration on top of it.
const signature = computed(() =>
  lines.value.filter((_, i) => isHighlighted(i)).map(l => l.map(t => t.text).join('')).join('\n')
)

const lineKey = (index: number) =>
  isHighlighted(index) ? `h${index}:${signature.value}` : `l${index}`

const codeEl = ref<HTMLElement | null>(null)
</script>

<template>
  <div class="overflow-hidden rounded-lg bg-surface shadow-md">
    <div
      class="flex items-center gap-2 border-b border-ink/9 py-1 pr-1"
      :class="dots ? 'pl-4' : 'pl-[18px]'"
    >
      <template v-if="dots">
        <span
          v-for="dot in 3"
          :key="dot"
          class="size-[9px] rounded-full bg-ink-800"
        />
      </template>
      <span
        class="font-mono text-[12.5px] text-ink/72"
        :class="dots && 'ml-2'"
      >{{ file }}</span>

      <!-- The page's thesis is that code is the product's imagery, so the
           config a visitor actually wants was the one thing they couldn't
           take with them. -->
      <CopyButton
        :text="code"
        :target="codeEl"
        :label="file"
        class="ml-auto"
      />
    </div>
    <pre
      ref="codeEl"
      class="overflow-x-auto font-mono text-[12.8px] leading-[1.85]"
      :class="tall ? 'min-h-[340px] p-[22px]' : 'px-[22px] pt-5 pb-6'"
    ><div
v-for="(line, index) in lines"
          :key="lineKey(index)"
class="whitespace-pre"
          :class="isHighlighted(index) && 'code-line-swap -mx-[22px] bg-payum/12 px-[22px] shadow-[inset_2px_0_0_var(--color-payum)]'"
><span
v-for="(token, tokenIndex) in line"
                                                    :key="tokenIndex"
:class="CODE_TOKEN_CLASS[token.kind]"
    >{{ token.text }}</span></div></pre>
  </div>
</template>
