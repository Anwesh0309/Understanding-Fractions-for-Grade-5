const numberWords = {
  0: "zero", 1: "one", 2: "two", 3: "three", 4: "four", 5: "five",
  6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten",
  11: "eleven", 12: "twelve", 13: "thirteen", 14: "fourteen", 15: "fifteen",
  16: "sixteen", 17: "seventeen", 18: "eighteen", 19: "nineteen", 20: "twenty",
  21: "twenty-one", 22: "twenty-two", 23: "twenty-three", 24: "twenty-four",
  25: "twenty-five", 31: "thirty-one"
};

const denomSingular = {
  2: "half", 3: "third", 4: "fourth", 5: "fifth", 6: "sixth",
  7: "seventh", 8: "eighth", 9: "ninth", 10: "tenth",
  12: "twelfth", 14: "fourteenth", 15: "fifteenth", 16: "sixteenth",
  20: "twentieth", 24: "twenty-fourth"
};

const denomPlural = {
  2: "halves", 3: "thirds", 4: "fourths", 5: "fifths", 6: "sixths",
  7: "sevenths", 8: "eighths", 9: "ninths", 10: "tenths",
  12: "twelfths", 14: "fourteenths", 15: "fifteenths", 16: "sixteenths",
  20: "twentieths", 24: "twenty-fourths"
};

function formatFraction(numStr, denStr) {
  const num = parseInt(numStr, 10);
  const den = parseInt(denStr, 10);
  const numWord = numberWords[num] || String(num);

  if (num === 1 && denomSingular[den]) {
    return `${numWord} ${denomSingular[den]}`;
  }
  if (denomPlural[den]) {
    return `${numWord} ${denomPlural[den]}`;
  }
  return `${numWord} over ${numberWords[den] || den}`;
}

export function toPronunciationText(text) {
  if (!text) return "";

  let res = text;

  // Handle currency: $60 -> 60 dollars
  res = res.replace(/\$(\d+)/g, "$1 dollars");

  // Handle units
  res = res.replace(/\bkg\b/g, "kilograms");
  res = res.replace(/\bL\b/g, "liters");
  res = res.replace(/\bm\b/g, "meters");
  res = res.replace(/\bhr\b/g, "hours");

  // Missing values:
  // e.g. "? / 15" -> "what number over 15"
  res = res.replace(/\?\s*\/\s*(\d+)/g, "what number over $1");
  // e.g. "9 / ?" -> "9 over what number"
  res = res.replace(/(\d+)\s*\/\s*\?/g, "$1 over what number");
  // e.g. "= ?" -> "= what number"
  res = res.replace(/=\s*\?/g, "equals what number");

  // Comparison blanks: "4/5 ___ 7/10" -> "4/5 is greater than or less than 7/10"
  res = res.replace(/_{2,}/g, "is blank compared to");

  // Mixed numbers: "3 2/5" -> "3 and 2/5"
  res = res.replace(/(\d+)\s+(\d+)\/(\d+)/g, (match, whole, n, d) => {
    const wholeWord = numberWords[parseInt(whole, 10)] || whole;
    const fracWord = formatFraction(n, d);
    return `${wholeWord} and ${fracWord}`;
  });

  // Standalone fractions: "4/6" -> "four sixths"
  res = res.replace(/(^|[^\d/])(\d+)\/(\d+)([^\d/]|$)/g, (match, prefix, n, d, suffix) => {
    return prefix + formatFraction(n, d) + suffix;
  });

  // Math operators
  res = res.replace(/\s*×\s*/g, " times ");
  res = res.replace(/\s*÷\s*/g, " divided by ");
  res = res.replace(/\s*\+\s*/g, " plus ");
  res = res.replace(/\s*-\s*/g, " minus ");
  res = res.replace(/\s*=\s*/g, " equals ");

  // Cleanup spaces
  res = res.replace(/\s{2,}/g, " ").trim();

  return res;
}
