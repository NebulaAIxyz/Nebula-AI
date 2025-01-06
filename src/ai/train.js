const tf = require('@tensorflow/tfjs-node');

async function trainModel(data) {
  try {
    // Create a more complex model with additional layers and dropout for regularization
    const model = tf.sequential({
      layers: [
        tf.layers.dense({units: 64, activation: 'relu', inputShape: [1]}),  // Input layer with 64 neurons
        tf.layers.dropout({rate: 0.2}),  // Dropout layer for regularization
        tf.layers.dense({units: 128, activation: 'relu'}),  // Hidden layer with 128 neurons
        tf.layers.dense({units: 1})  // Output layer
      ]
    });

    // Use the Adam optimizer for better performance and an advanced loss function
    model.compile({
      optimizer: tf.train.adam(),
      loss: 'meanAbsoluteError',  // Switching to a more stable loss function for certain tasks
      metrics: ['mae']  // Adding metrics to track during training
    });

    // Dummy training data
    const xs = tf.tensor2d(data.map(d => [d.input]));
    const ys = tf.tensor2d(data.map(d => [d.output]));

    // Use validation split and batching for better training management
    const batchSize = 32;
    const validationSplit = 0.2;

    // Implement callbacks like EarlyStopping to avoid overfitting
    const earlyStopping = tf.callbacks.earlyStopping({
      monitor: 'loss',
      patience: 10,
      restoreBestWeights: true
    });

    // Train the model with advanced settings like validation data and callbacks
    await model.fit(xs, ys, {
      epochs: 100,
      batchSize: batchSize,
      validationSplit: validationSplit,
      callbacks: [earlyStopping]
    });

    console.log('Model trained successfully');
    return model;
  } catch (error) {
    console.error('Failed to train model:', error);
    throw error;
  }
}

module.exports = { trainModel };
