# External Data Configuration Guide

## Overview
The panoramic X-ray tooth detection app now supports loading tooth data from external sources without requiring app rebuilds. This is perfect for dynamic content management with separate S3 buckets or other external hosting.

## Configuration File
The app reads data source configuration from `/public/config/data-config.json`:

```json
{
  "dataConfig": {
    "sources": [
      {
        "name": "External S3 Bucket",
        "url": "https://your-data-bucket.s3.amazonaws.com/tooth-areas.json",
        "description": "External S3 bucket for tooth data",
        "enabled": true
      },
      {
        "name": "Same Bucket Subfolder", 
        "url": "https://your-main-bucket.s3.amazonaws.com/data/tooth-areas.json",
        "description": "Same S3 bucket as your app, different subfolder",
        "enabled": false
      },
      {
        "name": "Local Static File",
        "url": "/data/tooth-areas.json",
        "description": "Local static file (requires rebuild to update)",
        "enabled": false
      }
    ],
    "fallbackToLocalStorage": true,
    "corsMode": "cors"
  }
}
```

## Data Loading Priority
1. **External Sources**: Tries each enabled source in order
2. **LocalStorage Fallback**: If no external data found
3. **Fresh Start**: If no data anywhere

## Setup Workflows

### Option 1: Separate S3 Bucket (Recommended)
```bash
# 1. Create a separate S3 bucket for data
aws s3 mb s3://your-tooth-data-bucket

# 2. Configure CORS for your main app domain
aws s3api put-bucket-cors --bucket your-tooth-data-bucket --cors-configuration file://cors-config.json

# 3. Update data-config.json with your bucket URL
# 4. Export tooth data from app
# 5. Upload JSON file to data bucket
aws s3 cp tooth-areas-2025-06-11.json s3://your-tooth-data-bucket/tooth-areas.json

# 6. Click "Refresh Data" in app - no rebuild needed!
```

### Option 2: Same Bucket, Different Path
```bash
# 1. Export tooth data from app
# 2. Upload to subfolder in your main bucket
aws s3 cp tooth-areas-2025-06-11.json s3://your-main-bucket/data/tooth-areas.json

# 3. Update data-config.json to enable this source
# 4. Click "Refresh Data" in app
```

## CORS Configuration Example
Create `cors-config.json` for your data bucket:

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://your-app-domain.com"],
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

## Benefits
- ✅ **No App Rebuilds**: Update tooth data without touching app code
- ✅ **Separate Buckets**: Keep app and data in different S3 buckets
- ✅ **Multiple Sources**: Configure fallback data sources
- ✅ **Real-time Updates**: Click refresh to get latest data instantly
- ✅ **CORS Ready**: Properly configured for cross-origin requests
- ✅ **Cache Busting**: Always fetches fresh data
- ✅ **Fallback System**: Graceful degradation if external sources fail

## App Features
- **🔄 Refresh Data**: Manual refresh button to reload from external sources
- **📁 Export Data**: Download tooth data as JSON for uploading
- **📂 Import Data**: Local file import for testing
- **🗑️ Clear All**: Reset all data

## Console Logging
The app provides detailed console logging to help debug data loading:
- ✅ Successful loads with source name and count
- ❌ Failed attempts with error details  
- 📁 Empty data sources
- 🆕 Fresh start indicators
- 📱 LocalStorage fallback usage
