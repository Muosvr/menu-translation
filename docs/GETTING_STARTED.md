# Getting Started with Menu Translator

Welcome to Menu Translator! This guide will help you set up and run the application locally, understand its features, and start contributing to the project.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

- **Node.js** v8.12.0 or higher
  ```bash
  # Check your Node.js version
  node --version
  
  # If you need to install Node.js, visit: https://nodejs.org/
  ```

- **MongoDB** v5.0 or higher
  ```bash
  # Check MongoDB version
  mongod --version
  
  # Install MongoDB: https://docs.mongodb.com/manual/installation/
  ```

- **Git** for version control
  ```bash
  git --version
  ```

### Google Cloud Platform Setup

You'll need a Google Cloud Platform account with the following APIs enabled:

1. **Google Cloud Vision API** - For OCR and image labeling
2. **Google Cloud Translation API** - For text translation
3. **Google Custom Search API** - For image search

#### Setting up Google APIs

1. **Create a Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Required APIs**
   ```bash
   # Using gcloud CLI (optional)
   gcloud services enable vision.googleapis.com
   gcloud services enable translate.googleapis.com
   gcloud services enable customsearch.googleapis.com
   ```

3. **Create API Credentials**
   - Go to "Credentials" in the Google Cloud Console
   - Click "Create Credentials" → "API Key"
   - Restrict the key to the required APIs
   - Copy the API key for later use

