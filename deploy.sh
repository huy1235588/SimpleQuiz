#!/bin/bash

# Deploy script for SimpleQuiz on DigitalOcean Droplet
# Usage: ./deploy.sh [production|staging]

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
DROPLET_IP="your_droplet_ip"  # Thay đổi IP của bạn
DROPLET_USER="root"
DEPLOY_PATH="/var/www/simplequiz_build"
APP_PATH="/var/www/simplequiz"

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}  SimpleQuiz Deployment Script${NC}"
echo -e "${GREEN}=====================================${NC}"
echo ""

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo -e "${YELLOW}Build folder not found. Building application...${NC}"
    npm run build
fi

echo -e "${GREEN}✓ Build completed${NC}"
echo ""

# Create backup on server
echo -e "${YELLOW}Creating backup on server...${NC}"
ssh ${DROPLET_USER}@${DROPLET_IP} << 'ENDSSH'
    if [ -d "/var/www/simplequiz_build" ]; then
        timestamp=$(date +%Y%m%d_%H%M%S)
        tar -czf /var/backups/simplequiz_backup_${timestamp}.tar.gz /var/www/simplequiz_build 2>/dev/null || true
        echo "Backup created: simplequiz_backup_${timestamp}.tar.gz"
        
        # Keep only last 5 backups
        cd /var/backups
        ls -t simplequiz_backup_*.tar.gz | tail -n +6 | xargs -r rm
    fi
ENDSSH

echo -e "${GREEN}✓ Backup completed${NC}"
echo ""

# Upload files to server
echo -e "${YELLOW}Uploading files to server...${NC}"
rsync -avz --delete \
    --exclude 'node_modules' \
    --exclude '.git' \
    --exclude '.env' \
    dist/ ${DROPLET_USER}@${DROPLET_IP}:${DEPLOY_PATH}/

echo -e "${GREEN}✓ Files uploaded${NC}"
echo ""

# Set correct permissions
echo -e "${YELLOW}Setting permissions...${NC}"
ssh ${DROPLET_USER}@${DROPLET_IP} << 'ENDSSH'
    chmod -R 755 /var/www/simplequiz_build
    chown -R www-data:www-data /var/www/simplequiz_build
ENDSSH

echo -e "${GREEN}✓ Permissions set${NC}"
echo ""

# Reload Nginx
echo -e "${YELLOW}Reloading Nginx...${NC}"
ssh ${DROPLET_USER}@${DROPLET_IP} << 'ENDSSH'
    nginx -t && systemctl reload nginx
ENDSSH

echo -e "${GREEN}✓ Nginx reloaded${NC}"
echo ""

# Test deployment
echo -e "${YELLOW}Testing deployment...${NC}"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://${DROPLET_IP})

if [ "$HTTP_STATUS" -eq 200 ]; then
    echo -e "${GREEN}✓ Deployment successful! Application is running.${NC}"
else
    echo -e "${RED}✗ Deployment may have issues. HTTP Status: ${HTTP_STATUS}${NC}"
    echo -e "${YELLOW}Check logs: ssh ${DROPLET_USER}@${DROPLET_IP} 'tail -f /var/log/nginx/error.log'${NC}"
fi

echo ""
echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo -e "${GREEN}=====================================${NC}"
echo -e "Access your application at: ${GREEN}http://${DROPLET_IP}${NC}"
echo ""
