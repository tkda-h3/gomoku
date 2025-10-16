# Gomoku

A CLI tool built with TypeScript, designed with future React frontend support in mind.

## Features

- TypeScript-based CLI with Commander.js
- OpenAPI-based API client generation
- Volta for Node.js and pnpm version management
- ESLint + Prettier for code quality
- Vitest for testing
- Docker support with multi-stage builds
- pnpm workspace ready for monorepo structure

## Prerequisites

- [Volta](https://volta.sh/) (recommended) or Node.js 20.10.0+
- pnpm 8.12.0+

## Installation

```bash
# Install dependencies
pnpm install
```

## Usage

### Development

```bash
# Run in development mode
pnpm dev hello World
# Output: hello, World

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run linter
pnpm lint

# Format code
pnpm format
```

### Build

```bash
# Build the project
pnpm build

# Run built version
pnpm start hello World
```

### Docker

```bash
# Build Docker image
docker build -t gomoku .

# Run with Docker
docker run --rm gomoku hello World

# Use Docker Compose for development
docker-compose up gomoku-dev
```

## CLI Commands

```bash
# Show help
gomoku --help

# Say hello
gomoku hello <name>
```

## Project Structure

```
gomoku/
├── src/
│   ├── cli.ts              # CLI entry point
│   └── __tests__/          # Test files
├── dist/                   # Build output
├── package.json
├── tsconfig.json           # TypeScript configuration
├── vitest.config.ts        # Test configuration
├── .eslintrc.json          # ESLint configuration
├── .prettierrc             # Prettier configuration
├── pnpm-workspace.yaml     # pnpm workspace configuration
├── Dockerfile
├── docker-compose.yml
└── README.md
```

## API Client Generation

This project uses OpenAPI specification to generate TypeScript API client code.

### Generate API Client

```bash
# Generate TypeScript client from OpenAPI spec
make generate-client

# Or using npx directly
npx openapi-typescript-codegen --input ./openapi.yaml --output ./generated-client --client axios
```

The generated client will be placed in `./generated-client/` directory.

### Clean Generated Files

```bash
make clean
```

**Note:** The generated client code is automatically excluded from git diffs (see `.gitattributes`) and ignored by git (see `.gitignore`).

## Scripts

- `pnpm dev` - Run in development mode with tsx
- `pnpm build` - Build the project
- `pnpm start` - Run the built version
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint errors
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting
- `pnpm typecheck` - Type check without emitting files
- `pnpm clean` - Remove build output

## Future Plans

- Add React-based web frontend
- Expand CLI functionality
- Add more comprehensive tests

## License

MIT
