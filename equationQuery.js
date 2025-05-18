
import { generateAdditionQuestion } from './additionBuilder.js';
import { generateSubtractionQuestion } from './subtractionBuilder.js';
import { generateMultiplicationQuestion } from './multiplicationBuilder.js';
import { generateDivisionQuestion } from './divisionBuilder.js';

// Utility: Randomly pick one operation from supported types
function pickOperation() {
  const operations = ['addition', 'subtraction', 'multiplication', 'division'];
  return operations[Math.floor(Math.random() * operations.length)];
}

// Main equation query function
export function generateEquation(grade, difficulty) {
  const operation = pickOperation();

  switch (operation) {
    case 'addition':
      return generateAdditionQuestion(grade, difficulty);
    case 'subtraction':
      return generateSubtractionQuestion(grade, difficulty);
    case 'multiplication':
      return generateMultiplicationQuestion(grade, difficulty);
    case 'division':
      return generateDivisionQuestion(grade, difficulty);
    default:
      throw new Error('Unsupported operation: ' + operation);
  }
}
