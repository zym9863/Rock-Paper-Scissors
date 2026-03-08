<script lang="ts">
  import Game from './lib/Game.svelte';
  import ThemeToggle from './lib/ThemeToggle.svelte';
</script>

<ThemeToggle />
<main>
  <Game />
</main>

<style>
  main {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem 1rem;
  }
</style>
