import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defaultImages } from '../config/images';

// Get the current directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base public directory
const publicDir = path.join(__dirname, '..', 'public');

// Function to create directory if it doesn't exist
const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dirPath}`);
  }
};

// Function to create a placeholder image
const createPlaceholderImage = (filePath: string, width = 800, height = 600) => {
  if (!fs.existsSync(filePath)) {
    // Create a simple SVG as a placeholder
    const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="#9ca3af" dy=".3em">
        ${path.basename(filePath, path.extname(filePath))}
      </text>
    </svg>`;
    
    fs.writeFileSync(filePath, svg);
    console.log(`Created placeholder: ${filePath}`);
  }
};

// Create all necessary directories and placeholder images
const setupDefaultImages = async () => {
  try {
    console.log('Setting up default images...');
    
    // Process each category in defaultImages
    for (const [category, variants] of Object.entries(defaultImages)) {
      if (typeof variants === 'string') continue; // Skip the placeholder
      
      for (const [variant, imagePath] of Object.entries(variants)) {
        if (!imagePath.startsWith('/')) continue; // Skip non-path values
        
        const fullPath = path.join(publicDir, imagePath);
        const dirPath = path.dirname(fullPath);
        
        // Create directory if it doesn't exist
        ensureDirectoryExists(dirPath);
        
        // Create placeholder image if it doesn't exist
        createPlaceholderImage(fullPath);
      }
    }
    
    // Ensure placeholder.jpg exists at root
    createPlaceholderImage(path.join(publicDir, 'placeholder.jpg'));
    
    console.log('Default images setup completed successfully!');
  } catch (error) {
    console.error('Error setting up default images:', error);
    process.exit(1);
  }
};

// Run the setup
setupDefaultImages();
