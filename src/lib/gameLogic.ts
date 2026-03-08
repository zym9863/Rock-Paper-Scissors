export type Choice = 'rock' | 'paper' | 'scissors';
export type Result = 'win' | 'lose' | 'draw';

const CHOICES: Choice[] = ['rock', 'paper', 'scissors'];

const EMOJI: Record<Choice, string> = {
  rock: '✊',
  paper: '🖐️',
  scissors: '✌️',
};

const LABELS: Record<Choice, string> = {
  rock: '石头',
  paper: '布',
  scissors: '剪刀',
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
