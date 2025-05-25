# 🔧 GUIDE DE CONFIGURATION

## ✅ DÉJÀ CONFIGURÉ
- NEXTAUTH_URL
- NEXTAUTH_SECRET  
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
- HUGGINGFACE_API_KEY

## ❌ À CONFIGURER OBLIGATOIREMENT

### 1. MongoDB Atlas
\`\`\`bash
# Aller sur https://cloud.mongodb.com
# Créer un cluster gratuit
# Obtenir la connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/loopnet-clone
\`\`\`

### 2. Cloudinary
\`\`\`bash
# Aller sur https://cloudinary.com
# Créer un compte gratuit
# Dashboard > Settings > API Keys
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key  
CLOUDINARY_API_SECRET=your_api_secret
\`\`\`

## 🎯 OPTIONNELS (pour fonctionnalités avancées)

### 3. Stripe (paiements)
\`\`\`bash
# Aller sur https://stripe.com
# Dashboard > Developers > API Keys
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
\`\`\`

### 4. Email SMTP (notifications)
\`\`\`bash
# Gmail App Password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
\`\`\`

## 🚀 ORDRE DE PRIORITÉ

1. **CRITIQUE** : MongoDB + Cloudinary
2. **IMPORTANT** : Déjà fait (Auth)
3. **OPTIONNEL** : Stripe + Email
