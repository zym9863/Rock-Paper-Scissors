[English](./README-EN.md) | [中文](./README.md)

# Rock Paper Scissors

A beautiful and fun Rock Paper Scissors web game built with Svelte 5 + TypeScript + Vite.

![Rock Paper Scissors](https://img.shields.io/badge/Svelte-5-FF3E00?style=for-the-badge&logo=svelte)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)

## Features

- 🎮 **Classic Gameplay** - Rock, Paper, Scissors, three choices
- 📊 **Score Tracking** - Automatically saves win/loss/draw records to localStorage
- 🔊 **Sound Effects** - Unique sounds for each move, win, lose, and draw
- 🎨 **Beautiful Animations** - Smooth transition animations and interactive effects
- 🌓 **Theme Switching** - Support for light and dark theme switching
- 📱 **Responsive Design** - Perfect adaptation for desktop and mobile devices

## Tech Stack

- **Svelte 5** - Progressive frontend framework
- **TypeScript** - Type-safe JavaScript superset
- **Vite** - Next generation frontend build tool
- **Vitest** - Fast unit testing framework

## Quick Start

### Install Dependencies

```bash
pnpm install
```

### Development Mode

```bash
pnpm dev
```

Start the development server, visit http://localhost:5173

### Build Production Version

```bash
pnpm build
```

### Run Tests

```bash
pnpm test        # Run tests once
pnpm test:watch # Watch mode
```

## Project Structure

```
src/
├── lib/
│   ├── Game.svelte       # Main game component
│   ├── gameLogic.ts      # Game logic
│   ├── Scoreboard.svelte # Scoreboard component
│   ├── sounds.ts         # Sound module
│   ├── ThemeToggle.svelte# Theme toggle component
│   └── __tests__/
│       └── gameLogic.test.ts # Game logic tests
├── App.svelte            # App entry
├── app.css               # Global styles
└── main.ts               # Entry file
```

## Game Rules

- ✊ Rock beats ✌️ Scissors
- 🖐️ Paper beats ✊ Rock
- ✌️ Scissors beats 🖐️ Paper
- Same choice is a draw

## License

MIT License