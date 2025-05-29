import { ConfigService } from '@nestjs/config';
import { KeycloakConnectOptions } from 'nest-keycloak-connect';

export const createKeycloakConfig = (
  configService: ConfigService,
): KeycloakConnectOptions => ({
  authServerUrl: configService.get<string>('KEYCLOAK_BASE_URL') || '',
  realm: configService.get<string>('KEYCLOAK_REALM') || '',
  clientId: configService.get<string>('KEYCLOAK_CLIENT_ID') || '',
  secret: configService.get<string>('KEYCLOAK_CLIENT_SECRET') || '',
  useNestLogger: false,
  logLevels: ['verbose'],
  cookieKey: 'KEYCLOAK_JWT',
  bearerOnly: true,
  serverUrl: configService.get<string>('KEYCLOAK_BASE_URL') || '',
  realmPublicKey: '',
});
