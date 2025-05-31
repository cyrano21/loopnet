require('dotenv').config();
const { MongoClient } = require('mongodb');

async function clearProfessionals() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('🔗 Connexion à MongoDB établie');

    const db = client.db();
    const collection = db.collection('professionals');

    // Supprimer tous les professionnels
    const result = await collection.deleteMany({});
    console.log(`🗑️ ${result.deletedCount} professionnels supprimés`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.close();
    console.log('🔌 Connexion fermée');
  }
}

clearProfessionals();