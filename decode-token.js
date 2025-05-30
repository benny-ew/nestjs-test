const token = process.argv[2];
if (!token) {
  console.error('Please provide a JWT token as an argument');
  process.exit(1);
}

// Extract the payload part (second part) of the JWT
const parts = token.split('.');
if (parts.length !== 3) {
  console.error('Invalid JWT token format');
  process.exit(1);
}

// Decode the base64url-encoded payload
const payload = Buffer.from(parts[1], 'base64').toString();
try {
  const decodedPayload = JSON.parse(payload);
  
  console.log('\n==== JWT Payload ====');
  console.log(JSON.stringify(decodedPayload, null, 2));
  
  console.log('\n==== Audience (aud) ====');
  console.log(decodedPayload.aud);
  
  console.log('\n==== Issuer (iss) ====');
  console.log(decodedPayload.iss);
  
  console.log('\n==== Client ID (azp) ====');
  console.log(decodedPayload.azp);
  
  console.log('\n==== Realm Roles ====');
  console.log(JSON.stringify(decodedPayload.realm_access?.roles || [], null, 2));
  
  console.log('\n==== Client Roles (by client) ====');
  const resourceAccess = decodedPayload.resource_access || {};
  Object.keys(resourceAccess).forEach(clientId => {
    console.log(`\nClient: ${clientId}`);
    console.log(JSON.stringify(resourceAccess[clientId]?.roles || [], null, 2));
  });
  
} catch (error) {
  console.error('Error parsing JWT payload:', error.message);
  process.exit(1);
}
