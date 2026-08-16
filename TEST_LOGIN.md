# Test login helper

This repository includes a small Node.js script you can run locally to verify the mobile app's login against your RideShare API.

Do NOT commit or share production credentials in the repository. Use environment variables or CLI args instead.

Usage examples

1) Install dev deps (you only need axios and minimist for this script):

   npm install axios minimist

2) Run with CLI args:

   node scripts/test-login.js --email=sharearsumon5@gmail.com --password='123@sumonE'

3) Or set environment variables and run:

   TEST_API_URL=http://72.61.225.177:5001 TEST_EMAIL=sharearsumon5@gmail.com TEST_PASSWORD='123@sumonE' node scripts/test-login.js

What it does
- Sends POST /auth/login to the configured API URL and prints the HTTP status and response body.
- Checks common token fields (token, accessToken, data.token) and reports whether a token was returned.

Next steps
- If login returns a token, the mobile app will store it in Expo SecureStore when you sign in via the Auth screen.
- If the server's token field is named differently, paste the sample response here and I will update the mobile client to extract and persist the correct token field.
