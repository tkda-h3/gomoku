# gomoku

Gomoku (五目並べ) game implementation with TypeScript CLI.

## Features

- TypeScript-based implementation with future frontend UI in mind
- CLI interface for board display
- Modular board representation
- Built with pnpm for package management

## Setup

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run in development mode
pnpm dev

# Run built CLI
pnpm start
```

## Project Structure

```
├── src/
│   ├── board.ts    # Board class and game logic
│   └── cli.ts      # CLI entry point
├── package.json    # Project configuration
├── tsconfig.json   # TypeScript configuration
└── README.md       # This file
```

## Development

This project is built with TypeScript and uses pnpm as the package manager. The CLI displays a Gomoku board with sample stones placed.

- `● = Black stone`
- `○ = White stone`
- `· = Empty cell`

## Future Plans

- Interactive gameplay
- Frontend UI implementation
- Game logic (win detection, turn management)
- Multiplayer support
