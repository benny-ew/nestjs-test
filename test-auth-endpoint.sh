#!/bin/bash

# Set the authorization token provided by the user
AUTH_TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJiakdXdmZYcWtHSHZJbi0taEplT1IyUThScTRFRzRWemRodGlpUnlDVVVJIn0.eyJleHAiOjE3NDg2MjcyMjYsImlhdCI6MTc0ODYyMDAyNiwianRpIjoiZWEyODgzMWEtNzNlMi00NmUzLTg3MzUtOTBiNDQ4Mjg2ZDI5IiwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eTIubWFwcGVkLmlkL3JlYWxtcy9tb25pdGEtaWRlbnRpdHkiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiODJkNDAzNGMtOGYyNS00OTZlLTk1MWYtNzIwNTkzOGQwNDI4IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibW9uaXRhLXB1YmxpYy1hcHAiLCJzaWQiOiI2ODMyMWY4ZS0yMmVjLTQ2NWMtOGEwMS04ZTQ3OGQ3OWRiNTQiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9uaWdlbGxhLm1hcHBlZC5pZC8qIiwiaHR0cDovL2V2YWZsb3cubWFwcGVkLmlkLyoiLCJodHRwOi8vbG9jYWxob3N0OjMwMDAvKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImRlZmF1bHQtcm9sZXMtbW9uaXRhLWlkZW50aXR5Il19LCJyZXNvdXJjZV9hY2Nlc3MiOnsibW9uaXRhLXB1YmxpYy1hcHAiOnsicm9sZXMiOlsiYWRtaW4iLCJ1c2VyIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkFkbWluIE9uZSIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluMSIsImdpdmVuX25hbWUiOiJBZG1pbiIsImZhbWlseV9uYW1lIjoiT25lIiwiZW1haWwiOiJhZG1pbkB0ZXN0LmNvbSJ9.dgspfoibmqJ3WhUGeOJtEUe2IIG99K300kUwI-nAgMTqGpkkRcMqfwb96IhnkD1Y3lvBCV6MmInlX_-7lqvOQYX00FjVyTpAQ2FccVlXko6RhB6gRPKYgS6J088vs3y41bSYQWBSt58LgvtLtu6SchcNO4LuztvIP_OB8xnM1imB536mko-AYbXUCGo82CGQBBbJX47x6FtkUs9obXf_L0TDMJFlWKdDoq1kjhSdhcHweysfijarSiy8v0cINYnLUxc9k6HU54olkw-kIsJcrmszvCDRyH9rR5fG7n2uiXkVQ91bN4uPfTvWnrvUrFr15FSzFtWhLvslt3atDWYF1A"

# Set the API URL
API_URL="http://localhost:3004"

echo "Testing auth profile endpoint..."
echo "==================================="
curl -X GET "${API_URL}/auth/profile" \
  -H "Authorization: Bearer ${AUTH_TOKEN}" \
  -H "Content-Type: application/json" \
  -s | jq

echo -e "\nTesting auth roles endpoint..."
echo "==================================="
curl -X GET "${API_URL}/auth/roles" \
  -H "Authorization: Bearer ${AUTH_TOKEN}" \
  -H "Content-Type: application/json" \
  -s | jq

echo -e "\nTesting tasks endpoint (should require auth)..."
echo "==================================="
curl -X GET "${API_URL}/tasks" \
  -H "Authorization: Bearer ${AUTH_TOKEN}" \
  -H "Content-Type: application/json" \
  -s | jq

echo -e "\nTesting task delete endpoint (should require admin role)..."
echo "==================================="
curl -X DELETE "${API_URL}/tasks/e2a7dde0-5e80-4b86-a60c-4c5ed2a72bb5" \
  -H "Authorization: Bearer ${AUTH_TOKEN}" \
  -H "Content-Type: application/json" \
  -i -s
