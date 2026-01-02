
/**
 * Ep 6: El Estratega (Reinforcement Learning)
 * El agente aprende mediante una función de recompensa.
 */
export const STRATEGIST_CODE = `// Ecuación de Bellman Simplificada
// Q(s,a) = (1-lr) * Q(s,a) + lr * (reward + gamma * max(Q(s', a')))

export const updateStrategy = (reward, riskTolerance) => {
  // Si la ganancia > 0, reforzamos la acción tomada
  // Si el riesgo es alto, penalizamos la volatilidad
  const strategyAdjustment = reward * (1 - riskTolerance);
  return strategyAdjustment;
};`;
