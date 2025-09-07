# React Components Documentation

## Overview

The Menu Translator frontend is built with React and uses Semantic UI React for styling. This document covers all React components, their props, state management, and usage examples.

---

## Main Application Components

### App.js

The root component that manages global state and routing.

#### Props
None (root component)

#### State
```javascript
{
  upload: boolean,     // Whether upload is in progress
  response: object,    // API response with cards data
  image: string        // URL of uploaded menu image
}
```

#### Methods

**`setUpload(boolean)`**
- **Purpose**: Toggle upload state
- **Parameters**: `boolean` - Upload status
- **Usage**: `this.setUpload(true)`

**`setResponse(response)`**
- **Purpose**: Store API response data
- **Parameters**: `response` - Cards data from API
- **Usage**: `this.setResponse(apiResponse)`

**`clearResponse()`**
- **Purpose**: Clear stored response data
- **Usage**: `this.clearResponse()`

**`setImage(imageURL)`**
- **Purpose**: Store uploaded image URL
- **Parameters**: `imageURL` - URL string
- **Usage**: `this.setImage('data:image/jpeg;base64,...')`

#### Usage Example
```jsx
import React from 'react';
import App from './App';

// App is the root component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

#### Routes
- `/` - Main interface for uploading menus
- `/cards` - Display translated menu cards
- `/editmenu` - Menu editing interface

---

## Interface Components

### Interface/index.js

Main interface component for file upload and language selection.

#### Props
```javascript
{
  setResponse: function,  // Callback to store API response
  setUpload: function,    // Callback to set upload state
  setImage: function,     // Callback to store image URL
  history: object         // React Router history object
}
```

#### State
```javascript
{
  file: File,                // Selected file object
  desiredLanguage: string,   // Target language code (default: "en")
  byLine: boolean           // Process by line flag
}
```

#### Usage Example
```jsx
<Interface
  setResponse={this.setResponse}
  setUpload={this.setUpload}
  setImage={this.setImage}
  history={props.history}
/>
```

### SelectFile.js

File selection component with image preview.

#### Props
```javascript
{
  setFile: function,   // Callback to store selected file
  setImage: function   // Callback to store image URL for preview
}
```

#### Features
- File validation (images only)
- Image preview with automatic resizing
- Drag & drop support
- File size optimization

#### Usage Example
```jsx
<SelectFile 
  setFile={(file) => setFile(file)}
  setImage={(url) => setImagePreview(url)}
/>
```

#### Implementation Details
```jsx
const SelectFile = ({ setFile, setImage }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <input 
      type="file" 
      accept="image/*" 
      onChange={handleFileChange}
    />
  );
};
```

### LanguagePicker.js

Language selection dropdown component.

#### Props
```javascript
{
  setLanguage: function  // Callback to set target language
}
```

#### Supported Languages
- English (en)
- Spanish (es)  
- French (fr)
- German (de)
- Chinese Simplified (zh-CN)
- Chinese Traditional (zh-TW)
- Japanese (ja)
- Korean (ko)
- Portuguese (pt)
- Italian (it)
- Russian (ru)
- Arabic (ar)

#### Usage Example
```jsx
<LanguagePicker 
  setLanguage={(lang) => setTargetLanguage(lang)}
/>
```

#### Implementation
```jsx
import { Dropdown } from 'semantic-ui-react';
import supportedLanguages from '../../options/supportedLanguages';

const LanguagePicker = ({ setLanguage }) => {
  const options = supportedLanguages.map(lang => ({
    key: lang.language,
    value: lang.language,
    text: lang.name
  }));

  return (
    <Dropdown
      placeholder="Select Language"
      selection
      options={options}
      onChange={(e, { value }) => setLanguage(value)}
    />
  );
};
```

### UploadToServer.js

Handles file upload to the server and navigation.

#### Props
```javascript
{
  history: object,           // React Router history
  desiredLanguage: string,   // Target language code
  file: File,               // File to upload
  setUpload: function,      // Upload state callback
  setResponse: function,    // Response callback
  byLine: boolean          // Line processing flag
}
```

#### Features
- FormData creation and upload
- Progress indication
- Error handling
- Automatic navigation on success

#### Usage Example
```jsx
<UploadToServer
  history={history}
  desiredLanguage="es"
  file={selectedFile}
  setUpload={setUploadState}
  setResponse={setApiResponse}
  byLine={false}
