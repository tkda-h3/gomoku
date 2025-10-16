# Build stage
FROM node:20.10.0-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.12.0 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* .npmrc ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM node:20.10.0-alpine AS runner

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.12.0 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml .npmrc ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built application
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

ENTRYPOINT ["node", "dist/cli.js"]
CMD ["--help"]
