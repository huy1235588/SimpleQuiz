#!/bin/bash

# Quick setup script for DigitalOcean Droplet
# Run this script on your droplet after first login

set -e

echo "======================================"
echo "  SimpleQuiz Server Setup"
echo "======================================"
echo ""

# Update system
echo "Updating system..."
apt update && apt upgrade -y

# Install Nginx
echo "Installing Nginx..."
apt install nginx -y
systemctl start nginx
systemctl enable nginx

# Install Node.js 18
echo "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install Git
echo "Installing Git..."
apt install git -y

# Create directories
echo "Creating directories..."
mkdir -p /var/www/simplequiz_build
mkdir -p /var/backups

# Configure firewall
echo "Configuring firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
echo "y" | ufw enable

# Set up Nginx configuration
echo "Setting up Nginx..."
cat > /etc/nginx/sites-available/simplequiz << 'EOF'
server {
    listen 80;
    listen [::]:80;
    
    server_name _;
    
    root /var/www/simplequiz_build;
    index index.html;

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    location ~* \.json$ {
        add_header Cache-Control "no-cache";
        add_header Content-Type "application/json";
    }

    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }

    access_log /var/log/nginx/simplequiz_access.log;
    error_log /var/log/nginx/simplequiz_error.log;
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/simplequiz /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test and reload Nginx
nginx -t
systemctl reload nginx

echo ""
echo "======================================"
echo "  Setup Complete!"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Upload your build files to: /var/www/simplequiz_build"
echo "2. Or use the deploy.sh script from your local machine"
echo ""
echo "Server IP: $(curl -s ifconfig.me)"
echo ""
echo "To deploy from local machine, update deploy.sh with this IP and run:"
echo "  chmod +x deploy.sh"
echo "  ./deploy.sh"
echo ""
