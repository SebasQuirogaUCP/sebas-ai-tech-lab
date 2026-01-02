
/**
 * Episodio 1: Perceptrón (El Juez)
 * Lógica manual sin librerías externas.
 */
export const runPerceptron = (
  precio: number, 
  necesidad: number, 
  weights: { w1: number, w2: number, bias: number }
) => {
  // Fórmula: (Precio * Peso1) + (Necesidad * Peso2) + Bias
  const activation = (precio * -weights.w1) + (necesidad * weights.w2) + weights.bias;
  
  // Función de Activación (Escalón)
  const decision = activation > 0 ? 1 : 0; 
  return { decision, activation };
};

export const PERCEPTRON_CODE = `export const runPerceptron = (precio, necesidad, weights) => {
  // Fórmula fundamental de la neurona:
  // (Precio * Peso1) + (Necesidad * Peso2) + Sesgo
  const activation = (precio * -weights.w1) + (necesidad * weights.w2) + weights.bias;
  
  // Función de Activación (Función Escalón)
  // Retorna 1 (Aprobado) si la suma es mayor a cero.
  const decision = activation > 0 ? 1 : 0; 
  return { decision, activation };
};`;
