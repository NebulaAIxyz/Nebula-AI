const axios = require('axios');

const API_KEY = process.env.SOLANA_API_KEY;

async function fetchBlockchainData() {
  try {
    const response = await axios.get('https://api.solana.com/v1/blocks/latest', {
      headers: {
        'x-api-key': API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch blockchain data:', error);
    throw error;
  }
}

module.exports = { fetchBlockchainData };
