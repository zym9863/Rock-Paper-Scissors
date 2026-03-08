<script lang="ts">
  import Game from './lib/Game.svelte';
  import ThemeToggle from './lib/ThemeToggle.svelte';
</script>

<ThemeToggle />
<main class="stage">
  <section class="hero">
    <p class="kicker">CLASSIC MINI GAME</p>
    <h1>Rock Paper Scissors</h1>
    <p class="lead">
      出招、对决、复盘。一个看似简单但充满心理战的小竞技场。
    </p>
  </section>

  <section class="board-wrap">
    <Game />
  </section>
</main>

<style>
  .stage {
    width: min(980px, 100% - 2rem);
    margin: 0 auto;
    padding: 3.2rem 0 2rem;
    position: relative;
  }

  .hero {
    margin-bottom: 1.6rem;
    animation: reveal 620ms var(--transition) both;
  }

  .kicker {
    font-family: 'Manrope', sans-serif;
    font-size: 0.74rem;
    letter-spacing: 0.24em;
    color: var(--accent-alt);
    font-weight: 800;
  }

  h1 {
    font-family: 'Bebas Neue', sans-serif;
    letter-spacing: 0.03em;
    font-size: clamp(2.4rem, 7vw, 4rem);
    line-height: 0.95;
    margin-top: 0.5rem;
    text-transform: uppercase;
  }

  .lead {
    margin-top: 0.65rem;
    color: var(--text-secondary);
    max-width: 52ch;
    line-height: 1.6;
  }

  .board-wrap {
    background: color-mix(in srgb, var(--bg-card) 80%, transparent);
    border: 1px solid var(--outline);
    border-radius: calc(var(--border-radius) + 8px);
    box-shadow: var(--shadow);
    backdrop-filter: blur(8px);
    padding: clamp(1rem, 2.8vw, 2rem);
    animation: reveal 820ms 120ms var(--transition) both;
  }

  @keyframes reveal {
    from {
      opacity: 0;
      transform: translateY(22px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 640px) {
    .stage {
      width: min(980px, 100% - 1.2rem);
      padding-top: 4.2rem;
    }

    .board-wrap {
      padding: 0.9rem;
    }
  }
</style>
