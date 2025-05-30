import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import { connectDB } from "../lib/mongodb";
import { seedUsers } from "./seed-users";
import { seedProperties } from "./seed-properties";
import { seedProfessionals } from "./seed-professionals";
import seedNews from "./seed-news";
import { seedInquiries } from "./seed-inquiries";
import { seedSavedSearches } from "./seed-saved-searches";
import { seedSearchAlerts } from "./seed-search-alerts";
import { seedFavorites } from "./seed-favorites";
import { seedCommissions } from "./seed-commissions";
import { seedTasks } from "./seed-tasks";
import { seedReports } from "./seed-reports";
import { seedMarketAnalysis } from "./seed-market-analysis";
import { seedPriceHistory } from "./seed-price-history";
import { seedNotifications } from "./seed-notifications";
import { seedAdvertisements } from "./seed-advertisements";

// Ordre d'exécution des seeds (important pour les dépendances)
const seedOrder = [
  {
    name: "Users",
    fn: seedUsers,
    description: "Création des utilisateurs de base",
  },
  {
    name: "Properties",
    fn: seedProperties,
    description: "Création des propriétés",
  },
  {
    name: "Professionals",
    fn: seedProfessionals,
    description: "Création des profils professionnels",
  },
  {
    name: "News",
    fn: seedNews,
    description: "Création des articles de presse",
  },
  {
    name: "Inquiries",
    fn: seedInquiries,
    description: "Création des demandes d'information",
  },
  {
    name: "SavedSearches",
    fn: seedSavedSearches,
    description: "Création des recherches sauvegardées",
  },
  {
    name: "SearchAlerts",
    fn: seedSearchAlerts,
    description: "Création des alertes de recherche",
  },
  { name: "Favorites", fn: seedFavorites, description: "Création des favoris" },
  {
    name: "Commissions",
    fn: seedCommissions,
    description: "Création des commissions",
  },
  { name: "Tasks", fn: seedTasks, description: "Création des tâches" },
  { name: "Reports", fn: seedReports, description: "Création des rapports" },
  {
    name: "MarketAnalysis",
    fn: seedMarketAnalysis,
    description: "Création des analyses de marché",
  },
  {
    name: "PriceHistory",
    fn: seedPriceHistory,
    description: "Création de l'historique des prix",
  },
  {
    name: "Notifications",
    fn: seedNotifications,
    description: "Création des notifications",
  },
  {
    name: "Advertisements",
    fn: seedAdvertisements,
    description: "Création des publicités",
  },
];

