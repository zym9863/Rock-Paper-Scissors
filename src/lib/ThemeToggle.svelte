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
  <span>{dark ? 'SUN' : 'MOON'}</span>
</button>

<style>
  .theme-toggle {
    position: fixed;
    top: 1.2rem;
    right: 1.2rem;
    background: color-mix(in srgb, var(--bg-card) 78%, transparent);
    border: 1px solid var(--outline);
    border-radius: 999px;
    width: 78px;
    height: 38px;
    cursor: pointer;
    box-shadow: var(--shadow);
    transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(8px);
    z-index: 40;
  }

  .theme-toggle span {
    font-family: 'Manrope', sans-serif;
    letter-spacing: 0.13em;
    font-size: 0.7rem;
    font-weight: 800;
    color: var(--text-secondary);
  }

  .theme-toggle:hover {
    transform: translateY(-1px);
    border-color: color-mix(in srgb, var(--accent) 52%, var(--outline));
    box-shadow: var(--shadow-hover);
  }

  @media (max-width: 640px) {
    .theme-toggle {
      top: 0.7rem;
      right: 0.7rem;
      width: 72px;
      height: 34px;
    }
  }
</style>
