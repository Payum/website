<template>
  <!-- The page's light: two blurred sources that come up as you arrive and then
       hold. Purely decorative, so it is hidden from assistive tech, ignores
       pointer events, and sits behind everything.

       These used to drift on infinite 38s/46s cycles. WCAG SC 2.2.2 (Level A)
       wants a stop mechanism for auto-starting motion past five seconds, and
       while a 60px-blurred gradient moving ~0.2px per second is arguably below
       the threshold of perceivable motion, "arguably" is not a standard worth
       defending. A finite arrival is strictly better anyway: a 38-second
       one-way crawl was imperceptible while it ran and frozen afterwards,
       whereas this is a moment you can actually feel, and it ends.

       Transform and opacity only — both composite, so this costs nothing per
       frame. `will-change` is deliberately absent: the animation runs once for
       under four seconds, and permanently promoting two full-viewport layers
       to hold that would be a worse trade than the paint it saves. -->
  <div
    aria-hidden="true"
    class="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
  >
    <div class="atmo atmo-crimson" />
    <div class="atmo atmo-gold" />
  </div>
</template>

<style scoped>
.atmo {
  position: absolute;
  width: 92vmax;
  height: 92vmax;
  border-radius: 50%;
  filter: blur(60px);
}

/* The resting composition. Both keyframes below declare a `from` only, so this
   is where the page settles — and where it simply starts if the animation
   never runs at all. */
.atmo-crimson {
  top: -46vmax;
  right: -22vmax;
  background: radial-gradient(circle, var(--color-glow) 0%, transparent 62%);
  opacity: 0.95;
}

.atmo-gold {
  bottom: -50vmax;
  left: -26vmax;
  background: radial-gradient(circle, var(--color-glow-warm) 0%, transparent 60%);
  opacity: 0.68;
}

@media (prefers-reduced-motion: no-preference) {
  .atmo-crimson {
    animation: atmo-rise-a 3200ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .atmo-gold {
    animation: atmo-rise-b 3800ms cubic-bezier(0.16, 1, 0.3, 1);
  }
}

@keyframes atmo-rise-a {
  from {
    transform: translate3d(-6vmax, 5vmax, 0) scale(0.86);
    opacity: 0.3;
  }
}

@keyframes atmo-rise-b {
  from {
    transform: translate3d(5vmax, -5vmax, 0) scale(0.88);
    opacity: 0.15;
  }
}
</style>
