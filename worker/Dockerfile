FROM node:22-alpine AS base

# Install build dependencies
RUN apk add --no-cache python3 make g++ git

FROM base AS deps
WORKDIR /app
# Copy root package files (libs/ depends on root dependencies)
COPY package.json yarn.lock ./
# Copy worker package files
COPY worker/package.json worker/yarn.lock ./worker/
# Install root dependencies (needed for libs/ imports)
RUN yarn install --frozen-lockfile --production=false
WORKDIR /app/worker
# Install worker dependencies including devDependencies for build
RUN yarn install --frozen-lockfile --production=false

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
RUN yarn build

FROM base AS runner
WORKDIR /app/worker
# Copy built files
COPY --from=builder /app/worker/dist ./dist
COPY --from=builder /app/worker/node_modules ./node_modules
COPY --from=builder /app/worker/package.json ./
# Copy libs directory (needed at runtime)
COPY --from=builder /app/libs ./libs

CMD ["node", "dist/index.js"]

