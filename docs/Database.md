# Database and Models Documentation

## Overview

The Menu Translator application uses MongoDB as its primary database with Mongoose ODM for data modeling. This document covers all data models, database operations, and data management patterns.

---

## Database Configuration

### Connection Setup

The application connects to MongoDB using the configuration in `config/keys.js`:

```javascript
// config/keys.js
module.exports = {
  mongoURI: process.env.MONGODB_URI || 'mongodb://localhost:27017/menu-translator',
  googleAPIKey: process.env.GOOGLE_API_KEY
};
```

### Connection in server.js

```javascript
const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('Database connection error:', err));
```

---

## Data Models

### Search Model (Search.js)

Stores cached image search results to optimize API usage and improve performance.

#### Schema Definition

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SearchSchema = new Schema({
  keywords: {
    type: String,
    required: true,
    index: true, // Index for fast lookups
    trim: true,
    lowercase: true // Store in lowercase for consistent searches
  },
  images: [{
    url: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
        },
        message: 'Invalid image URL format'
      }
    },
    isValid: {
      type: Boolean,
      default: true
    },
    lastChecked: {
      type: Date,
      default: Date.now
    }
  }],
  isFood: {
    type: Boolean,
    default: null
  },
  searchCount: {
    type: Number,
    default: 1
  },
  lastAccessed: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 2592000 // 30 days TTL
  }
});

// Compound index for efficient queries
SearchSchema.index({ keywords: 1, isFood: 1 });

module.exports = mongoose.model('Search', SearchSchema);
```

#### Usage Examples

**Creating a new search record:**
```javascript
const Search = require('./models/Search');

const saveImageSearch = async (keywords, imageUrls) => {
  try {
    const existingSearch = await Search.findOne({ 
      keywords: keywords.toLowerCase().trim() 
    });

    if (existingSearch) {
      // Update existing record
      existingSearch.images = imageUrls.map(url => ({ url }));
      existingSearch.searchCount += 1;
      existingSearch.lastAccessed = new Date();
      return await existingSearch.save();
    } else {
      // Create new record
      const newSearch = new Search({
        keywords: keywords.toLowerCase().trim(),
        images: imageUrls.map(url => ({ url })),
        searchCount: 1
      });
      return await newSearch.save();
    }
  } catch (error) {
    console.error('Error saving search:', error);
    throw error;
  }
};
```

**Retrieving cached search results:**
```javascript
const searchImageFromDB = async (keywords) => {
  try {
    const search = await Search.findOne({ 
      keywords: keywords.toLowerCase().trim() 
    });

    if (search) {
      // Update access tracking
      search.lastAccessed = new Date();
      search.searchCount += 1;
      await search.save();

      // Return valid image URLs
      return search.images
        .filter(img => img.isValid)
        .map(img => img.url);
    }

    return [];
  } catch (error) {
    console.error('Error retrieving from DB:', error);
    return [];
  }
};
```

**Advanced queries:**
```javascript
// Find popular search terms
const getPopularSearches = async (limit = 10) => {
  return await Search.find()
    .sort({ searchCount: -1 })
    .limit(limit)
    .select('keywords searchCount lastAccessed');
};

// Find searches that need image validation
const getSearchesNeedingValidation = async () => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return await Search.find({
    'images.lastChecked': { $lt: oneDayAgo }
  });
};

