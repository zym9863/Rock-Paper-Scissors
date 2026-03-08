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

  let state: GameState = $state('idle');
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
    if (state !== 'idle') return;

    playSelectSound();
    playerChoice = choice;
    computerChoice = null;
    result = null;
    state = 'revealing';

    setTimeout(() => {
      const cpuChoice = getRandomChoice();
      computerChoice = cpuChoice;
      result = determineWinner(choice, cpuChoice);

      if (result === 'win') { wins++; playWinSound(); }
      else if (result === 'lose') { losses++; playLoseSound(); }
      else { draws++; playDrawSound(); }

      state = 'result';
    }, 800);
  }

  function playAgain() {
    state = 'idle';
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

  <h1 class="title">剪刀石头布</h1>

  {#if state === 'idle'}
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

  {#if state === 'revealing'}
    <div class="arena" in:fade={{ duration: 200 }}>
      <div class="player-side">
        <div class="reveal-emoji" in:scale={{ start: 0.5, duration: 400, easing: elasticOut }}>
          {playerChoice ? getEmoji(playerChoice) : ''}
        </div>
        <span class="side-label">你</span>
      </div>
      <div class="vs">VS</div>
      <div class="computer-side">
        <div class="reveal-emoji thinking">?</div>
        <span class="side-label">电脑</span>
      </div>
    </div>
  {/if}

  {#if state === 'result' && computerChoice && result}
    <div class="arena" in:fade={{ duration: 200 }}>
      <div class="player-side">
        <div class="reveal-emoji">{playerChoice ? getEmoji(playerChoice) : ''}</div>
        <span class="side-label">你</span>
      </div>
      <div class="vs">VS</div>
      <div class="computer-side">
        <div class="reveal-emoji" in:scale={{ start: 0, duration: 500, easing: elasticOut }}>
          {getEmoji(computerChoice)}
        </div>
        <span class="side-label">电脑</span>
      </div>
    </div>
    <div class="result {resultClass}" in:fly={{ y: 20, duration: 400, easing: quintOut }}>
      {resultText}
    </div>
    <button class="play-again-btn" onclick={playAgain} in:fade={{ delay: 300, duration: 300 }}>
      再来一局
    </button>
  {/if}
</div>

<style>
  .game {
    text-align: center;
  }

  .title {
    font-size: 2rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, var(--accent), #ff6b6b);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    color: var(--text-secondary);
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }

  .choices {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .choice-btn {
    background: var(--bg-card);
    border: 2px solid transparent;
    border-radius: var(--border-radius);
    padding: 1.5rem 2rem;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    box-shadow: var(--shadow);
    transition: all var(--transition);
    min-width: 120px;
  }

  .choice-btn:hover {
    transform: translateY(-4px) scale(1.05);
    box-shadow: var(--shadow-hover);
    border-color: var(--accent);
  }

  .choice-btn:active {
    transform: scale(0.95);
  }

  .choice-emoji {
    font-size: 3rem;
  }

  .choice-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .arena {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    margin: 2rem 0;
  }

  .player-side, .computer-side {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  .reveal-emoji {
    font-size: 4.5rem;
    width: 100px;
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-card);
    border-radius: 50%;
    box-shadow: var(--shadow);
  }

  .reveal-emoji.thinking {
    animation: pulse 0.6s ease-in-out infinite alternate;
    font-size: 2.5rem;
    color: var(--text-secondary);
  }

  @keyframes pulse {
    from { transform: scale(1); }
    to { transform: scale(1.1); }
  }

  .vs {
    font-size: 1.2rem;
    font-weight: 800;
    color: var(--text-secondary);
  }

  .side-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-secondary);
  }

  .result {
    font-size: 1.6rem;
    font-weight: 800;
    margin: 1rem 0;
  }

  .result.win { color: var(--win-color); }
  .result.lose { color: var(--lose-color); }
  .result.draw { color: var(--draw-color); }

  .play-again-btn {
    background: var(--accent);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 0.8rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition);
  }

  .play-again-btn:hover {
    background: var(--accent-hover);
    transform: translateY(-2px);
  }
</style>
