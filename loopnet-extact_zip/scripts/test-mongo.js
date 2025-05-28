console.log('=== TEST DE CONNEXION MONGODB ===');

// Charger les variables d'environnement
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Erreur: MONGODB_URI non défini dans le fichier .env');
  console.log('Variables d\'environnement disponibles:', Object.keys(process.env).join(', '));
  process.exit(1);
}

console.log('✅ MONGODB_URI trouvé');
console.log('Tentative de connexion à MongoDB...');

const { MongoClient } = require('mongodb');

async function testConnection() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('Connexion à la base de données...');
    await client.connect();
    console.log('✅ Connecté avec succès à MongoDB');
    
    // Tester la connexion en listant les bases de données
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    
    console.log('📋 Bases de données disponibles:');
    dbs.databases.forEach(db => {
      console.log(`- ${db.name} (taille: ${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} Mo)`);
    });
    
    // Vérifier si la base de données Loopnet existe
    const dbName = MONGODB_URI.split('/').pop().split('?')[0];
    const dbExists = dbs.databases.some(db => db.name === dbName);
    
    if (dbExists) {
      console.log(`✅ Base de données "${dbName}" trouvée`);
      
      // Lister les collections
      const db = client.db(dbName);
      const collections = await db.listCollections().toArray();
      
      console.log('\n📋 Collections disponibles:');
      collections.forEach((collection, index) => {
        console.log(`${index + 1}. ${collection.name}`);
      });
      
      // Compter les documents dans la collection properties
      if (collections.some(c => c.name === 'properties')) {
        const count = await db.collection('properties').countDocuments();
        console.log(`\nℹ️  Nombre de propriétés dans la collection: ${count}`);
      }
    } else {
      console.log(`⚠️  Base de données "${dbName}" non trouvée`);
    }
    
  } catch (error) {
    console.error('❌ Erreur lors de la connexion à MongoDB:', error.message);
  } finally {
    await client.close();
    console.log('\n🔌 Déconnecté de MongoDB');
  }
}

// Exécuter le test
testConnection().catch(console.error);
