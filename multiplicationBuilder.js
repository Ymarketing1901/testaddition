
import { multiplicationSpec } from './multiplicationSpec.js';

// Utility: Generate a random integer between min and max inclusive, excluding 0 and 1
function getNonTrivialInt(min, max) {
  let val;
  do {
    val = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (val === 0 || val === 1);
  return val;
}

// Generate 3 tricky decoys
function generateDecoys(correct) {
  const decoys = new Set();
  while (decoys.size < 3) {
    const variantType = ["nearby", "plus10", "minus10", "digit_swap", "off_by_11"][Math.floor(Math.random() * 5)];
    let candidate;

    switch (variantType) {
      case "nearby":
        candidate = correct + (Math.random() < 0.5 ? -1 : 1) * getNonTrivialInt(2, 3);
        break;
      case "plus10":
        candidate = correct + 10;
        break;
      case "minus10":
        candidate = correct - 10;
        break;
      case "digit_swap":
        const digits = correct.toString().split('');
        if (digits.length > 1) {
          const i = Math.floor(Math.random() * digits.length);
          const j = (i + 1) % digits.length;
          [digits[i], digits[j]] = [digits[j], digits[i]];
          candidate = parseInt(digits.join(''), 10);
        } else {
          candidate = correct + 1;
        }
        break;
      case "off_by_11":
        candidate = correct + 11;
        break;
      default:
        candidate = correct + getNonTrivialInt(-3, 3);
    }

    if (candidate !== correct && candidate >= 0) {
      decoys.add(candidate);
    }
  }
  return Array.from(decoys);
}

// Core generator
export function generateMultiplicationQuestion(grade, difficulty) {
  const spec = multiplicationSpec[grade]?.[difficulty];
  if (!spec) {
    throw new Error('Invalid grade or difficulty for multiplication');
  }

  let a, b;

  if (spec.includes("2s table")) {
    a = 2;
    b = getNonTrivialInt(2, 9);
  } else if (spec.includes("3s table")) {
    a = 3;
    b = getNonTrivialInt(2, 9);
  } else if (spec.includes("4s") || spec.includes("5 table")) {
    a = getNonTrivialInt(4, 5);
    b = getNonTrivialInt(2, 9);
  } else if (spec.includes("6s") || spec.includes("7 table")) {
    a = getNonTrivialInt(6, 7);
    b = getNonTrivialInt(2, 9);
  } else if (spec.includes("single-digit × single-digit")) {
    a = getNonTrivialInt(2, 9);
    b = getNonTrivialInt(2, 9);
  } else if (spec.includes("max 20")) {
    a = getNonTrivialInt(2, 9);
    b = getNonTrivialInt(10, 20);
  } else if (spec.includes("max 30")) {
    a = getNonTrivialInt(2, 9);
    b = getNonTrivialInt(10, 30);
  } else if (spec.includes("max 50")) {
    a = getNonTrivialInt(2, 9);
    b = getNonTrivialInt(10, 50);
  } else if (spec.includes("2-digit (multiple of 5)")) {
    a = getNonTrivialInt(10, 99);
    a -= a % 5;
    b = getNonTrivialInt(10, 99);
  } else if (spec.includes("2-digit × 2-digit")) {
    a = getNonTrivialInt(10, 99);
    b = getNonTrivialInt(10, 99);
  } else {
    a = getNonTrivialInt(2, 9);
    b = getNonTrivialInt(2, 9);
  }

  const correct = a * b;
  const decoys = generateDecoys(correct);

  return {
    equation: `${a} × ${b}`,
    correctAnswer: correct,
    decoys,
    type: 'multiplication'
  };
}
