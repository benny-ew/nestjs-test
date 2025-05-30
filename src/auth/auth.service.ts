import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

export interface User {
  sub: string;
  email?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: {
    roles: string[];
  };
  resource_access?: {
    [key: string]: {
      roles: string[];
    };
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateToken(token: string): Promise<User> {
    try {
      // Let Passport and JwtStrategy handle verification with JWKS
      const decoded = this.jwtService.decode(token);
      if (!decoded) {
        throw new Error('Invalid token format');
      }
      return decoded as User;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async getUserFromToken(token: string): Promise<User> {
    return this.validateToken(token);
  }

  hasRole(user: User, role: string): boolean {
    const realmRoles = user.realm_access?.roles || [];
    return realmRoles.includes(role);
  }

  hasClientRole(user: User, clientId: string, role: string): boolean {
    const clientRoles = user.resource_access?.[clientId]?.roles || [];
    return clientRoles.includes(role);
  }

  getUserRoles(user: User): string[] {
    const realmRoles = user.realm_access?.roles || [];
    // Get the client ID from config - this is needed to extract client-specific roles
    const clientId = this.configService.get<string>('KEYCLOAK_CLIENT_ID') || 'monita-public-app';
    const clientRoles = user.resource_access?.[clientId]?.roles || [];
    
    // Combine realm roles and client roles
    return [...realmRoles, ...clientRoles.map(role => `${clientId}:${role}`)];
  }

  getClientRoles(user: User, clientId: string): string[] {
    return user.resource_access?.[clientId]?.roles || [];
  }
}
