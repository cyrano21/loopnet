// Charger les variables d'environnement en premier
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../.env');
dotenv.config({ path: envPath });

// Importer les autres dépendances après avoir chargé les variables d'environnement
import { ObjectId, WithId, Document } from 'mongodb';
import { db } from '../lib/db';

interface User extends WithId<Document> {
  name?: string;
  email: string;
  role: string;
}

interface Property {
  _id: ObjectId;
  title: string;
  description: string;
  propertyType: string;
  price: number;
  surface: number;
  status: string;
  images: Array<{
    url: string;
    publicId: string;
    alt?: string;
    isPrimary?: boolean;
  }>;
  userId: ObjectId;
  user?: {
    name?: string;
    email: string;
    role: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

async function listProperties() {
  try {
    console.log('🔌 Connecting to database...');
    const database = await db.connect();
    
    console.log('📋 Fetching properties...');
    const properties = await database.collection('properties')
      .find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray() as Property[];

    // Récupérer les utilisateurs associés
    const userIds = [...new Set(properties.map(p => p.userId))];
    const users = await database.collection('users')
      .find({ _id: { $in: userIds } })
      .toArray();

        // Créer un map des utilisateurs pour un accès rapide
    const userMap = new Map<string, User>();
    users.forEach((user: User) => {
      if (user._id) {
        userMap.set(user._id.toString(), user as User);
      }
    });

    // Associer les utilisateurs aux propriétés avec le bon typage
    const propertiesWithUsers = properties.map(property => {
      const user = property.userId ? userMap.get(property.userId.toString()) : undefined;
      const userInfo = user ? {
        name: user.name,
        email: user.email,
        role: user.role
      } : undefined;
      
      return {
        ...property,
        user: userInfo
      } as Property;
    });

    console.log(`✅ Found ${propertiesWithUsers.length} properties\n`);
    
    propertiesWithUsers.forEach((property: Property, index: number) => {
      console.log(`🏠 Property #${index + 1}`);
      console.log(`   ID: ${property._id}`);
      console.log(`   Title: ${property.title}`);
      console.log(`   Type: ${property.propertyType}`);
      console.log(`   Price: ${property.price} €`);
      console.log(`   Surface: ${property.surface} m²`);
      console.log(`   Status: ${property.status || 'N/A'}`);
      console.log(`   Created: ${property.createdAt}`);
      
      if (property.images && property.images.length > 0) {
        console.log(`\n   Images (${property.images.length}):`);
        property.images.forEach((img: any, imgIndex: number) => {
          console.log(`     ${imgIndex + 1}. ${img.url}${img.isPrimary ? ' (Primary)' : ''}`);
        });
      } else {
        console.log('\n   No images');
      }
      
      if (property.user) {
        console.log(`\n   Owner: ${property.user.name || 'Unknown'} (${property.user.email}, ${property.user.role})`);
      }
      
      console.log('\n' + '-'.repeat(80) + '\n');
    });
    
  } catch (error) {
    console.error('❌ Error fetching properties:', error);
  } finally {
    // La connexion est gérée par le singleton db
    console.log('🔌 Disconnected from database');
  }
}

// Run the script
listProperties().catch(console.error);
