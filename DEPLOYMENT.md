# VPB.CredAI Deployment Guide

This guide explains how to properly deploy the VPB.CredAI application from development to production.

## Branch Strategy

- **`dev`** - Development branch for active development and testing
- **`main`** - Production branch that triggers automatic deployment via AWS Amplify

## Deployment Workflow

### 1. Development Process

1. **Work on features in `dev` branch**
   ```bash
   git checkout dev
   git pull origin dev
   # Make your changes
   git add .
   git commit -m "feat: your feature description"
   ```

2. **Test thoroughly**
   ```bash
   npm run dev    # Test locally
   npm run build  # Ensure it builds successfully
   ```

### 2. Production Deployment

#### Option A: Automated Deployment Script (Recommended)

Use the provided deployment script for a safe, automated deployment:

```bash
# Ensure you're on dev branch with clean working directory
git checkout dev
git status  # Should show clean working directory

# Run the deployment script
./deploy.sh
```

The script will:
- ✅ Verify you're on dev branch
- ✅ Check working directory is clean
- ✅ Fetch latest changes
- ✅ Run tests (if available)
- ✅ Build project to verify
- ✅ Merge dev to main with proper commit message
- ✅ Push both branches to origin
- ✅ Switch back to dev branch

#### Option B: Manual Deployment

If you prefer manual control:

```bash
# 1. Ensure dev branch is ready
git checkout dev
git pull origin dev
npm run build  # Verify build works

# 2. Switch to main and merge
git checkout main
git pull origin main
git merge dev --no-ff -m "chore: merge dev to main for production deployment"

# 3. Push to trigger deployment
git push origin main

# 4. Switch back to dev
git checkout dev
git push origin dev  # Keep dev branch updated
```

## AWS Amplify Configuration

The `amplify.yml` file is configured to:
- Automatically deploy `main` branch to production
- Handle environment-specific builds
- Set security headers
- Configure proper caching

### Environment Variables

Make sure these are set in AWS Amplify Console:

**Production (main branch):**
- `VITE_COGNITO_AUTHORITY`
- `VITE_COGNITO_CLIENT_ID`
- `VITE_COGNITO_CLIENT_SECRET`
- `VITE_AMPLIFY_DOMAIN`
- `VITE_AMPLIFY_SIGN_OUT`

**Development (dev branch):**
- Same variables but with development values

## Key Features Implemented

### Authentication Improvements
- ✅ Automatic silent token renewal
- ✅ Proper session persistence across tabs
- ✅ Enhanced error handling
- ✅ Loading states for better UX
- ✅ Clean production code (no debugging logs)

### Configuration Enhancements
- ✅ Optimized OIDC client configuration
- ✅ AWS Cognito compatibility improvements
- ✅ Proper token storage management
- ✅ Silent authentication for seamless user experience

## Troubleshooting

### Common Issues

1. **Authentication persists showing login page**
   - Ensure `automaticSilentRenew: true` is enabled
   - Check that `silent_redirect_uri` matches your domain
   - Verify Cognito app client settings

2. **Build fails**
   - Run `npm install` to ensure dependencies are installed
   - Check for TypeScript errors: `npm run type-check`
   - Verify environment variables are set

3. **Deployment fails**
   - Check AWS Amplify console for detailed error logs
   - Verify branch settings in Amplify console
   - Ensure environment variables are properly configured

### Debug Mode

If you need to temporarily enable debugging for troubleshooting:

```typescript
// In main.tsx, add temporary console.log
console.log("Auth config:", { authority, client_id, redirect_uri });

// In components, add state logging
console.log("Auth state:", { isAuthenticated, isLoading, error });
```

**Important:** Remove debugging code before production deployment!

## Security Considerations

- 🔒 Never commit sensitive environment variables
- 🔒 Use proper HTTPS endpoints for all Cognito URLs
- 🔒 Regularly rotate client secrets
- 🔒 Monitor authentication logs for suspicious activity

## Monitoring

After deployment:
1. Check AWS Amplify console for build status
2. Test authentication flow on production
3. Monitor error logs in browser console
4. Verify session persistence works correctly

## Development Guidelines

- Always work on `dev` branch for new features
- Test thoroughly before deployment
- Use the deployment script for consistency
- Keep `main` branch clean and production-ready
- Document any configuration changes

## Support

For deployment issues:
1. Check this guide first
2. Review AWS Amplify console logs
3. Test locally with production configuration
4. Contact the development team if issues persist

---

**Remember:** The `main` branch should always be deployment-ready. Never push untested code directly to `main`. 