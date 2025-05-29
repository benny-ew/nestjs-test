# Keycloak Authentication Documentation

This NestJS application is configured with Keycloak authentication using JWT tokens.

## Configuration

The application uses the following environment variables for Keycloak configuration:

- `KEYCLOAK_BASE_URL`: The base URL of your Keycloak server
- `KEYCLOAK_REALM`: The realm name in Keycloak
- `KEYCLOAK_CLIENT_ID`: The client ID configured in Keycloak
- `KEYCLOAK_CLIENT_SECRET`: The client secret from Keycloak

## Authentication Flow

1. Users authenticate with Keycloak and receive a JWT token
2. Include the JWT token in the `Authorization` header as `Bearer <token>`
3. The application validates the token with Keycloak and extracts user information

## API Endpoints

### Public Endpoints (No Authentication Required)
- `GET /` - Application welcome message
- `GET /health` - Health check endpoint
- `GET /auth/health` - Auth service health check

### Protected Endpoints (Authentication Required)
- `GET /auth/profile` - Get current user profile
- `GET /auth/roles` - Get current user roles
- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get task by ID
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update task (full replacement)
- `PATCH /tasks/:id` - Update task (partial)

### Admin Only Endpoints (Admin Role Required)
- `DELETE /tasks/:id` - Delete task (requires 'admin' role)

## Using Authentication in Controllers

### Making Endpoints Public
Use the `@Public()` decorator to bypass authentication:

```typescript
import { Public } from './auth/decorators/public.decorator';

@Controller('public')
@Public()
export class PublicController {
  // All endpoints in this controller are public
}

// Or on individual endpoints
@Get('public-endpoint')
@Public()
publicEndpoint() {
  return 'This is public';
}
```

### Requiring Specific Roles
Use the `@Roles()` decorator to require specific roles:

```typescript
import { Roles } from './auth/decorators/roles.decorator';

@Delete(':id')
@Roles('admin', 'moderator') // Requires admin OR moderator role
deleteItem(@Param('id') id: string) {
  // Only users with admin or moderator role can access this
}
```

### Getting Current User Information
Use the `@CurrentUser()` decorator to inject user information:

```typescript
import { CurrentUser, User } from './auth';

@Get('profile')
getProfile(@CurrentUser() user: User) {
  return {
    userId: user.sub,
    email: user.email,
    username: user.preferred_username,
    roles: user.realm_access?.roles || []
  };
}
```

## User Object Structure

The `User` object contains the following properties from the JWT token:

```typescript
interface User {
  sub: string; // User ID
  email?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [clientId: string]: {
      roles: string[];
    };
  };
}
```

## Testing with Authentication

### Using Swagger UI
1. Navigate to `/api` (Swagger documentation)
2. Click the "Authorize" button
3. Enter your JWT token in the format: `Bearer <your-jwt-token>`
4. Test protected endpoints

### Using curl
```bash
# Get a token from Keycloak first
curl -X POST "https://your-keycloak-url/auth/realms/your-realm/protocol/openid-connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=password" \
  -d "client_id=your-client-id" \
  -d "client_secret=your-client-secret" \
  -d "username=your-username" \
  -d "password=your-password"

# Use the token in API calls
curl -X GET "http://localhost:3003/tasks" \
  -H "Authorization: Bearer <your-jwt-token>"
```

## AuthService Methods

The `AuthService` provides utility methods for working with user authentication:

- `validateToken(token: string)`: Validate a JWT token
- `getUserFromToken(token: string)`: Extract user info from token
- `hasRole(user: User, role: string)`: Check if user has a specific role
- `hasClientRole(user: User, clientId: string, role: string)`: Check client-specific role
- `getUserRoles(user: User)`: Get all user roles
- `getClientRoles(user: User, clientId: string)`: Get client-specific roles

## Error Responses

- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Valid token but insufficient permissions/roles
- `404 Not Found`: Resource not found

## Security Considerations

1. Always use HTTPS in production
2. Keep JWT tokens secure and don't log them
3. Implement proper token refresh mechanisms
4. Use appropriate token expiration times
5. Validate roles and permissions on the server side
6. Consider implementing rate limiting for authentication endpoints
