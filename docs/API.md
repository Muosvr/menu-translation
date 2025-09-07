# Menu Translator API Documentation

## Overview

The Menu Translator API provides endpoints for processing menu images, extracting text using OCR, translating text, and searching for related images. This RESTful API is built with Express.js and integrates with Google Cloud Vision, Translation, and Custom Search APIs.

## Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://menu-translator.herokuapp.com`

## Authentication

The API uses Google API keys configured in the backend. No client-side authentication is required for public endpoints.

---

## Endpoints

### 1. Cards API

#### POST `/cards/image/:language`

Processes an uploaded menu image to extract text, translate it, and create cards with related images.

**Parameters:**
- `language` (path parameter): Target language code (e.g., `en`, `es`, `zh-CN`, `fr`, `de`)

**Request:**
- **Method**: POST
- **Content-Type**: `multipart/form-data`
- **Body**: Form data with image file

```javascript
// Example using FormData
const formData = new FormData();
formData.append('image', imageFile);

fetch('/cards/image/en', {
  method: 'POST',
  body: formData
})
```

**Response:**
```json
{
  "cards": [
    {
      "description": {
        "0": "Beef Burger",
        "1": "With lettuce, tomato, onion"
      },
      "images": [
        "https://example.com/burger1.jpg",
        "https://example.com/burger2.jpg"
      ],
      "imageLabels": [
        ["food", "burger", "meat"],
        ["dish", "meal", "restaurant"]
      ],
      "isFood": [0, 1],
      "translation": {
        "0": "Hamburguesa de Res",
        "1": "Con lechuga, tomate, cebolla"
      }
    }
  ]
}
```

**Error Responses:**
- `400 Bad Request`: No files were uploaded
- `500 Internal Server Error`: Processing error

---

### 2. Testing Endpoints

#### GET `/ocr`

Test endpoint for OCR functionality.

**Response:** OCR test results

#### GET `/search`

Test endpoint for image search functionality.

**Response:** Image search test results

#### GET `/translate`

Test endpoint for translation functionality.

**Response:** Translation test results

#### GET `/label`

Test endpoint for image labeling functionality.

**Response:** Image labeling test results

#### GET `/supportedLanguages`

Returns list of supported languages for translation.

**Response:**
```json
{
  "languages": [
    {
      "language": "en",
      "name": "English"
    },
    {
      "language": "es", 
      "name": "Spanish"
    }
  ]
}
```

#### GET `/searchDB`

Test endpoint for database image search functionality.

**Response:** Database search test results

---

## Data Models

### Card Object

```javascript
{
  description: {
    "0": "Primary text (e.g., dish name)",
    "1": "Secondary text (e.g., description)", 
    // ... additional text blocks
  },
  images: ["url1", "url2", ...], // Array of image URLs
  imageLabels: [
    ["label1", "label2", ...], // Labels for first image
    ["label3", "label4", ...], // Labels for second image
    // ...
  ],
  isFood: [0, 1, ...] | false, // Array of valid food image indices or false
  translation: {
    "0": "Translated primary text",
    "1": "Translated secondary text",
    // ...
  }
}
```

### Language Object

```javascript
{
  language: "en", // Language code
  name: "English" // Human-readable name
}
```

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200 OK`: Successful request
- `400 Bad Request`: Invalid request parameters
- `404 Not Found`: Endpoint not found
- `500 Internal Server Error`: Server processing error

Error responses include descriptive messages:

```json
{
  "error": "No files were uploaded"
}
```

---

## Rate Limiting

The API implements rate limiting for Google API calls:
- Maximum 100 image search queries per request
- Requests exceeding limits return placeholder messages

---

## Usage Examples

### Upload and Process Menu Image

```javascript
// React/JavaScript example
const uploadMenu = async (imageFile, targetLanguage) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  try {
    const response = await fetch(`/cards/image/${targetLanguage}`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    return data.cards;
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

// Usage
const menuCards = await uploadMenu(selectedFile, 'es');
```

### Get Supported Languages

```javascript
const getSupportedLanguages = async () => {
  try {
    const response = await fetch('/supportedLanguages');
    const data = await response.json();
    return data.languages;
  } catch (error) {
    console.error('Failed to fetch languages:', error);
  }
};
```

---

## Integration Guide

### Backend Integration

To integrate the Menu Translator API into your backend:

1. **Install Dependencies**:
```bash
npm install express express-fileupload mongoose request-promise
```

2. **Configure Google APIs**:
```javascript
// config/keys.js
module.exports = {
  mongoURI: 'your-mongodb-uri',
  googleAPIKey: 'your-google-api-key'
};
```

3. **Set up Routes**:
```javascript
const express = require('express');
const fileUpload = require('express-fileupload');
const cards = require('./routes/api/cards');

const app = express();
app.use(fileUpload());
app.use('/cards', cards);
```

### Frontend Integration

The API is designed to work seamlessly with React frontends:

```javascript
// Example React component
import React, { useState } from 'react';

const MenuUploader = () => {
  const [file, setFile] = useState(null);
  const [language, setLanguage] = useState('en');
  const [cards, setCards] = useState([]);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`/cards/image/${language}`, {
      method: 'POST',
      body: formData
    });
    
    const data = await response.json();
    setCards(data.cards);
  };

  return (
    <div>
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files[0])} 
      />
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>
      <button onClick={handleUpload}>Upload Menu</button>
      
      {cards.map((card, index) => (
        <div key={index}>
          <h3>{card.description[0]}</h3>
          <p>{card.translation[0]}</p>
        </div>
      ))}
    </div>
  );
};
```

---

## Performance Considerations

- **Image Processing**: Large images are automatically resized to 800px width for optimal processing speed
- **Caching**: Frequently searched terms are cached in MongoDB to reduce API calls
- **Batch Processing**: Multiple translations are processed concurrently using Promise.all()
- **Error Recovery**: Fallback mechanisms handle API failures gracefully

---

## Security Notes

- File uploads are validated for image types
- API keys are stored securely on the server side
- CORS is configured for production deployment
- Input sanitization prevents XSS attacks

---

## Deployment

The API is configured for deployment on Heroku:

```json
{
  "scripts": {
    "start": "node server.js",
    "heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm run build --prefix client"
  }
}
```

Environment variables required:
- `NODE_ENV`: Set to 'production' for production builds
- `PORT`: Server port (automatically set by Heroku)
- MongoDB connection string
- Google API key