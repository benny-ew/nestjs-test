#!/bin/bash

# Test script for Keycloak Authentication
# This script demonstrates how to test the authentication endpoints

API_BASE_URL="http://localhost:3004"

echo "=== Keycloak Authentication Test Script ==="
echo ""

# Test public endpoints (should work without authentication)
echo "1. Testing public endpoints:"
echo "   GET /"
curl -s -o /dev/null -w "Status: %{http_code}\n" "${API_BASE_URL}/"

echo "   GET /health"
curl -s -o /dev/null -w "Status: %{http_code}\n" "${API_BASE_URL}/health"

echo "   GET /auth/health"
curl -s -o /dev/null -w "Status: %{http_code}\n" "${API_BASE_URL}/auth/health"

echo ""

# Test protected endpoints (should return 401 without token)
echo "2. Testing protected endpoints without token (should return 401):"
echo "   GET /tasks"
curl -s -o /dev/null -w "Status: %{http_code}\n" "${API_BASE_URL}/tasks"

echo "   GET /auth/profile"
curl -s -o /dev/null -w "Status: %{http_code}\n" "${API_BASE_URL}/auth/profile"

echo ""

# Instructions for getting a token
echo "3. To test with authentication:"
echo "   a) Get a JWT token from your Keycloak server:"
echo "      curl -X POST \"https://identity2.mapped.id/auth/realms/monita-identity/protocol/openid-connect/token\" \\"
echo "           -H \"Content-Type: application/x-www-form-urlencoded\" \\"
echo "           -d \"grant_type=password\" \\"
echo "           -d \"client_id=monita-public-app\" \\"
echo "           -d \"client_secret=RIzbJvbJEhMXoZhrSUO6SOu1Qws6AQvU\" \\"
echo "           -d \"username=YOUR_USERNAME\" \\"
echo "           -d \"password=YOUR_PASSWORD\""
echo ""
echo "   b) Extract the 'access_token' from the response"
echo ""
echo "   c) Test authenticated endpoints:"
echo "      curl -H \"Authorization: Bearer YOUR_JWT_TOKEN\" \"${API_BASE_URL}/tasks\""
echo "      curl -H \"Authorization: Bearer YOUR_JWT_TOKEN\" \"${API_BASE_URL}/auth/profile\""
echo "      curl -H \"Authorization: Bearer YOUR_JWT_TOKEN\" \"${API_BASE_URL}/auth/roles\""
echo ""

echo "4. Swagger Documentation:"
echo "   Visit: ${API_BASE_URL}/api"
echo "   Use the 'Authorize' button to enter your JWT token"
echo ""

# If JWT_TOKEN environment variable is set, test with it
if [ ! -z "$JWT_TOKEN" ]; then
    echo "5. Testing with provided JWT token:"
    echo "   GET /auth/profile"
    curl -s -H "Authorization: Bearer $JWT_TOKEN" "${API_BASE_URL}/auth/profile" | jq . 2>/dev/null || echo "Response received (install jq for formatted output)"
    
    echo "   GET /auth/roles"
    curl -s -H "Authorization: Bearer $JWT_TOKEN" "${API_BASE_URL}/auth/roles" | jq . 2>/dev/null || echo "Response received (install jq for formatted output)"
fi

echo ""
echo "=== Test completed ==="
