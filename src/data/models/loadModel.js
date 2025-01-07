const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
  try {
    const modelPath = process.env.MODEL_PATH || './data/models/model.json';
    return await tf.loadLayersModel(`file://${modelPath}`);
  } catch (error) {
    console.error('Failed to load model:', error);
    throw error;
  }
}

module.exports = { loadModel };
