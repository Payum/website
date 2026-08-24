<script setup lang="ts">
const { command, prompt = true, tone = 'bare' } = defineProps<{
  /** The exact shell command; this is also what lands on the clipboard. */
  command: string
  /** The `$` prompt glyph. Off for a bare package name. */
  prompt?: boolean
  tone?: 'bare' | 'panel' | 'accent'
}>()

const TONE_CLASS = {
  bare: 'text-[13px] text-ink/64',
  panel: 'rounded-md border border-ink/12 bg-ground py-1 pr-1 pl-4 text-[14px]',
  accent: 'rounded-sm bg-payum/12 py-0.5 pr-0.5 pl-[11px] text-[12.5px] text-payum-300'
} as const

const commandEl = ref<HTMLElement | null>(null)
</script>

<template>
  <div
    class="flex items-center gap-2.5 font-mono"
    :class="TONE_CLASS[tone]"
  >
    <span
      v-if="prompt"
      aria-hidden="true"
      class="text-payum-400"
    >$</span>

    <!-- Wraps rather than scrolls: in a narrow card the copy button leaves
         ~190px, and a nowrap command silently truncated to "composer require
         pay". `wrap-anywhere` only breaks when it must. -->
    <code
      ref="commandEl"
      class="min-w-0 flex-1 wrap-anywhere"
    >{{ command }}</code>

    <CopyButton
      :text="command"
      :target="commandEl"
      :label="command"
    />
  </div>
</template>
