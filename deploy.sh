#!/bin/bash

# VPB.CredAI Deployment Script
# This script handles merging clean code from dev to main for production deployment

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 VPB.CredAI Deployment Script${NC}"
echo "=================================="

# Check if we're on dev branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "dev" ]; then
    echo -e "${RED}❌ Error: You must be on the dev branch to run this script${NC}"
    echo "Current branch: $CURRENT_BRANCH"
    exit 1
fi

# Check if working directory is clean
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${RED}❌ Error: Working directory is not clean. Please commit or stash changes first.${NC}"
    git status --short
    exit 1
fi

# Fetch latest changes
echo -e "${YELLOW}📥 Fetching latest changes...${NC}"
git fetch origin

# Check if dev branch is up to date with origin
DEV_BEHIND=$(git rev-list --count HEAD..origin/dev)
if [ "$DEV_BEHIND" -gt 0 ]; then
    echo -e "${RED}❌ Error: Dev branch is behind origin/dev. Please pull latest changes first.${NC}"
    echo "Run: git pull origin dev"
    exit 1
fi

# Run tests (if they exist)
if [ -f "package.json" ] && npm run test --if-present > /dev/null 2>&1; then
    echo -e "${YELLOW}🧪 Running tests...${NC}"
    npm test
fi

# Build the project to ensure it compiles
echo -e "${YELLOW}🔨 Building project to verify...${NC}"
npm run build

# Switch to main branch
echo -e "${YELLOW}🔄 Switching to main branch...${NC}"
git checkout main

# Pull latest main
echo -e "${YELLOW}📥 Pulling latest main branch...${NC}"
git pull origin main

# Merge dev into main
echo -e "${YELLOW}🔀 Merging dev into main...${NC}"
git merge dev --no-ff -m "chore: merge dev to main for production deployment

- Authentication improvements with automatic silent renewal
- Enhanced user experience and error handling
- Clean production code without debugging
- Improved OIDC configuration for AWS Cognito"

# Push to main
echo -e "${YELLOW}📤 Pushing to main branch...${NC}"
git push origin main

# Switch back to dev
echo -e "${YELLOW}🔄 Switching back to dev branch...${NC}"
git checkout dev

# Push dev branch as well
echo -e "${YELLOW}📤 Pushing dev branch...${NC}"
git push origin dev

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo "=================================="
echo -e "${BLUE}📋 Summary:${NC}"
echo "• Dev branch merged to main"
echo "• Main branch pushed to origin"
echo "• Dev branch pushed to origin"
echo "• AWS Amplify will automatically deploy main branch to production"
echo ""
echo -e "${YELLOW}🔗 Next steps:${NC}"
echo "1. Monitor the Amplify console for deployment status"
echo "2. Test the production deployment"
echo "3. Continue development on dev branch"
echo ""
echo -e "${BLUE}🛠️  Development workflow:${NC}"
echo "• Work on features in dev branch"
echo "• Test thoroughly before running this deployment script"
echo "• Use this script to deploy to production" 