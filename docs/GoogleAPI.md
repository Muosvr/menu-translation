# Google API Integration Documentation

## Overview

The Menu Translator application integrates with several Google Cloud APIs to provide OCR, translation, and image search capabilities. This document covers all Google API utility functions and their usage.

---

## Google Cloud Vision API

### imageOCR.js

Performs Optical Character Recognition (OCR) on images using Google Cloud Vision API.

#### Function: `imageOCR(image, type, referer)`

**Purpose**: Extract text from images using Google Cloud Vision API

**Parameters**:
- `image` (string): Base64-encoded image content
- `type` (string): Vision API feature type (e.g., "DOCUMENT_TEXT_DETECTION", "LABEL_DETECTION")
- `referer` (string): Request referer URL for API security

**Returns**: Promise resolving to Google Vision API response object

**Usage Example**:
```javascript
const imageOCR = require('./googleAPI/imageOCR');

// Convert image to base64
const base64Image = Buffer.from(imageFile).toString('base64');

// Perform OCR
const ocrResult = await imageOCR(
  base64Image, 
  'DOCUMENT_TEXT_DETECTION', 
  'http://localhost:5000'
);

console.log(ocrResult.responses[0].fullTextAnnotation.text);
```

**Response Structure**:
```javascript
{
  responses: [{
    fullTextAnnotation: {
      pages: [{
        blocks: [{
          paragraphs: [{
            words: [{
              symbols: [{
                text: "character",
                property: {
                  detectedBreak: {
                    type: "LINE_BREAK" // or "EOL_SURE_SPACE"
                  }
                }
              }]
            }]
          }]
        }]
      }],
      text: "Full extracted text"
    },
    textAnnotations: [{
      description: "word",
      boundingPoly: {
        vertices: [
          {x: 100, y: 50},
          {x: 150, y: 50},
          {x: 150, y: 70},
          {x: 100, y: 70}
        ]
      }
    }]
  }]
}
```

**Error Handling**:
```javascript
try {
  const result = await imageOCR(image, type, referer);
} catch (error) {
  console.error('OCR failed:', error);
  // Handle API errors, network issues, etc.
}
```

---

## Google Translate API

### translate.js

Translates text from one language to another using Google Translate API.

#### Function: `translate(text, language, referer)`

**Purpose**: Translate text to target language

**Parameters**:
- `text` (string): Text to translate
- `language` (string): Target language code (ISO 639-1, e.g., "en", "es", "zh-CN")
- `referer` (string): Request referer URL

**Returns**: Promise resolving to translated text string

**Usage Example**:
```javascript
const translate = require('./googleAPI/translate');

// Single translation
const translated = await translate('Hola mundo', 'en', 'localhost:5000');
console.log(translated); // "Hello world"

// Multiple translations
const texts = ['Hola', 'Adiós', 'Gracias'];
const translations = await Promise.all(
  texts.map(text => translate(text, 'en', 'localhost:5000'))
);
console.log(translations); // ["Hello", "Goodbye", "Thank you"]
```

**Supported Language Codes**:
- `en`: English
- `es`: Spanish  
- `fr`: French
- `de`: German
- `zh-CN`: Simplified Chinese
- `zh-TW`: Traditional Chinese
- `ja`: Japanese
- `ko`: Korean
- `pt`: Portuguese
- `it`: Italian
- `ru`: Russian
- `ar`: Arabic

**Error Handling**:
```javascript
try {
  const result = await translate(text, language, referer);
} catch (error) {
  console.error('Translation failed:', error);
  return 'Translation unavailable';
}
```

---

## Google Custom Search API

### searchImage.js

Searches for images using Google Custom Search API.

#### Function: `searchImage(keyphrase, numOfResults, referer)`

**Purpose**: Find images related to search terms

**Parameters**:
- `keyphrase` (string): Search query
- `numOfResults` (number): Number of images to return (1-10)
- `referer` (string): Request referer URL

**Returns**: Promise resolving to array of image URLs

**Usage Example**:
```javascript
const searchImage = require('./googleAPI/searchImage');

// Search for food images
const imageUrls = await searchImage('pizza margherita', 5, 'localhost:5000');
console.log(imageUrls);
// [
//   'https://example.com/pizza1.jpg',
//   'https://example.com/pizza2.jpg',
//   ...
// ]

// Handle no results
if (imageUrls.length === 0) {
  console.log('No images found for this search term');
}
```

**Configuration**:
The search uses a custom search engine configured for food-related images:
- **Search Engine ID**: `016534509464678393715:5ihrfh22yvg`
- **Search Type**: Image search
- **Safe Search**: Enabled

**Error Handling**:
```javascript
try {
  const images = await searchImage(keyphrase, numOfResults, referer);
} catch (error) {
  console.error('Image search failed:', error);
  return []; // Return empty array on failure
}
```

