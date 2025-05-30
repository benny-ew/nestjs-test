import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService, User } from '../auth.service';
import * as jwksRsa from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    const keycloakBaseUrl = (configService.get<string>('KEYCLOAK_BASE_URL') || 'https://identity2.mapped.id').replace(/\/+$/, '');
    const keycloakRealm = configService.get<string>('KEYCLOAK_REALM') || 'monita-identity';
    const clientId = configService.get<string>('KEYCLOAK_CLIENT_ID') || 'monita-public-app';
    
    const issuer = `${keycloakBaseUrl}/realms/${keycloakRealm}`;
    const jwksUri = `${keycloakBaseUrl}/realms/${keycloakRealm}/protocol/openid-connect/certs`;
    
    console.log('JWT Strategy Configuration:');
    console.log('  Keycloak Base URL:', keycloakBaseUrl);
    console.log('  Keycloak Realm:', keycloakRealm);
    console.log('  Client ID:', clientId);
    console.log('  Issuer:', issuer);
    console.log('  JWKS URI:', jwksUri);
    
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKeyProvider: jwksRsa.passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri,
      }),
      issuer,
      algorithms: ['RS256'],
      // Disable audience verification since Keycloak uses 'account' as default audience
      // audience: false,
    });
  }

  async validate(payload: any): Promise<User> {
    console.log('JWT Strategy validate called with payload:', {
      sub: payload.sub,
      iss: payload.iss,
      azp: payload.azp,
      aud: payload.aud,
      exp: payload.exp,
      iat: payload.iat
    });

    if (!payload.sub) {
      console.log('Missing subject in token');
      throw new UnauthorizedException('Missing subject in token');
    }

    // Check if the client ID (azp) matches our expected client ID
    const expectedClientId = this.configService.get<string>('KEYCLOAK_CLIENT_ID') || 'monita-public-app';
    console.log('Expected client ID:', expectedClientId, 'Token azp:', payload.azp);
    
    if (payload.azp !== expectedClientId) {
      console.log(`Client ID mismatch. Expected: ${expectedClientId}, Got: ${payload.azp}`);
      throw new UnauthorizedException(`Invalid client identifier: ${payload.azp}`);
    }

    const user: User = {
      sub: payload.sub,
      email: payload.email,
      preferred_username: payload.preferred_username,
      given_name: payload.given_name,
      family_name: payload.family_name,
      realm_access: payload.realm_access,
      resource_access: payload.resource_access,
    };

    console.log('JWT validation successful for user:', user.preferred_username);
    return user;
  }
}
