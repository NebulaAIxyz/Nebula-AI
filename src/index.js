const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const { fetchBlockchainData } = require('./blockchain/explorer');
const { loadModel, predict } = require('./ai/predict');

// Middleware
app.use(express.json());

app.get('/api/blockchain', async (req, res) => {
  try {
    const data = await fetchBlockchainData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching blockchain data' });
  }
});

app.get('/api/predict', async (req, res) => {
  try {
    const model = await loadModel();
    const data = await fetchBlockchainData();
    const predictions = await predict(model, data);
    res.status(200).json(predictions);
  } catch (error) {
    res.status(500).json({ error: 'Error making predictions' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
