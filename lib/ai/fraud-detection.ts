
import * as tf from '@tensorflow/tfjs';

export const createFraudModel = () => {
  const model = tf.sequential();
  // Capa Oculta (ReLU para no-linealidad)
  model.add(tf.layers.dense({ units: 10, activation: 'relu', inputShape: [3] })); 
  // Capa Salida (Sigmoid para probabilidad 0 a 1)
  model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' })); 
  
  model.compile({ optimizer: 'adam', loss: 'binaryCrossentropy' });
  return model;
};

// Inputs: [Monto (normalizado), Hora (0-24), EsExtranjero (0/1)]
export const detectFraud = async (model: tf.Sequential, input: number[]) => {
  const tensorInput = tf.tensor2d([input], [1, 3]);
  const prediction = model.predict(tensorInput) as tf.Tensor;
  return prediction.dataSync()[0]; // Retorna probabilidad
};
