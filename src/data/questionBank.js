import { simplify, addFractions, subtractFractions, multiplyFractionByWhole, divideWholeByFraction, divideFractionByWhole, toMixedNumber, toImproperFraction } from '../utils/fractionMath';

/**
 * Question Bank — 100 Question Templates across 10 Worlds (F1 to F10)
 * All character names are Westernized.
 */

// Helper to shuffle array deterministically
function shuffle(array, seed) {
  const arr = [...array];
  let m = arr.length, t, i;
  while (m) {
    i = Math.floor(Math.sin(seed++) * 10000) % m;
    m--;
    t = arr[m];
    arr[m] = arr[i];
    arr[i] = t;
  }
  return arr;
}

export const rawQuestionBank = [
  // ==========================================
  // WORLD 1: Pizza Piazza (F1 Equivalent & Simplest Form)
  // ==========================================
  {
    id: "F1-01",
    worldId: "pizza-piazza",
    subtopic: "F1",
    conceptTitle: "SIMPLIFY FRACTION",
    generate: (rngSeed) => {
      const nums = [4, 6, 8, 9, 10, 12, 14, 15];
      const mults = [2, 3, 4];
      const baseNum = 2;
      const baseDen = 3;
      const factor = mults[Math.floor(rngSeed % mults.length)];
      const num = baseNum * factor;
      const den = baseDen * factor;
      const simplified = simplify(num, den);
      const correctAnswer = `${simplified.num}/${simplified.den}`;
      const distractors = [
        `${num - 1}/${den}`,
        `${num}/${den - 1}`,
        `${simplified.num + 1}/${simplified.den}`
      ];
      const stemText = `Express the fraction ${num}/${den} in its simplest form.`;
      return { stemText, correctAnswer, distractors, narrationText: stemText };
    }
  },
  {
    id: "F1-02",
    worldId: "pizza-piazza",
    subtopic: "F1",
    conceptTitle: "EQUIVALENT FRACTION",
    generate: (rngSeed) => {
      const baseN = 3, baseD = 4;
      const factor = 3;
      const num = baseN * factor;
      const den = baseD * factor;
      const correctAnswer = `${num}/${den}`;
      const stemText = `Which fraction is equivalent to 3/4?`;
      const distractors = ["5/6", "4/5", "7/10"];
      return { stemText, correctAnswer, distractors, narrationText: stemText };
    }
  },
  {
    id: "F1-03",
    worldId: "pizza-piazza",
    subtopic: "F1",
    conceptTitle: "FIND MISSING NUMERATOR",
    generate: (rngSeed) => {
      const num = 2, den = 5;
      const targetDen = 15;
      const missing = (num * targetDen) / den;
      const correctAnswer = `${missing}`;
      const stemText = `Find the missing number: 2/5 = ? / 15`;
      const distractors = ["4", "5", "8"];
      return { stemText, correctAnswer, distractors, narrationText: stemText };
    }
  },
  {
    id: "F1-04",
    worldId: "pizza-piazza",
    subtopic: "F1",
    conceptTitle: "SIMPLIFY 8/12",
    generate: () => ({
      stemText: "Oliver ate 8 out of 12 pizza slices. What fraction of the pizza did he eat in simplest form?",
      correctAnswer: "2/3",
      distractors: ["4/6", "3/4", "1/2"],
      narrationText: "Oliver ate 8 out of 12 pizza slices. What fraction of the pizza did he eat in simplest form?"
    })
  },
  {
    id: "F1-05",
    worldId: "pizza-piazza",
    subtopic: "F1",
    conceptTitle: "CHECK EQUIVALENCE",
    generate: () => ({
      stemText: "Which pair of fractions are equivalent?",
      correctAnswer: "4/10 and 2/5",
      distractors: ["3/4 and 4/5", "2/3 and 5/6", "3/8 and 1/2"],
      narrationText: "Which pair of fractions are equivalent?"
    })
  },
  {
    id: "F1-06",
    worldId: "pizza-piazza",
    subtopic: "F1",
    conceptTitle: "SIMPLIFY 10/15",
    generate: () => ({
      stemText: "Emma cut a pie into 15 slices and served 10. What is 10/15 in simplest form?",
      correctAnswer: "2/3",
      distractors: ["1/3", "3/5", "5/6"],
      narrationText: "Emma cut a pie into 15 slices and served 10. What is 10/15 in simplest form?"
    })
  },
  {
    id: "F1-07",
    worldId: "pizza-piazza",
    subtopic: "F1",
    conceptTitle: "EQUIVALENT FRACTION",
    generate: () => ({
      stemText: "What is 5/8 with a denominator of 16?",
      correctAnswer: "10/16",
      distractors: ["8/16", "12/16", "15/16"],
      narrationText: "What is 5/8 with a denominator of 16?"
    })
  },
  {
    id: "F1-08",
    worldId: "pizza-piazza",
    subtopic: "F1",
    conceptTitle: "SIMPLEST FORM",
    generate: () => ({
      stemText: "Express 6/18 in simplest form.",
      correctAnswer: "1/3",
      distractors: ["2/6", "3/9", "1/2"],
      narrationText: "Express 6/18 in simplest form."
    })
  },
  {
    id: "F1-09",
    worldId: "pizza-piazza",
    subtopic: "F1",
    conceptTitle: "MISSING DENOMINATOR",
    generate: () => ({
      stemText: "Find the missing denominator: 3/4 = 9 / ?",
      correctAnswer: "12",
      distractors: ["10", "15", "16"],
      narrationText: "Find the missing denominator: 3/4 equals 9 over what number?"
    })
  },
  {
    id: "F1-10",
    worldId: "pizza-piazza",
    subtopic: "F1",
    conceptTitle: "WORD PROBLEM",
    generate: () => ({
      stemText: "Lucas shaded 12 out of 16 squares on a grid. What fraction of the grid is shaded in simplest form?",
      correctAnswer: "3/4",
      distractors: ["6/8", "2/3", "4/5"],
      narrationText: "Lucas shaded 12 out of 16 squares on a grid. What fraction of the grid is shaded in simplest form?"
    })
  },

  // ==========================================
  // WORLD 2: Ribbon Row (F2 Comparing & Ordering)
  // ==========================================
  {
    id: "F2-01",
    worldId: "ribbon-row",
    subtopic: "F2",
    conceptTitle: "COMPARE FRACTIONS",
    generate: () => ({
      stemText: "Which fraction is larger: 2/3 or 3/5?",
      correctAnswer: "2/3",
      distractors: ["3/5", "They are equal", "Cannot be compared"],
      narrationText: "Which fraction is larger: 2/3 or 3/5?"
    })
  },
  {
    id: "F2-02",
    worldId: "ribbon-row",
    subtopic: "F2",
    conceptTitle: "ORDER ASCENDING",
    generate: () => ({
      stemText: "Arrange in increasing order: 1/2, 2/3, 5/12.",
      correctAnswer: "5/12, 1/2, 2/3",
      distractors: ["1/2, 5/12, 2/3", "2/3, 1/2, 5/12", "5/12, 2/3, 1/2"],
      narrationText: "Arrange in increasing order: 1/2, 2/3, 5/12."
    })
  },
  {
    id: "F2-03",
    worldId: "ribbon-row",
    subtopic: "F2",
    conceptTitle: "COMPARE WITH 1/2",
    generate: () => ({
      stemText: "Which fraction is greater than 1/2?",
      correctAnswer: "4/7",
      distractors: ["3/8", "2/5", "4/9"],
      narrationText: "Which fraction is greater than 1/2?"
    })
  },
  {
    id: "F2-04",
    worldId: "ribbon-row",
    subtopic: "F2",
    conceptTitle: "SMALLEST FRACTION",
    generate: () => ({
      stemText: "Which of the following is the smallest fraction: 3/4, 5/8, 7/12, 1/2?",
      correctAnswer: "1/2",
      distractors: ["7/12", "5/8", "3/4"],
      narrationText: "Which of the following is the smallest fraction: 3/4, 5/8, 7/12, 1/2?"
    })
  },
  {
    id: "F2-05",
    worldId: "ribbon-row",
    subtopic: "F2",
    conceptTitle: "RIBBON LENGTH",
    generate: () => ({
      stemText: "Ava has 3/4 m of red ribbon and Charlotte has 5/6 m of blue ribbon. Who has more ribbon?",
      correctAnswer: "Charlotte (5/6 m)",
      distractors: ["Ava (3/4 m)", "Both have the same", "Cannot be determined"],
      narrationText: "Ava has 3/4 meter of red ribbon and Charlotte has 5/6 meter of blue ribbon. Who has more ribbon?"
    })
  },
  {
    id: "F2-06",
    worldId: "ribbon-row",
    subtopic: "F2",
    conceptTitle: "COMPARE FRACTIONS",
    generate: () => ({
      stemText: "Fill in the blank: 4/5 ___ 7/10",
      correctAnswer: ">",
      distractors: ["<", "=", "≤"],
      narrationText: "Fill in the blank: 4/5 is greater than or less than 7/10?"
    })
  },
  {
    id: "F2-07",
    worldId: "ribbon-row",
    subtopic: "F2",
    conceptTitle: "ORDER DESCENDING",
    generate: () => ({
      stemText: "Arrange in decreasing order: 3/4, 5/6, 2/3.",
      correctAnswer: "5/6, 3/4, 2/3",
      distractors: ["2/3, 3/4, 5/6", "3/4, 5/6, 2/3", "5/6, 2/3, 3/4"],
      narrationText: "Arrange in decreasing order: 3/4, 5/6, 2/3."
    })
  },
  {
    id: "F2-08",
    worldId: "ribbon-row",
    subtopic: "F2",
    conceptTitle: "LARGEST FRACTION",
    generate: () => ({
      stemText: "Which fraction is the largest: 5/6, 7/9, 3/4, 11/12?",
      correctAnswer: "11/12",
      distractors: ["5/6", "7/9", "3/4"],
      narrationText: "Which fraction is the largest: 5/6, 7/9, 3/4, 11/12?"
    })
  },
  {
    id: "F2-09",
    worldId: "ribbon-row",
    subtopic: "F2",
    conceptTitle: "COMPARE UNLIKE",
    generate: () => ({
      stemText: "Which statement is true?",
      correctAnswer: "3/8 < 5/12",
      distractors: ["3/8 > 5/12", "3/8 = 5/12", "5/12 < 1/3"],
      narrationText: "Which statement is true?"
    })
  },
  {
    id: "F2-10",
    worldId: "ribbon-row",
    subtopic: "F2",
    conceptTitle: "WORD PROBLEM",
    generate: () => ({
      stemText: "Jack ran 5/8 of a mile and Ethan ran 2/3 of a mile. Who ran further?",
      correctAnswer: "Ethan (2/3 mile)",
      distractors: ["Jack (5/8 mile)", "They ran equal distance", "Neither"],
      narrationText: "Jack ran 5/8 of a mile and Ethan ran 2/3 of a mile. Who ran further?"
    })
  },

  // ==========================================
  // WORLD 3: Bakery Blend (F3 Adding Like Fractions)
  // ==========================================
  {
    id: "F3-01",
    worldId: "bakery-blend",
    subtopic: "F3",
    conceptTitle: "ADD LIKE FRACTIONS",
    generate: () => ({
      stemText: "What is 3/8 + 4/8?",
      correctAnswer: "7/8",
      distractors: ["7/16", "1/8", "6/8"],
      narrationText: "What is 3/8 plus 4/8?"
    })
  },
  {
    id: "F3-02",
    worldId: "bakery-blend",
    subtopic: "F3",
    conceptTitle: "ADD TO MIXED NUMBER",
    generate: () => ({
      stemText: "Calculate 5/8 + 4/8 and express as a mixed number.",
      correctAnswer: "1 1/8",
      distractors: ["9/16", "1 2/8", "9/8"],
      narrationText: "Calculate 5/8 plus 4/8 and express as a mixed number."
    })
  },
  {
    id: "F3-03",
    worldId: "bakery-blend",
    subtopic: "F3",
    conceptTitle: "SIMPLIFY SUM",
    generate: () => ({
      stemText: "Find 2/10 + 4/10 in simplest form.",
      correctAnswer: "3/5",
      distractors: ["6/10", "3/10", "6/20"],
      narrationText: "Find 2/10 plus 4/10 in simplest form."
    })
  },
  {
    id: "F3-04",
    worldId: "bakery-blend",
    subtopic: "F3",
    conceptTitle: "BAKERY RECIPE",
    generate: () => ({
      stemText: "Mia used 3/6 kg of sugar for muffins and 2/6 kg of sugar for cake. How much sugar did she use in total?",
      correctAnswer: "5/6 kg",
      distractors: ["5/12 kg", "1/6 kg", "1 kg"],
      narrationText: "Mia used 3/6 kg of sugar for muffins and 2/6 kg of sugar for cake. How much sugar did she use in total?"
    })
  },
  {
    id: "F3-05",
    worldId: "bakery-blend",
    subtopic: "F3",
    conceptTitle: "ADD LIKE FRACTIONS",
    generate: () => ({
      stemText: "What is 7/12 + 5/12?",
      correctAnswer: "1",
      distractors: ["12/24", "1 1/12", "11/12"],
      narrationText: "What is 7/12 plus 5/12?"
    })
  },
  {
    id: "F3-06",
    worldId: "bakery-blend",
    subtopic: "F3",
    conceptTitle: "RENAME TO MIXED",
    generate: () => ({
      stemText: "Add 4/5 + 3/5.",
      correctAnswer: "1 2/5",
      distractors: ["7/10", "1 1/5", "7/5"],
      narrationText: "Add 4/5 plus 3/5."
    })
  },
  {
    id: "F3-07",
    worldId: "bakery-blend",
    subtopic: "F3",
    conceptTitle: "ADD 3 LIKE FRACTIONS",
    generate: () => ({
      stemText: "Find 1/9 + 4/9 + 2/9.",
      correctAnswer: "7/9",
      distractors: ["7/27", "2/3", "8/9"],
      narrationText: "Find 1/9 plus 4/9 plus 2/9."
    })
  },
  {
    id: "F3-08",
    worldId: "bakery-blend",
    subtopic: "F3",
    conceptTitle: "SIMPLIFY RESULT",
    generate: () => ({
      stemText: "Calculate 3/15 + 7/15 in simplest form.",
      correctAnswer: "2/3",
      distractors: ["10/15", "1/3", "2/5"],
      narrationText: "Calculate 3/15 plus 7/15 in simplest form."
    })
  },
  {
    id: "F3-09",
    worldId: "bakery-blend",
    subtopic: "F3",
    conceptTitle: "WORD PROBLEM",
    generate: () => ({
      stemText: "Noah ate 2/7 of a pie and Sophia ate 3/7 of the same pie. What fraction of the pie did they eat together?",
      correctAnswer: "5/7",
      distractors: ["5/14", "1/7", "6/7"],
      narrationText: "Noah ate 2/7 of a pie and Sophia ate 3/7 of the same pie. What fraction of the pie did they eat together?"
    })
  },
  {
    id: "F3-10",
    worldId: "bakery-blend",
    subtopic: "F3",
    conceptTitle: "ADD LIKE FRACTIONS",
    generate: () => ({
      stemText: "What is 5/14 + 3/14 in simplest form?",
      correctAnswer: "4/7",
      distractors: ["8/14", "2/7", "8/28"],
      narrationText: "What is 5/14 plus 3/14 in simplest form?"
    })
  },

  // ==========================================
  // WORLD 4: Garden Grove (F4 Adding Unlike Fractions)
  // ==========================================
  {
    id: "F4-01",
    worldId: "garden-grove",
    subtopic: "F4",
    conceptTitle: "ADD UNLIKE FRACTIONS",
    generate: () => ({
      stemText: "What is 1/3 + 1/4?",
      correctAnswer: "7/12",
      distractors: ["2/7", "2/12", "5/12"],
      narrationText: "What is 1/3 plus 1/4?"
    })
  },
  {
    id: "F4-02",
    worldId: "garden-grove",
    subtopic: "F4",
    conceptTitle: "ADD UNLIKE FRACTIONS",
    generate: () => ({
      stemText: "Calculate 1/2 + 2/5.",
      correctAnswer: "9/10",
      distractors: ["3/7", "3/10", "7/10"],
      narrationText: "Calculate 1/2 plus 2/5."
    })
  },
  {
    id: "F4-03",
    worldId: "garden-grove",
    subtopic: "F4",
    conceptTitle: "GARDEN SEEDS",
    generate: () => ({
      stemText: "Liam planted sunflowers in 2/5 of his garden and roses in 1/3. What fraction of his garden has flowers?",
      correctAnswer: "11/15",
      distractors: ["3/8", "3/15", "8/15"],
      narrationText: "Liam planted sunflowers in 2/5 of his garden and roses in 1/3. What fraction of his garden has flowers?"
    })
  },
  {
    id: "F4-04",
    worldId: "garden-grove",
    subtopic: "F4",
    conceptTitle: "ADD UNLIKE FRACTIONS",
    generate: () => ({
      stemText: "Find 3/4 + 1/6 in simplest form.",
      correctAnswer: "11/12",
      distractors: ["4/10", "9/12", "7/12"],
      narrationText: "Find 3/4 plus 1/6 in simplest form."
    })
  },
  {
    id: "F4-05",
    worldId: "garden-grove",
    subtopic: "F4",
    conceptTitle: "ADD TO MIXED NUMBER",
    generate: () => ({
      stemText: "Calculate 2/3 + 3/4.",
      correctAnswer: "1 5/12",
      distractors: ["5/7", "1 1/12", "17/12"],
      narrationText: "Calculate 2/3 plus 3/4."
    })
  },
  {
    id: "F4-06",
    worldId: "garden-grove",
    subtopic: "F4",
    conceptTitle: "LCD STEP",
    generate: () => ({
      stemText: "What is the least common denominator needed to add 3/8 and 1/6?",
      correctAnswer: "24",
      distractors: ["48", "14", "16"],
      narrationText: "What is the least common denominator needed to add 3/8 and 1/6?"
    })
  },
  {
    id: "F4-07",
    worldId: "garden-grove",
    subtopic: "F4",
    conceptTitle: "ADD UNLIKE FRACTIONS",
    generate: () => ({
      stemText: "What is 3/8 + 1/6?",
      correctAnswer: "13/24",
      distractors: ["4/14", "4/24", "11/24"],
      narrationText: "What is 3/8 plus 1/6?"
    })
  },
  {
    id: "F4-08",
    worldId: "garden-grove",
    subtopic: "F4",
    conceptTitle: "WATERING CAN",
    generate: () => ({
      stemText: "Amelia poured 1/4 liter of water, then added 3/10 liter more. How much water did she pour in total?",
      correctAnswer: "11/20 L",
      distractors: ["4/14 L", "4/20 L", "13/20 L"],
      narrationText: "Amelia poured 1/4 liter of water, then added 3/10 liter more. How much water did she pour in total?"
    })
  },
  {
    id: "F4-09",
    worldId: "garden-grove",
    subtopic: "F4",
    conceptTitle: "ADD UNLIKE FRACTIONS",
    generate: () => ({
      stemText: "Calculate 5/6 + 1/4.",
      correctAnswer: "1 1/12",
      distractors: ["6/10", "1 1/6", "13/12"],
      narrationText: "Calculate 5/6 plus 1/4."
    })
  },
  {
    id: "F4-10",
    worldId: "garden-grove",
    subtopic: "F4",
    conceptTitle: "WORD PROBLEM",
    generate: () => ({
      stemText: "Harper spent 1/3 hour weeding and 2/5 hour watering. How many hours did she spend in total?",
      correctAnswer: "11/15 hr",
      distractors: ["3/8 hr", "7/15 hr", "4/15 hr"],
      narrationText: "Harper spent 1/3 hour weeding and 2/5 hour watering. How many hours did she spend in total?"
    })
  },

  // ==========================================
  // WORLD 5: Lemonade Lane (F5 Subtracting Fractions)
  // ==========================================
  {
    id: "F5-01",
    worldId: "lemonade-lane",
    subtopic: "F5",
    conceptTitle: "SUBTRACT FROM WHOLE",
    generate: () => ({
      stemText: "What is 1 - 3/8?",
      correctAnswer: "5/8",
      distractors: ["2/8", "4/8", "3/8"],
      narrationText: "What is 1 minus 3/8?"
    })
  },
  {
    id: "F5-02",
    worldId: "lemonade-lane",
    subtopic: "F5",
    conceptTitle: "SUBTRACT FROM WHOLE NUMBER",
    generate: () => ({
      stemText: "Calculate 2 - 3/5.",
      correctAnswer: "1 2/5",
      distractors: ["1 3/5", "2/5", "1 1/5"],
      narrationText: "Calculate 2 minus 3/5."
    })
  },
  {
    id: "F5-03",
    worldId: "lemonade-lane",
    subtopic: "F5",
    conceptTitle: "SUBTRACT UNLIKE FRACTIONS",
    generate: () => ({
      stemText: "What is 3/4 - 1/3?",
      correctAnswer: "5/12",
      distractors: ["2/1", "2/12", "7/12"],
      narrationText: "What is 3/4 minus 1/3?"
    })
  },
  {
    id: "F5-04",
    worldId: "lemonade-lane",
    subtopic: "F5",
    conceptTitle: "LEMONADE PITCHER",
    generate: () => ({
      stemText: "Benjamin had 7/8 L of lemonade. He drank 1/4 L. How much lemonade is left?",
      correctAnswer: "5/8 L",
      distractors: ["6/4 L", "3/8 L", "1/2 L"],
      narrationText: "Benjamin had 7/8 liter of lemonade. He drank 1/4 liter. How much lemonade is left?"
    })
  },
  {
    id: "F5-05",
    worldId: "lemonade-lane",
    subtopic: "F5",
    conceptTitle: "SUBTRACT UNLIKE FRACTIONS",
    generate: () => ({
      stemText: "Calculate 5/6 - 1/2.",
      correctAnswer: "1/3",
      distractors: ["4/4", "2/6", "1/6"],
      narrationText: "Calculate 5/6 minus 1/2."
    })
  },
  {
    id: "F5-06",
    worldId: "lemonade-lane",
    subtopic: "F5",
    conceptTitle: "SUBTRACT FROM MIXED NUMBER",
    generate: () => ({
      stemText: "What is 3 1/4 - 1/2?",
      correctAnswer: "2 3/4",
      distractors: ["2 1/4", "3 1/4", "2 1/2"],
      narrationText: "What is 3 1/4 minus 1/2?"
    })
  },
  {
    id: "F5-07",
    worldId: "lemonade-lane",
    subtopic: "F5",
    conceptTitle: "SUBTRACT UNLIKE FRACTIONS",
    generate: () => ({
      stemText: "Find 7/10 - 2/5.",
      correctAnswer: "3/10",
      distractors: ["5/5", "5/10", "1/5"],
      narrationText: "Find 7/10 minus 2/5."
    })
  },
  {
    id: "F5-08",
    worldId: "lemonade-lane",
    subtopic: "F5",
    conceptTitle: "LEMONADE STAND",
    generate: () => ({
      stemText: "Ella made 5 liters of lemonade and sold 3 2/3 liters. How many liters remain?",
      correctAnswer: "1 1/3 L",
      distractors: ["2 2/3 L", "1 2/3 L", "2 1/3 L"],
      narrationText: "Ella made 5 liters of lemonade and sold 3 2/3 liters. How many liters remain?"
    })
  },
  {
    id: "F5-09",
    worldId: "lemonade-lane",
    subtopic: "F5",
    conceptTitle: "SUBTRACT UNLIKE FRACTIONS",
    generate: () => ({
      stemText: "What is 4/5 - 3/10?",
      correctAnswer: "1/2",
      distractors: ["1/5", "5/10", "7/10"],
      narrationText: "What is 4/5 minus 3/10?"
    })
  },
  {
    id: "F5-10",
    worldId: "lemonade-lane",
    subtopic: "F5",
    conceptTitle: "WORD PROBLEM",
    generate: () => ({
      stemText: "Mason had 1 1/2 kg of lemons. He used 3/4 kg to make lemonade. How many kg are left?",
      correctAnswer: "3/4 kg",
      distractors: ["1/2 kg", "1/4 kg", "1 kg"],
      narrationText: "Mason had 1 1/2 kg of lemons. He used 3/4 kg to make lemonade. How many kg are left?"
    })
  },

  // ==========================================
  // WORLD 6: Marble Mountain (F6 Mixed ⇄ Improper)
  // ==========================================
  {
    id: "F6-01",
    worldId: "marble-mountain",
    subtopic: "F6",
    conceptTitle: "MIXED TO IMPROPER",
    generate: () => ({
      stemText: "Convert 3 2/5 to an improper fraction.",
      correctAnswer: "17/5",
      distractors: ["11/5", "15/5", "6/5"],
      narrationText: "Convert 3 2/5 to an improper fraction."
    })
  },
  {
    id: "F6-02",
    worldId: "marble-mountain",
    subtopic: "F6",
    conceptTitle: "IMPROPER TO MIXED",
    generate: () => ({
      stemText: "Express 19/4 as a mixed number.",
      correctAnswer: "4 3/4",
      distractors: ["3 3/4", "4 1/4", "5 1/4"],
      narrationText: "Express 19/4 as a mixed number."
    })
  },
  {
    id: "F6-03",
    worldId: "marble-mountain",
    subtopic: "F6",
    conceptTitle: "MIXED TO IMPROPER",
    generate: () => ({
      stemText: "What is 2 5/8 written as an improper fraction?",
      correctAnswer: "21/8",
      distractors: ["18/8", "10/8", "16/8"],
      narrationText: "What is 2 5/8 written as an improper fraction?"
    })
  },
  {
    id: "F6-04",
    worldId: "marble-mountain",
    subtopic: "F6",
    conceptTitle: "IMPROPER TO MIXED",
    generate: () => ({
      stemText: "Convert 25/6 into a mixed number.",
      correctAnswer: "4 1/6",
      distractors: ["4 5/6", "3 5/6", "5 1/6"],
      narrationText: "Convert 25/6 into a mixed number."
    })
  },
  {
    id: "F6-05",
    worldId: "marble-mountain",
    subtopic: "F6",
    conceptTitle: "MARBLE WEIGHT",
    generate: () => ({
      stemText: "Logan bought 13/3 kg of marbles. Express this weight as a mixed number.",
      correctAnswer: "4 1/3 kg",
      distractors: ["3 1/3 kg", "4 2/3 kg", "3 2/3 kg"],
      narrationText: "Logan bought 13/3 kg of marbles. Express this weight as a mixed number."
    })
  },
  {
    id: "F6-06",
    worldId: "marble-mountain",
    subtopic: "F6",
    conceptTitle: "MIXED TO IMPROPER",
    generate: () => ({
      stemText: "Convert 5 3/4 to an improper fraction.",
      correctAnswer: "23/4",
      distractors: ["19/4", "20/4", "15/4"],
      narrationText: "Convert 5 3/4 to an improper fraction."
    })
  },
  {
    id: "F6-07",
    worldId: "marble-mountain",
    subtopic: "F6",
    conceptTitle: "IMPROPER TO MIXED",
    generate: () => ({
      stemText: "Express 31/7 as a mixed number.",
      correctAnswer: "4 3/7",
      distractors: ["4 2/7", "3 3/7", "5 3/7"],
      narrationText: "Express 31/7 as a mixed number."
    })
  },
  {
    id: "F6-08",
    worldId: "marble-mountain",
    subtopic: "F6",
    conceptTitle: "EQUAL VALUE",
    generate: () => ({
      stemText: "Which improper fraction equals 4 2/3?",
      correctAnswer: "14/3",
      distractors: ["11/3", "10/3", "8/3"],
      narrationText: "Which improper fraction equals 4 2/3?"
    })
  },
  {
    id: "F6-09",
    worldId: "marble-mountain",
    subtopic: "F6",
    conceptTitle: "IMPROPER TO MIXED",
    generate: () => ({
      stemText: "Convert 22/5 to a mixed number.",
      correctAnswer: "4 2/5",
      distractors: ["4 1/5", "5 2/5", "3 4/5"],
      narrationText: "Convert 22/5 to a mixed number."
    })
  },
  {
    id: "F6-10",
    worldId: "marble-mountain",
    subtopic: "F6",
    conceptTitle: "WORD PROBLEM",
    generate: () => ({
      stemText: "Chloe ran 17/4 miles during marble race practice. Write 17/4 as a mixed number.",
      correctAnswer: "4 1/4 miles",
      distractors: ["3 3/4 miles", "4 3/4 miles", "5 1/4 miles"],
      narrationText: "Chloe ran 17/4 miles during marble race practice. Write 17/4 as a mixed number."
    })
  },

  // ==========================================
  // WORLD 7: Robot Workshop (F7 Multiply Fraction × Whole)
  // ==========================================
  {
    id: "F7-01",
    worldId: "robot-workshop",
    subtopic: "F7",
    conceptTitle: "MULTIPLY FRACTION BY WHOLE",
    generate: () => ({
      stemText: "What is 3/4 × 8?",
      correctAnswer: "6",
      distractors: ["24/32", "12", "5"],
      narrationText: "What is 3/4 times 8?"
    })
  },
  {
    id: "F7-02",
    worldId: "robot-workshop",
    subtopic: "F7",
    conceptTitle: "MULTIPLY FRACTION BY WHOLE",
    generate: () => ({
      stemText: "Calculate 2/5 × 15.",
      correctAnswer: "6",
      distractors: ["30/75", "10", "8"],
      narrationText: "Calculate 2/5 times 15."
    })
  },
  {
    id: "F7-03",
    worldId: "robot-workshop",
    subtopic: "F7",
    conceptTitle: "ROBOT GEARS",
    generate: () => ({
      stemText: "Each robot requires 5/6 meter of wire. How much wire is needed for 12 robots?",
      correctAnswer: "10 m",
      distractors: ["60/72 m", "12 m", "8 m"],
      narrationText: "Each robot requires 5/6 meter of wire. How much wire is needed for 12 robots?"
    })
  },
  {
    id: "F7-04",
    worldId: "robot-workshop",
    subtopic: "F7",
    conceptTitle: "MULTIPLY FRACTION BY WHOLE",
    generate: () => ({
      stemText: "Find 3/8 × 24.",
      correctAnswer: "9",
      distractors: ["72/192", "12", "6"],
      narrationText: "Find 3/8 times 24."
    })
  },
  {
    id: "F7-05",
    worldId: "robot-workshop",
    subtopic: "F7",
    conceptTitle: "MULTIPLY MIXED BY WHOLE",
    generate: () => ({
      stemText: "Calculate 1 1/2 × 6.",
      correctAnswer: "9",
      distractors: ["6", "12", "7 1/2"],
      narrationText: "Calculate 1 1/2 times 6."
    })
  },
  {
    id: "F7-06",
    worldId: "robot-workshop",
    subtopic: "F7",
    conceptTitle: "BATTERY CHARGE",
    generate: () => ({
      stemText: "A robot battery lasts 2/3 of an hour. How many hours will 9 batteries last?",
      correctAnswer: "6 hours",
      distractors: ["18 hours", "9 hours", "4 hours"],
      narrationText: "A robot battery lasts 2/3 of an hour. How many hours will 9 batteries last?"
    })
  },
  {
    id: "F7-07",
    worldId: "robot-workshop",
    subtopic: "F7",
    conceptTitle: "MULTIPLY FRACTION BY WHOLE",
    generate: () => ({
      stemText: "What is 4/7 × 21?",
      correctAnswer: "12",
      distractors: ["84/147", "14", "9"],
      narrationText: "What is 4/7 times 21?"
    })
  },
  {
    id: "F7-08",
    worldId: "robot-workshop",
    subtopic: "F7",
    conceptTitle: "MULTIPLY MIXED BY WHOLE",
    generate: () => ({
      stemText: "What is 2 1/3 × 9?",
      correctAnswer: "21",
      distractors: ["18", "27", "19"],
      narrationText: "What is 2 1/3 times 9?"
    })
  },
  {
    id: "F7-09",
    worldId: "robot-workshop",
    subtopic: "F7",
    conceptTitle: "MULTIPLY FRACTION BY WHOLE",
    generate: () => ({
      stemText: "Calculate 7/10 × 40.",
      correctAnswer: "28",
      distractors: ["21", "35", "14"],
      narrationText: "Calculate 7/10 times 40."
    })
  },
  {
    id: "F7-10",
    worldId: "robot-workshop",
    subtopic: "F7",
    conceptTitle: "WORD PROBLEM",
    generate: () => ({
      stemText: "Jackson has 20 robot parts. 3/5 of them are metallic. How many parts are metallic?",
      correctAnswer: "12 parts",
      distractors: ["15 parts", "10 parts", "8 parts"],
      narrationText: "Jackson has 20 robot parts. 3/5 of them are metallic. How many parts are metallic?"
    })
  },

  // ==========================================
  // WORLD 8: Chocolate Chalet (F8 Division with Fractions)
  // ==========================================
  {
    id: "F8-01",
    worldId: "chocolate-chalet",
    subtopic: "F8",
    conceptTitle: "WHOLE DIVIDE BY FRACTION",
    generate: () => ({
      stemText: "What is 6 ÷ 1/3?",
      correctAnswer: "18",
      distractors: ["2", "3", "6/3"],
      narrationText: "What is 6 divided by 1/3?"
    })
  },
  {
    id: "F8-02",
    worldId: "chocolate-chalet",
    subtopic: "F8",
    conceptTitle: "WHOLE DIVIDE BY FRACTION",
    generate: () => ({
      stemText: "Calculate 4 ÷ 1/2.",
      correctAnswer: "8",
      distractors: ["2", "4/2", "16"],
      narrationText: "Calculate 4 divided by 1/2."
    })
  },
  {
    id: "F8-03",
    worldId: "chocolate-chalet",
    subtopic: "F8",
    conceptTitle: "FRACTION DIVIDE BY WHOLE",
    generate: () => ({
      stemText: "What is 3/4 ÷ 2?",
      correctAnswer: "3/8",
      distractors: ["6/4", "3/2", "1/4"],
      narrationText: "What is 3/4 divided by 2?"
    })
  },
  {
    id: "F8-04",
    worldId: "chocolate-chalet",
    subtopic: "F8",
    conceptTitle: "CHOCOLATE BAR BARS",
    generate: () => ({
      stemText: "Lily has 5 chocolate bars. If each serving is 1/4 bar, how many servings does she have?",
      correctAnswer: "20 servings",
      distractors: ["5/4 servings", "9 servings", "15 servings"],
      narrationText: "Lily has 5 chocolate bars. If each serving is 1/4 bar, how many servings does she have?"
    })
  },
  {
    id: "F8-05",
    worldId: "chocolate-chalet",
    subtopic: "F8",
    conceptTitle: "FRACTION DIVIDE BY WHOLE",
    generate: () => ({
      stemText: "Calculate 4/5 ÷ 4.",
      correctAnswer: "1/5",
      distractors: ["16/5", "4/20", "1"],
      narrationText: "Calculate 4/5 divided by 4."
    })
  },
  {
    id: "F8-06",
    worldId: "chocolate-chalet",
    subtopic: "F8",
    conceptTitle: "WHOLE DIVIDE BY FRACTION",
    generate: () => ({
      stemText: "Find 8 ÷ 2/3.",
      correctAnswer: "12",
      distractors: ["16/3", "24", "6"],
      narrationText: "Find 8 divided by 2/3."
    })
  },
  {
    id: "F8-07",
    worldId: "chocolate-chalet",
    subtopic: "F8",
    conceptTitle: "SHARING CHOCOLATE",
    generate: () => ({
      stemText: "James shares 1/2 of a giant chocolate block equally among 3 friends. What fraction does each friend get?",
      correctAnswer: "1/6",
      distractors: ["3/2", "1/3", "2/3"],
      narrationText: "James shares 1/2 of a giant chocolate block equally among 3 friends. What fraction does each friend get?"
    })
  },
  {
    id: "F8-08",
    worldId: "chocolate-chalet",
    subtopic: "F8",
    conceptTitle: "WHOLE DIVIDE BY FRACTION",
    generate: () => ({
      stemText: "What is 3 ÷ 3/4?",
      correctAnswer: "4",
      distractors: ["9/4", "12", "3"],
      narrationText: "What is 3 divided by 3/4?"
    })
  },
  {
    id: "F8-09",
    worldId: "chocolate-chalet",
    subtopic: "F8",
    conceptTitle: "FRACTION DIVIDE BY WHOLE",
    generate: () => ({
      stemText: "Calculate 5/6 ÷ 5.",
      correctAnswer: "1/6",
      distractors: ["25/6", "5/30", "1"],
      narrationText: "Calculate 5/6 divided by 5."
    })
  },
  {
    id: "F8-10",
    worldId: "chocolate-chalet",
    subtopic: "F8",
    conceptTitle: "WORD PROBLEM",
    generate: () => ({
      stemText: "A baker has 6 kg of melted cocoa. Each mold needs 3/8 kg. How many molds can be filled?",
      correctAnswer: "16 molds",
      distractors: ["18/8 molds", "12 molds", "18 molds"],
      narrationText: "A baker has 6 kg of melted cocoa. Each mold needs 3/8 kg. How many molds can be filled?"
    })
  },

  // ==========================================
  // WORLD 9: Space Voyage (F9 Fraction as Division & Quantities)
  // ==========================================
  {
    id: "F9-01",
    worldId: "space-voyage",
    subtopic: "F9",
    conceptTitle: "FRACTION AS DIVISION",
    generate: () => ({
      stemText: "Express 3 ÷ 4 as a fraction.",
      correctAnswer: "3/4",
      distractors: ["4/3", "1 1/3", "7/4"],
      narrationText: "Express 3 divided by 4 as a fraction."
    })
  },
  {
    id: "F9-02",
    worldId: "space-voyage",
    subtopic: "F9",
    conceptTitle: "EQUAL SHARING",
    generate: () => ({
      stemText: "5 space rations are shared equally among 6 astronauts. What fraction of a ration does each astronaut get?",
      correctAnswer: "5/6",
      distractors: ["6/5", "1 1/5", "1/6"],
      narrationText: "5 space rations are shared equally among 6 astronauts. What fraction of a ration does each astronaut get?"
    })
  },
  {
    id: "F9-03",
    worldId: "space-voyage",
    subtopic: "F9",
    conceptTitle: "DIVISION TO MIXED",
    generate: () => ({
      stemText: "Express 11 ÷ 3 as a mixed number.",
      correctAnswer: "3 2/3",
      distractors: ["3 1/3", "4 1/3", "2 2/3"],
      narrationText: "Express 11 divided by 3 as a mixed number."
    })
  },
  {
    id: "F9-04",
    worldId: "space-voyage",
    subtopic: "F9",
    conceptTitle: "SPACE FUEL",
    generate: () => ({
      stemText: "7 liters of rocket fuel are distributed equally into 2 fuel tanks. How much fuel is in each tank?",
      correctAnswer: "3 1/2 L",
      distractors: ["2 1/2 L", "7/2 L", "3 L"],
      narrationText: "7 liters of rocket fuel are distributed equally into 2 fuel tanks. How much fuel is in each tank?"
    })
  },
  {
    id: "F9-05",
    worldId: "space-voyage",
    subtopic: "F9",
    conceptTitle: "FRACTION TO DIVISION",
    generate: () => ({
      stemText: "Which division sentence represents 7/10?",
      correctAnswer: "7 ÷ 10",
      distractors: ["10 ÷ 7", "7 × 10", "10 - 7"],
      narrationText: "Which division sentence represents 7/10?"
    })
  },
  {
    id: "F9-06",
    worldId: "space-voyage",
    subtopic: "F9",
    conceptTitle: "EQUAL PIZZA SHARING",
    generate: () => ({
      stemText: "4 space pizzas are shared equally among 5 crew members. How much pizza does each member receive?",
      correctAnswer: "4/5",
      distractors: ["5/4", "1 1/4", "1/5"],
      narrationText: "4 space pizzas are shared equally among 5 crew members. How much pizza does each member receive?"
    })
  },
  {
    id: "F9-07",
    worldId: "space-voyage",
    subtopic: "F9",
    conceptTitle: "DIVISION TO MIXED",
    generate: () => ({
      stemText: "Convert 14 ÷ 4 into a simplified mixed number.",
      correctAnswer: "3 1/2",
      distractors: ["3 2/4", "3 1/4", "4 1/2"],
      narrationText: "Convert 14 divided by 4 into a simplified mixed number."
    })
  },
  {
    id: "F9-08",
    worldId: "space-voyage",
    subtopic: "F9",
    conceptTitle: "OXYGEN TANKS",
    generate: () => ({
      stemText: "9 oxygen canisters are shared equally among 4 rovers. How many canisters does each rover get?",
      correctAnswer: "2 1/4",
      distractors: ["2 1/2", "3 1/4", "9/4"],
      narrationText: "9 oxygen canisters are shared equally among 4 rovers. How many canisters does each rover get?"
    })
  },
  {
    id: "F9-09",
    worldId: "space-voyage",
    subtopic: "F9",
    conceptTitle: "FRACTION AS DIVISION",
    generate: () => ({
      stemText: "Express 8 ÷ 12 as a fraction in simplest form.",
      correctAnswer: "2/3",
      distractors: ["8/12", "4/6", "3/4"],
      narrationText: "Express 8 divided by 12 as a fraction in simplest form."
    })
  },
  {
    id: "F9-10",
    worldId: "space-voyage",
    subtopic: "F9",
    conceptTitle: "WORD PROBLEM",
    generate: () => ({
      stemText: "Commander Oliver has 15 kg of lunar soil split into 6 equal sample containers. How much soil is in each container?",
      correctAnswer: "2 1/2 kg",
      distractors: ["2 1/3 kg", "2 3/6 kg", "3 1/2 kg"],
      narrationText: "Commander Oliver has 15 kg of lunar soil split into 6 equal sample containers. How much soil is in each container?"
    })
  },

  // ==========================================
  // WORLD 10: Puzzle Peak (F10 Multi-Step Mastery)
  // ==========================================
  {
    id: "F10-01",
    worldId: "puzzle-peak",
    subtopic: "F10",
    conceptTitle: "MULTI-STEP BAR MODEL",
    generate: () => ({
      stemText: "Emma had $60. She spent 1/3 of it on a book and 1/4 of it on a game. How much money did she spend in total?",
      correctAnswer: "$35",
      distractors: ["$25", "$40", "$30"],
      narrationText: "Emma had $60. She spent 1/3 of it on a book and 1/4 of it on a game. How much money did she spend in total?"
    })
  },
  {
    id: "F10-02",
    worldId: "puzzle-peak",
    subtopic: "F10",
    conceptTitle: "REMAINING FRACTION",
    generate: () => ({
      stemText: "Lucas read 2/5 of a book on Monday and 1/3 on Tuesday. What fraction of the book is left to read?",
      correctAnswer: "4/15",
      distractors: ["11/15", "3/8", "7/15"],
      narrationText: "Lucas read 2/5 of a book on Monday and 1/3 on Tuesday. What fraction of the book is left to read?"
    })
  },
  {
    id: "F10-03",
    worldId: "puzzle-peak",
    subtopic: "F10",
    conceptTitle: "FRACTION OF REMAINING",
    generate: () => ({
      stemText: "Charlotte has 24 marbles. 1/4 are red. Of the remaining marbles, 1/3 are blue. How many blue marbles does she have?",
      correctAnswer: "6",
      distractors: ["8", "12", "4"],
      narrationText: "Charlotte has 24 marbles. 1/4 are red. Of the remaining marbles, 1/3 are blue. How many blue marbles does she have?"
    })
  },
  {
    id: "F10-04",
    worldId: "puzzle-peak",
    subtopic: "F10",
    conceptTitle: "BAKING FLOUR",
    generate: () => ({
      stemText: "Oliver bought 5 kg of flour. He used 1 3/4 kg for bread and 2 1/2 kg for cakes. How much flour is left?",
      correctAnswer: "3/4 kg",
      distractors: ["1 1/4 kg", "1/2 kg", "1 kg"],
      narrationText: "Oliver bought 5 kg of flour. He used 1 3/4 kg for bread and 2 1/2 kg for cakes. How much flour is left?"
    })
  },
  {
    id: "F10-05",
    worldId: "puzzle-peak",
    subtopic: "F10",
    conceptTitle: "MULTI-STEP COMPARISON",
    generate: () => ({
      stemText: "Jack spent 3/8 of his savings on a toy and had $30 left. How much money did he have originally?",
      correctAnswer: "$48",
      distractors: ["$40", "$50", "$80"],
      narrationText: "Jack spent 3/8 of his savings on a toy and had $30 left. How much money did he have originally?"
    })
  },
  {
    id: "F10-06",
    worldId: "puzzle-peak",
    subtopic: "F10",
    conceptTitle: "RIBBON CUTTING",
    generate: () => ({
      stemText: "Ava had a ribbon of length 4 meters. She cut off 2 pieces of length 3/4 meter each. What length of ribbon is left?",
      correctAnswer: "2 1/2 m",
      distractors: ["3 1/4 m", "2 1/4 m", "1 1/2 m"],
      narrationText: "Ava had a ribbon of length 4 meters. She cut off 2 pieces of length 3/4 meter each. What length of ribbon is left?"
    })
  },
  {
    id: "F10-07",
    worldId: "puzzle-peak",
    subtopic: "F10",
    conceptTitle: "FRUIT CONTAINER",
    generate: () => ({
      stemText: "A box contains 36 fruits. 1/3 are apples and 1/4 are oranges. The rest are pears. How many pears are in the box?",
      correctAnswer: "15",
      distractors: ["21", "12", "18"],
      narrationText: "A box contains 36 fruits. 1/3 are apples and 1/4 are oranges. The rest are pears. How many pears are in the box?"
    })
  },
  {
    id: "F10-08",
    worldId: "puzzle-peak",
    subtopic: "F10",
    conceptTitle: "SPENDING MONEY",
    generate: () => ({
      stemText: "Ethan had $40. He gave 2/5 to his sister and spent 1/4 of the original amount on lunch. How much money does Ethan have now?",
      correctAnswer: "$14",
      distractors: ["$26", "$16", "$20"],
      narrationText: "Ethan had $40. He gave 2/5 to his sister and spent 1/4 of the original amount on lunch. How much money does Ethan have now?"
    })
  },
  {
    id: "F10-09",
    worldId: "puzzle-peak",
    subtopic: "F10",
    conceptTitle: "SWIMMING POOL",
    generate: () => ({
      stemText: "A swimming pool is filled with 120 liters of water. 3/8 of the water is drained out. How many liters of water remain in the pool?",
      correctAnswer: "75 L",
      distractors: ["45 L", "80 L", "90 L"],
      narrationText: "A swimming pool is filled with 120 liters of water. 3/8 of the water is drained out. How many liters of water remain in the pool?"
    })
  },
  {
    id: "F10-10",
    worldId: "puzzle-peak",
    subtopic: "F10",
    conceptTitle: "FINAL MASTERY CHALLENGE",
    generate: () => ({
      stemText: "Mia has 45 colored beads. 2/9 are red, 3/5 are green, and the rest are yellow. How many yellow beads does Mia have?",
      correctAnswer: "8",
      distractors: ["10", "37", "12"],
      narrationText: "Mia has 45 colored beads. 2/9 are red, 3/5 are green, and the rest are yellow. How many yellow beads does Mia have?"
    })
  }
];

