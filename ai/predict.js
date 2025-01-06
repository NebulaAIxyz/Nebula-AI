const tf = require('@tensorflow/tfjs-node');

async function loadModel() {
  try {
    return tf.sequential({
      layers: [
        tf.layers.dense({units: 1, inputShape: [1]})
      ]
    });
  } catch (error) {
    console.error('Failed to load model:', error);
    throw error;
  }
}

async function predict(model, data) {
  try {
    const tensor = tf.tensor2d(data.map(item => [item.value]), [data.length, 1]);
    const predictions = model.predict(tensor);
    return predictions.arraySync().map(pred => ({
      prediction: pred[0],
      confidence: Math.random() // Placeholder for confidence
    }));
  } catch (error) {
    console.error('Failed to make prediction:', error);
    throw error;
  }
}

module.exports = { loadModel, predict };
