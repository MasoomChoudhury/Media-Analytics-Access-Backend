const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const API_URL = 'http://localhost:3000';

const testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'password123',
};

let authToken = '';
let mediaId = '';

const testApi = async () => {
  try {
    console.log('--- Running API Tests ---');

    // 1. Sign Up
    console.log('\n1. Signing up a new user...');
    const signupResponse = await axios.post(`${API_URL}/auth/signup`, testUser);
    console.log('Signup successful:', signupResponse.data);

    // 2. Log In
    console.log('\n2. Logging in...');
    const loginResponse = await axios.post(`${API_URL}/auth/login`, testUser);
    authToken = loginResponse.data.token;
    console.log('Login successful. Token received.');

    // 3. Upload Media
    console.log('\n3. Uploading media...');
    const form = new FormData();
    form.append('title', 'My Test Audio');
    form.append('type', 'audio');
    form.append('media', fs.createReadStream('dummy.txt'));

    const uploadResponse = await axios.post(`${API_URL}/media`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${authToken}`,
      },
    });
    mediaId = uploadResponse.data.id;
    console.log('Upload successful:', uploadResponse.data);

    // 4. Get Streaming URL
    console.log('\n4. Getting streaming URL...');
    const streamUrlResponse = await axios.get(`${API_URL}/media/${mediaId}/stream-url`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Streaming URL:', streamUrlResponse.data);

    // 5. Log View
    console.log('\n5. Logging a view...');
    const logViewResponse = await axios.post(
      `${API_URL}/analytics/media/${mediaId}/view`,
      {},
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
    console.log('View logged:', logViewResponse.data);

    // 6. Get Media Analytics
    console.log('\n6. Getting media analytics...');
    const mediaAnalyticsResponse = await axios.get(`${API_URL}/analytics/media/${mediaId}/analytics`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Media Analytics:', mediaAnalyticsResponse.data);

    // 7. Get Dashboard Analytics
    console.log('\n7. Getting dashboard analytics...');
    const dashboardResponse = await axios.get(`${API_URL}/analytics/dashboard`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    console.log('Dashboard Analytics:', dashboardResponse.data);

    console.log('\n--- API Tests Completed Successfully ---');
  } catch (error) {
    console.error('\n--- API Test Failed ---');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
};

testApi();
