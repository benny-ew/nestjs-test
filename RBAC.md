# Role-Based Access Control (RBAC) Implementation

This document describes the role-based access control implementation for the NestJS Task Management API using JWT tokens from Keycloak.

## Overview

The application implements role-based authorization using JWT tokens issued by Keycloak. Users can have different roles that determine which operations they can perform on tasks.

## Supported Roles

- **user**: Basic user role with limited permissions
- **admin**: Administrative role with full permissions

## JWT Token Structure

The application expects JWT tokens from Keycloak with the following structure:

```json
{
  "resource_access": {
    "monita-public-app": {
      "roles": ["admin", "user"]
    }
  }
}
```

The roles are extracted from the `resource_access.monita-public-app.roles` field in the JWT token.

## Endpoint Permissions

| HTTP Method | Endpoint | Required Roles | Description |
|-------------|----------|----------------|-------------|
| GET | `/tasks` | `user`, `admin` | List all tasks with filtering and pagination |
| GET | `/tasks/:id` | `user`, `admin` | Get a specific task by ID |
| POST | `/tasks` | `user`, `admin` | Create a new task |
| PATCH | `/tasks/:id` | `user`, `admin` | Partially update a task |
| PUT | `/tasks/:id` | `admin` | Full update of a task (admin only) |
| DELETE | `/tasks/:id` | `admin` | Delete a task (admin only) |

## Implementation Details

### 1. JWT Token Parsing

The `AuthService.getUserRoles()` method extracts roles from the JWT token:

```typescript
getUserRoles(user: any): string[] {
  const realmRoles = user.realm_access?.roles || [];
  const clientRoles = user.resource_access?.['monita-public-app']?.roles || [];
  
  // Return clean role arrays without prefixes
  return [...realmRoles, ...clientRoles];
}
```

### 2. Combined Authentication and Authorization Guard

The `JwtAuthGuard` combines JWT authentication with role-based authorization:

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First, authenticate using JWT
    const isAuthenticated = await super.canActivate(context);
    if (!isAuthenticated) {
      return false;
    }

    // Then, check role-based authorization
    return this.checkRoles(context);
  }
}
```

### 3. Role Decorators

Controllers use the `@Roles()` decorator to specify required roles:

```typescript
@Get()
@Roles('user', 'admin')
findAll() { ... }

@Delete(':id')
@Roles('admin')
remove() { ... }
```

### 4. Global Guard Configuration

The guard is configured globally in the auth module:

```typescript
{
  provide: APP_GUARD,
  useClass: JwtAuthGuard,
}
```

## Authentication Flow

1. Client sends request with `Authorization: Bearer <JWT_TOKEN>` header
2. `JwtAuthGuard` validates the JWT token using Passport JWT strategy
3. If token is valid, user information is extracted and stored in request context
4. Guard checks if user has required roles for the endpoint
5. If authorized, request proceeds to controller; otherwise, 403 Forbidden is returned

## Configuration

### Environment Variables

```bash
# Keycloak configuration
KEYCLOAK_REALM=monita-identity
KEYCLOAK_CLIENT_ID=monita-public-app
KEYCLOAK_SECRET=your-client-secret
KEYCLOAK_BASE_URL=https://identity2.mapped.id
```

### JWT Strategy Configuration

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      algorithms: ['RS256'],
      secretOrKeyProvider: async (request, rawJwtToken, done) => {
        // Dynamic key fetching from Keycloak JWKS endpoint
      },
    });
  }
}
```

## Testing

### Test Scripts

1. **test-roles.sh**: Comprehensive test of all endpoints with admin+user token
2. **test-user-only.sh**: Demonstrates testing approach for user-only scenarios

### Sample Test Commands

```bash
# Run comprehensive role-based access control tests
./test-roles.sh

# Test with user-only permissions (requires user-only token from Keycloak)
./test-user-only.sh
```

## Security Considerations

1. **Token Validation**: All JWT tokens are validated against Keycloak's public keys
2. **Role Extraction**: Roles are extracted from the token's `resource_access` claim
3. **Global Protection**: All endpoints are protected by default with the global guard
4. **Principle of Least Privilege**: Users are granted minimal required permissions

## Error Responses

### 401 Unauthorized
Returned when:
- No JWT token is provided
- JWT token is invalid or expired
- JWT token signature verification fails

### 403 Forbidden
Returned when:
- Valid JWT token is provided
- User doesn't have required roles for the endpoint

## Troubleshooting

### Common Issues

1. **Token Not Recognized**: Verify the token is sent in the `Authorization: Bearer <token>` header
2. **Role Not Found**: Check that the user has the required roles in Keycloak
3. **Client Configuration**: Ensure the client ID matches the one configured in the JWT strategy

### Debugging

Enable debug logging to see role checking details:

```typescript
// In JwtAuthGuard
console.log('User roles:', userRoles);
console.log('Required roles:', requiredRoles);
console.log('Has required role:', hasRequiredRole);
```

## Future Enhancements

1. **Resource-Level Permissions**: Implement permissions based on task ownership
2. **Dynamic Role Loading**: Load roles dynamically from external sources
3. **Audit Logging**: Track all authorization decisions for security auditing
4. **Role Hierarchies**: Implement role inheritance (admin inherits user permissions)
