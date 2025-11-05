#!/bin/bash

# Build script for both German and English Docker images
# Usage: ./build-docker.sh [de|en|both]

set -e

LANGUAGE=${1:-both}
IMAGE_NAME="work-cafes-de"

echo "🚀 Building Docker images..."

if [ "$LANGUAGE" = "de" ] || [ "$LANGUAGE" = "both" ]; then
  echo "📦 Building German version (cafezumarbeiten.de)..."
  docker build \
    --build-arg LANGUAGE=de \
    --build-arg NODE_VERSION=22 \
    -t ${IMAGE_NAME}:de \
    -t ${IMAGE_NAME}:latest \
    .
  echo "✅ German build complete: ${IMAGE_NAME}:de"
fi

if [ "$LANGUAGE" = "en" ] || [ "$LANGUAGE" = "both" ]; then
  echo "📦 Building English version (awifiplace.com)..."
  docker build \
    --build-arg LANGUAGE=en \
    --build-arg NODE_VERSION=22 \
    -t ${IMAGE_NAME}:en \
    .
  echo "✅ English build complete: ${IMAGE_NAME}:en"
fi

echo "🎉 Build complete!"
echo ""
echo "To run:"
echo "  German:  docker run -p 3010:3010 --env-file .env.local ${IMAGE_NAME}:de"
echo "  English: docker run -p 3010:3010 --env-file .env.local ${IMAGE_NAME}:en"

