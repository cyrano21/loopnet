# LoopNet - Plateforme Immobilière Commerciale

Une plateforme moderne pour la recherche et la gestion de propriétés commerciales, inspirée des meilleures pratiques de l'industrie immobilière.

## 🚀 Fonctionnalités

### Vues de Propriétés
- **Vue Grille** (`/properties/grid-view`) - Affichage en cartes avec filtres avancés
- **Vue Liste** (`/properties/list-view`) - Affichage détaillé en liste
- **Vue Carte** (`/properties/map-view`) - Visualisation géographique interactive

### Système de Filtrage
- Filtres par type de propriété (Bureau, Local commercial, Entrepôt, etc.)
- Filtres par type de transaction (Vente/Location)
- Filtres par prix, surface, localisation
- Recherche textuelle avancée
- Tri par prix, date, pertinence

### Gestion des Utilisateurs
- Système de rôles (Guest, Basic, Premium, Admin)
- Limites d'utilisation par rôle
- Favoris et comparaisons
- Recherches sauvegardées

### Données de Test
- 50+ propriétés commerciales variées
- Données inspirées de l'application Homez
- Utilisateurs de test avec différents rôles
- Géolocalisation et images

## 🛠️ Installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd loopnet
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
Créer un fichier `.env.local` :
```env
MONGODB_URI=mongodb://localhost:27017/loopnet
DATABASE_NAME=loopnet
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

4. **Initialiser la base de données**
```bash
# Nettoyer et initialiser avec les données de test
npm run db:reset

# Ou seulement ajouter les données
npm run seed
```

5. **Lancer le serveur de développement**
```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📊 Scripts Disponibles

- `npm run dev` - Lancer le serveur de développement
- `npm run build` - Construire l'application pour la production
- `npm run start` - Lancer l'application en production
- `npm run seed` - Initialiser la base de données avec les données de test
- `npm run seed:clean` - Nettoyer la base de données
- `npm run db:reset` - Nettoyer et réinitialiser complètement

## 🏗️ Structure du Projet

```
loopnet/
├── app/
│   ├── properties/
│   │   ├── grid-view/          # Vue grille des propriétés
│   │   ├── list-view/          # Vue liste des propriétés
│   │   ├── map-view/           # Vue carte des propriétés
│   │   └── [id]/               # Page détail d'une propriété
│   ├── dashboard/              # Tableau de bord utilisateur
│   └── api/                    # API routes
├── components/
│   ├── ui/                     # Composants UI de base
│   ├── property-card.tsx       # Carte de propriété
│   ├── property-map-card.tsx   # Carte pour vue carte
│   ├── property-filters.tsx    # Filtres de propriétés
│   └── ...
├── lib/
│   ├── seed-data.ts            # Données de test
│   ├── mongodb.ts              # Configuration MongoDB
│   └── utils.ts                # Utilitaires
├── models/                     # Modèles Mongoose
├── hooks/                      # Hooks React personnalisés
└── scripts/
    └── seed-database.ts        # Script d'initialisation
```

## 🎨 Composants Principaux

### PropertyCard
Composant réutilisable pour afficher une propriété :
```tsx
<PropertyCard 
  property={property} 
  variant="grid" // ou "list"
  showActions={true}
/>
```

### PropertyMapCard
Composant spécialisé pour la vue carte :
```tsx
<PropertyMapCard 
  property={property}
  isSelected={selectedId === property.id}
  onClick={() => setSelected(property.id)}
  compact={true}
/>
```

### PropertyFilters
Système de filtrage avancé :
```tsx
<PropertyFilters 
  onFilterChange={handleFilterChange}
  initialFilters={filters}
/>
```

## 📱 Vues Disponibles

### Vue Grille (`/properties/grid-view`)
- Affichage en cartes responsive
- Filtres latéraux
- Pagination
- Actions rapides (favoris, comparaison)

### Vue Liste (`/properties/list-view`)
- Affichage détaillé en lignes
- Informations complètes visibles
- Tri et filtrage
- Actions en ligne

### Vue Carte (`/properties/map-view`)
- Carte interactive
- Marqueurs de prix
- Liste latérale
- Mode plein écran
- Sélection de propriétés

## 🔐 Système de Permissions

Les utilisateurs ont différents niveaux d'accès :

- **Guest** : 10 propriétés vues, 3 favoris, 2 comparaisons
- **Basic** : 50 propriétés vues, 10 favoris, 3 comparaisons
- **Premium** : 1000 propriétés vues, 100 favoris, 10 comparaisons
- **Admin** : Accès illimité

## 🗄️ Base de Données

### Collections MongoDB
- `properties` - Propriétés commerciales
- `users` - Utilisateurs et leurs permissions
- `favorites` - Favoris des utilisateurs
- `comparisons` - Listes de comparaison
- `savedSearches` - Recherches sauvegardées
- `inquiries` - Demandes de renseignements

### Données de Test
Le script de seed génère :
- 12 propriétés de base avec descriptions détaillées
- 38 propriétés générées automatiquement
- 4 utilisateurs de test avec différents rôles
- Favoris et comparaisons d'exemple
- Recherches sauvegardées

## 🌟 Fonctionnalités Inspirées de Homez

- **Structure de données** : Propriétés avec géolocalisation, images multiples, caractéristiques détaillées
- **Vues multiples** : Grille, liste et carte comme dans Homez
- **Filtrage avancé** : Système complet de filtres par critères
- **Composants réutilisables** : Architecture modulaire
- **Expérience utilisateur** : Navigation fluide entre les vues
- **Données réalistes** : Propriétés commerciales françaises authentiques

## 🚀 Prochaines Étapes

- [ ] Intégration d'une vraie carte (Mapbox/Google Maps)
- [ ] Système de notifications en temps réel
- [ ] Chat intégré avec les agents
- [ ] Visite virtuelle 360°
- [ ] API publique pour les partenaires
- [ ] Application mobile React Native

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.
