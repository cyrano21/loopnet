console.log('=== TEST DE CONNEXION SIMPLE ===');

// Charger les variables d'environnement
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ Erreur: MONGODB_URI non défini');
  process.exit(1);
}

console.log('✅ URI MongoDB chargée');
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

// Importer mongodb
console.log('Chargement du module mongodb...');
const mongodb = require('mongodb');
console.log('Module mongodb chargé:', Object.keys(mongodb));
const { MongoClient } = mongodb;
console.log('MongoClient:', typeof MongoClient);

async function testConnection() {
  console.log('\n🔌 Tentative de connexion...');
  
  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });
  
  try {
    console.log('1. Création du client...');
    
    // Essayer de se connecter avec un timeout court
    console.log('2. Connexion en cours...');
    console.log('   - Avant connect()');
    
    // Ajouter un timeout explicite
    const connectPromise = client.connect();
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout de connexion dépassé (5s)')), 5000)
    );
    
    console.log('   - Avant Promise.race');
    await Promise.race([connectPromise, timeout]);
    console.log('   - Après Promise.race');
    
    console.log('✅ Connecté avec succès!');
    
    // Tester la connexion
    console.log('3. Test de la connexion...');
    const db = client.db();
    console.log('   - Base de données:', db.databaseName);
    
    const ping = await db.command({ ping: 1 });
    console.log('   - Ping réussi:', ping);
    
    // Afficher les collections
    console.log('\n📋 Collections disponibles:');
    const collections = await db.listCollections().toArray();
    console.log(collections.map(c => `- ${c.name}`).join('\n'));
    
  } catch (error) {
    console.error('❌ ERREUR:');
    console.error('Message:', error.message);
    console.error('Nom:', error.name);
    console.error('Code:', error.code);
    console.error('Stack:', error.stack);
    
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔌 Déconnexion de MongoDB');
    }
  }
}

// Lancer le test
console.log('Démarrage du test...');
testConnection()
  .then(() => console.log('\n✅ Test terminé'))
  .catch(err => console.error('\n❌ Test échoué:', err));
