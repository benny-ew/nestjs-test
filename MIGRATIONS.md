# Database Migrations Guide

This project uses TypeORM migrations to manage database schema. The migrations ensure that your database schema is consistent across different environments.

## Available Migration Commands

- `npm run setup` - One-step setup for development (installs dependencies, checks database, runs migrations)
- `npm run migration:generate -- src/migrations/MigrationName` - Generate a new migration from entity changes
- `npm run migration:create -- src/migrations/CustomMigration` - Create a new empty migration
- `npm run migration:run` - Run all pending migrations
- `npm run migration:revert` - Revert the latest migration
- `npm run db:reset` - Reset the database (drops all tables and re-runs migrations)

### Running Migrations

To set up your database with the initial schema:

```bash
# Run all migrations
npm run migration:run
```

## Creating New Migrations

When you make changes to entities, you can generate a migration automatically:

```bash
# Generate a migration based on entity changes
npm run migration:generate -- src/migrations/YourMigrationName

# Or use the helper script which adds a timestamp automatically
./scripts/migrations/generate-migration.sh YourMigrationName
```

Or create a custom migration manually:

```bash
# Create an empty migration file
npm run migration:create -- src/migrations/CustomMigration
```

### Migration Files

Migrations are stored in the `src/migrations` directory. Each migration has an `up` method that applies the changes and a `down` method that reverts them.

## Database Configuration

Database connection details are stored in environment variables:
- `DB_HOST` - Database host
- `DB_PORT` - Database port
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_NAME` or `DB_DATABASE` - Database name

In production environments, synchronize is disabled and migrations run automatically during application startup.

## Automatic Migrations in Docker

When running the application in Docker, migrations run automatically before the application starts. This is configured in the `scripts/start-with-migrations.sh` script which is used as the entry point in the Dockerfile.

## Development Workflow

1. Make changes to your entities
2. Generate a migration: `npm run migration:generate -- src/migrations/DescriptiveChangeName`
3. Review the generated migration file in `src/migrations/`
4. Run the migration: `npm run migration:run`
5. Start your application: `npm run start:dev`

## Resetting the Database

During development, you might want to reset the database to a clean state:

```bash
# This will drop all tables and re-run migrations
npm run db:reset
```

## Troubleshooting

If you encounter issues with migrations:

1. Check that your database credentials are correct in `.env`
2. Ensure the database exists and you have sufficient privileges
3. Try the reset script: `npm run db:reset`
4. Check the TypeORM configuration in `src/config/typeorm.config.ts`
