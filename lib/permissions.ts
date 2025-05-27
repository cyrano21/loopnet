export type UserRole = "guest" | "simple" | "premium" | "agent" | "admin"

export interface UserPermissions {
  // Propriétés
  canViewProperties: boolean
  maxPropertiesView: number | null // null = illimité
  canViewPropertyDetails: boolean
  canViewSellerInfo: boolean
  canContactSeller: boolean
  canListProperties: boolean
  maxListings: number | null

  // Favoris
  canAddFavorites: boolean
  maxFavorites: number | null

  // Comparaison
  canCompareProperties: boolean
  maxComparisons: number | null

  // Recherche
  canUseAdvancedSearch: boolean
  canSaveSearches: boolean
  maxSavedSearches: number | null
  canSetAlerts: boolean
  maxAlerts: number | null

  // Analytics
  canViewMarketAnalytics: boolean
  canViewPropertyHistory: boolean
  canViewPriceEstimates: boolean

  // Contact & Communication
  canCallSellers: boolean
  canEmailSellers: boolean
  canScheduleVisits: boolean

  // Export & Reports
  canExportData: boolean
  canGenerateReports: boolean

  // CRM Features
  canUseCRM: boolean

  // Premium Features
  canUseAI: boolean
  canAccessAPI: boolean
  hasCustomerSupport: "none" | "email" | "priority" | "dedicated"
}

export const ROLE_PERMISSIONS: Record<UserRole, UserPermissions> = {
  guest: {
    canViewProperties: true,
    maxPropertiesView: 10, // Seulement 10 propriétés par session
    canViewPropertyDetails: false, // Détails limités
    canViewSellerInfo: false,
    canContactSeller: false,
    canListProperties: false,
    maxListings: 0,

    canAddFavorites: false,
    maxFavorites: 0,

    canCompareProperties: false,
    maxComparisons: 0,

    canUseAdvancedSearch: false,
    canSaveSearches: false,
    maxSavedSearches: 0,
    canSetAlerts: false,
    maxAlerts: 0,

    canViewMarketAnalytics: false,
    canViewPropertyHistory: false,
    canViewPriceEstimates: false,

    canCallSellers: false,
    canEmailSellers: false,
    canScheduleVisits: false,

    canExportData: false,
    canGenerateReports: false,

    canUseCRM: false,

    canUseAI: false,
    canAccessAPI: false,
    hasCustomerSupport: "none",
  },

  simple: {
    canViewProperties: true,
    maxPropertiesView: 50, // 50 propriétés par mois
    canViewPropertyDetails: true,
    canViewSellerInfo: false, // Pas d'infos vendeur
    canContactSeller: false, // Doit upgrader pour contacter
    canListProperties: true,
    maxListings: 2, // Maximum 2 annonces

    canAddFavorites: false, // Doit upgrader pour favoris
    maxFavorites: 0,

    canCompareProperties: false, // Pas de comparaison
    maxComparisons: 0,

    canUseAdvancedSearch: false, // Recherche basique seulement
    canSaveSearches: false,
    maxSavedSearches: 0,
    canSetAlerts: false,
    maxAlerts: 0,

    canViewMarketAnalytics: false,
    canViewPropertyHistory: false,
    canViewPriceEstimates: false,

    canCallSellers: false,
    canEmailSellers: false,
    canScheduleVisits: false,

    canExportData: false,
    canGenerateReports: false,

    canUseCRM: false,

    canUseAI: false,
    canAccessAPI: false,
    hasCustomerSupport: "email",
  },

  premium: {
    canViewProperties: true,
    maxPropertiesView: null, // Illimité
    canViewPropertyDetails: true,
    canViewSellerInfo: false, // Toujours pas d'infos vendeur
    canContactSeller: false, // Toujours pas de contact direct
    canListProperties: true,
    maxListings: 10, // Plus d'annonces

    canAddFavorites: true,
    maxFavorites: null, // Favoris illimités

    canCompareProperties: true,
    maxComparisons: 4, // Jusqu'à 4 propriétés

    canUseAdvancedSearch: true,
    canSaveSearches: true,
    maxSavedSearches: 20,
    canSetAlerts: true,
    maxAlerts: 10,

    canViewMarketAnalytics: true,
    canViewPropertyHistory: true,
    canViewPriceEstimates: true,

    canCallSellers: false, // Toujours pas de contact
    canEmailSellers: false,
    canScheduleVisits: false,

    canExportData: true,
    canGenerateReports: true,

    canUseCRM: false,

    canUseAI: true,
    canAccessAPI: false,
    hasCustomerSupport: "priority",
  },

  agent: {
    canViewProperties: true,
    maxPropertiesView: null,
    canViewPropertyDetails: true,
    canViewSellerInfo: true, // Accès complet aux infos
    canContactSeller: true, // Peut contacter
    canListProperties: true,
    maxListings: null, // Annonces illimitées

    canAddFavorites: true,
    maxFavorites: null,

    canCompareProperties: true,
    maxComparisons: 10, // Plus de comparaisons

    canUseAdvancedSearch: true,
    canSaveSearches: true,
    maxSavedSearches: null,
    canSetAlerts: true,
    maxAlerts: null,

    canViewMarketAnalytics: true,
    canViewPropertyHistory: true,
    canViewPriceEstimates: true,

    canCallSellers: true,
    canEmailSellers: true,
    canScheduleVisits: true,

    canExportData: true,
    canGenerateReports: true,

    canUseCRM: true,

    canUseAI: true,
    canAccessAPI: true,
    hasCustomerSupport: "dedicated",
  },

  admin: {
    canViewProperties: true,
    maxPropertiesView: null,
    canViewPropertyDetails: true,
    canViewSellerInfo: true,
    canContactSeller: true,
    canListProperties: true,
    maxListings: null,

    canAddFavorites: true,
    maxFavorites: null,

    canCompareProperties: true,
    maxComparisons: null,

    canUseAdvancedSearch: true,
    canSaveSearches: true,
    maxSavedSearches: null,
    canSetAlerts: true,
    maxAlerts: null,

    canViewMarketAnalytics: true,
    canViewPropertyHistory: true,
    canViewPriceEstimates: true,

    canCallSellers: true,
    canEmailSellers: true,
    canScheduleVisits: true,

    canExportData: true,
    canGenerateReports: true,

    canUseCRM: true,

    canUseAI: true,
    canAccessAPI: true,
    hasCustomerSupport: "dedicated",
  },
}

export function getUserPermissions(role: UserRole): UserPermissions {
  return ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.guest
}

export function canPerformAction(userRole: UserRole, action: keyof UserPermissions): boolean {
  const permissions = getUserPermissions(userRole)
  return permissions[action] as boolean
}

export function getLimit(userRole: UserRole, limitType: keyof UserPermissions): number | null {
  const permissions = getUserPermissions(userRole)
  return permissions[limitType] as number | null
}
