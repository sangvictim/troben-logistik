# Gunakan base image PHP
FROM php:8.4-fpm

# Install sistem dependencies
RUN apt-get update && apt-get install -y \
  curl unzip zip libpng-dev libonig-dev libxml2-dev sqlite3 libsqlite3-dev \
  nodejs npm \
  && docker-php-ext-install pdo pdo_sqlite

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy composer.json & lock dulu
COPY composer.json composer.lock ./

# Salin file .env jika sudah ada
COPY .env.example .env

# Install PHP dependencies
RUN composer install --no-dev --no-scripts --prefer-dist

# Copy semua file aplikasi
COPY . .

# Jalankan script artisan secara manual setelah semua file tersedia
RUN composer run-script post-create-project-cmd && post-autoload-dump || true
RUN php artisan config:clear && php artisan cache:clear && php artisan route:clear && php artisan view:clear

# Build frontend
RUN npm install && npm run build

# Set permission
RUN chmod -R 777 storage bootstrap/cache \
  && chown -R www-data:www-data /var/www

EXPOSE 9000
CMD ["php-fpm"]
