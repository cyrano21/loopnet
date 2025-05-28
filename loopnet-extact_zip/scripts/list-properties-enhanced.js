// Script amélioré pour lister les propriétés
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const { MongoClient } = require('mongodb');

// Vérifier la configuration
if (!process.env.MONGODB_URI) {
  console.error('❌ Erreur: MONGODB_URI non défini dans le fichier .env');
  process.exit(1);
}

// Configuration
const CONFIG = {
  MONGODB_URI: process.env.MONGODB_URI,
  TIMEOUT_MS: 10000,
  MAX_PROPERTIES: 10
};

// Fonction pour formater la sortie console
function formatProperty(prop, index) {
  let output = [];
  
  output.push(`🏠 Propriété #${index + 1}`);
  output.push(`   ID: ${prop._id}`);
  output.push(`   Titre: ${prop.title || 'Sans titre'}`);
  output.push(`   Type: ${prop.propertyType || 'Non spécifié'}`);
  output.push(`   Prix: ${prop.price ? `${prop.price} €` : 'Non spécifié'}`);
  output.push(`   Surface: ${prop.surface ? `${prop.surface} m²` : 'Non spécifiée'}`);
  output.push(`   Statut: ${prop.status || 'Non spécifié'}`);
  
  // Gestion des images
  if (prop.images?.length > 0) {
    output.push(`   Images (${prop.images.length}):`);
    prop.images.forEach((img, i) => {
      const url = img.url || 'URL non disponible';
      const isPrimary = img.isPrimary ? ' (Principale)' : '';
      output.push(`     ${i + 1}. ${url}${isPrimary}`);
      
      // Afficher l'aperçu de l'image si c'est une URL valide
      if (url.startsWith('http')) {
        output.push(`       Aperçu: ${url.split('?')[0]}`);
      }
    });
  } else {
    output.push('   Aucune image');
  }
  
  // Ajouter d'autres champs si présents
  if (prop.description) {
    const desc = prop.description.length > 50 
      ? `${prop.description.substring(0, 50)}...` 
      : prop.description;
    output.push(`   Description: ${desc}`);
  }
  
  if (prop.createdAt) {
    output.push(`   Créée le: ${new Date(prop.createdAt).toLocaleString()}`);
  }
  
  return output.join('\n');
}

async function listProperties() {
  console.log('=== LISTE DES PROPRIÉTÉS AMÉLIORÉE ===\n');
  
  console.log('1. Configuration de la connexion...');
  console.log(`   - URI: ${CONFIG.MONGODB_URI ? '***' : 'non défini'}`);
  console.log(`   - Timeout: ${CONFIG.TIMEOUT_MS}ms`);
  
  const client = new MongoClient(CONFIG.MONGODB_URI, {
    serverSelectionTimeoutMS: CONFIG.TIMEOUT_MS,
    socketTimeoutMS: CONFIG.TIMEOUT_MS * 2,
    connectTimeoutMS: CONFIG.TIMEOUT_MS,
  });
  
  try {
    console.log('\n2. Tentative de connexion...');
    
    // Ajouter un timeout explicite
    const connectPromise = client.connect();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`Timeout de connexion dépassé (${CONFIG.TIMEOUT_MS}ms)`)), CONFIG.TIMEOUT_MS)
    );
    
    await Promise.race([connectPromise, timeoutPromise]);
    
    console.log('✅ Connecté avec succès');
    
    const db = client.db();
    console.log(`   - Base de données: ${db.databaseName}`);
    
    console.log('\n3. Vérification de la collection...');
    const collections = await db.listCollections().toArray();
    console.log('   - Collections disponibles:', collections.map(c => c.name).join(', '));
    
    if (!collections.some(c => c.name === 'properties')) {
      console.log('❌ La collection "properties" n\'existe pas');
      return;
    }
    
    const collection = db.collection('properties');
    console.log('   - Collection "properties" trouvée');
    
    const count = await collection.countDocuments();
    console.log(`   - Nombre de documents: ${count}`);
    
    if (count === 0) {
      console.log('ℹ️  Aucune propriété trouvée dans la base de données.');
      return;
    }
    
    console.log(`📊 Nombre total de propriétés: ${count}\n`);
    
    // Récupérer les propriétés avec pagination
    const properties = await collection
      .find({})
      .sort({ _id: -1 })
      .limit(CONFIG.MAX_PROPERTIES)
      .toArray();
    
    // Afficher les propriétés
    console.log(`📝 Dernières ${properties.length} propriétés :\n`);
    
    properties.forEach((prop, index) => {
      console.log(formatProperty(prop, index));
      console.log('\n' + '─'.repeat(80) + '\n');
    });
    
  } catch (error) {
    console.error('\n❌ Erreur lors de la récupération des propriétés :');
    console.error('Message:', error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('\nVérifiez que :');
      console.error('1. Votre connexion Internet est active');
      console.error('2. L\'URL de connexion MongoDB est correcte');
      console.error('3. Votre adresse IP est autorisée dans les paramètres de sécurité MongoDB Atlas');
    }
    
    process.exit(1);
    
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Déconnexion de la base de données');
    }
  }
}

// Lancer le script
listProperties().catch(error => {
  console.error('❌ Erreur inattendue :', error.message);
  process.exit(1);
});
