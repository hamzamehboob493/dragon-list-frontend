# Docker Setup for Next.js Application

This document describes how to run the application using Docker.

## Prerequisites

- Docker installed on your machine
- Docker Compose installed on your machine
- A `.env` file with required environment variables (see below)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

## Development Environment

To run the application in development mode with hot-reloading:

```bash
# Using npm script
npm run docker:dev

# Or using docker-compose directly
docker-compose -f docker-compose.dev.yml up
```

## Production Environment

To run the application in production mode:

```bash
# Using npm script
npm run docker:prod

# Or using docker-compose directly
docker-compose up
```

## Additional Commands

```bash
# Build the Docker image
npm run docker:build

# Stop all containers
npm run docker:stop

# View logs
docker-compose logs -f

# Rebuild containers
docker-compose up --build
```

## Docker Configuration Files

- `Dockerfile`: Multi-stage build configuration for both development and production
- `docker-compose.yml`: Production configuration
- `docker-compose.dev.yml`: Development configuration with hot-reloading
- `.dockerignore`: Lists files to be excluded from the Docker build

## Health Check

The application includes a health check endpoint at `/api/health` that returns:
```json
{
  "status": "healthy",
  "timestamp": "2024-XX-XX..."
}
```

This endpoint is used by Docker to monitor the container's health.

## Volumes

The development environment mounts the following volumes:
- `.:/app`: Source code for hot-reloading
- `/app/node_modules`: Persistent node_modules
- `/app/.next`: Persistent Next.js build

## Debugging

In development mode, the container is configured with:
- `stdin_open: true`
- `tty: true`

This allows for better debugging capabilities.

## Common Issues

1. **Port already in use**: 
   ```bash
   # Find and kill the process using port 3000
   lsof -i :3000
   kill -9 <PID>
   ```

2. **Container not starting**: 
   ```bash
   # Check container logs
   docker-compose logs web
   ```

3. **Hot-reloading not working**:
   - Ensure your Docker volumes are properly mounted
   - Check if your file watchers are working
   ```bash
   # Restart the containers
   docker-compose -f docker-compose.dev.yml restart
