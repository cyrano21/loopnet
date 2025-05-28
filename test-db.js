const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://louiscyrano:Figoro21@cluster0.hsnymcz.mongodb.net/Loopnet?retryWrites=true&w=majority";

async function testConnection() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("✅ Connexion MongoDB réussie !");
    
    // Lister les propriétés existantes
    const db = client.db('Loopnet');
    const properties = await db.collection('properties').find({}).toArray();
    console.log(`📋 Nombre de propriétés dans la base : ${properties.length}`);
    
    if (properties.length > 0) {
      console.log("🏠 Première propriété :");
      console.log(`   - Titre: ${properties[0].title}`);
      console.log(`   - ID: ${properties[0]._id}`);
      console.log(`   - Slug: ${properties[0].slug || 'Pas de slug'}`);
    }
    
    await client.close();
  } catch (error) {
    console.error("❌ Erreur de connexion :", error.message);
  }
}

testConnection();
