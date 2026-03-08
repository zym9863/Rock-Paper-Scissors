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