function buildFourOptions(correctAnswer, distractors = [], seed = 1) {
  const cleanCorrect = (correctAnswer !== undefined && correctAnswer !== null && String(correctAnswer).trim() !== "" && String(correctAnswer).trim() !== "[object Object]")
    ? String(correctAnswer).trim()
    : "2/3";

  const cleanSet = new Set([cleanCorrect]);

  (distractors || []).forEach(d => {
    if (d !== undefined && d !== null) {
      const str = String(d).trim();
      if (str.length > 0 && str !== "[object Object]" && str !== "undefined" && str !== "null") {
        cleanSet.add(str);
      }
    }
  });

  const pool = ["1/2", "2/3", "3/4", "4/5", "5/6", "3/8", "5/8", "7/12", "1/4", "3/5", "7/10", "1/6", "5/12"];
  let pIdx = 0;
  while (cleanSet.size < 4 && pIdx < pool.length) {
    if (!cleanSet.has(pool[pIdx])) {
      cleanSet.add(pool[pIdx]);
    }
    pIdx++;
  }

  let count = 1;
  while (cleanSet.size < 4) {
    const f = `${count}/${count + 4}`;
    cleanSet.add(f);
    count++;
  }

  const rawArray = Array.from(cleanSet).slice(0, 4);
  return shuffle(rawArray, seed);
}

