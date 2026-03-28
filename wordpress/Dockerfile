FROM wordpress:6.7-php8.2-apache

# PHP config
RUN printf 'upload_max_filesize = 64M\npost_max_size = 64M\n' > /usr/local/etc/php/conf.d/uploads.ini

# WP-CLI (for seeding on prod)
RUN curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar \
    && chmod +x wp-cli.phar \
    && mv wp-cli.phar /usr/local/bin/wp

# Theme
COPY theme/ /var/www/html/wp-content/themes/elevation-theme/

# Seed data + script
COPY data/ /tmp/data/
COPY seed.sh /tmp/seed.sh
