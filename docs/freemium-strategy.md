# Stratégie Freemium de LoopNet

## Objectifs stratégiques

Notre nouvelle approche freemium pour les annonces immobilières vise à équilibrer deux objectifs clés :

1. **Maximiser l'acquisition d'utilisateurs** et le volume de contenu
2. **Monétiser efficacement** les fonctionnalités premium

## Structure du modèle freemium

### Plan Gratuit
- **Annonces :** Max. 3 annonces actives simultanément
- **Photos :** Max. 3 photos par annonce
- **Durée :** 30 jours de visibilité
- **Contacts :** Masqués (les contacts passent par formulaire anonyme LoopNet)
- **Visibilité :** Standard (pas de mise en avant)

### Plan Premium (19€/mois)
- **Annonces :** Max. 15 annonces actives simultanément
- **Photos :** Max. 10 photos par annonce
- **Durée :** 90 jours de visibilité
- **Contacts :** Visibles (email et téléphone accessibles directement)
- **Visibilité :** Améliorée (meilleures positions dans les listes)
- **Analytics :** Statistiques de base sur les vues

### Plan Agent (199€/mois)
- **Annonces :** Illimitées
- **Photos :** Illimitées
- **Durée :** Illimitée
- **Contacts :** Visibles avec notifications en temps réel
- **Visibilité :** Premium (positions prioritaires)
- **Analytics :** Analytics détaillés, conversion, parcours utilisateur
- **Outils :** Suite marketing, gestion des leads, dashboard agent

## Implémentation technique

L'implémentation repose sur le composant `FreemiumListingGuard` qui :

1. Vérifie le niveau d'abonnement de l'utilisateur
2. Applique les limites correspondantes
3. Affiche des incitations à l'upgrade appropriées

### Exemples d'utilisation

Pour protéger la création d'annonces :
```tsx
<FreemiumListingGuard action="create" currentListingCount={count}>
  {/* Formulaire de création d'annonce */}
</FreemiumListingGuard>
```

Pour masquer les contacts selon le niveau :
```tsx
<FreemiumListingGuard action="contact">
  {/* Coordonnées de contact */}
</FreemiumListingGuard>
```

## Bénéfices attendus

- **Augmentation du volume de contenu** grâce à l'accès gratuit
- **Amélioration du SEO** et de la visibilité du site
- **Conversion optimisée** vers les plans payants
- **Expérience utilisateur cohérente** avec restrictions explicites
- **Encouragement à l'upgrade** via des limites stratégiques

## Métriques de suivi

- Nombre d'annonces créées par type d'utilisateur
- Taux de conversion des utilisateurs gratuits vers payants
- Durée moyenne avant upgrade
- Nombre moyen d'annonces par utilisateur
- Taux d'engagement sur les limitations (% d'utilisateurs atteignant les limites)

Cette stratégie sera évaluée et ajustée après 3 mois de déploiement en fonction des résultats et des retours utilisateurs.
