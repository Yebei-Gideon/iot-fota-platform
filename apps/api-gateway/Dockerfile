# ---- Base Environment ----
FROM oven/bun:1.3.14-alpine AS base
WORKDIR /usr/src/app

# ---- Builder ----
FROM base AS builder

# Copy root workspace configurations
COPY package.json bun.lock ./

# Copy the entire workspace (packages and apps)
COPY packages ./packages
COPY apps/api-gateway ./apps/api-gateway
COPY apps ./apps

ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV DIRECT_URL="postgresql://dummy:dummy@localhost:5432/dummy"
ENV SHADOW_DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"

# Install all dependencies (dev + prod) for the build process
RUN bun install --frozen-lockfile --ignore-scripts

# Generate the Prisma Client
RUN bun run db:generate

# Build all workspace packages
RUN for dir in packages/*; do \
      if [ -f "$dir/package.json" ]; then \
        (cd "$dir" && bun run build); \
      fi; \
    done

# Build the api-gateway application
WORKDIR /usr/src/app/apps/api-gateway
RUN bun run build

# ---- Production Runner ----
FROM base AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production

COPY package.json ./
COPY --from=builder /usr/src/app/packages ./packages
COPY --from=builder /usr/src/app/apps/api-gateway/package.json ./apps/api-gateway/package.json
COPY --from=builder /usr/src/app/apps/api-gateway/tsconfig*.json ./apps/api-gateway/

# Create a fresh, production-only node_modules with intact workspace symlinks
RUN bun install --production --ignore-scripts

COPY --from=builder /usr/src/app/apps/api-gateway/dist ./apps/api-gateway/dist

WORKDIR /usr/src/app/apps/api-gateway

# Run as a non-root user for security
USER bun

EXPOSE 3030

# Start the application
CMD ["bun", "run", "./dist/main.js"]