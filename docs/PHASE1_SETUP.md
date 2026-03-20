# Phase 1: Infrastructure Setup Script

## Prerequisites Check
- [ ] 4GB+ RAM VPS (DigitalOcean, Linode, AWS, etc.)
- [ ] Domain pointed to server IP
- [ ] SSH access to server

## Run on Server

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 3. Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 4. Install Nginx
sudo apt install nginx certbot python3-certbot-nginx -y

# 5. Clone your project
git clone https://github.com/your-repo/dropship-pro.git
cd dropship-pro

# 6. Set up environment
cp config/env.template .env
nano .env  # Fill in your values

# 7. Generate SSL certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 8. Start the stack
docker-compose up -d

# 9. Check status
docker-compose ps
```

## Verify Services

```bash
# Check all containers
docker-compose ps

# View logs
docker-compose logs -f

# Check health
curl http://localhost:9000/health
curl http://localhost:3000
```
