#!/bin/sh
set -eu

mkdir -p /app/data /app/public/uploads

echo "Inicializando base de datos..."
npm run db:push

if [ ! -f /app/data/.seeded ]; then
  echo "Cargando datos de prueba..."
  npm run db:seed
  touch /app/data/.seeded
fi

echo "Iniciando Sanabi en puerto ${PORT:-3000}..."
exec npm run start
