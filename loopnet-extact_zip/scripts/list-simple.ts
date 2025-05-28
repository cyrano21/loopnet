// Script TypeScript pour lister les propriétés
import { MongoClient, ObjectId, WithId, Document } from 'mongodb';

// Charger les variables d'environnement
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

// Vérifier la configuration
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('❌ Erreur: MONGODB_URI non défini dans le fichier .env');
  process.exit(1);
}

// Interface pour les propriétés
interface Property extends WithId<Document> {
  _id: ObjectId;
  title?: string;
  description?: string;
  propertyType?: string;
  price?: number;
  surface?: number;
  status?: string;
  images?: Array<{
    url: string;
    publicId: string;
    alt?: string;
    isPrimary?: boolean;
  }>;
  userId?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  user?: {
    name?: string;
    email: string;
    role: string;
  };
}

async function listProperties() {
  console.log('=== LISTE DES PROPRIÉTÉS ===\n');
  
  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 10000,
  });
  
  try {
    // Connexion
    console.log('1. Connexion à la base de données...');
    await client.connect();
    console.log('✅ Connecté avec succès');
    
    const db = client.db();
    console.log(`2. Base de données: ${db.databaseName}`);
    
    // Vérifier la collection
    const collections = await db.listCollections().toArray();
    console.log('3. Collections disponibles:', collections.map(c => c.name).join(', '));
    
    if (!collections.some(c => c.name === 'properties')) {
      console.log('❌ La collection "properties" n\'existe pas');
      return;
    }
    
    const collection = db.collection<Property>('properties');
    
    // Compter les documents
    const count = await collection.countDocuments();
    console.log(`\n📊 Nombre de propriétés: ${count}\n`);
    
    if (count === 0) {
      console.log('Aucune propriété trouvée.');
      return;
    }
    
    // Récupérer les propriétés
    console.log('📝 Dernières propriétés :\n');
    const properties = await collection
      .find({})
      .sort({ _id: -1 })
      .limit(5)
      .toArray();
    
    // Afficher les propriétés
    properties.forEach((property, index) => {
      console.log(`🏠 Propriété #${index + 1}`);
      console.log(`   ID: ${property._id}`);
      console.log(`   Titre: ${property.title || 'Sans titre'}`);
      console.log(`   Type: ${property.propertyType || 'Non spécifié'}`);
      console.log(`   Prix: ${property.price ? `${property.price} €` : 'Non spécifié'}`);
      console.log(`   Surface: ${property.surface ? `${property.surface} m²` : 'Non spécifiée'}`);
      console.log(`   Statut: ${property.status || 'Non spécifié'}`);
      
      // Afficher les images
      if (property.images?.length) {
        console.log(`   Images (${property.images.length}):`);
        property.images.forEach((img, i) => {
          console.log(`     ${i + 1}. ${img.url || 'URL non disponible'}`);
          if (img.isPrimary) console.log('       (Image principale)');
        });
      } else {
        console.log('   Aucune image');
      }
      
      // Afficher les informations utilisateur si disponibles
      if (property.user) {
        console.log(`\n   Propriétaire: ${property.user.name || 'Anonyme'}`);
        console.log(`   Email: ${property.user.email}`);
        console.log(`   Rôle: ${property.user.role}`);
      }
      
      console.log('\n' + '─'.repeat(80) + '\n');
    });
    
  } catch (error) {
    console.error('\n❌ Erreur:');
    console.error('Message:', error instanceof Error ? error.message : String(error));
    
    if (error instanceof Error && 'code' in error) {
      console.error('Code d\'erreur:', (error as any).code);
    }
    
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Déconnexion de la base de données');
    }
  }
}

// Lancer le script
listProperties().catch(error => {
  console.error('Erreur inattendue:', error);
  process.exit(1);
});
