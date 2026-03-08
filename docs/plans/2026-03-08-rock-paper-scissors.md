# Rock Paper Scissors Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a player-vs-computer Rock Paper Scissors web game with Svelte 5 + Vite, featuring animations, sound effects, scoreboard, and dark mode.

**Architecture:** Single main Game component with small sub-components for Scoreboard and ThemeToggle. Game logic as a pure TypeScript module. Sound effects via Web Audio API with no external files. CSS variables for theming.

**Tech Stack:** Svelte 5 (runes), Vite, TypeScript, Web Audio API, localStorage

---

### Task 1: Project Scaffolding

**Files:**
- Create: project root via `npm create vite@latest`

**Step 1: Scaffold Svelte + Vite project**

Run:
```bash
cd "d:/github/Rock Paper Scissors"
npm create vite@latest . -- --template svelte-ts
```

If prompted about non-empty directory, confirm overwrite.

**Step 2: Install dependencies**

Run:
```bash
npm install
```

**Step 3: Verify dev server starts**

Run:
```bash
npm run dev
```

Expected: Dev server starts on localhost, no errors.

**Step 4: Clean up template files**

Remove default template content:
- Clear `src/App.svelte` to a minimal shell
- Delete `src/lib/Counter.svelte`
- Clear `src/app.css` to empty

**Step 5: Init git and commit**

```bash
git init
git add .
git commit -m "chore: scaffold Svelte + Vite project"
```

---

### Task 2: Game Logic Module

**Files:**
- Create: `src/lib/gameLogic.ts`
- Create: `src/lib/__tests__/gameLogic.test.ts`

**Step 1: Install vitest**

Run:
```bash
npm install -D vitest
```

Add test script to `package.json`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 2: Write failing tests for game logic**

```typescript
// src/lib/__tests__/gameLogic.test.ts
import { describe, it, expect } from 'vitest';
import { determineWinner, type Choice, type Result } from '../gameLogic';

describe('determineWinner', () => {
  it('returns draw when both choose the same', () => {
    expect(determineWinner('rock', 'rock')).toBe('draw');
    expect(determineWinner('paper', 'paper')).toBe('draw');
    expect(determineWinner('scissors', 'scissors')).toBe('draw');
  });

  it('returns win when player beats computer', () => {
    expect(determineWinner('rock', 'scissors')).toBe('win');
    expect(determineWinner('paper', 'rock')).toBe('win');
    expect(determineWinner('scissors', 'paper')).toBe('win');
  });

  it('returns lose when computer beats player', () => {
    expect(determineWinner('rock', 'paper')).toBe('lose');
    expect(determineWinner('paper', 'scissors')).toBe('lose');
    expect(determineWinner('scissors', 'rock')).toBe('lose');
  });
});
```

**Step 3: Run tests to verify they fail**

Run: `npx vitest run`
Expected: FAIL - module not found

**Step 4: Implement game logic**

```typescript
// src/lib/gameLogic.ts
export type Choice = 'rock' | 'paper' | 'scissors';
export type Result = 'win' | 'lose' | 'draw';

const CHOICES: Choice[] = ['rock', 'paper', 'scissors'];

const EMOJI: Record<Choice, string> = {
  rock: '\u270a',
  paper: '\ud83d\udd90\ufe0f',
  scissors: '\u270c\ufe0f',
};

const LABELS: Record<Choice, string> = {
  rock: '\u77f3\u5934',
  paper: '\u5e03',
  scissors: '\u526a\u5200',
};

export function determineWinner(player: Choice, computer: Choice): Result {
  if (player === computer) return 'draw';
  if (
    (player === 'rock' && computer === 'scissors') ||
    (player === 'paper' && computer === 'rock') ||
    (player === 'scissors' && computer === 'paper')
  ) {
    return 'win';
  }
  return 'lose';
}

export function getRandomChoice(): Choice {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}

export function getEmoji(choice: Choice): string {
  return EMOJI[choice];
}

export function getLabel(choice: Choice): string {
  return LABELS[choice];
}

export { CHOICES };
```

**Step 5: Run tests to verify they pass**

Run: `npx vitest run`
Expected: All 3 test cases PASS

**Step 6: Commit**

```bash
git add .
git commit -m "feat: add game logic module with tests"
```

---

### Task 3: Sound Effects Module

**Files:**
- Create: `src/lib/sounds.ts`

**Step 1: Implement programmatic sound effects**

```typescript
// src/lib/sounds.ts
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function playTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume = 0.3) {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
}

export function playSelectSound() {
  playTone(600, 0.1, 'sine', 0.2);
}

export function playWinSound() {
  const ctx = getAudioContext();
  const now = ctx.currentTime;
  [523, 659, 784].forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.12);
    gain.gain.setValueAtTime(0.3, now + i * 0.12);
    gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.12);
    osc.stop(now + i * 0.12 + 0.3);
  });
}

export function playLoseSound() {
  playTone(300, 0.4, 'sawtooth', 0.15);
}

export function playDrawSound() {
  playTone(440, 0.2, 'triangle', 0.2);
}
```

**Step 2: Commit**

```bash
git add src/lib/sounds.ts
git commit -m "feat: add programmatic sound effects module"
```

---

### Task 4: Global Styles & Theme System

**Files:**
- Modify: `src/app.css`
- Create: `src/lib/ThemeToggle.svelte`
- Modify: `index.html` - update title

**Step 1: Write global CSS with theme variables**

