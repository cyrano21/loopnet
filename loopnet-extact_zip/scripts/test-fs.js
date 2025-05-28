const fs = require('fs');
const path = require('path');

console.log('Démarrage du script test-fs.js');

// Afficher le répertoire courant
console.log('Répertoire courant:', process.cwd());

// Afficher le contenu du répertoire scripts
try {
  const files = fs.readdirSync(__dirname);
  console.log('Contenu du répertoire scripts:');
  console.log(files);
  
  // Vérifier si le fichier .env existe
  const envPath = path.resolve(__dirname, '../../.env');
  console.log('Chemin du fichier .env:', envPath);
  console.log('Le fichier .env existe:', fs.existsSync(envPath));
  
  // Afficher les premières lignes du fichier .env
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    console.log('Début du contenu du fichier .env:');
    console.log(content.split('\n').slice(0, 5).join('\n'));
  }
} catch (error) {
  console.error('Erreur lors de la lecture du répertoire:', error);
}

console.log('Fin du script test-fs.js');