/>
```

#### Implementation
```jsx
const UploadToServer = (props) => {
  const handleUpload = async () => {
    if (!props.file) return;
    
    props.setUpload(true);
    
    const formData = new FormData();
    formData.append('image', props.file);
    
    try {
      const response = await fetch(`/cards/image/${props.desiredLanguage}`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      props.setResponse(data);
      props.history.push('/cards');
    } catch (error) {
      console.error('Upload failed:', error);
      props.setUpload(false);
    }
  };

  return (
    <Button primary onClick={handleUpload}>
      Translate Menu
    </Button>
  );
};
```

---

## Display Components

### CardContainer.js

Container component that displays translated menu cards.

#### Props
```javascript
{
  menuImage: string,      // Original menu image URL
  setUpload: function,    // Upload state callback
  upload: boolean,        // Current upload state
  response: object,       // API response with cards
  clearResponse: function // Clear response callback
}
```

#### State
```javascript
{
  menuImage: boolean  // Whether to show original menu image
}
```

#### Features
- Loading state management
- Card filtering (food items only)
- Menu image toggle
- Navigation controls

#### Usage Example
```jsx
<CardContainer
  menuImage={imageUrl}
  setUpload={setUploadState}
  upload={isUploading}
  response={apiResponse}
  clearResponse={clearData}
/>
```

#### Implementation Details
```jsx
const CardContainer = (props) => {
  const [showMenuImage, setShowMenuImage] = useState(false);
  
  const foodCards = props.response?.cards
    ?.filter(card => card.isFood)
    ?.map((card, index) => (
      <Grid.Column key={index}>
        <Card card={card} />
      </Grid.Column>
    ));

  if (props.upload && !props.response) {
    return <LoadingMessage />;
  }

  return (
    <div>
      <Button onClick={() => setShowMenuImage(!showMenuImage)}>
        Toggle Menu Image
      </Button>
      
      {showMenuImage && (
        <Image src={props.menuImage} fluid />
      )}
      
      <Grid columns={3} doubling stackable>
        {foodCards}
      </Grid>
    </div>
  );
};
```

### Card.js

Individual menu item card component.

#### Props
```javascript
{
  card: {
    description: object,    // Text blocks {0: "title", 1: "desc", ...}
    translation: object,    // Translations {0: "título", 1: "desc", ...}
    images: string[],      // Array of image URLs
    isFood: number[]       // Array of valid food image indices
  }
}
```

#### State
```javascript
{
  imageIndex: number,  // Current image index
  imageURL: string     // Current image URL
}
```

#### Features
- Multiple image cycling
- Translation display
- Responsive design
- Image validation

#### Usage Example
```jsx
<Card 
  card={{
    description: {0: "Pasta Carbonara", 1: "With bacon and cream"},
    translation: {0: "Pasta Carbonara", 1: "Con tocino y crema"},
    images: ["url1.jpg", "url2.jpg"],
    isFood: [0, 1]
  }}
/>
```

#### Implementation
```jsx
const Card = ({ card }) => {
  const [imageIndex, setImageIndex] = useState(0);
  const [imageURL, setImageURL] = useState('');

  useEffect(() => {
    if (card.isFood && card.isFood.length > 0) {
      setImageURL(card.images[card.isFood[0]]);
    }
  }, [card]);

  const nextImage = () => {
    const validIndexes = card.isFood;
    const nextIndex = (imageIndex + 1) % validIndexes.length;
    setImageIndex(nextIndex);
    setImageURL(card.images[validIndexes[nextIndex]]);
  };

  const renderDetails = () => {
    return Object.keys(card.description)
      .filter(key => key !== "0")
      .map((key, index) => (
        <div key={index}>
          <Card.Description>
            {card.description[key]}
          </Card.Description>
          <Card.Meta>
            ({card.translation?.[key] || "No translation"})
          </Card.Meta>
        </div>
      ));
  };

  return (
    <Card fluid>
      <div style={{ maxHeight: "300px", overflow: "hidden" }}>
        <Image src={imageURL} fluid />
      </div>
      
      <Button fluid onClick={nextImage}>
        Get a different image
      </Button>
      
      <Card.Content>
        <Card.Header>{card.description[0]}</Card.Header>
        <Card.Meta>
          ({card.translation?.[0] || "No translation"})
        </Card.Meta>
        {renderDetails()}
      </Card.Content>
    </Card>
  );
};
```

---

## Layout Components

### Layout.js

Common layout wrapper component.

#### Props
```javascript
{
  children: ReactNode  // Child components to render
}
```

#### Features
- Consistent header/footer
- Responsive container
- Global styling

#### Usage Example
```jsx
<Layout>
  <MainContent />
</Layout>
```

### Menu.js

Navigation menu component.

#### Features
- Route navigation
- Active state indication
- Responsive design

#### Usage Example
```jsx
<Menu>
  <Menu.Item as={Link} to="/">Home</Menu.Item>
  <Menu.Item as={Link} to="/cards">Cards</Menu.Item>
</Menu>
```

---

## Advanced Components

### MenuEditor.js

Advanced menu editing interface component.

#### Props
```javascript
{
  menuImage: string  // Original menu image URL
}
```

#### Features
- Image annotation
- Text editing
- Translation management
- Export functionality

#### Usage Example
```jsx
<MenuEditor 
  menuImage={originalImageUrl}
/>
```

### MenuLayout.js

Layout component for menu editing interface.

#### Features
- Split-pane layout
- Resizable panels
- Tool panels

---

## Utility Components

### helpers/srcToFile.js

Utility function to convert image src to File object.

#### Function: `srcToFile(src, fileName, mimeType)`

**Parameters**:
- `src` (string): Image data URL or blob URL
- `fileName` (string): Desired file name
- `mimeType` (string): MIME type (default: 'image/jpeg')

**Returns**: Promise resolving to File object

**Usage Example**:
```javascript
import srcToFile from './helpers/srcToFile';

const convertImageToFile = async (imageDataUrl) => {
  const file = await srcToFile(imageDataUrl, 'menu.jpg', 'image/jpeg');
  return file;
};
```

---

## State Management

### Global State Flow

```
App.js (Root State)
├── upload: boolean
├── response: object
└── image: string
    │
    ├── Interface/ (Upload Flow)
    │   ├── SelectFile
    │   ├── LanguagePicker
    │   └── UploadToServer
    │
    └── CardContainer (Display Flow)
        └── Card[]
```

### Props Drilling Pattern

```jsx
// App.js
<Interface 
  setResponse={this.setResponse}
  setUpload={this.setUpload}
  setImage={this.setImage}
/>

// Interface/index.js
<UploadToServer
  setUpload={props.setUpload}
  setResponse={props.setResponse}
  // ... other props
/>
```

### State Update Flow

1. User selects file → `setFile()` → `Interface` state
2. User selects language → `setLanguage()` → `Interface` state  
3. User clicks upload → `UploadToServer` → API call
4. API response → `setResponse()` → `App` state
5. Navigation → `/cards` → `CardContainer` renders

---

## Event Handling

### File Upload Events
```jsx
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    setFile(file);
    createImagePreview(file);
  } else {
    alert('Please select a valid image file');
  }
};
```

### Form Submission
```jsx
const handleSubmit = async (event) => {
  event.preventDefault();
  
  if (!file || !language) {
    setError('Please select a file and language');
    return;
  }
  
  try {
    setLoading(true);
    await uploadFile(file, language);
  } catch (error) {
    setError('Upload failed');
  } finally {
    setLoading(false);
  }
};
```

### Image Cycling
```jsx
const cycleImage = () => {
  const validImages = card.isFood;
  const currentIndex = validImages.indexOf(activeImageIndex);
  const nextIndex = (currentIndex + 1) % validImages.length;
  setActiveImageIndex(validImages[nextIndex]);
};
```

---

## Performance Optimization

### Memoization
```jsx
import React, { memo, useMemo } from 'react';

