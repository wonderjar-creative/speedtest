# WordPress Setup - Traditional Site

This WordPress instance intentionally represents a **typical small business site** - not optimized, running on modest infrastructure.

## Local Development (LocalWP)

1. **Create new site in LocalWP:**
   - Site name: `speedtest`
   - Domain: `speedtest.local`
   - PHP 8.1+, MySQL 8

2. **Install theme:**
   ```bash
   # Symlink theme into LocalWP (macOS)
   ln -s /path/to/speedtest/wordpress/theme \
     ~/Local\ Sites/speedtest/app/public/wp-content/themes/elevation-theme
   ```

3. **Install required plugins:**
   - WPGraphQL
   - WPGraphQL JWT Authentication
   - Yoast SEO
   - Contact Form 7

4. **Activate theme** in Appearance → Themes

5. **Expose for headless dev:**
   - Use LocalWP's "Live Link" feature, or
   - Use ngrok: `ngrok http 80`

**GraphQL endpoint:** `http://speedtest.local/graphql`

---

## Production: AWS Lightsail

### Instance Specification
- **Plan:** Nano ($5/mo)
- **RAM:** 512 MB
- **CPU:** 1 vCPU
- **Storage:** 20 GB SSD
- **Transfer:** 1 TB
- **OS:** Amazon Linux 2 or Ubuntu 22.04

### Provisioning Steps

1. **Create Lightsail Instance**
   ```bash
   # Via AWS Console or CLI
   aws lightsail create-instances \
     --instance-names "speedtest-wp" \
     --availability-zone "us-west-2a" \
     --blueprint-id "wordpress" \
     --bundle-id "nano_3_0"
   ```

2. **Get Default Credentials**
   ```bash
   # SSH into instance
   ssh -i ~/.ssh/lightsail.pem bitnami@<instance-ip>

   # Get WordPress admin password
   cat /home/bitnami/bitnami_credentials
   ```

3. **Configure Domain**
   - Add A record: `slow.speedtest.denverheadless.com` → Instance IP
   - Install SSL via Bitnami HTTPS Configuration Tool:
     ```bash
     sudo /opt/bitnami/bncert-tool
     ```

## WordPress Configuration

### Theme
- **Astra** (free version) or **GeneratePress** (free version)
- Use default settings, no performance optimization

### Required Plugins

| Plugin | Purpose | Notes |
|--------|---------|-------|
| WPGraphQL | Headless API | Required for headless frontend |
| Yoast SEO | SEO | Typical site plugin |
| Contact Form 7 | Forms | Typical site plugin |
| WP Super Cache | Caching | Basic caching only |
| Smush | Images | Do NOT optimize - leave defaults |

### Content Types

Using standard WordPress:
- **Pages:** Homepage, About, Services, Portfolio, Contact
- **Posts:** Not used
- **Custom Post Type:** Projects (for portfolio)

### WPGraphQL Setup

1. Install WPGraphQL plugin
2. Enable in Settings → GraphQL
3. Endpoint: `https://slow.speedtest.denverheadless.com/graphql`

## Performance Notes

**Intentionally NOT doing:**
- Image optimization
- CDN configuration
- PHP OpCache tuning
- MySQL optimization
- Advanced caching
- Asset minification
- Lazy loading

**The goal:** Represent a typical $5/mo WordPress site that a small business might have.

## Backup & Recovery

```bash
# Export database
wp db export backup.sql

# Export uploads
tar -czf uploads.tar.gz wp-content/uploads/
```

## Domain Configuration

| Record | Type | Value |
|--------|------|-------|
| slow.speedtest.denverheadless.com | A | <Lightsail IP> |
