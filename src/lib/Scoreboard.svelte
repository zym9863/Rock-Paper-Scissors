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
    <span class="win-rate">胜率: {winRate}%</span>
    <button class="reset-btn" onclick={onReset}>重置</button>
  </div>
</div>

<style>
  .scoreboard {
    background: var(--bg-card);
    border-radius: var(--border-radius);
    padding: 1.25rem;
    box-shadow: var(--shadow);
    margin-bottom: 2rem;
  }

  .scores {
    display: flex;
    justify-content: space-around;
    text-align: center;
  }

  .score-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .score-value {
    font-size: 2rem;
    font-weight: 700;
  }

  .score-label {
    font-size: 0.85rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .win .score-value { color: var(--win-color); }
  .draw .score-value { color: var(--draw-color); }
  .lose .score-value { color: var(--lose-color); }

  .score-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-top: 0.75rem;
    border-top: 1px solid var(--bg-primary);
  }

  .win-rate {
    font-size: 0.85rem;
    color: var(--text-secondary);
  }

  .reset-btn {
    background: none;
    border: 1px solid var(--text-secondary);
    border-radius: 8px;
    color: var(--text-secondary);
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all var(--transition);
  }

  .reset-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
  }
</style>
