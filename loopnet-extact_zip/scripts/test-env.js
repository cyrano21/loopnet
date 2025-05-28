console.log('Test des variables d\'environnement');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '***' : 'non défini');

// Charger le fichier .env manuellement
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

console.log('Après chargement de dotenv:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '***' : 'toujours pas défini');

// Afficher le contenu du fichier .env
const fs = require('fs');
const envPath = require('path').resolve(__dirname, '../.env');
console.log('Chemin du fichier .env:', envPath);

try {
  const content = fs.readFileSync(envPath, 'utf8');
  console.log('Contenu du fichier .env (premières lignes):');
  console.log(content.split('\n').slice(0, 5).join('\n'));
} catch (error) {
  console.error('Erreur lors de la lecture du fichier .env:', error.message);
}
