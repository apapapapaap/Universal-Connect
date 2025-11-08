#!/bin/bash
echo "🧪 Quick API Test"
echo "=================="

# Login
echo -e "\n1. Login:"
LOGIN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "ravi@iitb.ac.in", "password": "password123"}')
echo $LOGIN

# Extract token
TOKEN=$(echo $LOGIN | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['token'])" 2>/dev/null)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get token"
  exit 1
fi

echo -e "\n✅ Got token: ${TOKEN:0:30}..."

# Test events
echo -e "\n2. Events near Bangalore:"
curl -s "http://localhost:5000/api/events?lat=12.9716&lng=77.5946&radius=500"

echo -e "\n\n3. AI Team Builder:"
curl -s -X POST http://localhost:5000/api/ai/team-builder \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"radius_km": 500}'

echo -e "\n\n✅ All tests completed!"
