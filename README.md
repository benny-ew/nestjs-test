# Task Management API

## Description

A NestJS application with PostgreSQL database integration for task management. This project includes:

- Task entity with CRUD operations
- Docker and Docker Compose setup
- PostgreSQL database integration
- pgAdmin for database management
- TypeORM migrations for database schema management
- Health endpoints for application monitoring
- Environment variable configuration


## Environment Configuration

Create a `.env` file in the root directory with the following variables:

```bash
# Application Configuration
PORT=3003

# Environment
NODE_ENV=development

# Database Configuration
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres_password
DB_NAME=nestjs_db
```

## Running with Docker

```bash
# Build and start all services
$ docker-compose up -d

# Access the API at http://localhost:3003
# Access Swagger documentation at http://localhost:3003/api
```

## Running locally

```bash
# One-step development setup (installs dependencies, checks database, runs migrations)
$ npm run setup

# Or do the steps manually:

# Install dependencies
$ npm install

# Run database migrations
$ npm run migration:run

# Development mode
$ npm run start

# Watch mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

## Database Migrations

This project uses TypeORM migrations to manage the database schema. For more details, see [MIGRATIONS.md](MIGRATIONS.md).

```bash
# Generate a new migration
$ npm run migration:generate -- src/migrations/YourMigrationName

# Create an empty migration
$ npm run migration:create -- src/migrations/CustomMigration

# Run all pending migrations
$ npm run migration:run

# Revert the latest migration
$ npm run migration:revert
```

## API Endpoints

| Method | Endpoint        | Description           | Request Body Example                                              |
|--------|-----------------|--------------------|-----------------------------------------------------------------|
| GET    | /tasks          | Get all tasks         | N/A                                                           |
| GET    | /tasks/:id      | Get a specific task   | N/A                                                           |
| POST   | /tasks          | Create a new task     | `{ "title": "New Task", "description": "Task details" }`      |
| PUT    | /tasks/:id      | Update a task         | `{ "title": "Updated Task", "status": "IN_PROGRESS" }`        |
| DELETE | /tasks/:id      | Delete a task         | N/A                                                           |

## Testing

This project includes comprehensive test coverage with both unit tests and integration tests.

```bash
# Run all tests (unit tests, coverage, and e2e tests)
$ ./scripts/run-tests.sh

# Run only unit tests
$ npm run test

# Run tests with coverage report
$ npm run test:cov

# Run e2e tests
$ npm run test:e2e
```

For detailed information about the testing approach, see [TESTING.md](TESTING.md).

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
