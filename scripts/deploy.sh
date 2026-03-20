#!/bin/bash

# DropshipPro Deployment Script
# Run as: sudo bash deploy.sh

set -e

echo "🚀 Starting DropshipPro Deployment..."

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root${NC}"
    exit 1
fi

# Update system
echo -e "${YELLOW}Updating system...${NC}"
apt update && apt upgrade -y

# Install Docker
echo -e "${YELLOW}Installing Docker...${NC}"
curl -fsSL https://get.docker.com | sh
usermod -aG docker $USER

# Install Docker Compose
echo -e "${YELLOW}Installing Docker Compose...${NC}"
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Install Nginx & Certbot
echo -e "${YELLOW}Installing Nginx & Certbot...${NC}"
apt install nginx certbot python3-certbot-nginx -y

# Clone repository
echo -e "${YELLOW}Cloning repository...${NC}"
cd /opt
git clone https://github.com/AGENT33-BOT/DROPSHIP.git dropshippro
cd dropshippro

# Create environment file
echo -e "${YELLOW}Creating environment file...${NC}"
cp config/env.template .env

# Edit .env with your values
echo -e "${RED}⚠️  Please edit .env with your API keys before continuing!${NC}"
echo -e "${YELLOW}Run: nano .env${NC}"
echo -e "${YELLOW}Then run: docker-compose up -d${NC}"

# Generate SSL certificate
read -p "Enter your domain name (e.g., dropshippro.com): " DOMAIN
if [ -n "$DOMAIN" ]; then
    echo -e "${YELLOW}Generating SSL certificate...${NC}"
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
fi

# Create docker network
echo -e "${YELLOW}Creating Docker network...${NC}"
docker network create dropship-network 2>/dev/null || true

# Start services
echo -e "${YELLOW}Starting services...${NC}"
docker-compose up -d

# Show status
echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "Services:"
docker-compose ps
echo ""
echo "View logs: docker-compose logs -f"
echo "Stop: docker-compose down"
