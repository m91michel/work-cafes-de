# syntax=docker.io/docker/dockerfile:1

FROM node:22-alpine AS base

# Install build dependencies
RUN apk add --no-cache python3 make g++ git

FROM base AS deps
WORKDIR /app
# Copy root package files (libs/ depends on root dependencies)
COPY package.json yarn.lock ./
# Copy worker package files
COPY worker/package.json worker/yarn.lock ./worker/
# Set Yarn cache folder explicitly for Yarn v1
ENV YARN_CACHE_FOLDER=/usr/local/share/.cache/yarn
# Install root dependencies (needed for libs/ imports)
# Use BuildKit cache mount to share yarn cache between builds
# Yarn v1 doesn't handle concurrent writes well, so use 'locked' mode to serialize access
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn,id=yarn-cache,sharing=locked \
    yarn install --frozen-lockfile --production=false
WORKDIR /app/worker
# Install worker dependencies including devDependencies for build
# Use BuildKit cache mount to share yarn cache between builds
RUN --mount=type=cache,target=/usr/local/share/.cache/yarn,id=yarn-cache,sharing=locked \
    yarn install --frozen-lockfile --production=false

FROM base AS builder
WORKDIR /app
# Copy root node_modules (needed for libs/ dependencies)
COPY --from=deps /app/node_modules ./node_modules
# Copy worker node_modules
COPY --from=deps /app/worker/node_modules ./worker/node_modules
# Copy worker source code, config, and package.json
COPY worker/src ./worker/src
COPY worker/tsconfig.json ./worker/
COPY worker/package.json ./worker/
# Copy libs directory (required by worker imports: ../../../libs)
COPY libs/ ./libs/
# Copy types_db.ts if it exists (referenced by libs)
# Note: This file may be generated, so build will continue if missing
COPY types_db.ts ./types_db.ts
WORKDIR /app/worker
RUN yarn build && \
    ls -la dist/ && \
    test -f dist/worker/src/index.js || (echo "ERROR: dist/worker/src/index.js not found after build" && exit 1)

FROM base AS runner
WORKDIR /app/worker
# Copy built files
COPY --from=builder /app/worker/dist ./dist
COPY --from=builder /app/worker/node_modules ./node_modules
COPY --from=builder /app/worker/package.json ./
# Copy libs directory to /app/libs (needed at runtime, code expects ../../../libs from dist/worker/src/)
COPY --from=builder /app/libs ../libs
# Copy root node_modules (needed for libs/ imports at runtime)
COPY --from=builder /app/node_modules ../node_modules

CMD ["node", "dist/worker/src/index.js"]

