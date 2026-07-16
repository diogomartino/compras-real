FROM oven/bun:1.3.14 AS builder

WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile --production

FROM oven/bun:1.3.14-slim

WORKDIR /app

COPY --from=builder /app .

RUN bunx playwright install --with-deps chromium

WORKDIR /app/apps/server

EXPOSE 4000

CMD ["bun", "run", "start"]