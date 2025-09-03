# RangMantra API Integration

## Overview
The RangMantra frontend now integrates with a real colorization API that uses Google's Gemini AI model to transform black and white photos into color.

## API Endpoints

### 1. Upload Image
- **Endpoint**: `POST /v1/colorize/upload`
- **Content-Type**: `multipart/form-data`
- **Parameters**:
  - `file`: The black and white image file
  - `user_id`: User's unique identifier
  - `user_email`: User's email (optional)
- **Response**: Returns a `request_id` for tracking

### 2. Check Status
- **Endpoint**: `GET /v1/colorize/status/{request_id}`
- **Response**: Returns the current status and URLs

## Implementation Details

### File Upload Flow
1. User selects a photo via `FileUpload` component
2. `handleFileSelect` function is triggered
3. Image is uploaded to the colorization API
4. Status polling begins every 1 second
5. UI updates based on processing status
6. Colorized image is displayed when complete

### Status Polling
The application polls the status endpoint every 1 second with safety limits:
- **Polling Interval**: 1 second
- **Maximum Retries**: 60 attempts (1 minute)
- **Total Timeout**: 60 seconds
- **Stop Conditions**:
  - Status becomes `complete` → Show colorized image
  - Status becomes `failed` → Show error message
  - Maximum retries reached → Show timeout error
  - Total timeout exceeded → Show timeout error
  - Network error occurs → Show error message

### Environment Variables
```env
VITE_API_BASE_URL="http://localhost:8000"
VITE_SUPABASE_PROJECT_ID="your-project-id"
VITE_SUPABASE_PUBLISHABLE_KEY="your-publishable-key"
VITE_SUPABASE_URL="your-supabase-url"
```

## Error Handling
- Upload failures show toast notifications
- Processing failures are handled gracefully
- Network errors are caught and displayed
- Timeout errors prevent infinite polling
- User can retry by uploading a new photo
- Processing time is displayed after 30 seconds

## UI States
1. **Upload**: User can select a photo
2. **Processing**: Shows progress with status updates
3. **Complete**: Displays before/after comparison

## Testing
To test the integration:
1. Start the backend API server on port 8000
2. Start the frontend with `npm run dev`
3. Upload a black and white image
4. Watch the real-time processing status
5. View the colorized result
