#!/bin/sh

# Fix permission for Laravel folders
chown -R www-data:www-data storage bootstrap/cache database
chmod -R 775 storage bootstrap/cache database
chmod 664 database/database.sqlite

# Jalankan PHP-FPM
exec php-fpm
