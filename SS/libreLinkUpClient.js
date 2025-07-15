const axios = require('axios');

const LIBRE_USERNAME = process.env.LIBRE_USERNAME;
const LIBRE_PASSWORD = process.env.LIBRE_PASSWORD;
const LIBRE_REGION = process.env.LIBRE_REGION || 'EU';

const BASE_URLS = {
  EU: 'https://api.eu.libreview.io',
  US: 'https://api-us.libreview.io'
};
const BASE_URL = BASE_URLS[LIBRE_REGION];

let session = null;

async function login() {
  const res = await axios.post(`${BASE_URL}/llu/auth/login`, {
    email: LIBRE_USERNAME,
    password: LIBRE_PASSWORD
  }, {
    headers: { 'version': '4.7.0' }
  });
  session = res.data.data;
  return session;
}

async function getGlucose() {
  if (!session) await login();
  const accountId = session.userId;
  const token = session.authTicket.token;

  // Get connections (shared sensors)
  const connectionsRes = await axios.get(`${BASE_URL}/llu/connections`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'version': '4.7.0'
    }
  });

  const connection = connectionsRes.data.data[0];
  const connectionId = connection.patientId;

  // Get glucose data
  const glucoseRes = await axios.get(`${BASE_URL}/llu/connections/${connectionId}/graph`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'version': '4.7.0'
    }
  });

  return glucoseRes.data.data;
}

module.exports = { getGlucose };