#!/bin/bash

echo "🚀 Déploiement de LoopNet..."

# 1. Build de l'application
echo "📦 Build de l'application..."
npm run build

# 2. Tests
echo "🧪 Exécution des tests..."
npm run test

# 3. Migration de la base de données
echo "🗄️ Migration de la base de données..."
npm run migrate:up

# 4. Seed des données (si nécessaire)
if [ "$1" = "--seed" ]; then
  echo "🌱 Peuplement de la base de données..."
  npm run seed
fi

# 5. Déploiement Vercel
echo "☁️ Déploiement sur Vercel..."
vercel --prod

echo "✅ Déploiement terminé !"
