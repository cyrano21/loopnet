// Script de connexion directe à MongoDB Atlas
console.log('=== TEST DE CONNEXION DIRECTE ===');

// Configuration directe (à des fins de test uniquement - ne pas commiter les informations sensibles)
const MONGODB_URI = 'mongodb+srv://louiscyrano:Figoro21@cluster0.hsnymcz.mongodb.net/Loopnet?retryWrites=true&w=majority';

console.log('Configuration:');
console.log('- URI:', MONGODB_URI ? '***' : 'non défini');

// Importer mongodb
console.log('\nChargement du module mongodb...');
const { MongoClient } = require('mongodb');
console.log('Module mongodb chargé avec succès');

async function testConnection() {
  console.log('\n🔌 Tentative de connexion...');
  
  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000, // 10 secondes
    socketTimeoutMS: 45000,          // 45 secondes
    connectTimeoutMS: 10000,         // 10 secondes
  });
  
  try {
    console.log('1. Connexion en cours...');
    
    // Essayer de se connecter avec un timeout explicite
    const connectPromise = client.connect();
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout de connexion dépassé (10s)')), 10000)
    );
    
    console.log('2. En attente de la connexion...');
    await Promise.race([connectPromise, timeout]);
    console.log('3. Connecté avec succès!');
    
    // Tester la connexion
    console.log('4. Test de la connexion...');
    const db = client.db();
    console.log('   - Base de données:', db.databaseName);
    
    const ping = await db.command({ ping: 1 });
    console.log('   - Ping réussi:', ping);
    
    // Afficher les collections
    console.log('\n📋 Collections disponibles:');
    const collections = await db.listCollections().toArray();
    console.log(collections.map(c => `- ${c.name}`).join('\n'));
    
    return true;
    
  } catch (error) {
    console.error('\n❌ ERREUR:');
    console.error('Message:', error.message);
    console.error('Nom:', error.name);
    console.error('Code:', error.code);
    
    if (error.syscall) console.error('Syscall:', error.syscall);
    if (error.hostname) console.error('Hostname:', error.hostname);
    if (error.port) console.error('Port:', error.port);
    
    return false;
    
  } finally {
    if (client) {
      await client.close().catch(console.error);
      console.log('\n🔌 Déconnexion de MongoDB');
    }
  }
}

// Lancer le test
console.log('\nDémarrage du test...');
testConnection()
  .then(success => {
    console.log('\n✅ Test terminé:', success ? 'Succès' : 'Échec');
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('\n❌ Erreur lors du test:', err);
    process.exit(1);
  });
