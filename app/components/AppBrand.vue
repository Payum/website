<script setup lang="ts">
const { small = false } = defineProps<{
  small?: boolean
}>()
</script>

<template>
  <span
    class="flex items-center gap-2.5 font-medium tracking-[-0.02em]"
    :class="small ? 'text-[16px]' : 'text-[19px]'"
  >
    <!-- The real mark, replacing the accent square that stood in for it.
         `alt=""` on purpose: the wordmark beside it already carries the name,
         so announcing it twice would be noise. Width and height are set so the
         mark reserves its space before the image decodes — a logo that pops in
         and shoves the wordmark sideways is the most-seen layout shift on any
         site. -->
    <img
      src="/payum-mark.png"
      alt=""
      width="200"
      height="200"
      decoding="async"
      class="shrink-0"
      :class="small ? 'size-[19px]' : 'size-[23px]'"
    >
    Payum
  </span>
</template>
