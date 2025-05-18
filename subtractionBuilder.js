
import { subtractionSpec } from './subtractionSpec.js';

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
export function generateSubtractionQuestion(grade, difficulty) {
  const spec = subtractionSpec[grade]?.[difficulty];
  if (!spec) {
    throw new Error('Invalid grade or difficulty for subtraction');
  }

  let a, b;

  if (spec.includes("within 10")) {
    a = getNonTrivialInt(2, 10);
    b = getNonTrivialInt(2, a);
  } else if (spec.includes("2-digit - 1-digit")) {
    a = getNonTrivialInt(10, 99);
    b = getNonTrivialInt(2, 9);
  } else if (spec.includes("2-digit - 2-digit")) {
    b = getNonTrivialInt(10, 40);
    a = getNonTrivialInt(b, 99);
  } else if (spec.includes("3-digit - 2-digit")) {
    b = getNonTrivialInt(10, 99);
    a = getNonTrivialInt(b, 999);
  } else if (spec.includes("3-digit - 3-digit")) {
    b = getNonTrivialInt(100, 999);
    a = getNonTrivialInt(b, 999);
  } else if (spec.includes("4-digit - 3-digit")) {
    b = getNonTrivialInt(100, 999);
    a = getNonTrivialInt(b + 1, 9999);
  } else if (spec.includes("4-digit - 4-digit")) {
    b = getNonTrivialInt(1000, 9999);
    a = getNonTrivialInt(b, 9999);
  } else if (spec.includes("5-digit - 5-digit")) {
    b = getNonTrivialInt(10000, 99999);
    a = getNonTrivialInt(b, 99999);
  } else {
    a = getNonTrivialInt(2, 20);
    b = getNonTrivialInt(2, a);
  }

  const correct = a - b;
  const decoys = generateDecoys(correct);

  return {
    equation: `${a} - ${b}`,
    correctAnswer: correct,
    decoys,
    type: 'subtraction'
  };
}
