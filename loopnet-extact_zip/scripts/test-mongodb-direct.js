// Script de test direct de connexion MongoDB
console.log('=== TEST DIRECT MONGODB ===\n');

// Configuration directe (à des fins de test uniquement)
const MONGODB_URI = 'mongodb+srv://louiscyrano:Figoro21@cluster0.hsnymcz.mongodb.net/Loopnet?retryWrites=true&w=majority';

console.log('1. Chargement du module mongodb...');
const { MongoClient } = require('mongodb');
console.log('   - Module chargé avec succès');

async function test() {
  console.log('\n2. Création du client...');
  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 10000,
    connectTimeoutMS: 5000,
  });
  
  console.log('   - Client créé');
  
  try {
    console.log('\n3. Connexion en cours...');
    
    // Utiliser une promesse avec un timeout
    const connectPromise = client.connect();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Timeout dépassé (5s)')), 5000)
    );
    
    console.log('   - En attente...');
    await Promise.race([connectPromise, timeoutPromise]);
    
    console.log('✅ Connecté avec succès !');
    
    // Tester la connexion
    console.log('\n4. Test de la base de données...');
    const db = client.db();
    console.log('   - Base de données:', db.databaseName);
    
    const ping = await db.command({ ping: 1 });
    console.log('   - Ping réussi:', ping);
    
    // Afficher les collections
    console.log('\n5. Collections disponibles:');
    const collections = await db.listCollections().toArray();
    console.log(collections.map(c => `   - ${c.name}`).join('\n'));
    
    // Afficher quelques propriétés
    if (collections.some(c => c.name === 'properties')) {
      console.log('\n6. Dernières propriétés :');
      const properties = await db.collection('properties')
        .find({})
        .sort({ _id: -1 })
        .limit(3)
        .toArray();
      
      properties.forEach((p, i) => {
        console.log(`\n   ${i+1}. ${p.title || 'Sans titre'}`);
        console.log(`      ID: ${p._id}`);
        console.log(`      Type: ${p.propertyType || 'Non spécifié'}`);
        console.log(`      Prix: ${p.price ? `${p.price} €` : 'Non spécifié'}`);
      });
    }
    
  } catch (error) {
    console.error('\n❌ ERREUR :');
    console.error('   Message:', error.message);
    console.error('   Name:', error.name);
    
    if (error.code) console.error('   Code:', error.code);
    if (error.stack) console.error('   Stack:', error.stack.split('\n')[0]);
    
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
test().catch(console.error);