// Clean up old or invalid searches
const cleanupOldSearches = async () => {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return await Search.deleteMany({
    lastAccessed: { $lt: thirtyDaysAgo },
    searchCount: { $lt: 5 }
  });
};
```

### User Model (User.js)

Stores user information for potential future authentication and personalization features.

#### Schema Definition

```javascript
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  preferences: {
    defaultLanguage: {
      type: String,
      default: 'en',
      enum: ['en', 'es', 'fr', 'de', 'zh-CN', 'zh-TW', 'ja', 'ko', 'pt', 'it', 'ru', 'ar']
    },
    processingMode: {
      type: String,
      default: 'auto',
      enum: ['auto', 'byLine', 'byBlock']
    },
    imageQuality: {
      type: String,
      default: 'medium',
      enum: ['low', 'medium', 'high']
    }
  },
  usage: {
    menusProcessed: {
      type: Number,
      default: 0
    },
    translationsGenerated: {
      type: Number,
      default: 0
    },
    lastActivity: {
      type: Date,
      default: Date.now
    }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Index for email lookups
UserSchema.index({ email: 1 });

module.exports = mongoose.model('User', UserSchema);
```

#### Usage Examples

**Creating a new user:**
```javascript
const User = require('./models/User');

const createUser = async (userData) => {
  try {
    const newUser = new User({
      name: userData.name,
      email: userData.email,
      preferences: {
        defaultLanguage: userData.language || 'en'
      }
    });

    return await newUser.save();
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Email already exists');
    }
    throw error;
  }
};
```

**Updating user preferences:**
```javascript
const updateUserPreferences = async (userId, preferences) => {
  try {
    return await User.findByIdAndUpdate(
      userId,
      { 
        $set: { preferences },
        $inc: { 'usage.menusProcessed': 1 },
        $currentDate: { 'usage.lastActivity': true }
      },
      { new: true }
    );
  } catch (error) {
    console.error('Error updating user preferences:', error);
    throw error;
  }
};
```

---

## Database Operations

### Search Operations

#### Caching Strategy

The application implements a multi-level caching strategy:

1. **Memory Cache**: Frequently used searches cached in application memory
2. **Database Cache**: Persistent cache in MongoDB with TTL
3. **API Fallback**: Google API calls when cache misses

```javascript
class SearchCache {
  constructor() {
    this.memoryCache = new Map();
    this.maxMemoryEntries = 100;
  }

  async get(keywords) {
    const key = keywords.toLowerCase().trim();
    
    // Check memory cache first
    if (this.memoryCache.has(key)) {
      return this.memoryCache.get(key);
    }

    // Check database cache
    const dbResult = await searchImageFromDB(key);
    if (dbResult.length > 0) {
      // Update memory cache
      this.setMemoryCache(key, dbResult);
      return dbResult;
    }

    return null;
  }

  async set(keywords, imageUrls) {
    const key = keywords.toLowerCase().trim();
    
    // Save to database
    await saveImageSearch(key, imageUrls);
    
    // Update memory cache
    this.setMemoryCache(key, imageUrls);
  }

