<script lang="ts">
  import { fade } from 'svelte/transition';

  interface Props {
    wins: number;
    losses: number;
    draws: number;
    onReset: () => void;
  }

  let { wins, losses, draws, onReset }: Props = $props();

  let total = $derived(wins + losses + draws);
  let winRate = $derived(total > 0 ? Math.round((wins / total) * 100) : 0);
</script>

<div class="scoreboard" transition:fade={{ duration: 200 }}>
  <div class="scores">
    <div class="score-item win">
      <span class="score-value">{wins}</span>
      <span class="score-label">胜</span>
    </div>
    <div class="score-item draw">
      <span class="score-value">{draws}</span>
      <span class="score-label">平</span>
    </div>
    <div class="score-item lose">
      <span class="score-value">{losses}</span>
      <span class="score-label">负</span>
    </div>
  </div>
  <div class="score-footer">
    <span class="win-rate">胜率 {winRate}%</span>
    <button class="reset-btn" onclick={onReset}>重置</button>
  </div>
</div>

<style>
  .scoreboard {
    background: color-mix(in srgb, var(--bg-card) 86%, transparent);
    border-radius: calc(var(--border-radius) - 2px);
    padding: 1rem;
    border: 1px solid var(--outline);
    box-shadow: var(--shadow);
    margin-bottom: 1.25rem;
  }

  .scores {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.75rem;
    text-align: center;
  }

  .score-item {
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    border: 1px solid var(--outline);
    border-radius: 14px;
    padding: 0.75rem 0.2rem;
    background: color-mix(in srgb, var(--bg-secondary) 75%, transparent);
  }

  .score-value {
    font-size: clamp(1.7rem, 3vw, 2.1rem);
    font-weight: 900;
    line-height: 1;
    font-family: 'Manrope', sans-serif;
  }

  .score-label {
    font-size: 0.76rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.18em;
    font-weight: 800;
  }

  .win .score-value { color: var(--win-color); }
  .draw .score-value { color: var(--draw-color); }
  .lose .score-value { color: var(--lose-color); }

  .score-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.8rem;
    padding-top: 0.75rem;
    border-top: 1px dashed var(--outline);
  }

  .win-rate {
    font-size: 0.88rem;
    color: var(--text-secondary);
    letter-spacing: 0.04em;
    font-weight: 700;
  }

  .reset-btn {
    background: color-mix(in srgb, var(--accent) 12%, transparent);
    border: 1px solid color-mix(in srgb, var(--accent) 62%, transparent);
    border-radius: 10px;
    color: var(--accent-hover);
    padding: 0.38rem 0.85rem;
    font-size: 0.76rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: transform var(--transition), filter var(--transition), border-color var(--transition);
  }

  .reset-btn:hover {
    transform: translateY(-1px);
    border-color: var(--accent);
    filter: saturate(112%);
  }

  @media (max-width: 640px) {
    .score-item {
      padding: 0.62rem 0.1rem;
    }

    .win-rate {
      font-size: 0.82rem;
    }
  }
</style>
