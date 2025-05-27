# Loopnet Clone with NestJS

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/louis-oliviers-projects/v0-loopnet-clone-with-nest-js)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/M4FDwPJSjL0)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/louis-oliviers-projects/v0-loopnet-clone-with-nest-js](https://vercel.com/louis-oliviers-projects/v0-loopnet-clone-with-nest-js)**

## Solutions aux problèmes de TypeScript avec React 19

Ce projet utilise React 19, qui ne dispose pas encore de définitions de types officielles. Pour contourner les problèmes de typage, les solutions suivantes ont été mises en place :

### 1. Fichier de définition temporaire

Un fichier de définition temporaire a été créé dans `src/react.d.ts` pour fournir les déclarations de types manquantes. Ce fichier contient :
- Les déclarations pour les hooks React (useState, useEffect, etc.)
- Les interfaces JSX.IntrinsicElements nécessaires pour les éléments HTML
- Les types pour les événements et les props de base

### 2. Configuration temporaire dans .env

Les variables d'environnement suivantes ont été ajoutées au fichier `.env` pour permettre au projet de fonctionner malgré les erreurs de typage :
```
TYPESCRIPT_SKIP_VALIDATION=true
TSC_COMPILE_ON_ERROR=true
```

### 3. Composants adaptés pour React 19

#### Badge / ExtendedBadge

Le composant Badge de shadcn/ui a été adapté pour fonctionner avec React 19 :
- Une fonction `createBadge` a été ajoutée dans `components/ui/extended-badge.tsx` pour simplifier la création de badges sans problèmes de typage
- Le composant `ExtendedBadge` a été modifié pour accepter explicitement des enfants

#### Gestion des props children

Pour les composants qui requièrent des enfants, comme `AccessRestriction` ou `TooltipProvider`, nous utilisons maintenant une syntaxe JSX avec une prop children explicite :

```tsx
<AccessRestriction action='canListProperties' children={...} />

// ou

<TooltipProvider children={...} />
```

### Migration future

Lorsque des définitions de types officielles pour React 19 seront disponibles, ces solutions temporaires pourront être supprimées en :
1. Supprimant le fichier `src/react.d.ts`
2. Supprimant les variables temporaires dans `.env`
3. Revertant les ajustements de typage dans les composants

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/M4FDwPJSjL0](https://v0.dev/chat/projects/M4FDwPJSjL0)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository
