
import { pipeline } from '@xenova/transformers';

let classifier: any = null;

export const classifyTransaction = async (text: string, labels: string[]) => {
  if (!classifier) {
    classifier = await pipeline('zero-shot-classification', 'Xenova/mobilebert-uncased-mnli');
  }

  const result = await classifier(text, labels);
  return result;
};