function getUniqueFallbackQuestion(worldId, qNum) {
  const mult = qNum;
  if (worldId === "pizza-piazza") {
    const num = 2 * mult;
    const den = 3 * mult;
    const ans = "2/3";
    return {
      id: `fallback-w1-${qNum}`,
      worldId,
      subtopic: "F1",
      conceptTitle: `SIMPLIFY ${num}/${den}`,
      stemText: `Question ${qNum}: Express the fraction ${num}/${den} in its simplest form.`,
      correctAnswer: ans,
      options: buildFourOptions(ans, [`${num - 1}/${den}`, `${num}/${den - 1}`, `${num + 1}/${den}`], qNum * 41),
      narrationText: `Question ${qNum}: Express the fraction ${num}/${den} in its simplest form.`
    };
  } else if (worldId === "ribbon-row") {
    const n1 = mult, d1 = mult + 1;
    const n2 = mult, d2 = mult + 3;
    return {
      id: `fallback-w2-${qNum}`,
      worldId,
      subtopic: "F2",
      conceptTitle: `COMPARE FRACTIONS #${qNum}`,
      stemText: `Question ${qNum}: Which fraction is larger: ${n1}/${d1} or ${n2}/${d2}?`,
      correctAnswer: `${n1}/${d1}`,
      options: buildFourOptions(`${n1}/${d1}`, [`${n2}/${d2}`, "They are equal", `${n1 + 1}/${d1}`], qNum * 41),
      narrationText: `Question ${qNum}: Which fraction is larger: ${n1} over ${d1} or ${n2} over ${d2}?`
    };
  } else if (worldId === "bakery-blend") {
    const n1 = mult, n2 = mult + 1, den = 12;
    const sum = n1 + n2;
    return {
      id: `fallback-w3-${qNum}`,
      worldId,
      subtopic: "F3",
      conceptTitle: `ADD LIKE FRACTIONS #${qNum}`,
      stemText: `Question ${qNum}: Add the fractions ${n1}/${den} + ${n2}/${den}.`,
      correctAnswer: `${sum}/${den}`,
      options: buildFourOptions(`${sum}/${den}`, [`${sum - 1}/${den}`, `${sum + 1}/${den}`, `${sum}/${den * 2}`], qNum * 41),
      narrationText: `Question ${qNum}: Add the fractions ${n1}/${den} plus ${n2}/${den}.`
    };
  } else {
    const val1 = mult;
    const val2 = mult + 2;
    return {
      id: `fallback-gen-${worldId}-${qNum}`,
      worldId,
      subtopic: "F4",
      conceptTitle: `FRACTION PRACTICE #${qNum}`,
      stemText: `Question ${qNum}: Solve: What is ${val1}/10 + ${val2}/10?`,
      correctAnswer: `${val1 + val2}/10`,
      options: buildFourOptions(`${val1 + val2}/10`, [`${val1 + val2 - 1}/10`, `${val1 + val2 + 1}/10`, `${val1}/10`], qNum * 41),
      narrationText: `Question ${qNum}: Solve: What is ${val1}/10 plus ${val2}/10?`
    };
  }
}