  setMemoryCache(key, value) {
    // Implement LRU eviction
    if (this.memoryCache.size >= this.maxMemoryEntries) {
      const firstKey = this.memoryCache.keys().next().value;
      this.memoryCache.delete(firstKey);
    }
    
    this.memoryCache.set(key, value);
  }
}
```

#### Batch Operations

```javascript
const batchSaveSearches = async (searchData) => {
  try {
    const operations = searchData.map(({ keywords, images }) => ({
      updateOne: {
        filter: { keywords: keywords.toLowerCase().trim() },
        update: {
          $set: { 
            images: images.map(url => ({ url })),
            lastAccessed: new Date()
          },
          $inc: { searchCount: 1 }
        },
        upsert: true
      }
    }));

    return await Search.bulkWrite(operations);
  } catch (error) {
    console.error('Batch save failed:', error);
    throw error;
  }
};
```

### Analytics and Reporting

#### Search Analytics

```javascript
const getSearchAnalytics = async (dateRange = 30) => {
  const startDate = new Date(Date.now() - dateRange * 24 * 60 * 60 * 1000);
  
  const analytics = await Search.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: null,
        totalSearches: { $sum: 1 },
        totalSearchCount: { $sum: '$searchCount' },
        avgImagesPerSearch: { $avg: { $size: '$images' } },
        foodSearches: {
          $sum: { $cond: [{ $eq: ['$isFood', true] }, 1, 0] }
        }
      }
    }
  ]);

  return analytics[0] || {
    totalSearches: 0,
    totalSearchCount: 0,
    avgImagesPerSearch: 0,
    foodSearches: 0
  };
};
```

#### Popular Keywords

```javascript
const getPopularKeywords = async (limit = 20) => {
  return await Search.aggregate([
    { $match: { isFood: true } },
    { $sort: { searchCount: -1 } },
    { $limit: limit },
    {
      $project: {
        keywords: 1,
        searchCount: 1,
        imageCount: { $size: '$images' },
        lastAccessed: 1
      }
    }
  ]);
};
```

---

## Data Validation and Sanitization

### Input Validation

```javascript
const validateSearchInput = (keywords) => {
  if (!keywords || typeof keywords !== 'string') {
    throw new Error('Keywords must be a non-empty string');
  }
  
  if (keywords.length > 200) {
    throw new Error('Keywords too long (max 200 characters)');
  }
  
  // Remove potentially dangerous characters
  return keywords
    .replace(/[<>\"']/g, '') // Remove HTML/script chars
    .trim();
};

const validateImageUrl = (url) => {
  try {
    const urlObj = new URL(url);
    
    // Must be HTTPS
    if (urlObj.protocol !== 'https:') {
      throw new Error('Only HTTPS URLs allowed');
    }
    
    // Check file extension
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const hasValidExt = validExtensions.some(ext => 
      urlObj.pathname.toLowerCase().endsWith(ext)
    );
    
    if (!hasValidExt) {
      throw new Error('Invalid image file extension');
    }
    
    return url;
  } catch (error) {
    throw new Error(`Invalid image URL: ${error.message}`);
  }
};
```

### Data Sanitization

```javascript
const sanitizeSearchData = (data) => {
  return {
    keywords: validateSearchInput(data.keywords),
    images: data.images
      .filter(url => {
        try {
          validateImageUrl(url);
          return true;
        } catch {
          return false;
        }
      })
      .slice(0, 10), // Limit to 10 images max
    isFood: typeof data.isFood === 'boolean' ? data.isFood : null
  };
};
```

---

## Database Maintenance

### Indexing Strategy

```javascript
// Create compound indexes for optimal query performance
db.searches.createIndex({ "keywords": 1, "isFood": 1 });
db.searches.createIndex({ "lastAccessed": 1 }); // For cleanup operations
db.searches.createIndex({ "searchCount": -1 }); // For popular searches
db.searches.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 2592000 }); // TTL index

db.users.createIndex({ "email": 1 }, { unique: true });
db.users.createIndex({ "usage.lastActivity": 1 });
```

### Cleanup Operations

```javascript
const performMaintenance = async () => {
  console.log('Starting database maintenance...');
  
  // Remove searches with broken image links
  const invalidSearches = await Search.find({
    'images.isValid': false,
    searchCount: { $lt: 2 }
  });
  
  for (const search of invalidSearches) {
    await Search.findByIdAndDelete(search._id);
  }
  
  // Update image validity
  const searchesNeedingValidation = await getSearchesNeedingValidation();
  for (const search of searchesNeedingValidation) {
    await validateImageUrls(search);
  }
  
  // Compact frequently accessed data
  await compactPopularSearches();
  
  console.log('Database maintenance completed');
};

const validateImageUrls = async (search) => {
  const validatedImages = [];
  
  for (const image of search.images) {
    try {
      const response = await fetch(image.url, { method: 'HEAD' });
      if (response.ok) {
        validatedImages.push({
          ...image,
          isValid: true,
          lastChecked: new Date()
        });
      } else {
        validatedImages.push({
          ...image,
          isValid: false,
          lastChecked: new Date()
        });
      }
    } catch (error) {
      validatedImages.push({
        ...image,
        isValid: false,
        lastChecked: new Date()
      });
    }
  }
  
  search.images = validatedImages;
  await search.save();
};
```

---

## Performance Optimization

### Query Optimization

```javascript
// Use lean() for read-only operations
const getSearchKeywords = async () => {
  return await Search.find({}, 'keywords searchCount')
    .lean() // Returns plain objects, not Mongoose documents
    .sort({ searchCount: -1 })
    .limit(100);
};

