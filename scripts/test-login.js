#!/usr/bin/env node
// scripts/test-login.js
// Usage: node scripts/test-login.js --email=you@example.com --password=YourPass123
// Or set env: TEST_API_URL and TEST_EMAIL and TEST_PASSWORD

const axios = require('axios');
const argv = require('minimist')(process.argv.slice(2));

const API_URL = process.env.TEST_API_URL || process.env.EXPO_PUBLIC_API_URL || 'http://72.61.225.177:5001';
const email = argv.email || process.env.TEST_EMAIL;
const password = argv.password || process.env.TEST_PASSWORD;

if (!email || !password) {
  console.error('Usage: node scripts/test-login.js --email=you@example.com --password=YourPass');
  console.error('Or set env TEST_EMAIL and TEST_PASSWORD');
  process.exit(1);
}

async function run() {
  try {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password }, { timeout: 10000 });
    console.log('HTTP', res.status);
    console.log('Response data:', JSON.stringify(res.data, null, 2));
    if (res.data && (res.data.token || res.data.accessToken || (res.data.data && res.data.data.token))) {
      console.log('\nLogin appears successful and returned a token.');
    } else {
      console.log('\nLogin response did not include a recognizable token field.');
    }
  } catch (err) {
    if (err.response) {
      console.error('Error response:', err.response.status, JSON.stringify(err.response.data, null, 2));
    } else {
      console.error('Request error:', err.message);
    }
    process.exit(2);
  }
}

run();
