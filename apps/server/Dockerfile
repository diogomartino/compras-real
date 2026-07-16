FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lock ./
COPY apps/server ./apps/server
COPY packages ./packages

RUN bun install --production

FROM oven/bun:1-slim

WORKDIR /app

COPY --from=builder /app .

WORKDIR /app/apps/server

CMD ["bun", "run", "start"]