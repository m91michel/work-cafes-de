#!/bin/bash

# Script to replace Open Graph and Twitter images with German versions when NEXT_PUBLIC_LANGUAGE=de

echo "Running pre-build script..."

# Check if NEXT_PUBLIC_LANGUAGE is set to "de"
if [ "$NEXT_PUBLIC_LANGUAGE" = "de" ]; then
  echo "German language detected. Replacing Open Graph and Twitter images with German versions..."
  
  # Check if German versions exist
  if [ -f "app/opengraph-image-de.jpeg" ]; then
    echo "Replacing opengraph-image.jpeg with opengraph-image-de.jpeg"
    cp app/opengraph-image-de.jpeg app/opengraph-image.jpeg
  else
    echo "Warning: app/opengraph-image-de.jpeg not found"
  fi
  
  # For Twitter image, we'll use the same German Open Graph image if a specific German Twitter image doesn't exist
  if [ -f "app/twitter-image-de.jpeg" ]; then
    echo "Replacing twitter-image.jpeg with twitter-image-de.jpeg"
    cp app/twitter-image-de.jpeg app/twitter-image.jpeg
  elif [ -f "app/opengraph-image-de.jpeg" ]; then
    echo "No specific German Twitter image found. Using German Open Graph image instead."
    cp app/opengraph-image-de.jpeg app/twitter-image.jpeg
  else
    echo "Warning: No German images found for Twitter"
  fi
  
  echo "Image replacement completed."
else
  echo "English language detected. No image replacement needed."
fi

echo "Pre-build script completed."
