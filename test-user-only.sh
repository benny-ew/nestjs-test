#!/bin/bash

# This script tests role-based access control with a user that only has "user" role
# We'll simulate this by creating scenarios where admin-only endpoints should be denied

# For this demo, we'll use the same token but test the logic
# In a real scenario, you would have a different token with only "user" role

JWT_TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJiakdXdmZYcWtHSHZJbi0taEplT1IyUThScTRFRzRWemRodGlpUnlDVVVJIn0.eyJleHAiOjE3NDg2MzA5NzEsImlhdCI6MTc0ODYyMzc3MSwianRpIjoiODBmMjZjZWItN2MxZi00NWM4LWI0ZDAtMDZmYzhjZjgyNzFkIiwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eTIubWFwcGVkLmlkL3JlYWxtcy9tb25pdGEtaWRlbnRpdHkiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiODJkNDAzNGMtOGYyNS00OTZlLTk1MWYtNzIwNTkzOGQwNDI4IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibW9uaXRhLXB1YmxpYy1hcHAiLCJzaWQiOiJiZDlkYTZkZC0wZDg1LTQyMDktYWJhMi1kYzFkMjUyNDIyZTIiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9uaWdlbGxhLm1hcHBlZC5pZC8qIiwiaHR0cDovL2V2YWZsb3cubWFwcGVkLmlkLyoiLCJodHRwOi8vbG9jYWxob3N0OjMwMDAvKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImRlZmF1bHQtcm9sZXMtbW9uaXRhLWlkZW50aXR5Il19LCJyZXNvdXJjZV9hY2Nlc3MiOnsibW9uaXRhLXB1YmxpYy1hcHAiOnsicm9sZXMiOlsiYWRtaW4iLCJ1c2VyIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkFkbWluIE9uZSIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluMSIsImdpdmVuX25hbWUiOiJBZG1pbiIsImZhbWlseV9uYW1lIjoiT25lIiwiZW1haWwiOiJhZG1pbkB0ZXN0LmNvbSJ9.S3tUVLQKGYhXinMV1YrGx_1u5UpG7fgG9MjnpIPG2znCOj15rUlAh8exOs4MVa8LA870kfF1omc8vfsEGFGwwwhnWfSKsDKVsPZHSaZyW7C6hRnqJwnKlpNugzik4CHP3hVoRzonMpXtMnT7f9T1Yrct0626fF4kOhAYqYgE88gyzwSWdDLcHpvr_ElwXvYTUHdhvPtmNE29dG8L1mLTYf6jyTQIpQ7OM2IRkybtwJU5WK_kzUfS-EK4oWZln_b0UP9JQ-K3ifIvJ5JcA9SQWfQtv0TTTfXW41k_orxfyF3tAfxMOwb3eeL7GDEYg13yL9TnDUqpNyPJh50IrNAiaA"

BASE_URL="http://localhost:3004"

echo "Testing Role-based Access Control - Current Status"
echo "=================================================="
echo "Note: Current token has both 'admin' and 'user' roles"
echo "All endpoints should work with this token"
echo ""

# First create a task to test against
echo "Creating a test task..."
response=$(curl -s -w "%{http_code}" -X POST \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"title":"Test Task for Deletion","description":"This task will be tested for admin operations","status":"TO_DO"}' \
    "$BASE_URL/tasks")
http_code="${response: -3}"
body="${response%???}"

if [ "$http_code" = "201" ]; then
    task_id=$(echo "$body" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "✅ Test task created with ID: $task_id"
else
    echo "❌ Failed to create test task"
    echo "Response: $body"
    exit 1
fi

echo ""

# Test PUT (admin only) - should work with current token
echo "Testing PUT /tasks/$task_id (admin only - should work):"
response=$(curl -s -w "%{http_code}" -X PUT \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"title":"Updated by Admin","description":"Full update test","status":"IN_PROGRESS"}' \
    "$BASE_URL/tasks/$task_id")
http_code="${response: -3}"
body="${response%???}"
echo "HTTP Status: $http_code"
if [ "$http_code" = "200" ]; then
    echo "✅ SUCCESS - PUT allowed (user has admin role)"
else
    echo "❌ FAILED - PUT denied"
    echo "Response: $body"
fi
echo ""

# Test DELETE (admin only) - should work with current token
echo "Testing DELETE /tasks/$task_id (admin only - should work):"
response=$(curl -s -w "%{http_code}" -X DELETE \
    -H "Authorization: Bearer $JWT_TOKEN" \
    "$BASE_URL/tasks/$task_id")
http_code="${response: -3}"
body="${response%???}"
echo "HTTP Status: $http_code"
if [ "$http_code" = "204" ]; then
    echo "✅ SUCCESS - DELETE allowed (user has admin role)"
else
    echo "❌ FAILED - DELETE denied"
    echo "Response: $body"
fi
echo ""

echo "Role-based access control test completed!"
echo ""
echo "Summary of Role Permissions:"
echo "============================"
echo "✅ GET /tasks - user, admin"
echo "✅ GET /tasks/:id - user, admin" 
echo "✅ POST /tasks - user, admin"
echo "✅ PATCH /tasks/:id - user, admin"
echo "🔒 PUT /tasks/:id - admin only"
echo "🔒 DELETE /tasks/:id - admin only"
echo ""
echo "Current test token has both 'user' and 'admin' roles, so all operations are allowed."
echo "To test role restrictions, you would need a token with only 'user' role from Keycloak."
