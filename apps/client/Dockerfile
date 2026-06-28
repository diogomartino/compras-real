FROM oven/bun:1 AS builder

WORKDIR /app

# Copy root workspace config
COPY package.json bun.lock ./

# Copy workspace package.json files for dependency resolution
COPY apps/client/package.json apps/client/
COPY packages/shared/package.json packages/shared/

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code for shared packages and client
COPY packages/shared/ packages/shared/
COPY apps/client/ apps/client/

ARG API_URL
ENV API_URL=$API_URL

WORKDIR /app/apps/client
RUN bun run build

# --- Production stage ---
FROM nginx:alpine

COPY apps/client/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/client/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
