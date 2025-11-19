# Render Deployment Guide for EduAdminHub Exam Portal

## Issues Fixed

1. **Build Script**: Removed `--turbopack` flag from build command (Render doesn't support it)
2. **Output Mode**: Added `output: "standalone"` to `next.config.ts` for optimized deployment
3. **Port Configuration**: Render automatically sets PORT environment variable

## Render Configuration

### Option 1: Using Render Dashboard

1. Go to your Render dashboard
2. Select your web service
3. Go to **Settings**
4. Update the following:

   **Build Command:**
   ```bash
   npm install && npm run build
   ```

   **Start Command:**
   ```bash
   npm start
   ```

   **Environment Variables:**
   - `NODE_ENV`: `production`
   - `PORT`: (auto-set by Render)

### Option 2: Using render.yaml (Recommended)

The `render.yaml` file has been created in the root directory. Render will automatically detect it if:
- Your repository is connected to Render
- Auto-deploy is enabled

If not working, manually update settings in Render dashboard.

## Common Issues & Solutions

### Issue 1: 404 Not Found
**Cause**: Build not completing or routes not properly configured

**Solution**:
1. Check build logs in Render dashboard
2. Ensure all dependencies are installed
3. Verify `src/app/page.tsx` exists
4. Check middleware is not blocking root route

### Issue 2: Build Fails
**Cause**: Turbopack flag or TypeScript errors

**Solution**:
- Turbopack flag has been removed from build script
- TypeScript errors are ignored during build (can be changed later)

### Issue 3: Port Issues
**Cause**: Next.js not using Render's PORT

**Solution**:
- Next.js automatically uses PORT environment variable
- Render sets PORT automatically
- No manual configuration needed

## Testing Locally

To test the production build locally:

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start
```

The server will start on `http://localhost:3000` (or the PORT env variable if set).

## Verification Checklist

- [ ] Build completes without errors
- [ ] Root route (`/`) is accessible
- [ ] `/login` route works
- [ ] `/exam-portal/dashboard` redirects to login if not authenticated
- [ ] Static files are served correctly
- [ ] Environment variables are set in Render

## Next Steps

1. Commit and push these changes:
   ```bash
   git add .
   git commit -m "Fix Render deployment configuration"
   git push
   ```

2. Go to Render dashboard and trigger a new deployment

3. Check build logs to ensure successful build

4. Test the deployed URL

## Support

If issues persist:
1. Check Render build logs
2. Verify all environment variables are set
3. Ensure Node.js version matches (check `.nvmrc` or package.json engines)
4. Check Render service health status

