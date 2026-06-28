FROM oven/bun:1 AS base

WORKDIR /app

# --- Install dependencies ---
FROM base AS install

# Copy root workspace config
COPY package.json bun.lock ./

# Copy all workspace package.json files for dependency resolution
COPY apps/server/package.json apps/server/
COPY packages/db/package.json packages/db/
COPY packages/email/package.json packages/email/
COPY packages/shared/package.json packages/shared/
COPY packages/logger/package.json packages/logger/

RUN bun install --frozen-lockfile --production

# --- Production image ---
FROM base

# Don't run as root
RUN addgroup --system --gid 1001 app && \
    adduser --system --uid 1001 --ingroup app app

WORKDIR /app

# Copy installed node_modules
COPY --from=install /app/node_modules ./node_modules

# Copy workspace packages
COPY packages/db/ packages/db/
COPY packages/email/ packages/email/
COPY packages/shared/ packages/shared/
COPY packages/logger/ packages/logger/

# Copy server source (includes migrations in src/db/migrations/)
COPY apps/server/ apps/server/

# Ensure logs directory exists and is writable
RUN mkdir -p /app/apps/server/logs && chown -R app:app /app

USER app

WORKDIR /app/apps/server

EXPOSE 4000

CMD ["bun", "run", "src/index.ts"]