4. **Set up Custom Search Engine**
   - Visit [Google Custom Search Engine](https://cse.google.com/)
   - Create a new search engine
   - Configure it for image search
   - Note the Search Engine ID

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/Muosvr/menu-translation.git

# Navigate to the project directory
cd menu-translation

# Check that you're in the right directory
ls -la
```

### Step 2: Install Dependencies

```bash
# Install server dependencies
npm install

# Install client dependencies
npm run client-install

# Verify installations
npm list --depth=0
cd client && npm list --depth=0 && cd ..
```

### Step 3: Configure Environment

Create your configuration file:

```bash
# Copy the example configuration
cp config/keys.js.example config/keys.js

# Edit the configuration file
nano config/keys.js
```

Update `config/keys.js` with your credentials:

```javascript
module.exports = {
  // MongoDB connection string
  mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/menu-translator',
  
  // Google API key
  googleAPIKey: process.env.GOOGLE_API_KEY || 'your-google-api-key-here'
};
```

### Step 4: Set up MongoDB

#### Option A: Local MongoDB

```bash
# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb  # macOS

# Verify MongoDB is running
mongo --eval "db.adminCommand('ismaster')"
```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `mongoURI` in your config file

### Step 5: Start the Application

```bash
# Development mode (starts both server and client)
npm run dev

# Or start them separately
npm run server  # Terminal 1
npm run client  # Terminal 2
```

### Step 6: Verify Installation

1. **Frontend**: Open http://localhost:3000
2. **Backend API**: Open http://localhost:5000
3. **Test API**: Visit http://localhost:5000/supportedLanguages

You should see the Menu Translator interface and be able to upload images for translation.

---

## 🎯 First Steps

### Understanding the Interface

1. **Upload Area**: Drag and drop or click to select menu images
2. **Language Selector**: Choose your target translation language
3. **Process Button**: Start the translation process
4. **Results View**: See translated cards with images

### Testing with Sample Images

The project includes sample menu images in the `test_images/` directory:

```bash
# Try uploading these sample images
ls test_images/
```

Recommended test images:
- `sample.jpg` - English menu
- `speisekarte.jpg` - German menu
- `Evening-Menu2018.jpg` - Restaurant menu

### Your First Translation

1. **Select a test image** from `test_images/`
2. **Choose target language** (e.g., Spanish)
3. **Click "Translate Menu"**
4. **Wait for processing** (30-60 seconds)
5. **View results** with translated text and food images

---

## 🔧 Development Workflow

### Project Structure Overview

```
menu-translation/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Interface/  # Upload interface
│   │   │   ├── common/     # Shared components
│   │   │   ├── Card.js     # Menu item cards
│   │   │   └── CardContainer.js
│   │   ├── App.js          # Main app component
│   │   └── index.js        # Entry point
│   └── package.json
├── server.js               # Express server entry point
├── routes/api/             # API endpoints
├── models/                 # MongoDB schemas
├── googleAPI/              # Google API integrations
├── component_logic/        # Business logic
├── utils/                  # Utility functions
└── config/                 # Configuration files
```

### Making Your First Change

1. **Frontend Changes**: Edit files in `client/src/`
2. **Backend Changes**: Edit files in the root directory
3. **API Changes**: Edit files in `routes/api/`

Example: Change the app title

```javascript
// client/src/App.js
// Find the title and update it
<h1>My Custom Menu Translator</h1>
```

The development server will automatically reload with your changes.

### Running Tests

```bash
# Run all tests
npm test

# Run specific test files
npm test -- --grep "API"

# Run tests with coverage
npm run test:coverage
```

### Debugging

#### Server-side Debugging

```bash
# Enable debug logging
DEBUG=* npm run server

# Or use nodemon with inspect
nodemon --inspect server.js
```

#### Client-side Debugging

- Use React Developer Tools browser extension
- Check browser console for errors
- Use `console.log()` for debugging

#### Database Debugging

```bash
# Connect to MongoDB directly
mongo menu-translator

# Check collections
show collections

# Query searches
db.searches.find().limit(5)
```

---

## 🔍 Understanding the Flow

### Complete Processing Pipeline

1. **Image Upload**
   ```
   User uploads image → Express receives file → Convert to base64
   ```

2. **OCR Processing**
   ```
   Base64 image → Google Vision API → Extract text blocks
   ```

3. **Text Parsing**
   ```
   Raw OCR response → Parse into structured text → Clean and organize
   ```

4. **Image Search**
   ```
   Text descriptions → Google Image Search → Filter food images
   ```

5. **Food Classification**
   ```
   Image URLs → Google Vision labeling → Determine if food-related
   ```

6. **Translation**
   ```
   Food items → Google Translate API → Target language translation
   ```

7. **Card Creation**
   ```
   Combine all data → Create menu cards → Return to frontend
   ```

### Key Components Interaction

```
┌─────────────┐    ┌──────────────┐    ┌─────────────────┐
│   Frontend  │    │   Backend    │    │   Google APIs   │
│             │    │              │    │                 │
│ File Upload │───►│ OCR Process  │───►│ Vision API      │
│ Language    │    │ Text Parse   │    │ Translate API   │
│ Selection   │    │ Image Search │    │ Custom Search   │
│             │    │ Translation  │    │                 │
│ Display     │◄───│ Card Create  │◄───│ Label Detection │
│ Results     │    │              │    │                 │
└─────────────┘    └──────────────┘    └─────────────────┘
```

---

## 🛠️ Common Development Tasks

### Adding a New Language

1. **Update supported languages**:
   ```javascript
   // client/src/options/supportedLanguages.js
   export default [
     // ... existing languages
     { language: 'pt', name: 'Portuguese' }
   ];
   ```

2. **Test the new language**:
   ```bash
   # Upload a test image and select Portuguese
   ```

### Modifying the UI

1. **Update React components** in `client/src/components/`
2. **Modify styles** using Semantic UI React classes
3. **Test responsive design** on different screen sizes

### Adding API Endpoints

1. **Create new route file**:
   ```javascript
   // routes/api/newfeature.js
   const express = require('express');
   const router = express.Router();
   
   router.get('/test', (req, res) => {
     res.json({ message: 'New feature works!' });
   });
   
   module.exports = router;
   ```

2. **Register the route**:
   ```javascript
   // server.js
   const newFeature = require('./routes/api/newfeature');
   app.use('/api/newfeature', newFeature);
   ```

### Database Operations

1. **View existing data**:
   ```bash
   mongo menu-translator
   db.searches.find().pretty()
   ```

2. **Clear test data**:
   ```bash
   db.searches.deleteMany({keywords: /test/})
   ```

---

## 🚨 Troubleshooting

### Common Issues and Solutions

#### Issue: "Cannot connect to MongoDB"

**Solution**:
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB if not running
sudo systemctl start mongod

# Check connection string in config/keys.js
```

#### Issue: "Google API quota exceeded"

**Solution**:
1. Check your Google Cloud Console quotas
2. Enable billing if necessary
3. Request quota increases if needed

#### Issue: "Module not found" errors

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
rm -rf client/node_modules client/package-lock.json

npm install
npm run client-install
```

#### Issue: "CORS errors" in development

**Solution**:
```javascript
// client/package.json should have:
"proxy": "http://localhost:5000"
```

#### Issue: Images not loading

**Solution**:
1. Check if Google Custom Search API is enabled
2. Verify the search engine ID is correct
3. Check network connectivity

### Getting Help

1. **Check the logs**:
   ```bash
   # Server logs
   npm run server
   
   # Client logs
   npm run client
   ```

2. **Enable debug mode**:
   ```bash
   DEBUG=* npm run dev
   ```

3. **Check the documentation**:
   - [API Documentation](API.md)
   - [Component Documentation](Components.md)
   - [Database Documentation](Database.md)

4. **Community Support**:
   - GitHub Issues
   - GitHub Discussions
   - Stack Overflow (tag: menu-translator)

---

## 🎉 Next Steps

Now that you have Menu Translator running locally, you can:

1. **Explore the codebase** - Understand how each component works
2. **Try different menu images** - Test with various languages and layouts  
3. **Make modifications** - Customize the UI or add new features
4. **Contribute back** - Submit pull requests with improvements
5. **Deploy your own instance** - Follow the deployment guide

### Recommended Learning Path

1. **Week 1**: Get familiar with the interface and basic functionality
2. **Week 2**: Explore the React components and make UI changes
3. **Week 3**: Understand the backend API and Google integrations
4. **Week 4**: Work on database operations and optimization
5. **Week 5**: Contribute a new feature or improvement

### Resources for Learning

- [React Documentation](https://reactjs.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [MongoDB Tutorial](https://docs.mongodb.com/manual/tutorial/)
- [Google Cloud APIs](https://cloud.google.com/apis/)

---

## 📞 Support

If you encounter any issues or have questions:

1. **Check existing documentation** in the `docs/` folder
2. **Search GitHub Issues** for similar problems
3. **Create a new issue** with detailed information
4. **Join the discussion** in GitHub Discussions

**Happy coding! 🚀**