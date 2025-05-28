# Base image
FROM ubuntu:24.04

# Install Node.js
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    ca-certificates \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Install NestJS dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    python3-pip \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g @nestjs/cli

# Create app directory
WORKDIR /usr/src/app


# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including dev dependencies needed for build)
RUN npm ci

# Copy source files
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies except those needed for TypeORM migrations
RUN npm prune --production
# Reinstall packages needed for TypeORM CLI in production
RUN npm install typeorm dotenv @nestjs/config

# Copy and set permissions for startup script
COPY scripts/start-with-migrations.sh ./scripts/
RUN chmod +x ./scripts/start-with-migrations.sh

# Expose API port
EXPOSE 3003

# Start the application
CMD ["./scripts/start-with-migrations.sh"]