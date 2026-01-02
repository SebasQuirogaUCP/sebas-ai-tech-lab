
import * as tf from '@tensorflow/tfjs';

export const trainLinearModel = async (xValues: number[], yValues: number[]) => {
  // 1. Definir el modelo (1 neurona, entrada simple)
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

  // 2. Compilar (Optimizer: SGD, Loss: Mean Squared Error)
  model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

  // 3. Convertir datos a Tensores
  const xs = tf.tensor2d(xValues, [xValues.length, 1]);
  const ys = tf.tensor2d(yValues, [yValues.length, 1]);

  // 4. Entrenar
  await model.fit(xs, ys, { epochs: 100 });
  
  return model; 
};

export const predictFuture = (model: tf.Sequential, val: number) => {
  const output = model.predict(tf.tensor2d([val], [1, 1])) as tf.Tensor;
  return output.dataSync()[0];
}
