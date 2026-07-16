FROM oven/bun:1 AS builder

WORKDIR /app

COPY package.json bun.lock ./
COPY apps/client ./apps/client
COPY packages ./packages

RUN bun install

WORKDIR /app/apps/client

RUN bun run build

FROM nginx:alpine

COPY --from=builder /app/apps/client/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]