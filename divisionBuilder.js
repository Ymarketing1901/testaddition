
import { divisionSpec } from './divisionSpec.js';

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
        candidate = correct + (Math.random() < 0.5 ? -1 : 1) * getNonTrivialInt(1, 2);
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
        candidate = correct + getNonTrivialInt(-2, 2);
    }

    if (candidate !== correct && candidate >= 0) {
      decoys.add(candidate);
    }
  }
  return Array.from(decoys);
}

// Core generator
export function generateDivisionQuestion(grade, difficulty) {
  const spec = divisionSpec[grade]?.[difficulty];
  if (!spec) {
    throw new Error('Invalid grade or difficulty for division');
  }

  let dividend, divisor;

  if (spec.includes("2-digit ÷ 1-digit")) {
    divisor = getNonTrivialInt(2, 9);
    const quotient = getNonTrivialInt(2, 9);
    dividend = divisor * quotient;
  } else if (spec.includes("3-digit ÷ 1-digit")) {
    divisor = getNonTrivialInt(2, 9);
    const quotient = getNonTrivialInt(10, 99);
    dividend = divisor * quotient;
  } else if (spec.includes("3-digit ÷ 2-digit")) {
    divisor = getNonTrivialInt(10, 99);
    const quotient = getNonTrivialInt(2, 9);
    dividend = divisor * quotient;
  } else if (spec.includes("4-digit ÷ 2-digit")) {
    divisor = getNonTrivialInt(10, 99);
    const quotient = getNonTrivialInt(10, 99);
    dividend = divisor * quotient;
  } else {
    divisor = getNonTrivialInt(2, 9);
    const quotient = getNonTrivialInt(2, 9);
    dividend = divisor * quotient;
  }

  const correct = dividend / divisor;
  const decoys = generateDecoys(correct);

  return {
    equation: `${dividend} ÷ ${divisor}`,
    correctAnswer: correct,
    decoys,
    type: 'division'
  };
}
