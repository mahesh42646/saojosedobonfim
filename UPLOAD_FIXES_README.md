# Upload Issues Fix - Complete Solution

This document outlines all the fixes applied to resolve the upload issues you were experiencing.

## Issues Fixed

### 1. 413 Request Entity Too Large Error
**Problem**: Server was rejecting large file uploads due to size limits
**Solution**: Removed all file size restrictions

### 2. Profile Photo Display Issues
**Problem**: Profile photos showing alt text instead of actual images
**Solution**: Fixed image path construction and added error handling

### 3. File Size Restrictions
**Problem**: Forms had unnecessary file size limits
**Solution**: Removed all file size checks to allow unlimited uploads

## Changes Made

### Backend Changes (`backend/`)

1. **`routes.js`**:
   - Removed multer file size limits (`fileSize: 150MB` limit removed)
   - Removed multer file count limits (`maxCount` restrictions removed)
   - Updated error handling to remove size-related errors

2. **`server.js`**:
   - Removed Express body parser size limits
   - Removed 413 error handling from global error handler

### Frontend Changes (`src/`)

1. **`src/app/agent/painel/components/profile.js`**:
   - Fixed profile photo path construction with `.trim()`
   - Added error handling for failed image loads
   - Changed fallback image to `placeholder-Avatar.png`

2. **`src/app/agent/painel/components/PublicProfileModal.js`**:
   - Fixed profile photo and gallery image path construction
   - Added error handling for failed image loads
   - Added logging for debugging image load failures

3. **`src/app/agent/painel/components/new-project-form.js`**:
   - Removed file size validation checks
   - Removed file size limit alerts

### Nginx Configuration

1. **`nginx_saojosedobonfim_config.conf`** (NEW FILE):
   - Set `client_max_body_size 0` for unlimited uploads
   - Increased all timeout values for large file processing
   - Disabled proxy buffering for large files
   - Configured for `mapacultural.saojosedobonfim.pb.gov.br` domain

2. **`update_nginx_unlimited.sh`** (NEW FILE):
   - Automated script to apply nginx configuration
   - Backs up existing configuration
   - Tests and reloads nginx safely

## Deployment Instructions

### 1. Backend Changes
The backend changes are already applied. You need to restart your backend server:

```bash
cd backend
pm2 restart server  # or however you manage your backend process
```

### 2. Frontend Changes
The frontend changes are already applied. You need to rebuild and restart your frontend:

```bash
npm run build
pm2 restart nextjs  # or however you manage your frontend process
```

### 3. Nginx Configuration
Apply the new nginx configuration to fix the 413 errors:

```bash
# Make the script executable
chmod +x update_nginx_unlimited.sh

# Run the script (requires sudo)
sudo ./update_nginx_unlimited.sh
```

Or manually:
```bash
# Copy the new configuration
sudo cp nginx_saojosedobonfim_config.conf /etc/nginx/sites-available/mapacultural.saojosedobonfim.pb.gov.br

# Test the configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
```

## Testing the Fixes

### 1. Test Profile Photo Upload
1. Go to Agent Panel → Profile
2. Click the camera icon or "Perfil Público"
3. Upload a profile photo of any size
4. Verify the photo displays correctly (not alt text)

### 2. Test Gallery Photos
1. In the Public Profile modal
2. Enable "Galeria de fotos"
3. Upload multiple large images
4. Verify all images display correctly

### 3. Test Large File Upload
1. Try uploading files larger than 150MB
2. Should now work without 413 errors

## Key Technical Details

- **File Size**: No limits (was 150MB limit)
- **File Count**: No limits (was limited to specific counts)
- **Nginx**: `client_max_body_size 0` means unlimited
- **Image Paths**: Now properly trimmed and validated
- **Error Handling**: Added for graceful fallbacks

## Troubleshooting

### If 413 errors persist:
1. Verify nginx configuration is applied: `sudo nginx -t`
2. Check if nginx was reloaded: `sudo systemctl status nginx`
3. Verify backend server was restarted

### If profile photos show alt text:
1. Check browser console for image loading errors
2. Verify the uploads directory is accessible
3. Check file permissions on uploaded images

### If uploads fail silently:
1. Check backend logs for multer errors
2. Verify disk space is available
3. Check file permissions on uploads directory

## Support

All changes maintain backward compatibility. Existing uploaded files will continue to work normally. The fixes only remove restrictions and improve error handling. 