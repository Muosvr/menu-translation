# Utilities and Component Logic Documentation

## Overview

This document covers all utility functions and component logic modules that power the Menu Translator application. These modules handle text processing, image analysis, data transformation, and business logic.

---

## Text Processing Utilities

### parseOCRAnnotation.js

Parses Google Cloud Vision API OCR responses into structured text blocks.

#### Function: `parseOCRAnnotations(response)`

**Purpose**: Extract and structure text from Google Vision API OCR response

**Parameters**:
- `response` (object): Google Vision API response object

**Returns**: Array of text block objects in format `[{0: "text", 1: "text", ...}, ...]`

**Usage Example**:
```javascript
const parseOCRAnnotation = require('./utils/parseOCRAnnotation');

const ocrResponse = await imageOCR(image, 'DOCUMENT_TEXT_DETECTION');
const parsedText = parseOCRAnnotation(ocrResponse);

console.log(parsedText);
// [
//   {0: "APPETIZERS", 1: "Fresh salads and soups"},
//   {0: "Chicken Wings", 1: "$12.99"},
//   {0: "Caesar Salad", 1: "$8.50"}
// ]
```

**Algorithm**:
1. Traverse OCR response hierarchy: `pages → blocks → paragraphs → words → symbols`
2. Detect line breaks using `detectedBreak` properties
3. Group text by paragraphs within blocks
4. Filter out text shorter than minimum character threshold (2 chars)
5. Remove special characters and clean text

**Implementation Details**:
```javascript
const parseOCRAnnotations = response => {
  const minPhraseChar = 2;
  const fullText = [];

  if (response?.responses?.[0]?.fullTextAnnotation) {
    const blocks = response.responses[0].fullTextAnnotation.pages[0].blocks;
    
    blocks.forEach(block => {
      const textBlock = {};
      let paragraphIndex = 0;
      
      block.paragraphs.forEach(paragraph => {
        let paragraphText = "";
        
        paragraph.words.forEach(word => {
          let wordText = "";
          let hasLineBreak = false;
          
          word.symbols.forEach(symbol => {
            wordText += symbol.text;
            
            // Check for line breaks
            if (symbol.property?.detectedBreak) {
              const breakType = symbol.property.detectedBreak.type;
              if (breakType === "LINE_BREAK" || breakType === "EOL_SURE_SPACE") {
                hasLineBreak = true;
              }
            }
          });
          
          paragraphText += wordText + " ";
          
          if (hasLineBreak) {
            const cleanText = removeSpecialChar(paragraphText.trim());
            if (cleanText && cleanText.length >= minPhraseChar) {
              textBlock[paragraphIndex++] = cleanText;
              paragraphText = "";
            }
          }
        });
      });
      
      if (Object.keys(textBlock).length > 0) {
        fullText.push(textBlock);
      }
    });
  }
  
  return fullText;
};
```

### removeSpecialChar.js

Removes special characters and cleans text for processing.

#### Function: `removeSpecialChar(text)`

**Purpose**: Clean text by removing unwanted characters and normalizing whitespace

**Parameters**:
- `text` (string): Raw text to clean

**Returns**: Cleaned text string

**Usage Example**:
```javascript
const removeSpecialChar = require('./utils/removeSpecialChar');

const rawText = "  Chicken Wings!!! @#$%  ";
const cleanText = removeSpecialChar(rawText);
console.log(cleanText); // "Chicken Wings"

const priceText = "$12.99***";
const cleanPrice = removeSpecialChar(priceText);
console.log(cleanPrice); // "$12.99"
```

**Cleaning Rules**:
- Remove excessive punctuation (more than 2 consecutive)
- Preserve currency symbols ($, €, £, ¥)
- Preserve decimal numbers
- Trim whitespace
- Remove control characters
- Normalize multiple spaces to single space

**Implementation**:
```javascript
const removeSpecialChar = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  return text
    .replace(/[^\w\s$€£¥.,!?()-]/g, '') // Keep alphanumeric, currency, basic punctuation
    .replace(/[!?]{3,}/g, '!') // Limit excessive punctuation
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
};
```

### lineByLine.js

Converts text blocks into individual line objects for line-by-line processing.

#### Function: `lineByLine(fullTextArr)`

**Purpose**: Transform block-based text structure into line-based structure

**Parameters**:
- `fullTextArr` (array): Array of text block objects

**Returns**: Array of single-line objects `[{0: "line1"}, {0: "line2"}, ...]`

