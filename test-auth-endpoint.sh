#!/bin/bash

# Set the authorization token provided by the user
AUTH_TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJiakdXdmZYcWtHSHZJbi0taEplT1IyUThScTRFRzRWemRodGlpUnlDVVVJIn0.eyJleHAiOjE3NDg2MzA5NzEsImlhdCI6MTc0ODYyMzc3MSwianRpIjoiODBmMjZjZWItN2MxZi00NWM4LWI0ZDAtMDZmYzhjZjgyNzFkIiwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eTIubWFwcGVkLmlkL3JlYWxtcy9tb25pdGEtaWRlbnRpdHkiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiODJkNDAzNGMtOGYyNS00OTZlLTk1MWYtNzIwNTkzOGQwNDI4IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibW9uaXRhLXB1YmxpYy1hcHAiLCJzaWQiOiJiZDlkYTZkZC0wZDg1LTQyMDktYWJhMi1kYzFkMjUyNDIyZTIiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9uaWdlbGxhLm1hcHBlZC5pZC8qIiwiaHR0cDovL2V2YWZsb3cubWFwcGVkLmlkLyoiLCJodHRwOi8vbG9jYWxob3N0OjMwMDAvKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImRlZmF1bHQtcm9sZXMtbW9uaXRhLWlkZW50aXR5Il19LCJyZXNvdXJjZV9hY2Nlc3MiOnsibW9uaXRhLXB1YmxpYy1hcHAiOnsicm9sZXMiOlsiYWRtaW4iLCJ1c2VyIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkFkbWluIE9uZSIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluMSIsImdpdmVuX25hbWUiOiJBZG1pbiIsImZhbWlseV9uYW1lIjoiT25lIiwiZW1haWwiOiJhZG1pbkB0ZXN0LmNvbSJ9.S3tUVLQKGYhXinMV1YrGx_1u5UpG7fgG9MjnpIPG2znCOj15rUlAh8exOs4MVa8LA870kfF1omc8vfsEGFGwwwhnWfSKsDKVsPZHSaZyW7C6hRnqJwnKlpNugzik4CHP3hVoRzonMpXtMnT7f9T1Yrct0626fF4kOhAYqYgE88gyzwSWdDLcHpvr_ElwXvYTUHdhvPtmNE29dG8L1mLTYf6jyTQIpQ7OM2IRkybtwJU5WK_kzUfS-EK4oWZln_b0UP9JQ-K3ifIvJ5JcA9SQWfQtv0TTTfXW41k_orxfyF3tAfxMOwb3eeL7GDEYg13yL9TnDUqpNyPJh50IrNAiaA"

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
