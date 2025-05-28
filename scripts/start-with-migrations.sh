#!/bin/bash
set -e

echo "Starting NestJS application..."

# Check if we're in production and migrations should be run
if [ "$NODE_ENV" = "production" ]; then
    echo "Running database migrations..."
    npm run migration:run:prod
fi

echo "Starting the application..."
exec npm run start:prod