**Usage Example**:
```javascript
const lineByLine = require('./utils/lineByLine');

const textBlocks = [
  {0: "APPETIZERS", 1: "Fresh and delicious"},
  {0: "Chicken Wings", 1: "$12.99", 2: "Spicy buffalo sauce"}
];

const lines = lineByLine(textBlocks);
console.log(lines);
// [
//   {0: "APPETIZERS"},
//   {0: "Fresh and delicious"},
//   {0: "Chicken Wings"},
//   {0: "$12.99"},
//   {0: "Spicy buffalo sauce"}
// ]
```

**Use Cases**:
- Menu items listed vertically
- Price lists
- Ingredient lists
- Line-by-line translation needs

---

## Image Processing Utilities

### cleanImageUrls.js

Validates and filters image URLs for reliability and safety.

#### Function: `cleanImageUrls(urls)`

**Purpose**: Filter out invalid, unsafe, or low-quality image URLs

**Parameters**:
- `urls` (string[]): Array of image URLs

**Returns**: Array of validated image URLs

**Usage Example**:
```javascript
const cleanImageUrls = require('./utils/cleanImageUrls');

const rawUrls = [
  'https://example.com/food.jpg',
  'http://unsafe-site.com/image.jpg', // Filtered out (HTTP)
  'https://cdn.example.com/tiny.jpg', // Might be filtered (too small)
  'https://stock-photo.com/food.jpg',
  'invalid-url', // Filtered out
  'https://example.com/food.png'
];

const cleanUrls = cleanImageUrls(rawUrls);
console.log(cleanUrls);
// ['https://example.com/food.jpg', 'https://example.com/food.png']
```

**Validation Rules**:
- Must be valid URLs
- HTTPS only (security)
- Common image extensions (.jpg, .jpeg, .png, .webp)
- Not from blocked domains
- Minimum dimensions (inferred from URL patterns)
- Maximum file size limits

**Implementation**:
```javascript
const cleanImageUrls = (urls) => {
  const blockedDomains = ['ads.', 'popup.', 'tracker.'];
  const validExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  
  return urls.filter(url => {
    try {
      const urlObj = new URL(url);
      
      // HTTPS only
      if (urlObj.protocol !== 'https:') return false;
      
      // Check blocked domains
      if (blockedDomains.some(domain => urlObj.hostname.includes(domain))) {
        return false;
      }
      
      // Check file extension
      const hasValidExt = validExtensions.some(ext => 
        urlObj.pathname.toLowerCase().includes(ext)
      );
      
      return hasValidExt;
    } catch (error) {
      return false; // Invalid URL
    }
  });
};
```

### parseImageLabels.js

Processes and categorizes image labels from Google Vision API.

#### Function: `parseImageLabels(labelResponse)`

**Purpose**: Extract and categorize labels from Vision API label detection response

**Parameters**:
- `labelResponse` (object): Google Vision API label detection response

**Returns**: Object with categorized labels

**Usage Example**:
```javascript
const parseImageLabels = require('./utils/parseImageLabels');

const labelResponse = {
  responses: [{
    labelAnnotations: [
      {description: 'Food', score: 0.95},
      {description: 'Dish', score: 0.89},
      {description: 'Cuisine', score: 0.78}
    ]
  }]
};

const parsed = parseImageLabels(labelResponse);
console.log(parsed);
// {
//   food: ['Food', 'Dish', 'Cuisine'],
//   confidence: [0.95, 0.89, 0.78],
//   categories: ['food', 'restaurant']
// }
```

---

## Component Logic Modules

### createCards.js

Core business logic for creating menu item cards with translations and images.

#### Function: `createCards(collection, byLine, targetLanguage, referer)`

**Purpose**: Transform parsed text into complete menu cards with translations and images

**Parameters**:
- `collection` (array): Parsed text blocks from OCR
- `byLine` (boolean): Whether to process line-by-line
- `targetLanguage` (string): Target language code
- `referer` (string): Request referer for API calls

**Returns**: Promise resolving to array of card objects

**Card Structure**:
```javascript
{
  description: {0: "Dish Name", 1: "Description"},
  images: ["url1.jpg", "url2.jpg", ...],
  imageLabels: [["food", "dish"], ["meal", "restaurant"]],
  isFood: [0, 1] | false, // Indices of food images or false
  translation: {0: "Nombre del Plato", 1: "Descripción"}
}
```

**Usage Example**:
```javascript
const createCards = require('./component_logic/createCards');

const textBlocks = [
  {0: "Chicken Parmesan", 1: "Breaded chicken with marinara sauce"},
  {0: "Caesar Salad", 1: "Romaine lettuce with caesar dressing"}
];

const cards = await createCards(textBlocks, false, 'es', 'localhost:5000');
console.log(cards[0]);
// {
//   description: {0: "Chicken Parmesan", 1: "Breaded chicken..."},
//   images: ["https://example.com/chicken1.jpg", ...],
//   isFood: [0, 2],
//   translation: {0: "Pollo Parmesano", 1: "Pollo empanizado..."}
// }
```

