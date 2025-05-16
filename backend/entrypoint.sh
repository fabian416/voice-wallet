#!/bin/sh

# Activar el entorno virtual
. /app/voice-embedding/.venv/bin/activate

# Ejecutar el backend Node.js
exec node dist/main