const Card = memo(({ card }) => {
  const translationText = useMemo(() => {
    return card.translation?.[0] || 'No translation available';
  }, [card.translation]);

  return (
    <div>
      <h3>{card.description[0]}</h3>
      <p>{translationText}</p>
    </div>
  );
});
```

### Lazy Loading
```jsx
import { lazy, Suspense } from 'react';

const MenuEditor = lazy(() => import('./MenuEditor'));

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <MenuEditor />
  </Suspense>
);
```

### Image Optimization
```jsx
const optimizeImage = (file, maxWidth = 800) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(resolve, 'image/jpeg', 0.8);
    };
    
    img.src = URL.createObjectURL(file);
  });
};
```

---

## Testing Components

### Unit Testing with Jest
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Card from '../Card';

describe('Card Component', () => {
  const mockCard = {
    description: { 0: 'Test Dish' },
    translation: { 0: 'Plato de Prueba' },
    images: ['test.jpg'],
    isFood: [0]
  };

  test('renders card with description', () => {
    render(<Card card={mockCard} />);
    expect(screen.getByText('Test Dish')).toBeInTheDocument();
  });

  test('cycles through images', () => {
    render(<Card card={mockCard} />);
    const button = screen.getByText('Get a different image');
    fireEvent.click(button);
    // Assert image change
  });
});
```

### Integration Testing
```jsx
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

test('full upload flow', async () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  
  // Simulate file upload
  const fileInput = screen.getByLabelText(/upload/i);
  const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
  fireEvent.change(fileInput, { target: { files: [file] } });
  
  // Wait for processing
  await waitFor(() => {
    expect(screen.getByText(/cards/i)).toBeInTheDocument();
  });
});
```