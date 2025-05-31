import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Professional from "@/models/Professional";

export async function POST() {
  try {
    await connectToDatabase();

    console.log("👔 Vérification et création des professionnels...");

    const professionals = [
      {
        name: "Pierre Dubois",
        email: "pierre.dubois@commercial-expert.fr",
        phone: "+33 1 42 56 78 90",
        company: "Commercial Expert",
        title: "Directeur Commercial",
        bio: "Expert en immobilier commercial avec plus de 20 ans d'expérience dans la région parisienne.",
        specialties: ["Bureaux", "Commerces", "Investissement"],
        location: {
          address: "15 Avenue des Champs-Élysées",
          city: "Paris",
          postalCode: "75008",
          country: "France",
        },
        rating: 4.8,
        reviews: 156,
        yearsExperience: 20,
        totalTransactions: 89,
        totalVolume: 45000000,
        languages: ["Français", "Anglais"],
        certifications: ["FNAIM", "UNIS"],
        image: "https://ui-avatars.com/api/?name=Pierre+Dubois&size=300&background=0D8ABC&color=fff&font-size=0.6",
        isActive: true,
        isVerified: true,
      },
      {
        name: "Sophie Martin",
        email: "sophie.martin@lyon-immobilier.fr",
        phone: "+33 4 78 90 12 34",
        company: "Lyon Immobilier",
        title: "Responsable Investissement",
        bio: "Spécialiste de l'investissement immobilier commercial dans la région Rhône-Alpes.",
        specialties: ["Investissement", "Entrepôts", "Bureaux"],
        location: {
          address: "25 Rue de la République",
          city: "Lyon",
          postalCode: "69002",
          country: "France",
        },
        rating: 4.6,
        reviews: 98,
        yearsExperience: 12,
        totalTransactions: 67,
        totalVolume: 32000000,
        languages: ["Français", "Anglais", "Italien"],
        certifications: ["FNAIM"],
        image: "https://ui-avatars.com/api/?name=Sophie+Martin&size=300&background=7C3AED&color=fff&font-size=0.6",
        isActive: true,
        isVerified: true,
      },
      {
        name: "Marc Leroy",
        email: "marc.leroy@marseille-commercial.fr",
        phone: "+33 4 91 23 45 67",
        company: "Marseille Commercial",
        title: "Expert en Retail",
        bio: "Spécialiste des locaux commerciaux et centres commerciaux dans le Sud de la France.",
        specialties: ["Commerces", "Retail", "Centres commerciaux"],
        location: {
          address: "45 La Canebière",
          city: "Marseille",
          postalCode: "13001",
          country: "France",
        },
        rating: 4.7,
        reviews: 124,
        yearsExperience: 15,
        totalTransactions: 78,
        totalVolume: 28000000,
        languages: ["Français", "Anglais", "Espagnol"],
        certifications: ["FNAIM", "CCI"],
        image: "https://ui-avatars.com/api/?name=Marc+Leroy&size=300&background=059669&color=fff&font-size=0.6",
        isActive: true,
        isVerified: true,
      },
      {
        name: "Isabelle Moreau",
        email: "isabelle.moreau@toulouse-invest.fr",
        phone: "+33 5 61 78 90 12",
        company: "Toulouse Invest",
        title: "Directrice Investissement",
        bio: "Experte en investissement immobilier commercial et industriel dans le Sud-Ouest.",
        specialties: ["Investissement", "Industriel", "Logistique"],
        location: {
          address: "12 Place du Capitole",
          city: "Toulouse",
          postalCode: "31000",
          country: "France",
        },
        rating: 4.9,
        reviews: 87,
        yearsExperience: 18,
        totalTransactions: 92,
        totalVolume: 52000000,
        languages: ["Français", "Anglais"],
        certifications: ["FNAIM", "RICS"],
        image: "https://ui-avatars.com/api/?name=Isabelle+Moreau&size=300&background=DC2626&color=fff&font-size=0.6",
        isActive: true,
        isVerified: true,
      },
      {
        name: "Thomas Dubois",
        email: "thomas.dubois@nice-premium.fr",
        phone: "+33 4 93 45 67 89",
        company: "Nice Premium",
        title: "Consultant Senior",
        bio: "Spécialiste de l'immobilier de prestige et des bureaux sur la Côte d'Azur.",
        specialties: ["Bureaux", "Prestige", "Hôtellerie"],
        location: {
          address: "8 Promenade des Anglais",
          city: "Nice",
          postalCode: "06000",
          country: "France",
        },
        rating: 4.5,
        reviews: 156,
        yearsExperience: 22,
        totalTransactions: 134,
        totalVolume: 67000000,
        languages: ["Français", "Anglais", "Italien"],
        certifications: ["FNAIM", "UNIS", "RICS"],
        image: "https://ui-avatars.com/api/?name=Thomas+Dubois&size=300&background=EA580C&color=fff&font-size=0.6",
        isActive: true,
        isVerified: true,
      },
      {
        name: "Caroline Petit",
        email: "caroline.petit@bordeaux-business.fr",
        phone: "+33 5 56 12 34 56",
        company: "Bordeaux Business",
        title: "Responsable Développement",
        bio: "Experte en développement commercial et immobilier d'entreprise dans la région bordelaise.",
        specialties: ["Bureaux", "Développement", "Conseil"],
        location: {
          address: "20 Cours de l'Intendance",
          city: "Bordeaux",
          postalCode: "33000",
          country: "France",
        },
        rating: 4.6,
        reviews: 93,
        yearsExperience: 14,
        totalTransactions: 71,
        totalVolume: 35000000,
        languages: ["Français", "Anglais"],
        certifications: ["FNAIM", "CCI"],
        image: "https://ui-avatars.com/api/?name=Caroline+Petit&size=300&background=9333EA&color=fff&font-size=0.6",
        isActive: true,
        isVerified: true,
      },
    ];

    const results = {
      created: [] as any[],
      skipped: [] as any[],
      errors: [] as any[],
    };

    for (const profData of professionals) {
      try {
        console.log(`🔍 Vérification professionnel: ${profData.email}`);

        // Vérifier si le professionnel existe déjà
        const existingProf = await Professional.findOne({
          email: profData.email,
        });

        if (existingProf) {
          console.log(`⚠️ Professionnel déjà existant: ${profData.email}`);
          results.skipped.push({
            email: profData.email,
            name: profData.name,
            reason: "Email déjà utilisé",
            existingId: existingProf._id,
          });
          continue;
        }

        // Créer le nouveau professionnel
        console.log(`➕ Création professionnel: ${profData.email}`);
        const newProf = await Professional.create(profData);

        console.log(
          `✅ Professionnel créé: ${newProf.email} (${newProf.company})`
        );
        results.created.push({
          id: newProf._id,
          name: newProf.name,
          email: newProf.email,
          company: newProf.company,
          city: newProf.location.city,
        });
      } catch (error) {
        console.error(
          `❌ Erreur création professionnel ${profData.email}:`,
          error
        );
        results.errors.push({
          email: profData.email,
          name: profData.name,
          error: error instanceof Error ? error.message : "Erreur inconnue",
        });
      }
    }

    const message = `Professionnels: ${results.created.length} créés, ${results.skipped.length} ignorés, ${results.errors.length} erreurs`;
    console.log(`📊 ${message}`);

    return NextResponse.json({
      success: true,
      message,
      results,
      summary: {
        total: professionals.length,
        created: results.created.length,
        skipped: results.skipped.length,
        errors: results.errors.length,
      },
    });
  } catch (error) {
    console.error(
      "Erreur globale lors de la création des professionnels:",
      error
    );
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la création des professionnels",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
