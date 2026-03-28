#!/bin/bash
set -e

# Copy the baked-in theme into the volume-mounted docroot.
# This runs on every container start so theme updates from new
# image builds always take effect.
THEME_SRC="/usr/src/elevation-theme"
THEME_DEST="/var/www/html/wp-content/themes/elevation-theme"

if [ -d "$THEME_SRC" ]; then
  mkdir -p "$THEME_DEST"
  cp -a "$THEME_SRC/." "$THEME_DEST/"
  chown -R www-data:www-data "$THEME_DEST"
fi

# Hand off to the stock WordPress Docker entrypoint
exec docker-entrypoint.sh "$@"
