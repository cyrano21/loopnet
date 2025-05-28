// Script de test réseau pour MongoDB Atlas
console.log('=== TEST DE CONNECTIVITÉ RÉSEAU ===\n');

const { exec } = require('child_process');
const { promisify } = require('util');
const execPromise = promisify(exec);

// URL de test pour MongoDB Atlas
const MONGODB_HOST = 'cluster0.hsnymcz.mongodb.net';
const TEST_URL = `https://${MONGODB_HOST}`;

// Fonction pour tester la connexion
async function testConnection(host, port = 443) {
  try {
    console.log(`Test de connexion à ${host}:${port}...`);
    
    // Utiliser curl pour tester la connexion
    const command = process.platform === 'win32' 
      ? `Test-NetConnection -ComputerName ${host} -Port ${port} | Select-Object -Property ComputerName, TcpTestSucceeded`
      : `nc -zv ${host} ${port} -w 5`;
    
    const { stdout, stderr } = await execPromise(command);
    
    if (stderr) {
      console.error('Erreur:', stderr);
      return false;
    }
    
    console.log('Réponse:', stdout.trim());
    return true;
    
  } catch (error) {
    console.error('❌ Erreur de connexion:');
    console.error('Message:', error.message);
    return false;
  }
}

// Fonction pour tester la résolution DNS
async function testDns(hostname) {
  try {
    console.log(`\nRésolution DNS pour ${hostname}...`);
    const { stdout } = await execPromise(`nslookup ${hostname}`);
    console.log(stdout);
    return true;
  } catch (error) {
    console.error('❌ Erreur de résolution DNS:', error.message);
    return false;
  }
}

// Exécuter les tests
async function runTests() {
  console.log('1. Test de résolution DNS...');
  await testDns(MONGODB_HOST);
  
  console.log('\n2. Test de connexion au port 443 (HTTPS)...');
  await testConnection(MONGODB_HOST, 443);
  
  console.log('\n3. Test de connexion au port 27017 (MongoDB)...');
  await testConnection(MONGODB_HOST, 27017);
  
  console.log('\n=== TESTS TERMINÉS ===');
}

// Lancer les tests
runTests().catch(console.error);
