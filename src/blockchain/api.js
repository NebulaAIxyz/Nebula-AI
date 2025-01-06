const axios = require('axios');

const API_KEY = process.env.SOLANA_API_KEY;

async function getBlock(blockNumber) {
  try {
    const response = await axios.get(`https://api.solana.com/v1/block/${blockNumber}`, {
      headers: {
        'x-api-key': API_KEY
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get block:', error);
    throw error;
  }
}

module.exports = { getBlock };
