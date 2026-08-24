/** Clipboard write with an honest fallback.
 *
 *  When the clipboard is unavailable — insecure origin, denied permission,
 *  Firefox without user activation — this selects the source text instead of
 *  reporting a copy that never happened, so ⌘C still works and the UI never
 *  lies about what it did. */
export function useCopy(resetAfter = 2400) {
  const copied = ref(false)
  const failed = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  function announce(ok: boolean) {
    copied.value = ok
    failed.value = !ok
    clearTimeout(timer)
    timer = setTimeout(() => {
      copied.value = false
      failed.value = false
    }, resetAfter)
  }

  async function copy(text: string, fallbackEl?: HTMLElement | null) {
    try {
      await navigator.clipboard.writeText(text)
      announce(true)
    } catch {
      if (fallbackEl) {
        const range = document.createRange()
        range.selectNodeContents(fallbackEl)
        const selection = window.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
      announce(false)
    }
  }

  onBeforeUnmount(() => clearTimeout(timer))

  return { copied, failed, copy }
}
