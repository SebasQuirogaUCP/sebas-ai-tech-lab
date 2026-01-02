
import * as tf from '@tensorflow/tfjs';

export const createLSTMModel = () => {
  const model = tf.sequential();
  // LSTM layer requiere input 3D: [samples, timeSteps, features]
  model.add(tf.layers.lstm({ units: 20, returnSequences: false, inputShape: [5, 1] }));
  model.add(tf.layers.dense({ units: 1 }));
  
  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
  return model;
};
