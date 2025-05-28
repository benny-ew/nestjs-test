# Testing Guide

This document outlines the testing approach for the NestJS application, covering both unit tests and integration tests.

## Testing Architecture

The application uses Jest as the testing framework and follows NestJS's recommended testing practices:

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test API endpoints with the full application context

## Unit Tests

Unit tests focus on testing individual components in isolation, such as:

- Service methods
- Controller methods
- DTOs validation
- Entity configurations

### Running Unit Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode during development
npm run test:watch

# Generate test coverage report
npm run test:cov
```

## Integration Tests (E2E Tests)

End-to-end tests verify that the API endpoints work as expected by testing the full request/response cycle. These tests:

- Start a real NestJS application instance
- Connect to a test database
- Execute HTTP requests against the API endpoints
- Validate responses

### Running E2E Tests

```bash
# Run all e2e tests
npm run test:e2e
```

## Test Files Structure

- `*.spec.ts` files next to the implementation files for unit tests
- `*.e2e-spec.ts` files in the `/test` directory for integration tests

## Mocking Strategy

- **TypeORM repositories**: Mocked in unit tests to isolate service logic
- **External services**: Mocked in unit tests
- **Database**: Real database connections in e2e tests

## Test Coverage

The goal is to maintain test coverage above 80%, focusing on:

1. Core business logic in services
2. API endpoints behavior
3. Input validation
4. Error handling scenarios

For detailed coverage metrics, see [TEST-COVERAGE.md](TEST-COVERAGE.md).

## Running All Tests

Use the provided script to run all tests including coverage reports:

```bash
./scripts/run-tests.sh
```

This script will run unit tests, generate coverage reports, and execute e2e tests.
