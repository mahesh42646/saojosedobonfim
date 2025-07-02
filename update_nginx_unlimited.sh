#!/bin/bash

# Script to update nginx configuration for unlimited file uploads
# This script should be run with sudo privileges

NGINX_CONFIG="/etc/nginx/sites-available/mapacultural.saojosedobonfim.pb.gov.br"
NGINX_ENABLED="/etc/nginx/sites-enabled/mapacultural.saojosedobonfim.pb.gov.br"

# Backup existing configuration
if [ -f "$NGINX_CONFIG" ]; then
    echo "Backing up existing nginx configuration..."
    sudo cp "$NGINX_CONFIG" "$NGINX_CONFIG.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Copy new configuration
echo "Installing new nginx configuration..."
sudo cp "./nginx_saojosedobonfim_config.conf" "$NGINX_CONFIG"

# Enable the site if not already enabled
if [ ! -L "$NGINX_ENABLED" ]; then
    echo "Enabling the site..."
    sudo ln -s "$NGINX_CONFIG" "$NGINX_ENABLED"
fi

# Test nginx configuration
echo "Testing nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "Configuration test passed. Reloading nginx..."
    sudo systemctl reload nginx
    echo "Nginx configuration updated successfully!"
    echo ""
    echo "Key changes made:"
    echo "- client_max_body_size set to 0 (unlimited)"
    echo "- Increased timeouts for large file uploads"
    echo "- Disabled proxy buffering for large files"
    echo ""
    echo "You can now upload files of any size!"
else
    echo "Configuration test failed. Please check the nginx configuration."
    exit 1
fi 