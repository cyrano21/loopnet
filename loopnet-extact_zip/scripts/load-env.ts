import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuration du chemin du fichier .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');
const envPath = path.join(projectRoot, '.env');

console.log('Répertoire du projet:', projectRoot);
console.log(`Chargement des variables d'environnement depuis: ${envPath}`);
console.log('Contenu du répertoire:', fs.readdirSync(projectRoot));

// Charger les variables d'environnement
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('Erreur lors du chargement du fichier .env:', result.error);
  process.exit(1);
}

console.log('Variables d\'environnement chargées avec succès');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '***' : 'non défini');
console.log('NODE_ENV:', process.env.NODE_ENV || 'non défini');

export const MONGODB_URI = process.env.MONGODB_URI;
export const NODE_ENV = process.env.NODE_ENV || 'development';
