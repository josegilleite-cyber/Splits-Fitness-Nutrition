#!/bin/bash
# Script para copiar google-services.json a android/app/ si existe en config/ o en la raíz

set -e

SRC_CONFIG="$(pwd)/config/google-services.json"
SRC_ROOT="$(pwd)/google-services.json"
DEST="$(pwd)/android/app/google-services.json"

if [ -f "$SRC_CONFIG" ]; then
  echo "Copiando google-services.json desde config/ a android/app/"
  cp "$SRC_CONFIG" "$DEST"
elif [ -f "$SRC_ROOT" ]; then
  echo "Copiando google-services.json desde la raíz a android/app/"
  cp "$SRC_ROOT" "$DEST"
else
  echo "No se encontró google-services.json en config/ ni en la raíz."
fi