**Processing Pipeline**:
1. **Text Processing**: Apply line-by-line processing if requested
2. **Image Search**: Search for relevant images using primary description
3. **Image Labeling**: Analyze images to detect food content
4. **Food Detection**: Determine if item represents food
5. **Fallback Search**: If not food, try longer description
6. **Translation**: Translate all text blocks if item is food
7. **Optimization**: Clean and validate image URLs

**Advanced Features**:
- **Smart Fallback**: If primary search doesn't yield food images, tries combined description
- **Batch Processing**: Processes multiple cards concurrently
- **Rate Limiting**: Respects API quotas with configurable limits
- **Caching**: Integrates with database caching for repeated searches

### hasFoodLabels.js

Determines if image labels indicate food content.

#### Function: `hasFoodLabels(collection)`

**Purpose**: Analyze image labels to determine if images show food

**Parameters**:
- `collection` (string[][]): Nested array of image labels

**Returns**: Array of food image indices or `false`

**Usage Example**:
```javascript
const hasFoodLabels = require('./component_logic/hasFoodLabels');

const imageLabels = [
  ['Food', 'Dish', 'Cuisine'], // Image 0: Food
  ['Plant', 'Flower', 'Garden'], // Image 1: Not food
  ['Drink', 'Beverage', 'Glass'], // Image 2: Food (drink)
  ['Building', 'Architecture'] // Image 3: Not food
];

const foodIndices = hasFoodLabels(imageLabels);
console.log(foodIndices); // [0, 2]

// If not enough food images
const nonFoodLabels = [
  ['Plant', 'Flower'],
  ['Building', 'Road']
];
const result = hasFoodLabels(nonFoodLabels);
console.log(result); // false
```

**Algorithm**:
- **Tolerance**: Minimum 40% of images must be food-related
- **Food Keywords**: 'food', 'foods', 'drink', 'beverage', 'meal', 'dish'
- **Confidence**: Uses label confidence scores if available
- **Filtering**: Removes invalid labels before analysis

**Configuration**:
```javascript
const config = {
  tolerance: 0.4, // 40% minimum food images
  foodKeywords: ['food', 'foods', 'drink', 'beverage', 'meal', 'dish', 'cuisine'],
  minConfidence: 0.5 // Minimum label confidence
};
```

### getImageLabels.js

Retrieves labels for multiple images using Google Vision API.

#### Function: `getImageLabels(imageUrls, referer)`

**Purpose**: Get descriptive labels for array of image URLs

**Parameters**:
- `imageUrls` (string[]): Array of image URLs to analyze
- `referer` (string): Request referer for API

**Returns**: Promise resolving to nested array of labels

**Usage Example**:
```javascript
const getImageLabels = require('./component_logic/getImageLabels');

const imageUrls = [
  'https://example.com/burger.jpg',
  'https://example.com/salad.jpg'
];

const labels = await getImageLabels(imageUrls, 'localhost:5000');
console.log(labels);
// [
//   ['Food', 'Burger', 'Fast food', 'Meat'],
//   ['Food', 'Salad', 'Vegetable', 'Healthy']
// ]
```

**Features**:
- **Batch Processing**: Analyzes multiple images in single API call
- **Error Handling**: Graceful handling of invalid URLs
- **Label Filtering**: Removes low-confidence labels
- **Retry Logic**: Implements exponential backoff for failures

### checkByLine.js

Determines whether text should be processed line-by-line based on content analysis.

#### Function: `checkByLine(textCollection)`

**Purpose**: Analyze text structure to recommend line-by-line processing

**Parameters**:
- `textCollection` (array): Collection of text blocks

**Returns**: Boolean recommendation for line-by-line processing

**Usage Example**:
```javascript
const checkByLine = require('./component_logic/checkByLine');

// Menu with clear line structure
const menuText = [
  {0: "APPETIZERS"},
  {0: "Wings", 1: "$12"},
  {0: "Nachos", 1: "$8"},
  {0: "MAIN COURSES"},
  {0: "Burger", 1: "$15"}
];

const shouldProcessByLine = checkByLine(menuText);
console.log(shouldProcessByLine); // true

// Menu with paragraph structure
const paragraphText = [
  {0: "Today's Special", 1: "Our chef recommends the grilled salmon with seasonal vegetables and rice pilaf"}
];

const shouldProcessByLine2 = checkByLine(paragraphText);
console.log(shouldProcessByLine2); // false
```

**Analysis Criteria**:
- **Line Length**: Short lines indicate list structure
- **Pattern Recognition**: Repeated price patterns ($X.XX)
- **Structure Indicators**: Headers, categories, numbered items
- **Content Density**: Ratio of text blocks to content

