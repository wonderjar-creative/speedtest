# Docker Setup Guide (Beginner-Friendly)

This guide will get WordPress running locally with Docker in about 5 minutes.

## Step 1: Install Docker Desktop

Download and install Docker Desktop for your operating system:

- **Mac:** https://docs.docker.com/desktop/install/mac-install/
- **Windows:** https://docs.docker.com/desktop/install/windows-install/
- **Linux:** https://docs.docker.com/desktop/install/linux-install/

After installing, **open Docker Desktop** and wait until it says "Docker is running" (green icon in the system tray/menu bar).

## Step 2: Start Everything

Open your terminal/command prompt, navigate to this project folder, and run:

```bash
docker compose up -d
```

That's it! Docker will:
1. Download WordPress, MySQL, and phpMyAdmin images (first time only, ~1-2 min)
2. Start all services in the background

## Step 3: Access Your Sites

| Service | URL | Purpose |
|---------|-----|---------|
| WordPress | http://localhost:8080 | Your local WordPress site |
| phpMyAdmin | http://localhost:8081 | Database management (optional) |

### First-Time WordPress Setup

1. Go to http://localhost:8080
2. Select your language
3. Fill in the setup form:
   - Site Title: `Elevation Design Studio`
   - Username: `admin`
   - Password: (choose one)
   - Email: (your email)
4. Click "Install WordPress"

## Step 4: Activate the Theme

1. Log in to WordPress admin: http://localhost:8080/wp-admin
2. Go to **Appearance → Themes**
3. Find "Elevation Theme" and click **Activate**

## Step 5: Install Required Plugins

In WordPress admin, go to **Plugins → Add New** and install:

1. **WPGraphQL** - Search and install, then activate
2. **WPGraphQL JWT Authentication** - Search and install, then activate

The GraphQL endpoint will be: `http://localhost:8080/graphql`

---

## Common Commands

```bash
# Start all services
docker compose up -d

# Stop all services (keeps data)
docker compose down

# Stop and DELETE all data (fresh start)
docker compose down -v

# View logs (helpful for debugging)
docker compose logs -f

# View logs for just WordPress
docker compose logs -f wordpress

# Restart a specific service
docker compose restart wordpress
```

## Running the Next.js Apps

The Next.js apps run outside Docker (simpler for development):

```bash
# Terminal 1: Comparison interface
cd comparison
pnpm install
pnpm dev
# → http://localhost:3000

# Terminal 2: Headless frontend
cd frontend
pnpm install
pnpm dev
# → http://localhost:3001
```

### Configure Frontend to Use Docker WordPress

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_WORDPRESS_API_URL=http://localhost:8080/graphql
```

---

## Troubleshooting

### "Port 8080 is already in use"

Another app is using port 8080. Either:
- Stop that app, or
- Edit `docker-compose.yml` and change `8080:80` to `8888:80`, then use http://localhost:8888

### "Cannot connect to Docker daemon"

Docker Desktop isn't running. Open Docker Desktop and wait for it to start.

### WordPress shows database error

Wait 30 seconds and refresh. MySQL takes a moment to initialize on first run.

### Need a completely fresh start?

```bash
docker compose down -v
docker compose up -d
```

This deletes all WordPress data and starts over.

---

## How It Works (Optional Reading)

Docker runs your services in isolated "containers" - think of them as lightweight virtual machines.

The `docker-compose.yml` file defines:
- **db**: MySQL database server
- **wordpress**: WordPress + Apache web server
- **phpmyadmin**: Web interface for the database

Your theme folder (`wordpress/theme`) is "mounted" into the WordPress container, so changes you make to theme files appear instantly.

---

## phpMyAdmin Access

If you need to look at the database directly:

1. Go to http://localhost:8081
2. Login with:
   - Username: `root`
   - Password: `rootpassword`

---

## Next Steps

Once WordPress is running:
1. Install the required plugins (WPGraphQL, etc.)
2. Create the demo content (pages, projects)
3. Run the Next.js frontend to connect to your local WordPress
