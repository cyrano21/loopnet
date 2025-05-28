const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const sizes = {
  properties: { width: 800, height: 600 },
  cities: { width: 1200, height: 800 },
  articles: { width: 800, height: 450 },
  backgrounds: { width: 1920, height: 1080 },
  users: { width: 500, height: 500 }
};

const colors = {
  properties: '#4A90E2',
  cities: '#50E3C2',
  articles: '#F5A623',
  backgrounds: '#9013FE',
  users: '#7ED321'
};

Object.entries(sizes).forEach(([type, { width, height }]) => {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Fond de couleur
  ctx.fillStyle = colors[type];
  ctx.fillRect(0, 0, width, height);
  
  // Texte
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `${Math.min(width, height) / 10}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  const text = `${type.toUpperCase()}\n${width}x${height}`;
  const lines = text.split('\n');
  const lineHeight = parseInt(ctx.font) * 1.2;
  let y = (height - (lines.length - 1) * lineHeight) / 2;
  
  lines.forEach(line => {
    ctx.fillText(line, width / 2, y);
    y += lineHeight;
  });
  
  // Sauvegarder l'image
  const outputPath = path.join(__dirname, '..', 'public', 'images', type, `default-${type}.png`);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
  
  console.log(`Créé : ${outputPath}`);
});

console.log('Toutes les images par défaut ont été créées avec succès !');
