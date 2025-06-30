#!/bin/bash

# Script to update nginx configuration for large file uploads
# Run this script with sudo privileges

echo "Updating nginx configuration for large file uploads..."

# Backup existing configuration
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup.$(date +%Y%m%d_%H%M%S)

# Check if client_max_body_size is already set
if grep -q "client_max_body_size" /etc/nginx/sites-available/default; then
    echo "client_max_body_size already exists, updating..."
    sudo sed -i 's/client_max_body_size.*/client_max_body_size 200M;/' /etc/nginx/sites-available/default
else
    echo "Adding client_max_body_size to nginx configuration..."
    # Add client_max_body_size inside server block
    sudo sed -i '/server {/a\    client_max_body_size 200M;' /etc/nginx/sites-available/default
fi

# Add other necessary settings if they don't exist
settings=(
    "client_body_timeout 300s;"
    "client_header_timeout 300s;"
    "proxy_connect_timeout 300s;"
    "proxy_send_timeout 300s;"
    "proxy_read_timeout 300s;"
    "send_timeout 300s;"
    "client_body_buffer_size 1M;"
    "client_header_buffer_size 1M;"
    "large_client_header_buffers 4 1M;"
)

for setting in "${settings[@]}"; do
    setting_name=$(echo $setting | cut -d' ' -f1)
    if ! grep -q "$setting_name" /etc/nginx/sites-available/default; then
        echo "Adding $setting_name..."
        sudo sed -i "/client_max_body_size/a\    $setting" /etc/nginx/sites-available/default
    fi
done

# Test nginx configuration
echo "Testing nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    echo "Configuration test passed. Reloading nginx..."
    sudo systemctl reload nginx
    echo "Nginx configuration updated successfully!"
    echo ""
    echo "Current settings:"
    echo "- Maximum file size: 200MB"
    echo "- Timeouts: 300 seconds"
    echo "- Buffer sizes: 1MB"
    echo ""
    echo "You can now upload files up to 200MB."
else
    echo "Configuration test failed. Please check the nginx configuration manually."
    echo "Restoring backup..."
    sudo cp /etc/nginx/sites-available/default.backup.$(date +%Y%m%d)* /etc/nginx/sites-available/default
fi 