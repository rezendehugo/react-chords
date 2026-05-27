# Docker Setup Guide - React-Chords with Cavaquinho

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Local `chords-db` project at `/Users/hugo/Documents/Projects/chords-db`

### Start the Application

```bash
cd /Users/hugo/Documents/Projects/react-chords
docker-compose up
```

The app will start on **http://localhost:3000/react-chords**

Press `Ctrl+C` to stop.

---

## What's Running

### Services

**chords-tester** - React development server
- Port: 3000
- Hot-reload enabled
- Watches source code changes

### Volume Mounts

| Local Path | Container Path | Purpose |
|-----------|-----------------|---------|
| `./my-chords-tester/src` | `/app/src` | Source code (hot-reload) |
| `./my-chords-tester/public` | `/app/public` | Public assets |
| `./lib` | `/app/node_modules/@tombatossals/react-chords/lib` | Built library |
| `../chords-db/lib` | `/app/node_modules/@tombatossals/chords-db/lib` | Local chords-db |

---

## Using Your Local Chords-DB Branch

The Docker setup automatically mounts your local chords-db project, allowing you to test cavaquinho changes instantly.

### Test Cavaquinho Changes

```bash
# Terminal 1: Start Docker
docker-compose up

# Terminal 2: Make changes to your chords-db
cd /Users/hugo/Documents/Projects/chords-db
git checkout your-cavaquinho-branch

# Edit cavaquinho.json
vim lib/cavaquinho.json

# Refresh browser - changes appear immediately!
```

### How It Works

```yaml
# docker-compose.yml volume mount
- ../chords-db/lib:/app/node_modules/@tombatossals/chords-db/lib
```

When you edit `cavaquinho.json` in your chords-db branch, the app reads the updated file directly from the mounted volume. **No rebuild or restart needed!**

---

## Running Tests

### Run Tests in Container

```bash
docker-compose exec chords-tester npm run test
```

### Run Specific Test

```bash
docker-compose exec chords-tester npm run test App.test.js
```

### Watch Mode

```bash
docker-compose exec chords-tester npm run test -- --watch
```

---

## Build for Production

### Create Production Build

```bash
docker-compose exec chords-tester yarn run build
```

Output is in `my-chords-tester/build/`

---

## Docker Commands Reference

### Container Management

```bash
# Start containers (foreground)
docker-compose up

# Start in background
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Rebuild images (fresh build)
docker-compose build --no-cache
```

### Interactive Shell

```bash
# Access container shell
docker-compose exec chords-tester sh

# Run commands in container
docker-compose exec chords-tester npm list
```

### Clean Up

```bash
# Stop and remove containers
docker-compose down

# Remove all Docker data
docker-compose down -v

# Clean Docker cache
docker system prune
```

---

## Troubleshooting

### Problem: Port 3000 Already in Use

**Error**: `Error response from daemon: driver failed programming external connectivity on endpoint`

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port in docker-compose.yml
# ports:
#   - "3001:3000"
```

### Problem: Container Won't Start

**Error**: `failed to solve: process "/bin/sh -c yarn install"`

**Solution**: 
```bash
# Clean and rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Problem: Hot-Reload Not Working

**Solution**: Check volume mounts are correct

```bash
# Verify volumes are mounted
docker inspect chords-tester | grep -A 20 Mounts

# Should show:
# "/Users/hugo/Documents/Projects/react-chords/my-chords-tester/src": "/app/src"
```

### Problem: Local Chords-DB Not Updating

**Solution**: Ensure path is correct in docker-compose.yml

```yaml
# Check this line in docker-compose.yml:
- ../chords-db/lib:/app/node_modules/@tombatossals/chords-db/lib

# If your chords-db is in different location, update path
# Example if chords-db is at same level as react-chords:
- ../../chords-db/lib:/app/node_modules/@tombatossals/chords-db/lib
```

Refresh browser after checking path.

### Problem: Git Binary Error During Build

**Error**: `error Couldn't find the binary git`

**Solution**: Dockerfiles now include `apk add --no-cache git`. This is already fixed in Dockerfile and Dockerfile.lib.

---

## Development Workflow

### Recommended Setup

1. **Terminal 1** - Run Docker:
   ```bash
   docker-compose up
   ```

2. **Terminal 2** - Edit chords-db branch:
   ```bash
   cd ../chords-db
   git checkout your-branch
   ```

3. **Browser** - http://localhost:3000/react-chords
   - Edit cavaquinho.json in Terminal 2
   - Refresh browser to see changes
   - No restart needed!

### Testing Changes

```bash
# Terminal 3 - Run tests
docker-compose exec chords-tester npm run test

# Watch for changes
docker-compose exec chords-tester npm run test -- --watch
```

---

## Files

### Dockerfiles

- `Dockerfile.lib` - Builds react-chords library
- `my-chords-tester/Dockerfile` - Runs development server

### Configuration

- `docker-compose.yml` - Service definitions and volume mounts
- `my-chords-tester/.dockerignore` - Optimize Docker builds

---

## System Requirements

- Docker 20.10+
- Docker Compose 2.0+
- 2GB RAM minimum
- 1GB disk space for images

---

## Next Steps

1. ✅ Run `docker-compose up`
2. ✅ Open http://localhost:3000/react-chords
3. ✅ Verify cavaquinho appears
4. ✅ Test with your chords-db branch
5. ✅ Run tests with `npm run test`

---

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Guide](https://docs.docker.com/compose/)
- [React Development Guide](https://react.dev/)

---

## Support

- Check **Troubleshooting** section above
- Review **docker-compose.yml** for configuration
- Run `docker-compose logs` to see error messages
- Check browser console (F12) for frontend errors
