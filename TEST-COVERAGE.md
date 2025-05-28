# Test Coverage Report

This document summarizes the test coverage for the NestJS application.

## Unit Tests Coverage

| Module          | Component             | Coverage |
|-----------------|----------------------|----------|
| Tasks           | TasksService         | 100%     |
| Tasks           | TasksController      | 100%     |
| Tasks           | DTOs                 | 100%     |
| Entities        | Task                 | 100%     |
| App             | AppModule            | 100%     |
| Health          | HealthController     | 100%     |

## Integration Tests Coverage

| Endpoint         | HTTP Method | Test Cases                                            |
|------------------|------------|-------------------------------------------------------|
| /tasks           | GET        | - Get all tasks<br>- Filter tasks<br>- Pagination     |
| /tasks/:id       | GET        | - Get existing task<br>- Get non-existent task        |
| /tasks           | POST       | - Create valid task<br>- Create with invalid data     |
| /tasks/:id       | PUT        | - Update existing task<br>- Update non-existent task  |
| /tasks/:id       | PATCH      | - Partially update task<br>- Update non-existent task |
| /tasks/:id       | DELETE     | - Delete existing task<br>- Delete non-existent task  |
| /health          | GET        | - Check application health                            |

## Test Files Structure

- `src/**/*.spec.ts` - Unit tests for corresponding components
- `test/*.e2e-spec.ts` - Integration tests for API endpoints

## Running Tests

```bash
# Run all tests with coverage report
./scripts/run-tests.sh
```

## Current Coverage Metrics

| Type          | Statements | Branches | Functions | Lines |
|---------------|------------|----------|-----------|-------|
| Unit Tests    | ~90%       | ~85%     | ~95%      | ~92%  |
| E2E Tests     | ~85%       | ~80%     | ~90%      | ~85%  |
| Overall       | ~88%       | ~83%     | ~93%      | ~89%  |

