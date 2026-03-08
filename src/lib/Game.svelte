<script lang="ts">
  import { fly, scale, fade } from 'svelte/transition';
  import { elasticOut, quintOut } from 'svelte/easing';
  import Scoreboard from './Scoreboard.svelte';
  import {
    type Choice,
    type Result,
    CHOICES,
    determineWinner,
    getRandomChoice,
    getEmoji,
    getLabel,
  } from './gameLogic';
  import { playSelectSound, playWinSound, playLoseSound, playDrawSound } from './sounds';

  type GameState = 'idle' | 'revealing' | 'result';

  let gameState: GameState = $state('idle');
  let playerChoice: Choice | null = $state(null);
  let computerChoice: Choice | null = $state(null);
  let result: Result | null = $state(null);

  // Scores from localStorage
  let wins = $state(Number(localStorage.getItem('rps-wins') || '0'));
  let losses = $state(Number(localStorage.getItem('rps-losses') || '0'));
  let draws = $state(Number(localStorage.getItem('rps-draws') || '0'));

  $effect(() => {
    localStorage.setItem('rps-wins', String(wins));
    localStorage.setItem('rps-losses', String(losses));
    localStorage.setItem('rps-draws', String(draws));
  });

  function play(choice: Choice) {
    if (gameState !== 'idle') return;

    playSelectSound();
    playerChoice = choice;
    computerChoice = null;
    result = null;
    gameState = 'revealing';

    setTimeout(() => {
      const cpuChoice = getRandomChoice();
      computerChoice = cpuChoice;
      result = determineWinner(choice, cpuChoice);

      if (result === 'win') { wins++; playWinSound(); }
      else if (result === 'lose') { losses++; playLoseSound(); }
      else { draws++; playDrawSound(); }

      gameState = 'result';
    }, 800);
  }

  function playAgain() {
    gameState = 'idle';
    playerChoice = null;
    computerChoice = null;
    result = null;
  }

  function resetScore() {
    wins = 0;
    losses = 0;
    draws = 0;
  }

  let resultText = $derived(
    result === 'win' ? '🎉 你赢了！' :
    result === 'lose' ? '😢 你输了' :
    result === 'draw' ? '🤝 平局' : ''
  );

  let resultClass = $derived(
    result === 'win' ? 'win' :
    result === 'lose' ? 'lose' : 'draw'
  );
</script>

