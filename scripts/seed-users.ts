import { connectDB } from "../lib/mongodb";
import User from "../models/User";
import bcrypt from "bcryptjs";

export async function seedUsers() {
  try {
    console.log("👥 Vérification et création des utilisateurs de test...");

    const users = [
      {
        name: "Jean Dupont",
        email: "jean.dupont@example.com",
        password: "password123",
        role: "user",
        phone: "+33 1 23 45 67 89",
        bio: "Investisseur immobilier spécialisé dans le commercial",
        company: "Dupont Investissements",
        subscription: { plan: "premium", status: "active" },
      },
      {
        name: "Marie Martin",
        email: "marie.martin@realestate.com",
        password: "password123",
        role: "agent",
        phone: "+33 6 78 90 12 34",
        bio: "Agent immobilier commercial avec 15 ans d'expérience",
        company: "Martin & Associés",
        subscription: { plan: "enterprise", status: "active" },
      },
      {
        name: "Admin System",
        email: "admin@loopnet.com",
        password: "admin123",
        role: "admin",
        phone: "+33 1 00 00 00 00",
        bio: "Administrateur système",
        company: "LoopNet",
        subscription: { plan: "enterprise", status: "active" },
      },
    ];

    const results = {
      created: [] as any[],
      skipped: [] as any[],
      errors: [] as any[],
    };

    for (const userData of users) {
      try {
        const existingUser = await User.findOne({ email: userData.email });

        if (existingUser) {
          console.log(`⚠️  Utilisateur ${userData.email} existe déjà`);
          results.skipped.push(userData.email);
          continue;
        }

        const hashedPassword = await bcrypt.hash(userData.password, 12);

        const user = new User({
          ...userData,
          password: hashedPassword,
        });

        await user.save();
        console.log(
          `✅ Utilisateur créé: ${userData.name} (${userData.email})`
        );
        results.created.push(userData.email);
      } catch (error) {
        console.error(
          `❌ Erreur lors de la création de ${userData.email}:`,
          error
        );
        results.errors.push({ email: userData.email, error: error.message });
      }
    }

    console.log(`\n📊 Résumé des utilisateurs:`);
    console.log(`   - Créés: ${results.created.length}`);
    console.log(`   - Ignorés: ${results.skipped.length}`);
    console.log(`   - Erreurs: ${results.errors.length}`);

    if (results.errors.length > 0) {
      console.log(`\n❌ Erreurs détaillées:`);
      results.errors.forEach((err) => {
        console.log(`   - ${err.email}: ${err.error}`);
      });
    }

    return results;
  } catch (error) {
    console.error("❌ Erreur lors du seeding des utilisateurs:", error);
    throw error;
  }
}