---

## Batch Image Labeling

### batchAnnotateImages.js

Processes multiple images for label detection using Google Vision API.

#### Function: `batchAnnotateImages(imageUrls, referer)`

**Purpose**: Get labels for multiple images in a single API call

**Parameters**:
- `imageUrls` (string[]): Array of image URLs to analyze
- `referer` (string): Request referer URL

**Returns**: Promise resolving to nested array of labels

**Usage Example**:
```javascript
const batchAnnotateImages = require('./googleAPI/batchAnnotateImages');

const imageUrls = [
  'https://example.com/burger.jpg',
  'https://example.com/pizza.jpg'
];

const labels = await batchAnnotateImages(imageUrls, 'localhost:5000');
console.log(labels);
// [
//   ['food', 'burger', 'meat', 'fast food'],
//   ['food', 'pizza', 'cheese', 'italian']
// ]
```

**Label Confidence**:
Labels are returned in order of confidence score. Higher confidence labels appear first in each array.

---

## Language Support

### getSupportedLanguages.js

Retrieves list of supported languages from Google Translate API.

#### Function: `getSupportedLanguages(referer)`

**Purpose**: Get available translation languages

**Parameters**:
- `referer` (string): Request referer URL

**Returns**: Promise resolving to array of language objects

**Usage Example**:
```javascript
const getSupportedLanguages = require('./googleAPI/getSupportedLanguages');

const languages = await getSupportedLanguages('localhost:5000');
console.log(languages);
// [
//   { language: 'en', name: 'English' },
//   { language: 'es', name: 'Spanish' },
//   { language: 'fr', name: 'French' },
//   ...
// ]
```

---

## Configuration

### API Keys Setup

Create a `config/keys.js` file:

```javascript
module.exports = {
  googleAPIKey: process.env.GOOGLE_API_KEY || 'your-api-key-here'
};
```

### Required Google Cloud APIs

Enable these APIs in your Google Cloud Console:
1. **Cloud Vision API** - For OCR and image labeling
2. **Cloud Translation API** - For text translation  
3. **Custom Search API** - For image search

### Custom Search Engine Setup

1. Go to [Google Custom Search Engine](https://cse.google.com/)
2. Create a new search engine
3. Configure for image search
4. Enable SafeSearch
5. Get the Search Engine ID

---

## Error Handling Best Practices

### Rate Limiting
```javascript
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const translateWithRetry = async (text, language, referer, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await translate(text, language, referer);
    } catch (error) {
      if (error.statusCode === 429 && i < retries - 1) {
        await delay(1000 * (i + 1)); // Exponential backoff
        continue;
      }
      throw error;
    }
  }
};
```

### API Quota Management
```javascript
class APIQuotaManager {
  constructor() {
    this.dailyQueries = 0;
    this.maxDailyQueries = 1000;
  }

  canMakeRequest() {
    return this.dailyQueries < this.maxDailyQueries;
  }

  incrementQueries() {
    this.dailyQueries++;
  }

  resetDaily() {
    this.dailyQueries = 0;
  }
}
```

### Graceful Degradation
```javascript
const translateWithFallback = async (text, language, referer) => {
  try {
    return await translate(text, language, referer);
  } catch (error) {
    console.warn('Translation API failed, using fallback');
    return `[${language}] ${text}`; // Simple fallback
  }
};
```

---

## Performance Optimization

### Batch Processing
```javascript
// Process multiple translations concurrently
const batchTranslate = async (texts, language, referer) => {
  const batchSize = 5; // Limit concurrent requests
  const results = [];
  
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(text => translate(text, language, referer))
    );
    results.push(...batchResults);
  }
  
  return results;
};
```

### Caching
```javascript
const translationCache = new Map();

const translateWithCache = async (text, language, referer) => {
  const cacheKey = `${text}:${language}`;
  
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }
  
  const result = await translate(text, language, referer);
  translationCache.set(cacheKey, result);
  return result;
};
```

---

## Testing

### Unit Tests Example
```javascript
const { expect } = require('chai');
const translate = require('../googleAPI/translate');

describe('Google Translate API', () => {
  it('should translate Spanish to English', async () => {
    const result = await translate('Hola', 'en', 'localhost:5000');
    expect(result.toLowerCase()).to.include('hello');
  });

  it('should handle empty strings', async () => {
    const result = await translate('', 'en', 'localhost:5000');
    expect(result).to.equal('');
  });
});
```

### Integration Tests
```javascript
const request = require('supertest');
const app = require('../server');

describe('OCR Integration', () => {
  it('should process uploaded image', async () => {
    const response = await request(app)
      .post('/cards/image/en')
      .attach('image', 'test_images/sample.jpg')
      .expect(200);
    
    expect(response.body.cards).to.be.an('array');
  });
});
```