interface SeedResult {
  name: string;
  success: boolean;
  duration: number;
  error?: string;
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}min`;
}

function formatResults(results: SeedResult[]): void {
  console.log("\n" + "=".repeat(80));
  console.log("📊 RÉSUMÉ DU SEEDING");
  console.log("=".repeat(80));

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  console.log(`✅ Réussis: ${successful.length}/${results.length}`);
  console.log(`❌ Échoués: ${failed.length}/${results.length}`);
  console.log(`⏱️ Durée totale: ${formatDuration(totalDuration)}`);

  if (successful.length > 0) {
    console.log("\n🟢 SEEDS RÉUSSIS:");
    successful.forEach((result) => {
      console.log(
        `   ✓ ${result.name.padEnd(20)} - ${formatDuration(result.duration)}`
      );
    });
  }

  if (failed.length > 0) {
    console.log("\n🔴 SEEDS ÉCHOUÉS:");
    failed.forEach((result) => {
      console.log(`   ✗ ${result.name.padEnd(20)} - ${result.error}`);
    });
  }

  console.log("\n" + "=".repeat(80));
}

export async function seedAll(
  options: {
    skipExisting?: boolean;
    verbose?: boolean;
    only?: string[];
    exclude?: string[];
  } = {}
) {
  const { skipExisting = false, verbose = true, only, exclude } = options;

  try {
    console.log("🚀 Démarrage du seeding complet de la base de données");
    console.log("⏰ Début:", new Date().toLocaleString("fr-FR"));

    // Connexion à la base de données
    await connectDB();
    console.log("✅ Connexion à MongoDB établie");

    // Filtrer les seeds à exécuter
    let seedsToRun = seedOrder;

    if (only && only.length > 0) {
      seedsToRun = seedOrder.filter((seed) =>
        only.some((name) =>
          seed.name.toLowerCase().includes(name.toLowerCase())
        )
      );
      console.log(
        `🎯 Exécution sélective: ${seedsToRun.map((s) => s.name).join(", ")}`
      );
    }

    if (exclude && exclude.length > 0) {
      seedsToRun = seedsToRun.filter(
        (seed) =>
          !exclude.some((name) =>
            seed.name.toLowerCase().includes(name.toLowerCase())
          )
      );
      console.log(`🚫 Exclusions: ${exclude.join(", ")}`);
    }

    console.log(`📋 ${seedsToRun.length} seeds à exécuter\n`);

    const results: SeedResult[] = [];

    // Exécuter chaque seed
    for (let i = 0; i < seedsToRun.length; i++) {
      const seed = seedsToRun[i];
      const startTime = Date.now();

      try {
        console.log(
          `[${i + 1}/${seedsToRun.length}] 🔄 ${seed.name}: ${seed.description}`
        );

        if (verbose) {
          console.log(`   ⏳ Démarrage...`);
        }

        await seed.fn();

        const duration = Date.now() - startTime;
        results.push({
          name: seed.name,
          success: true,
          duration,
        });

        console.log(`   ✅ Terminé en ${formatDuration(duration)}\n`);
      } catch (error) {
        const duration = Date.now() - startTime;
        const errorMessage =
          error instanceof Error ? error.message : "Erreur inconnue";

        results.push({
          name: seed.name,
          success: false,
          duration,
          error: errorMessage,
        });

        console.error(
          `   ❌ Échec après ${formatDuration(duration)}: ${errorMessage}\n`
        );

        if (!skipExisting) {
          console.error("🛑 Arrêt du seeding suite à l'erreur");
          throw error;
        }
      }
    }

    // Afficher le résumé
    formatResults(results);

    const failedCount = results.filter((r) => !r.success).length;
    if (failedCount === 0) {
      console.log("🎉 Seeding complet terminé avec succès!");
    } else {
      console.log(`⚠️ Seeding terminé avec ${failedCount} erreur(s)`);
    }

    return results;
  } catch (error) {
    console.error("💥 Erreur fatale lors du seeding:", error);
    throw error;
  }
}

// Fonction pour nettoyer toutes les collections
export async function clearAllData() {
  try {
    await connectDB();

    const mongoose = require("mongoose");
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    console.log("🗑️ Suppression de toutes les données...");

    for (const collection of collections) {
      await mongoose.connection.db.collection(collection.name).deleteMany({});
      console.log(`   ✓ Collection ${collection.name} vidée`);
    }

    console.log("✅ Toutes les données ont été supprimées");
  } catch (error) {
    console.error("❌ Erreur lors de la suppression des données:", error);
    throw error;
  }
}

// Fonction pour afficher les statistiques de la base
export async function showDatabaseStats() {
  try {
    await connectDB();

    const mongoose = require("mongoose");
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    console.log("📊 STATISTIQUES DE LA BASE DE DONNÉES");
    console.log("=".repeat(50));

    let totalDocuments = 0;

    for (const collection of collections) {
      const count = await mongoose.connection.db
        .collection(collection.name)
        .countDocuments();
      totalDocuments += count;
      console.log(
        `${collection.name.padEnd(20)}: ${count.toLocaleString(
          "fr-FR"
        )} documents`
      );
    }

    console.log("=".repeat(50));
    console.log(`Total: ${totalDocuments.toLocaleString("fr-FR")} documents`);

    // Statistiques de la base
    const stats = await mongoose.connection.db.stats();
    console.log(
      `Taille de la base: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`
    );
    console.log(`Index: ${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`);
  } catch (error) {
    console.error("❌ Erreur lors de l'affichage des statistiques:", error);
    throw error;
  }
}

// Exécuter le script si appelé directement
if (require.main === module) {
  const args = process.argv.slice(2);

  // Analyser les arguments
  const options = {
    skipExisting: args.includes("--skip-existing"),
    verbose: !args.includes("--quiet"),
    only: args
      .find((arg) => arg.startsWith("--only="))
      ?.split("=")[1]
      ?.split(","),
    exclude: args
      .find((arg) => arg.startsWith("--exclude="))
      ?.split("=")[1]
      ?.split(","),
  };

  if (args.includes("--clear")) {
    clearAllData()
      .then(() => {
        console.log("🎉 Suppression terminée");
        process.exit(0);
      })
      .catch((error) => {
        console.error("💥 Erreur fatale:", error);
        process.exit(1);
      });
  } else if (args.includes("--stats")) {
    showDatabaseStats()
      .then(() => {
        process.exit(0);
      })
      .catch((error) => {
        console.error("💥 Erreur fatale:", error);
        process.exit(1);
      });
  } else {
    seedAll(options)
      .then((results) => {
        const failedCount = results.filter((r) => !r.success).length;
        process.exit(failedCount > 0 ? 1 : 0);
      })
      .catch((error) => {
        console.error("💥 Erreur fatale:", error);
        process.exit(1);
      });
  }
}

/*
USAGE:

# Seeding complet
npm run seed:all

# Seeding avec options
npm run seed:all -- --skip-existing --quiet

# Seeding sélectif
npm run seed:all -- --only=users,properties

# Seeding avec exclusions
npm run seed:all -- --exclude=notifications,advertisements

# Vider la base
npm run seed:all -- --clear

# Afficher les statistiques
npm run seed:all -- --stats
*/
