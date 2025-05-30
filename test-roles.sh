#!/bin/bash

# JWT Token from the user
JWT_TOKEN="eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJiakdXdmZYcWtHSHZJbi0taEplT1IyUThScTRFRzRWemRodGlpUnlDVVVJIn0.eyJleHAiOjE3NDg2MzA5NzEsImlhdCI6MTc0ODYyMzc3MSwianRpIjoiODBmMjZjZWItN2MxZi00NWM4LWI0ZDAtMDZmYzhjZjgyNzFkIiwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eTIubWFwcGVkLmlkL3JlYWxtcy9tb25pdGEtaWRlbnRpdHkiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiODJkNDAzNGMtOGYyNS00OTZlLTk1MWYtNzIwNTkzOGQwNDI4IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoibW9uaXRhLXB1YmxpYy1hcHAiLCJzaWQiOiJiZDlkYTZkZC0wZDg1LTQyMDktYWJhMi1kYzFkMjUyNDIyZTIiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9uaWdlbGxhLm1hcHBlZC5pZC8qIiwiaHR0cDovL2V2YWZsb3cubWFwcGVkLmlkLyoiLCJodHRwOi8vbG9jYWxob3N0OjMwMDAvKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsib2ZmbGluZV9hY2Nlc3MiLCJ1bWFfYXV0aG9yaXphdGlvbiIsImRlZmF1bHQtcm9sZXMtbW9uaXRhLWlkZW50aXR5Il19LCJyZXNvdXJjZV9hY2Nlc3MiOnsibW9uaXRhLXB1YmxpYy1hcHAiOnsicm9sZXMiOlsiYWRtaW4iLCJ1c2VyIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6IkFkbWluIE9uZSIsInByZWZlcnJlZF91c2VybmFtZSI6ImFkbWluMSIsImdpdmVuX25hbWUiOiJBZG1pbiIsImZhbWlseV9uYW1lIjoiT25lIiwiZW1haWwiOiJhZG1pbkB0ZXN0LmNvbSJ9.S3tUVLQKGYhXinMV1YrGx_1u5UpG7fgG9MjnpIPG2znCOj15rUlAh8exOs4MVa8LA870kfF1omc8vfsEGFGwwwhnWfSKsDKVsPZHSaZyW7C6hRnqJwnKlpNugzik4CHP3hVoRzonMpXtMnT7f9T1Yrct0626fF4kOhAYqYgE88gyzwSWdDLcHpvr_ElwXvYTUHdhvPtmNE29dG8L1mLTYf6jyTQIpQ7OM2IRkybtwJU5WK_kzUfS-EK4oWZln_b0UP9JQ-K3ifIvJ5JcA9SQWfQtv0TTTfXW41k_orxfyF3tAfxMOwb3eeL7GDEYg13yL9TnDUqpNyPJh50IrNAiaA"

BASE_URL="http://localhost:3004"

echo "Testing Role-based Access Control"
echo "================================="
echo "User has roles: admin, user (from monita-public-app resource_access)"
echo ""

# Test 1: GET /tasks (should work - user and admin can access)
echo "1. Testing GET /tasks (user + admin access):"
response=$(curl -s -w "%{http_code}" -H "Authorization: Bearer $JWT_TOKEN" "$BASE_URL/tasks")
http_code="${response: -3}"
body="${response%???}"
echo "HTTP Status: $http_code"
if [ "$http_code" = "200" ]; then
    echo "✅ SUCCESS - Access granted"
else
    echo "❌ FAILED - Access denied"
    echo "Response: $body"
fi
echo ""

# Test 2: POST /tasks (should work - user and admin can access)
echo "2. Testing POST /tasks (user + admin access):"
response=$(curl -s -w "%{http_code}" -X POST \
    -H "Authorization: Bearer $JWT_TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"title":"Test Role Task","description":"Testing role-based access","status":"TO_DO"}' \
    "$BASE_URL/tasks")
http_code="${response: -3}"
body="${response%???}"
echo "HTTP Status: $http_code"
if [ "$http_code" = "201" ]; then
    echo "✅ SUCCESS - Task created"
    # Extract task ID for further tests
    task_id=$(echo "$body" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "Created task ID: $task_id"
else
    echo "❌ FAILED - Task creation failed"
    echo "Response: $body"
fi
echo ""

# Test 3: PUT /tasks/:id (should work - admin only)
if [ -n "$task_id" ]; then
    echo "3. Testing PUT /tasks/$task_id (admin only access):"
    response=$(curl -s -w "%{http_code}" -X PUT \
        -H "Authorization: Bearer $JWT_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"title":"Updated Admin Task","description":"Full update by admin","status":"IN_PROGRESS"}' \
        "$BASE_URL/tasks/$task_id")
    http_code="${response: -3}"
    body="${response%???}"
    echo "HTTP Status: $http_code"
    if [ "$http_code" = "200" ]; then
        echo "✅ SUCCESS - Admin can perform PUT"
    else
        echo "❌ FAILED - PUT access denied"
        echo "Response: $body"
    fi
    echo ""
fi

# Test 4: PATCH /tasks/:id (should work - user and admin can access)
if [ -n "$task_id" ]; then
    echo "4. Testing PATCH /tasks/$task_id (user + admin access):"
    response=$(curl -s -w "%{http_code}" -X PATCH \
        -H "Authorization: Bearer $JWT_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"description":"Partial update test"}' \
        "$BASE_URL/tasks/$task_id")
    http_code="${response: -3}"
    body="${response%???}"
    echo "HTTP Status: $http_code"
    if [ "$http_code" = "200" ]; then
        echo "✅ SUCCESS - PATCH access granted"
    else
        echo "❌ FAILED - PATCH access denied"
        echo "Response: $body"
    fi
    echo ""
fi

# Test 5: DELETE /tasks/:id (should work - admin only)
if [ -n "$task_id" ]; then
    echo "5. Testing DELETE /tasks/$task_id (admin only access):"
    response=$(curl -s -w "%{http_code}" -X DELETE \
        -H "Authorization: Bearer $JWT_TOKEN" \
        "$BASE_URL/tasks/$task_id")
    http_code="${response: -3}"
    body="${response%???}"
    echo "HTTP Status: $http_code"
    if [ "$http_code" = "204" ]; then
        echo "✅ SUCCESS - Admin can delete tasks"
    else
        echo "❌ FAILED - DELETE access denied"
        echo "Response: $body"
    fi
    echo ""
fi

# Test 6: Test without token (should fail)
echo "6. Testing GET /tasks without token (should fail):"
response=$(curl -s -w "%{http_code}" "$BASE_URL/tasks")
http_code="${response: -3}"
body="${response%???}"
echo "HTTP Status: $http_code"
if [ "$http_code" = "401" ]; then
    echo "✅ SUCCESS - Properly denied access without token"
else
    echo "❌ FAILED - Should have denied access"
    echo "Response: $body"
fi
echo ""

echo "Role-based access control testing completed!"
