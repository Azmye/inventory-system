#!/bin/bash

# Make the script executable on Render
# chmod +x deploy.sh

# Create SQLite database if it doesn't exist
if [ ! -f /data/database.sqlite ]; then
    echo "Creating new SQLite database..."
    touch /data/database.sqlite
    php artisan migrate --force
    php artisan db:seed --force
else
    echo "SQLite database exists, running migrations..."
    php artisan migrate --force
fi

# Set proper permissions
chmod -R 775 /data
chmod -R 775 storage bootstrap/cache