```css
/* src/app.css */
:root {
  --bg-primary: #f8f9fa;
  --bg-secondary: #ffffff;
  --bg-card: #ffffff;
  --text-primary: #1a1a2e;
  --text-secondary: #6c757d;
  --accent: #6c63ff;
  --accent-hover: #5a52d5;
  --win-color: #28a745;
  --lose-color: #dc3545;
  --draw-color: #ffc107;
  --shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  --shadow-hover: 0 8px 30px rgba(0, 0, 0, 0.12);
  --border-radius: 16px;
  --transition: 0.3s ease;
}

:root.dark {
  --bg-primary: #0f0f23;
  --bg-secondary: #1a1a2e;
  --bg-card: #16213e;
  --text-primary: #e0e0e0;
  --text-secondary: #a0a0b0;
  --accent: #7c73ff;
  --accent-hover: #6c63ff;
  --shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  --shadow-hover: 0 8px 30px rgba(0, 0, 0, 0.4);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  min-height: 100vh;
  transition: background var(--transition), color var(--transition);
}

#app {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
```

**Step 2: Create ThemeToggle component**

```svelte
<!-- src/lib/ThemeToggle.svelte -->
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
  {dark ? '\u2600\ufe0f' : '\ud83c\udf19'}
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
```

**Step 3: Update index.html title**

Change `<title>` to `Rock Paper Scissors`.

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add theme system with dark mode toggle"
```

---

### Task 5: Scoreboard Component

**Files:**
- Create: `src/lib/Scoreboard.svelte`

**Step 1: Create Scoreboard component**

```svelte
<!-- src/lib/Scoreboard.svelte -->
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
      <span class="score-label">\u80dc</span>
    </div>
    <div class="score-item draw">
      <span class="score-value">{draws}</span>
      <span class="score-label">\u5e73</span>
    </div>
    <div class="score-item lose">
      <span class="score-value">{losses}</span>
      <span class="score-label">\u8d1f</span>
    </div>
  </div>
  <div class="score-footer">
    <span class="win-rate">\u80dc\u7387: {winRate}%</span>
    <button class="reset-btn" onclick={onReset}>\u91cd\u7f6e</button>
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
```

**Step 2: Commit**

```bash
git add src/lib/Scoreboard.svelte
git commit -m "feat: add scoreboard component with win rate"
```

---

### Task 6: Main Game Component

**Files:**
- Create: `src/lib/Game.svelte`

**Step 1: Create the Game component**

This is the core component with choice buttons, reveal animation, and result display.

```svelte
<!-- src/lib/Game.svelte -->
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
    result === 'win' ? '\ud83c\udf89 \u4f60\u8d62\u4e86\uff01' :
    result === 'lose' ? '\ud83d\ude22 \u4f60\u8f93\u4e86' :
    result === 'draw' ? '\ud83e\udd1d \u5e73\u5c40' : ''
  );

  let resultClass = $derived(
    result === 'win' ? 'win' :
    result === 'lose' ? 'lose' : 'draw'
  );
</script>

<div class="game">
  <Scoreboard {wins} {losses} {draws} onReset={resetScore} />

  <h1 class="title">\u526a\u5200\u77f3\u5934\u5e03</h1>

  {#if state === 'idle'}
    <p class="subtitle">\u9009\u62e9\u4f60\u7684\u51fa\u62db</p>
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
        <span class="side-label">\u4f60</span>
      </div>
      <div class="vs">VS</div>
      <div class="computer-side">
        <div class="reveal-emoji thinking">?</div>
        <span class="side-label">\u7535\u8111</span>
      </div>
    </div>
  {/if}

  {#if state === 'result' && computerChoice && result}
    <div class="arena" in:fade={{ duration: 200 }}>
      <div class="player-side">
        <div class="reveal-emoji">{playerChoice ? getEmoji(playerChoice) : ''}</div>
        <span class="side-label">\u4f60</span>
      </div>
      <div class="vs">VS</div>
      <div class="computer-side">
        <div class="reveal-emoji" in:scale={{ start: 0, duration: 500, easing: elasticOut }}>
          {getEmoji(computerChoice)}
        </div>
        <span class="side-label">\u7535\u8111</span>
      </div>
    </div>
    <div class="result {resultClass}" in:fly={{ y: 20, duration: 400, easing: quintOut }}>
      {resultText}
    </div>
    <button class="play-again-btn" onclick={playAgain} in:fade={{ delay: 300, duration: 300 }}>
      \u518d\u6765\u4e00\u5c40
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
```

**Step 2: Commit**

```bash
git add src/lib/Game.svelte
git commit -m "feat: add main game component with animations"
```

---

### Task 7: App Shell Integration

**Files:**
- Modify: `src/App.svelte`

**Step 1: Wire up App.svelte**

```svelte
<!-- src/App.svelte -->
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
```

**Step 2: Verify the app runs correctly**

Run: `npm run dev`
Expected: Game renders with choice buttons, scoreboard, and theme toggle.

**Step 3: Commit**

```bash
git add src/App.svelte
git commit -m "feat: integrate all components into App shell"
```

---

### Task 8: Manual QA & Polish

**Step 1: Test full game flow in browser**

- Click each choice button, verify animation and sound
- Verify result display and score update
- Verify localStorage persistence (refresh page, scores persist)
- Toggle dark/light mode
- Test reset button on scoreboard
- Test responsive layout on narrow viewport

**Step 2: Fix any issues found during QA**

**Step 3: Final commit**

```bash
git add .
git commit -m "polish: final QA adjustments"
```

---

### Task 9: Build Verification

**Step 1: Run production build**

Run: `npm run build`
Expected: Build succeeds with no errors.

**Step 2: Preview production build**

Run: `npm run preview`
Expected: Game works correctly in production mode.

**Step 3: Commit if any build fixes were needed**
