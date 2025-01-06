const tf = require('@tensorflow/tfjs-node');
const { Connection, PublicKey } = require('@solana/web3.js');
const fs = require('fs');

// Solana network setup
const SOLANA_RPC_URL = "https://api.mainnet-beta.solana.com";
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

// Function to load the model, now with persistence
async function loadModel(modelPath) {
  try {
    if (fs.existsSync(modelPath)) {
      const model = await tf.loadLayersModel(`file://${modelPath}`);
      console.log('Loaded existing model from file.');
      return model;
    } else {
      const model = tf.sequential({
        layers: [
          tf.layers.dense({units: 128, activation: 'relu', inputShape: [1]}),  // Input layer with 128 neurons
          tf.layers.dense({units: 64, activation: 'relu'}),  // Hidden layer with 64 neurons
          tf.layers.dense({units: 1})  // Output layer
        ]
      });
      model.compile({
        optimizer: tf.train.adam(),
        loss: 'meanSquaredError',
        metrics: ['mae']
      });
      console.log('Created a new model.');
      return model;
    }
  } catch (error) {
    console.error('Failed to load model:', error);
    throw error;
  }
}

// Function to fetch transaction data from Solana blockchain
async function fetchSolanaData(publicKey) {
  try {
    // Fetching confirmed transactions for a specific public key
    const transactions = await connection.getConfirmedSignaturesForAddress2(new PublicKey(publicKey), {limit: 10});
    
    // Extracting relevant data (e.g., transaction amounts) for training the model
    const data = transactions.map(tx => ({
      value: tx.signature.length // Placeholder, you can use transaction amounts or other metrics
    }));
    return data;
  } catch (error) {
    console.error('Failed to fetch Solana data:', error);
    throw error;
  }
}

// Function to train the model with Solana transaction data
async function trainModel(model, data) {
  try {
    const xs = tf.tensor2d(data.map(d => [d.value]));  // Feature input (e.g., transaction value)
    const ys = tf.tensor2d(data.map(d => [d.value]));  // Target output (e.g., prediction for next transaction value)

    await model.fit(xs, ys, {
      epochs: 100,
      batchSize: 32,
      validationSplit: 0.2
    });

    // Save model after training
    await model.save('file://./model');
    console.log('Model trained and saved.');
    return model;
  } catch (error) {
    console.error('Failed to train model:', error);
    throw error;
  }
}

// Function to make predictions with the model, using Solana data
async function predict(model, data) {
  try {
    const tensor = tf.tensor2d(data.map(item => [item.value]), [data.length, 1]);
    const predictions = model.predict(tensor);
    
    // Returning predictions with a confidence value based on randomness (for illustration purposes)
    return predictions.arraySync().map(pred => ({
      prediction: pred[0],
      confidence: Math.random()  // Placeholder for confidence (you can calculate a real confidence level here)
    }));
  } catch (error) {
    console.error('Failed to make prediction:', error);
    throw error;
  }
}

// Example usage
(async () => {
  const publicKey = "YourPublicKeyHere"; // Use a valid Solana address
  const model = await loadModel('./model/model.json');
  const data = await fetchSolanaData(publicKey);
  
  if (data.length > 0) {
    const trainedModel = await trainModel(model, data);
    const predictions = await predict(trainedModel, data);
    console.log(predictions);
  }
})();

module.exports = { loadModel, trainModel, predict, fetchSolanaData };