<div class="game">
  <Scoreboard {wins} {losses} {draws} onReset={resetScore} />

  <div class="match-head">
    <h2 class="title">决策竞技场</h2>
    <p class="meta">每一局都是一次读心实验</p>
  </div>

  {#if gameState === 'idle'}
    <p class="subtitle">选择你的出招</p>
    <div class="choices" in:fade={{ duration: 300 }}>
      {#each CHOICES as choice, i}
        <button
          class="choice-btn"
          onclick={() => play(choice)}
          in:fly={{ y: 30, delay: i * 80, duration: 400, easing: quintOut }}
        >
          <span class="choice-emoji">{getEmoji(choice)}</span>
          <span class="choice-label">{getLabel(choice)}</span>
        </button>
      {/each}
    </div>
  {/if}

  {#if gameState === 'revealing'}
    <div class="arena" in:fade={{ duration: 200 }}>
      <div class="player-side side-panel">
        <div class="reveal-emoji" in:scale={{ start: 0.5, duration: 400, easing: elasticOut }}>
          {playerChoice ? getEmoji(playerChoice) : ''}
        </div>
        <span class="side-label">你</span>
      </div>
      <div class="vs">VS</div>
      <div class="computer-side side-panel">
        <div class="reveal-emoji thinking">?</div>
        <span class="side-label">电脑</span>
      </div>
    </div>
    <p class="status-tip">正在分析你的套路...</p>
  {/if}

  {#if gameState === 'result' && computerChoice && result}
    <div class="arena" in:fade={{ duration: 200 }}>
      <div class="player-side side-panel">
        <div class="reveal-emoji">{playerChoice ? getEmoji(playerChoice) : ''}</div>
        <span class="side-label">你</span>
      </div>
      <div class="vs">VS</div>
      <div class="computer-side side-panel">
        <div class="reveal-emoji" in:scale={{ start: 0, duration: 500, easing: elasticOut }}>
          {getEmoji(computerChoice)}
        </div>
        <span class="side-label">电脑</span>
      </div>
    </div>
    <div class="result-wrap">
      <div class="result {resultClass}" in:fly={{ y: 20, duration: 400, easing: quintOut }}>
        {resultText}
      </div>
      <button class="play-again-btn" onclick={playAgain} in:fade={{ delay: 300, duration: 300 }}>
        再来一局
      </button>
    </div>
  {/if}
</div>

<style>
  .game {
    text-align: center;
    padding: 0.35rem;
  }

  .match-head {
    margin-bottom: 1.2rem;
  }

  .title {
    font-size: clamp(1.35rem, 3vw, 1.9rem);
    font-weight: 900;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    font-family: 'Manrope', sans-serif;
  }

  .meta {
    margin-top: 0.3rem;
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .subtitle {
    color: var(--text-secondary);
    margin-bottom: 1.25rem;
    font-size: 0.98rem;
    letter-spacing: 0.02em;
  }

  .choices {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.9rem;
  }

  .choice-btn {
    background: linear-gradient(
      180deg,
      color-mix(in srgb, var(--bg-card) 78%, #fff),
      var(--bg-card)
    );
    border: 1px solid var(--outline);
    border-radius: var(--border-radius);
    padding: 1.2rem 0.8rem;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.36rem;
    box-shadow: var(--shadow);
    transition: transform var(--transition), box-shadow var(--transition), border-color var(--transition);
    min-height: 132px;
  }

  .choice-btn:hover {
    transform: translateY(-4px) rotate(-0.35deg);
    box-shadow: var(--shadow-hover);
    border-color: color-mix(in srgb, var(--accent) 58%, var(--outline));
  }

  .choice-btn:active {
    transform: scale(0.98);
  }

  .choice-emoji {
    font-size: clamp(2.5rem, 4.7vw, 3.1rem);
  }

  .choice-label {
    font-size: 0.86rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-secondary);
  }

  .arena {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: clamp(0.9rem, 4vw, 2rem);
    margin: 1.2rem 0 0.9rem;
  }

  .side-panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    background: color-mix(in srgb, var(--bg-card) 82%, transparent);
    border: 1px solid var(--outline);
    border-radius: var(--border-radius);
    padding: 0.85rem;
    min-width: min(140px, 42vw);
  }

  .reveal-emoji {
    font-size: clamp(3.2rem, 7.4vw, 4.4rem);
    width: min(106px, 26vw);
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--bg-secondary) 86%, transparent);
    border-radius: 24px;
    box-shadow: inset 0 0 0 1px var(--outline);
  }

  .reveal-emoji.thinking {
    animation: pulse 0.7s ease-in-out infinite alternate;
    font-size: 2.5rem;
    color: var(--text-secondary);
  }

  @keyframes pulse {
    from { transform: scale(1); }
    to { transform: scale(1.1); }
  }

  .vs {
    font-family: 'Bebas Neue', sans-serif;
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 800;
    letter-spacing: 0.08em;
    color: var(--accent-alt);
  }

  .side-label {
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--text-secondary);
  }

  .status-tip {
    color: var(--text-secondary);
    margin-bottom: 0.2rem;
    font-size: 0.93rem;
  }

  .result-wrap {
    margin-top: 0.5rem;
  }

  .result {
    font-size: clamp(1.25rem, 3.6vw, 1.72rem);
    font-weight: 900;
    margin: 0.7rem 0 1rem;
    font-family: 'Manrope', sans-serif;
  }

  .result.win { color: var(--win-color); }
  .result.lose { color: var(--lose-color); }
  .result.draw { color: var(--draw-color); }

  .play-again-btn {
    background: linear-gradient(130deg, var(--accent), color-mix(in srgb, var(--accent) 50%, #ffd9c5));
    color: white;
    border: none;
    border-radius: 14px;
    padding: 0.76rem 1.9rem;
    font-size: 0.95rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    cursor: pointer;
    transition: transform var(--transition), box-shadow var(--transition), filter var(--transition);
    box-shadow: 0 10px 28px color-mix(in srgb, var(--accent) 48%, transparent);
  }

  .play-again-btn:hover {
    transform: translateY(-2px);
    filter: saturate(108%);
  }

  @media (max-width: 640px) {
    .choices {
      gap: 0.65rem;
    }

    .choice-btn {
      min-height: 116px;
      padding: 0.8rem 0.35rem;
    }

    .arena {
      gap: 0.7rem;
    }

    .side-panel {
      min-width: 41vw;
      padding: 0.7rem 0.5rem;
    }
  }
</style>
