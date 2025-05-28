console.log('=== TEST DE CONNEXION MONGODB ATLAS ===');

// Charger les variables d'environnement
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Erreur: MONGODB_URI non défini dans le fichier .env');
  process.exit(1);
}

console.log('✅ Configuration chargée avec succès');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');
console.log('MongoDB URI:', MONGODB_URI ? '***' : 'non défini');

// Importer mongodb
const { MongoClient } = require('mongodb');

async function testConnection() {
  console.log('\n🔌 Tentative de connexion à MongoDB Atlas...');
  
  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
  });
  
  try {
    console.log('Connexion en cours...');
    await client.connect();
    console.log('✅ Connecté avec succès à MongoDB Atlas');
    
    // Tester la connexion
    console.log('\n🔄 Test de la connexion...');
    const db = client.db();
    console.log('Base de données:', db.databaseName);
    
    const pingResult = await db.command({ ping: 1 });
    console.log('✅ Réponse du ping:', pingResult);
    
    // Lister les collections
    console.log('\n📋 Collections disponibles:');
    const collections = await db.listCollections().toArray();
    collections.forEach((col, index) => {
      console.log(`${index + 1}. ${col.name}`);
    });
    
    // Compter les documents dans la collection properties
    if (collections.some(c => c.name === 'properties')) {
      const count = await db.collection('properties').countDocuments();
      console.log(`\n🏠 Nombre de propriétés: ${count}`);
      
      // Afficher les propriétés
      if (count > 0) {
        console.log('\n📝 Dernières propriétés:');
        const properties = await db.collection('properties')
          .find({})
          .sort({ _id: -1 })
          .limit(3)
          .toArray();
        
        properties.forEach((prop, i) => {
          console.log(`\n${i + 1}. ${prop.title || 'Sans titre'}`);
          console.log(`   ID: ${prop._id}`);
          console.log(`   Type: ${prop.propertyType || 'Non spécifié'}`);
          console.log(`   Prix: ${prop.price ? `${prop.price} €` : 'Non spécifié'}`);
          console.log(`   Images: ${prop.images ? prop.images.length : 0}`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur de connexion à MongoDB Atlas:');
    console.error(error.message);
    
    // Afficher plus de détails sur l'erreur
    if (error.name === 'MongoServerSelectionError') {
      console.error('\nDétails de l\'erreur de sélection du serveur:');
      console.error('- Code:', error.code);
      console.error('- Code de l\'erreur:', error.errorLabels || 'Aucun');
      console.error('- Cause:', error.cause || 'Inconnue');
    }
    
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Déconnecté de MongoDB Atlas');
    }
  }
}

// Exécuter le test
testConnection().catch(error => {
  console.error('❌ Erreur inattendue:', error.message);
  process.exit(1);
});
