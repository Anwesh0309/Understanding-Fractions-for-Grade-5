/**
 * Fraction Math Utility Library for Primary 5 Math (Singapore MOE Syllabus)
 */

// Greatest Common Divisor (Euclidean algorithm)
export function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a || 1;
}

// Least Common Multiple
export function lcm(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs((a * b) / gcd(a, b));
}

// Simplify fraction to lowest terms
export function simplify(numerator, denominator) {
  if (denominator === 0) return { num: 0, den: 1 };
  const divisor = gcd(numerator, denominator);
  return {
    num: Math.round(numerator / divisor),
    den: Math.round(denominator / divisor)
  };
}

// Convert improper fraction to mixed number object
export function toMixedNumber(numerator, denominator) {
  const { num, den } = simplify(numerator, denominator);
  const whole = Math.floor(num / den);
  const remNum = num % den;
  return { whole, num: remNum, den };
}

// Convert mixed number to improper fraction object
export function toImproperFraction(whole, num, den) {
  return {
    num: whole * den + num,
    den
  };
}

// Add two fractions: f1 = {num, den}, f2 = {num, den}
export function addFractions(f1, f2) {
  const commonDen = lcm(f1.den, f2.den);
  const num1 = f1.num * (commonDen / f1.den);
  const num2 = f2.num * (commonDen / f2.den);
  const totalNum = num1 + num2;
  const simplified = simplify(totalNum, commonDen);
  const mixed = toMixedNumber(simplified.num, simplified.den);
  return {
    commonDen,
    num1,
    num2,
    rawNum: totalNum,
    simplifiedNum: simplified.num,
    simplifiedDen: simplified.den,
    mixed
  };
}

// Subtract two fractions: f1 - f2
export function subtractFractions(f1, f2) {
  const commonDen = lcm(f1.den, f2.den);
  const num1 = f1.num * (commonDen / f1.den);
  const num2 = f2.num * (commonDen / f2.den);
  const totalNum = num1 - num2;
  const simplified = simplify(totalNum, commonDen);
  const mixed = toMixedNumber(simplified.num, simplified.den);
  return {
    commonDen,
    num1,
    num2,
    rawNum: totalNum,
    simplifiedNum: simplified.num,
    simplifiedDen: simplified.den,
    mixed
  };
}

// Multiply fraction by whole number
export function multiplyFractionByWhole(fraction, whole) {
  const rawNum = fraction.num * whole;
  const simplified = simplify(rawNum, fraction.den);
  const mixed = toMixedNumber(simplified.num, simplified.den);
  return {
    rawNum,
    den: fraction.den,
    simplifiedNum: simplified.num,
    simplifiedDen: simplified.den,
    mixed
  };
}

// Divide whole number by fraction: whole ÷ (num/den) = whole * (den/num)
export function divideWholeByFraction(whole, fraction) {
  const rawNum = whole * fraction.den;
  const rawDen = fraction.num;
  const simplified = simplify(rawNum, rawDen);
  const mixed = toMixedNumber(simplified.num, simplified.den);
  return {
    rawNum,
    rawDen,
    simplifiedNum: simplified.num,
    simplifiedDen: simplified.den,
    mixed
  };
}

// Divide fraction by whole number: (num/den) ÷ whole = num / (den * whole)
export function divideFractionByWhole(fraction, whole) {
  const rawNum = fraction.num;
  const rawDen = fraction.den * whole;
  const simplified = simplify(rawNum, rawDen);
  return {
    simplifiedNum: simplified.num,
    simplifiedDen: simplified.den
  };
}

// Compare two fractions
export function compareFractions(f1, f2) {
  const val1 = f1.num / f1.den;
  const val2 = f2.num / f2.den;
  if (val1 < val2) return -1;
  if (val1 > val2) return 1;
  return 0;
}