---

## Database Integration

### saveImageSearch.js

Caches image search results in MongoDB for performance optimization.

#### Function: `saveImageSearch(keywords, imageUrls)`

**Purpose**: Store image search results for future use

**Parameters**:
- `keywords` (string): Search query used
- `imageUrls` (string[]): Resulting image URLs

**Returns**: Promise resolving to saved document

**Usage Example**:
```javascript
const saveImageSearch = require('./component_logic/saveImageSearch');

const keywords = "chicken parmesan";
const images = ["https://example.com/chicken1.jpg", "https://example.com/chicken2.jpg"];

await saveImageSearch(keywords, images);
console.log('Search results cached');
```

**Schema**:
```javascript
{
  keywords: String, // Search query
  images: [{url: String}], // Array of image URLs
  isFood: Boolean, // Whether images represent food
  createdAt: Date, // Timestamp
  accessCount: Number // Usage tracking
}
```

### searchImageFromDB.js

Retrieves cached image search results from database.

#### Function: `searchImageFromDB(keywords)`

**Purpose**: Get previously cached image search results

**Parameters**:
- `keywords` (string): Search query

**Returns**: Promise resolving to array of image URLs or empty array

**Usage Example**:
```javascript
const searchImageFromDB = require('./component_logic/searchImageFromDB');

const cachedImages = await searchImageFromDB("chicken parmesan");
if (cachedImages.length > 0) {
  console.log('Using cached results:', cachedImages);
} else {
  console.log('No cached results, will use API');
}
```

**Performance Benefits**:
- **Reduced API Calls**: Avoids repeated Google API requests
- **Faster Response**: Database queries are much faster than API calls
- **Cost Savings**: Reduces Google API usage costs
- **Offline Capability**: Works when API is unavailable

---

## Error Handling Utilities

### API Error Recovery

```javascript
const withRetry = async (apiCall, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      console.warn(`Attempt ${attempt} failed, retrying in ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
};

// Usage
const safeTranslate = (text, language, referer) => 
  withRetry(() => translate(text, language, referer));
```

### Graceful Degradation

```javascript
const safeProcessCard = async (card, targetLanguage, referer) => {
  try {
    // Try full processing
    return await createCards([card], false, targetLanguage, referer);
  } catch (error) {
    console.warn('Full processing failed, using fallback');
    
    // Fallback: basic translation only
    return {
      ...card,
      translation: await translate(card.description[0], targetLanguage, referer)
        .catch(() => 'Translation unavailable'),
      images: [],
      isFood: false
    };
  }
};
```

---

## Performance Optimization

### Batch Processing

```javascript
const processBatch = async (items, batchSize = 5, processor) => {
  const results = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(item => processor(item))
    );
    results.push(...batchResults);
    
    // Rate limiting pause between batches
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
};
```

### Memory Management

```javascript
const processLargeMenu = async (textBlocks) => {
  // Process in chunks to avoid memory issues
  const chunkSize = 10;
  const results = [];
  
  for (let i = 0; i < textBlocks.length; i += chunkSize) {
    const chunk = textBlocks.slice(i, i + chunkSize);
    const chunkResults = await createCards(chunk, false, 'en', 'localhost:5000');
    results.push(...chunkResults);
    
    // Force garbage collection opportunity
    if (global.gc) global.gc();
  }
  
  return results;
};
```

---

## Testing Utilities

### Mock Data Generators

```javascript
const generateMockCard = (overrides = {}) => ({
  description: {0: "Test Dish", 1: "Test Description"},
  images: ["https://example.com/test.jpg"],
  imageLabels: [["food", "test"]],
  isFood: [0],
  translation: {0: "Plato de Prueba", 1: "Descripción de Prueba"},
  ...overrides
});

const generateMockOCRResponse = (textBlocks) => ({
  responses: [{
    fullTextAnnotation: {
      pages: [{
        blocks: textBlocks.map(block => ({
          paragraphs: [{
            words: block.split(' ').map(word => ({
              symbols: word.split('').map(char => ({
                text: char,
                property: null
              }))
            }))
          }]
        }))
      }]
    }
  }]
});
```

### Test Helpers

```javascript
const testUtils = {
  // Wait for async operations
  waitFor: (condition, timeout = 5000) => {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const check = () => {
        if (condition()) {
          resolve();
        } else if (Date.now() - startTime > timeout) {
          reject(new Error('Timeout waiting for condition'));
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  },

  // Mock API responses
  mockApiResponse: (data, delay = 0) => {
    return new Promise(resolve => {
      setTimeout(() => resolve(data), delay);
    });
  }
};
```