// Use select() to limit returned fields
const getRecentSearches = async (limit = 10) => {
  return await Search.find()
    .select('keywords lastAccessed searchCount')
    .sort({ lastAccessed: -1 })
    .limit(limit);
};

// Use aggregation for complex queries
const getSearchStats = async () => {
  return await Search.aggregate([
    {
      $group: {
        _id: '$isFood',
        count: { $sum: 1 },
        avgSearchCount: { $avg: '$searchCount' },
        avgImages: { $avg: { $size: '$images' } }
      }
    }
  ]);
};
```

### Connection Pooling

```javascript
// Optimize connection settings for production
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      bufferCommands: false, // Disable mongoose buffering
      bufferMaxEntries: 0 // Disable mongoose buffering
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};
```

---

## Testing Database Operations

### Test Data Setup

```javascript
const setupTestData = async () => {
  // Clear test data
  await Search.deleteMany({ keywords: /^test_/ });
  await User.deleteMany({ email: /test@/ });

  // Create test searches
  const testSearches = [
    {
      keywords: 'test_pizza',
      images: [{ url: 'https://example.com/pizza.jpg' }],
      isFood: true,
      searchCount: 5
    },
    {
      keywords: 'test_burger',
      images: [{ url: 'https://example.com/burger.jpg' }],
      isFood: true,
      searchCount: 3
    }
  ];

  await Search.insertMany(testSearches);

  // Create test user
  const testUser = new User({
    name: 'Test User',
    email: 'test@example.com',
    preferences: { defaultLanguage: 'en' }
  });

  await testUser.save();
};
```

### Integration Tests

```javascript
const { expect } = require('chai');
const mongoose = require('mongoose');
const Search = require('../models/Search');

describe('Search Model', () => {
  before(async () => {
    await mongoose.connect('mongodb://localhost:27017/menu-translator-test');
    await setupTestData();
  });

  after(async () => {
    await mongoose.connection.close();
  });

  it('should save image search results', async () => {
    const keywords = 'test_chicken';
    const images = ['https://example.com/chicken1.jpg'];
    
    await saveImageSearch(keywords, images);
    
    const saved = await Search.findOne({ keywords });
    expect(saved).to.exist;
    expect(saved.images).to.have.length(1);
    expect(saved.images[0].url).to.equal(images[0]);
  });

  it('should retrieve cached search results', async () => {
    const results = await searchImageFromDB('test_pizza');
    expect(results).to.be.an('array');
    expect(results).to.have.length.greaterThan(0);
  });

  it('should update search count on access', async () => {
    const initialSearch = await Search.findOne({ keywords: 'test_pizza' });
    const initialCount = initialSearch.searchCount;
    
    await searchImageFromDB('test_pizza');
    
    const updatedSearch = await Search.findOne({ keywords: 'test_pizza' });
    expect(updatedSearch.searchCount).to.equal(initialCount + 1);
  });
});
```

---

## Backup and Recovery

### Backup Strategy

```javascript
const createBackup = async () => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `./backups/menu-translator-${timestamp}.json`;
  
  try {
    // Export searches
    const searches = await Search.find().lean();
    const users = await User.find().lean();
    
    const backupData = {
      timestamp: new Date(),
      collections: {
        searches,
        users
      },
      metadata: {
        searchCount: searches.length,
        userCount: users.length
      }
    };
    
    fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2));
    console.log(`Backup created: ${backupPath}`);
    
    return backupPath;
  } catch (error) {
    console.error('Backup failed:', error);
    throw error;
  }
};
```

### Recovery Operations

```javascript
const restoreFromBackup = async (backupPath) => {
  try {
    const backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
    
    // Clear existing data (use with caution)
    await Search.deleteMany({});
    await User.deleteMany({});
    
    // Restore searches
    if (backupData.collections.searches.length > 0) {
      await Search.insertMany(backupData.collections.searches);
    }
    
    // Restore users
    if (backupData.collections.users.length > 0) {
      await User.insertMany(backupData.collections.users);
    }
    
    console.log('Restore completed successfully');
  } catch (error) {
    console.error('Restore failed:', error);
    throw error;
  }
};
```