// Simple test to verify the endpoint
const fetch = require('node-fetch');

const testEndpoint = async () => {
  try {
    const response = await fetch('http://localhost:5892/api/v1/account/test');
    const data = await response.json();
    console.log('Test endpoint response:', data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testEndpoint();