export function getRoundQuestions(worldId, count = 10) {
  try {
    let worldTemplates = rawQuestionBank.filter(q => q && q.worldId === worldId);
    if (!worldTemplates || worldTemplates.length === 0) {
      worldTemplates = rawQuestionBank;
    }

    const resultQuestions = [];
    const seenStems = new Set();
    const baseTimestamp = Date.now();

    let attempts = 0;
    while (resultQuestions.length < count && attempts < 150) {
      attempts++;
      const templateIdx = (resultQuestions.length + attempts) % worldTemplates.length;
      const template = worldTemplates[templateIdx];

      const seed = baseTimestamp + resultQuestions.length * 997 + attempts * 137;
      let generated;
      try {
        generated = template.generate ? template.generate(seed) : template;
      } catch (e) {
        generated = null;
      }

      if (!generated || !generated.stemText) continue;

      let stemText = generated.stemText;
      let correctAnswer = String(generated.correctAnswer || "");
      let distractors = (generated.distractors || []).map(String);

      // If duplicate stem text, perturb with altSeed
      if (seenStems.has(stemText) && template.generate) {
        const altSeed = seed + attempts * 53;
        try {
          generated = template.generate(altSeed);
          stemText = generated.stemText;
          correctAnswer = String(generated.correctAnswer);
          distractors = (generated.distractors || []).map(String);
        } catch(e) {}
      }

      if (!seenStems.has(stemText)) {
        seenStems.add(stemText);
        const options = buildFourOptions(correctAnswer, distractors, seed + 99);

        resultQuestions.push({
          id: `${template.id || 'q'}-${resultQuestions.length + 1}`,
          worldId: template.worldId || worldId,
          subtopic: template.subtopic || "F1",
          conceptTitle: template.conceptTitle || "FRACTION PRACTICE",
          stemText,
          correctAnswer,
          options,
          narrationText: generated.narrationText || stemText
        });
      }
    }

    // If still under count, fill with guaranteed unique world questions
    while (resultQuestions.length < count) {
      const qNum = resultQuestions.length + 1;
      const fallbackQ = getUniqueFallbackQuestion(worldId, qNum);
      if (!seenStems.has(fallbackQ.stemText)) {
        seenStems.add(fallbackQ.stemText);
        resultQuestions.push(fallbackQ);
      } else {
        fallbackQ.stemText = `Challenge Question ${qNum}: Express ${qNum * 2}/${qNum * 3} in simplest form.`;
        fallbackQ.correctAnswer = "2/3";
        fallbackQ.options = buildFourOptions("2/3", ["3/4", "1/2", "4/5"], qNum * 17);
        resultQuestions.push(fallbackQ);
      }
    }

    return resultQuestions;
  } catch (err) {
    console.error("getRoundQuestions error:", err);
    return Array.from({ length: count }).map((_, i) => getUniqueFallbackQuestion(worldId, i + 1));
  }
}
