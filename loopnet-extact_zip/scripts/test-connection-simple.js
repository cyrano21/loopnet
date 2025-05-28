// Script de test de connexion simple
console.log('=== TEST DE CONNEXION SIMPLIFIÉ ===\n');

// Charger les variables d'environnement
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// Configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://louiscyrano:Figoro21@cluster0.hsnymcz.mongodb.net/Loopnet?retryWrites=true&w=majority';

console.log('1. Configuration :');
console.log('   - URI:', MONGODB_URI ? '***' : 'non définie');

// Importer mongodb
console.log('\n2. Chargement du module mongodb...');
const { MongoClient } = require('mongodb');
console.log('   - Module chargé avec succès');

async function testConnection() {
  console.log('\n3. Création du client MongoDB...');
  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 10000,
    connectTimeoutMS: 5000,
  });
  
  console.log('   - Client créé');
  
  try {
    console.log('\n4. Tentative de connexion...');
    
    // Essayer de se connecter avec un timeout court
    const connectPromise = client.connect();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout de connexion dépassé (5s)')), 5000)
    );
    
    console.log('   - En attente de la connexion...');
    await Promise.race([connectPromise, timeoutPromise]);
    
    console.log('✅ Connecté avec succès !');
    
    // Tester la connexion
    console.log('\n5. Test de la connexion...');
    const db = client.db();
    console.log('   - Base de données:', db.databaseName);
    
    const ping = await db.command({ ping: 1 });
    console.log('   - Ping réussi:', ping);
    
    // Afficher les collections
    console.log('\n6. Liste des collections :');
    const collections = await db.listCollections().toArray();
    console.log(collections.map(c => `   - ${c.name}`).join('\n'));
    
    return true;
    
  } catch (error) {
    console.error('\n❌ ERREUR :');
    console.error('   Message:', error.message);
    console.error('   Nom:', error.name);
    
    if (error.code) console.error('   Code:', error.code);
    if (error.stack) console.error('   Stack:', error.stack.split('\n')[0]);
    
    return false;
    
  } finally {
    if (client) {
      console.log('\n7. Fermeture de la connexion...');
      await client.close();
      console.log('   - Connexion fermée');
    }
  }
}

// Lancer le test
console.log('\nDémarrage du test...');
testConnection()
  .then(success => {
    console.log('\n=== RÉSULTAT DU TEST ===');
    console.log(success ? '✅ Test réussi !' : '❌ Test échoué');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('\n❌ ERREUR INATTENDUE :', error);
    process.exit(1);
  });
