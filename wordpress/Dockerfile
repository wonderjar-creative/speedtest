FROM wordpress:6.7-php8.2-apache

# Stage theme and seed assets outside the volume-mounted docroot.
# The entrypoint script below copies them in at runtime so they
# survive the wp_data named volume overlay on /var/www/html.
COPY theme/ /usr/src/elevation-theme/
COPY data/ /tmp/data/
COPY seed.sh /tmp/seed.sh

# Custom entrypoint: copy theme into the live docroot, then hand off
# to the stock WordPress entrypoint.
COPY docker-entrypoint-extra.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint-extra.sh

ENTRYPOINT ["docker-entrypoint-extra.sh"]
CMD ["apache2-foreground"]
