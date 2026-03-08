<script lang="ts">
  let dark = $state(
    typeof localStorage !== 'undefined'
      ? localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
      : false
  );

  $effect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  });

  function toggle() {
    dark = !dark;
  }
</script>

<button class="theme-toggle" onclick={toggle} aria-label="Toggle theme">
  {dark ? '☀️' : '🌙'}
</button>

<style>
  .theme-toggle {
    position: fixed;
    top: 1rem;
    right: 1rem;
    background: var(--bg-card);
    border: none;
    border-radius: 50%;
    width: 44px;
    height: 44px;
    font-size: 1.3rem;
    cursor: pointer;
    box-shadow: var(--shadow);
    transition: transform var(--transition), box-shadow var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .theme-toggle:hover {
    transform: scale(1.1);
    box-shadow: var(--shadow-hover);
  }
</style>
