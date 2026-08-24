<script setup lang="ts">
const { text, target = null, label } = defineProps<{
  /** Exactly what lands on the clipboard. */
  text: string
  /** Selected as a fallback when the clipboard is unavailable. */
  target?: HTMLElement | null
  /** Names the thing being copied, for the accessible label. */
  label: string
}>()

const { copied, failed, copy } = useCopy()
</script>

<template>
  <div class="flex shrink-0 items-center">
    <button
      type="button"
      class="flex h-11 cursor-pointer items-center gap-1.5 rounded-sm px-3 text-[12.5px] text-ink/64 transition-colors hover:bg-ink/10 hover:text-ink"
      @click="copy(text, target)"
    >
      <UIcon
        :name="copied ? 'i-lucide-check' : 'i-lucide-copy'"
        aria-hidden="true"
        class="size-4"
        :class="copied && 'text-payum-400'"
      />
      <!-- A bare icon swap was the only success signal, which a user who
           mis-aimed could not tell from nothing happening. The word is the
           feedback; the icon just carries the state.

           Revealed by max-width rather than mounted with `v-if`: mounting it
           grew the button on every copy, so the control jumped under the
           cursor at the exact moment it was clicked. Width is a layout
           property, but this is one small element and the alternative is
           reserving ~50px of dead space beside six buttons. -->
      <span
        aria-hidden="true"
        class="max-w-0 overflow-hidden whitespace-nowrap text-payum-400 transition-[max-width,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none"
        :class="copied ? 'max-w-[5rem] opacity-100' : 'opacity-0'"
      >Copied</span>
      <span class="sr-only">Copy {{ label }} to the clipboard</span>
    </button>

    <span
      role="status"
      aria-live="polite"
      class="sr-only"
    >{{ copied ? `Copied ${label} to the clipboard` : failed ? 'The browser blocked the copy — the text is selected, press Ctrl or Cmd + C' : '' }}</span>
  </div>
</template>
