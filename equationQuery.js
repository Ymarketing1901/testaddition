
import { generateAdditionQuestion } from './additionBuilder.js';

// Utility: Randomly pick one operation (only addition for now)
function pickOperation() {
  return 'addition'; // Extend with more ops in the future
}

// Main equation query function
export function generateEquation(grade, difficulty) {
  const operation = pickOperation();

  switch (operation) {
    case 'addition':
      return generateAdditionQuestion(grade, difficulty);
    default:
      throw new Error('Unsupported operation: ' + operation);
  }
}
