# WordPress Setup - Traditional Site

This WordPress instance intentionally represents a **typical small business site** - not optimized, running on modest infrastructure.

## Local Development (Docker)

```bash
cd wordpress

# Start containers
make up

# First-time setup (installs WP, plugins, activates theme)
make setup

# View logs
make logs

# Stop
make down
```

**URLs:**
- WordPress: http://localhost:8080
- Admin: http://localhost:8080/wp-admin
- GraphQL: http://localhost:8080/graphql

**Login:** `wjmatt` / `localdev123`

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
