# Base image with PHP 8.4
FROM php:8.4-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
  git \
  curl \
  libpng-dev \
  libonig-dev \
  libxml2-dev \
  sqlite3 \
  libsqlite3-dev \
  unzip \
  nodejs \
  npm \
  && docker-php-ext-install pdo pdo_sqlite

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy composer files
COPY composer.json composer.lock ./

# Install PHP dependencies for production only
# RUN composer install --no-dev

# Copy rest of the app
COPY . .

# Install JS dependencies and build frontend
RUN npm install && npm run build

RUN php artisan optimize:clear
RUN php artisan config:clear
RUN php artisan cache:clear

# Set permissions
RUN chmod -R 777 storage && chown -R www-data:www-data storage \
  && chown -R www-data:www-data /var/www \
  && chmod -R 755 /var/www
# Expose port (if using Laravel with a server like php-fpm + nginx)
EXPOSE 9000

CMD ["php-fpm"]
