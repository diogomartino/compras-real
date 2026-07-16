FROM oven/bun:1.3.14 AS builder

WORKDIR /app

COPY . .

RUN bun install --frozen-lockfile

WORKDIR /app/apps/client

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN bun run build

FROM nginx:1.29-alpine

COPY apps/client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/client/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]