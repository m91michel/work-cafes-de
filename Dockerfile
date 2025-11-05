# syntax=docker.io/docker/dockerfile:1

# Multi-stage Dockerfile for Next.js 15 (React 19) with Yarn v1 workspaces
# Supports building separate images for German (de) and English (en) versions
# Defaults to German, override with --build-arg LANGUAGE=en

ARG NODE_VERSION=22
ARG LANGUAGE=de
FROM node:${NODE_VERSION}-alpine AS base

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Alpine compatibility libraries
RUN apk add --no-cache libc6-compat

WORKDIR /app

# ------------------------------ deps ------------------------------
FROM base AS deps
WORKDIR /app

# Toolchain for native modules (node-gyp) on Alpine/arm64
RUN apk add --no-cache python3 make g++ git

# Only copy lockfiles and manifests for dependency installation
COPY package.json yarn.lock ./

# Install all deps for build, including devDependencies required by Tailwind/PostCSS
RUN yarn install --frozen-lockfile --production=false

# ----------------------------- builder ----------------------------
FROM base AS builder
WORKDIR /app

# Build argument for language (de or en)
ARG LANGUAGE=de

# Set language environment variable for build
ENV NEXT_PUBLIC_LANGUAGE=${LANGUAGE}

# Install DNS utils and ensure network connectivity for font downloads
RUN apk add --no-cache bash ca-certificates && \
    update-ca-certificates

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Ensure prebuild script is executable for locale-specific builds
RUN chmod +x ./pre-build-script.sh

# Build Next.js app with language-specific configuration
RUN yarn build

# ----------------------------- runner -----------------------------
FROM node:${NODE_VERSION}-alpine AS runner

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME="0.0.0.0" \
    PORT=3010

WORKDIR /app

# Security: drop root
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

# Static public assets
COPY --from=builder /app/public ./public

# Prefer Next.js standalone output for smaller runtime image
# This requires `output: 'standalone'` in next.config.js
# See: https://nextjs.org/docs/app/building-your-application/deploying#docker-image
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3010

# server.js is created by `next build` when using standalone output
CMD ["node", "server.js"]
