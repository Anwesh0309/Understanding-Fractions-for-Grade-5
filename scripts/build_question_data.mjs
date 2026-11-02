import fs from 'fs';
import path from 'path';
import { toPronunciationText } from './pronunciation.mjs';

// Deterministic option shuffler
function buildOptions(correctAnswer, distractors, seed) {
  const uniqueDistractors = [...new Set(distractors.filter(d => d !== correctAnswer))];
  while (uniqueDistractors.length < 3) {
    uniqueDistractors.push(`Alt-${uniqueDistractors.length + 1}`);
  }
  const opts = [correctAnswer, uniqueDistractors[0], uniqueDistractors[1], uniqueDistractors[2]];
  
  // Simple deterministic shuffle using seed
  for (let i = opts.length - 1; i > 0; i--) {
    const j = Math.floor((Math.sin(seed + i * 31) * 10000 - Math.floor(Math.sin(seed + i * 31) * 10000)) * (i + 1));
    [opts[i], opts[j]] = [opts[j], opts[i]];
  }
  return opts;
}

export const allQuestions = [
  // ==========================================
  // WORLD 1: Pizza Piazza (F1 Equivalent & Simplest Form)
  // ==========================================
  {
    id: "F1-01",
    worldId: "pizza-piazza",
    subtopic: "F1",
    conceptTitle: "SIMPLIFY FRACTION",
    stemText: "Express the fraction 4/6 in its simplest form.",
    correctAnswer: "2/3",
    distractors: ["3/4", "1/2", "2/6"],
    hint: "Find the greatest common factor of 4 and 6, which is 2. Divide both numerator and denominator by 2."
  },
  {
    id: "F1-02",
    worldId: "pizza-piazza",
    subtopic: "F1",
    conceptTitle: "EQUIVALENT FRACTION",
    stemText: "Which fraction is equivalent to 3/4?",
    correctAnswer: "9/12",
    distractors: ["5/6", "4/5", "7/10"],
    hint: "Multiply both the numerator 3 and the denominator 4 by 3 to find an equivalent fraction."
  },
  {
    id: "F1-03",
    worldId: "pizza-piazza",
    subtopic: "F1",
    conceptTitle: "FIND MISSING NUMERATOR",
    stemText: "Find the missing number: 2/5 = ? / 15",
    correctAnswer: "6",
    distractors: ["4", "5", "8"],
    hint: "Notice that 5 times 3 equals 15. Multiply the numerator 2 by 3 as well."
  },
  {
    id: "F1-04",
    worldId: "pizza-piazza",
    subtopic: "F1",
    conceptTitle: "SIMPLIFY PIZZA SLICES",
    stemText: "Oliver ate 8 out of 12 pizza slices. What fraction of the pizza did he eat in simplest form?",
    correctAnswer: "2/3",
    distractors: ["4/6", "3/4", "1/2"],
    hint: "Write 8 over 12 and divide both numbers by their common factor, 4."
  },
  {
    id: "F1-05",
    worldId: "pizza-piazza",
    subtopic: "F1",
    conceptTitle: "CHECK EQUIVALENCE",
    stemText: "Which pair of fractions are equivalent?",
    correctAnswer: "4/10 and 2/5",
    distractors: ["3/4 and 4/5", "1/3 and 2/5", "2/3 and 3/4"],
    hint: "Simplify each fraction. 4 tenths simplifies to 2 fifths by dividing by 2."
  },
  {
    id: "F1-06",
    worldId: "pizza-piazza",
    subtopic: "F1",
    conceptTitle: "SIMPLIFY PIE PORTION",
    stemText: "Emma cut a pie into 15 slices and served 10. What is 10/15 in simplest form?",
    correctAnswer: "2/3",
    distractors: ["1/2", "3/5", "4/5"],
    hint: "Divide both 10 and 15 by their greatest common factor, 5."
  },
  {
    id: "F1-07",
    worldId: "pizza-piazza",
    subtopic: "F1",
    conceptTitle: "CONVERT DENOMINATOR",
    stemText: "What is 5/8 with a denominator of 16?",
    correctAnswer: "10/16",
    distractors: ["7/16", "8/16", "12/16"],
    hint: "Multiply both the numerator and denominator of 5/8 by 2."
  },
  {
    id: "F1-08",
    worldId: "pizza-piazza",
    subtopic: "F1",
    conceptTitle: "SIMPLIFY TO LOWEST TERMS",
    stemText: "Express 6/18 in simplest form.",
    correctAnswer: "1/3",
    distractors: ["2/6", "3/9", "1/4"],
    hint: "Divide both 6 and 18 by their greatest common factor, 6."
  },
  {
    id: "F1-09",
    worldId: "pizza-piazza",
    subtopic: "F1",
    conceptTitle: "FIND MISSING DENOMINATOR",
    stemText: "Find the missing denominator: 3/4 = 9 / ?",
    correctAnswer: "12",
    distractors: ["10", "15", "16"],
    hint: "Since 3 times 3 equals 9, multiply the denominator 4 by 3 to get 12."
  },
  {
    id: "F1-10",
    worldId: "pizza-piazza",
    subtopic: "F1",
    conceptTitle: "SHADED GRID FRACTION",
    stemText: "Lucas shaded 12 out of 16 squares on a grid. What fraction of the grid is shaded in simplest form?",
    correctAnswer: "3/4",
    distractors: ["6/8", "2/3", "4/5"],
    hint: "Divide both 12 and 16 by their common factor, 4."
  },

  // ==========================================
  // WORLD 2: Ribbon Row (F2 Comparing & Ordering Fractions)
  // ==========================================
  {
    id: "F2-01",
    worldId: "ribbon-row",
    subtopic: "F2",
    conceptTitle: "COMPARE TWO FRACTIONS",
    stemText: "Which fraction is larger: 2/3 or 3/5?",
    correctAnswer: "2/3",
    distractors: ["3/5", "They are equal", "Cannot be compared"],
    hint: "Find a common denominator of 15: 2/3 equals 10/15, while 3/5 equals 9/15."
  },
  {
    id: "F2-02",
    worldId: "ribbon-row",
    subtopic: "F2",
    conceptTitle: "ORDER FRACTIONS ASCENDING",
    stemText: "Arrange in increasing order: 1/2, 2/3, 5/12.",
    correctAnswer: "5/12, 1/2, 2/3",
    distractors: ["1/2, 5/12, 2/3", "2/3, 1/2, 5/12", "5/12, 2/3, 1/2"],
    hint: "Use denominator 12: 5/12 is 5/12, 1/2 is 6/12, and 2/3 is 8/12."
  },
  {
    id: "F2-03",
    worldId: "ribbon-row",
    subtopic: "F2",
    conceptTitle: "BENCHMARK FRACTION HALF",
    stemText: "Which fraction is greater than 1/2?",
    correctAnswer: "4/7",
    distractors: ["3/7", "2/5", "5/12"],
    hint: "Half of 7 is 3.5, so 4/7 is greater than half."
  },
  {
    id: "F2-04",
    worldId: "ribbon-row",
    subtopic: "F2",
    conceptTitle: "FIND SMALLEST FRACTION",
    stemText: "Which of the following is the smallest fraction: 3/4, 5/8, 7/12, 1/2?",
    correctAnswer: "1/2",
    distractors: ["3/4", "5/8", "7/12"],
    hint: "Convert all to denominator 24: 18/24, 15/24, 14/24, and 12/24. 12/24 is smallest."
  },
  {
    id: "F2-05",
    worldId: "ribbon-row",
    subtopic: "F2",
    conceptTitle: "COMPARE RIBBON LENGTHS",
    stemText: "Ava has 3/4 m of red ribbon and Charlotte has 5/6 m of blue ribbon. Who has more ribbon?",
    correctAnswer: "Charlotte (5/6 m)",
    distractors: ["Ava (3/4 m)", "They have equal length", "Cannot be determined"],
    hint: "Use common denominator 12: 3/4 equals 9/12, while 5/6 equals 10/12."
  },
  {
    id: "F2-06",
    worldId: "ribbon-row",
    subtopic: "F2",
    conceptTitle: "COMPARE WITH INEQUALITY",
    stemText: "Fill in the blank: 4/5 ___ 7/10",
    correctAnswer: ">",
    distractors: ["<", "=", "≤"],
    hint: "Convert 4/5 to tenths: 4/5 equals 8/10, which is greater than 7/10."
  },
  {
    id: "F2-07",
    worldId: "ribbon-row",
    subtopic: "F2",
    conceptTitle: "ORDER FRACTIONS DESCENDING",
    stemText: "Arrange in decreasing order: 3/4, 5/6, 2/3.",
    correctAnswer: "5/6, 3/4, 2/3",
    distractors: ["3/4, 5/6, 2/3", "2/3, 3/4, 5/6", "5/6, 2/3, 3/4"],
    hint: "With denominator 12: 5/6 is 10/12, 3/4 is 9/12, and 2/3 is 8/12."
  },
  {
    id: "F2-08",
    worldId: "ribbon-row",
    subtopic: "F2",
    conceptTitle: "FIND LARGEST FRACTION",
    stemText: "Which fraction is the largest: 5/6, 7/9, 3/4, 11/12?",
    correctAnswer: "11/12",
    distractors: ["5/6", "7/9", "3/4"],
    hint: "Compare distance to 1 whole: 11/12 is missing only 1/12, so it is closest to 1."
  },
  {
    id: "F2-09",
    worldId: "ribbon-row",
    subtopic: "F2",
    conceptTitle: "VERIFY INEQUALITY",
    stemText: "Which statement is true?",
    correctAnswer: "3/8 < 5/12",
    distractors: ["3/8 > 5/12", "3/8 = 5/12", "5/12 < 1/4"],
    hint: "Common denominator is 24: 3/8 equals 9/24, and 5/12 equals 10/24."
  },
  {
    id: "F2-10",
    worldId: "ribbon-row",
    subtopic: "F2",
    conceptTitle: "RUNNING DISTANCE COMPARISON",
    stemText: "Jack ran 5/8 of a mile and Ethan ran 2/3 of a mile. Who ran further?",
    correctAnswer: "Ethan (2/3 mile)",
    distractors: ["Jack (5/8 mile)", "Both ran the same", "Neither ran past half"],
    hint: "Common denominator is 24: 5/8 is 15/24 and 2/3 is 16/24."
  },

  // ==========================================
  // WORLD 3: Bakery Blend (F3 Adding Like Fractions)
  // ==========================================
  {
    id: "F3-01",
    worldId: "bakery-blend",
    subtopic: "F3",
    conceptTitle: "ADD LIKE DENOMINATORS",
    stemText: "What is 3/8 + 4/8?",
    correctAnswer: "7/8",
    distractors: ["7/16", "1/8", "1"],
    hint: "Keep the common denominator 8, and simply add the numerators 3 + 4."
  },
  {
    id: "F3-02",
    worldId: "bakery-blend",
    subtopic: "F3",
    conceptTitle: "RENAME AS MIXED NUMBER",
    stemText: "Calculate 5/8 + 4/8 and express as a mixed number.",
    correctAnswer: "1 1/8",
    distractors: ["9/16", "1 2/8", "1 3/8"],
    hint: "5 + 4 = 9/8. Since 8/8 equals 1 whole, 9/8 is 1 and 1/8."
  },
  {
    id: "F3-03",
    worldId: "bakery-blend",
    subtopic: "F3",
    conceptTitle: "ADD & SIMPLIFY LIKE FRACTIONS",
    stemText: "Find 2/10 + 4/10 in simplest form.",
    correctAnswer: "3/5",
    distractors: ["6/10", "6/20", "2/5"],
    hint: "2/10 + 4/10 = 6/10. Divide both 6 and 10 by 2 to get 3/5."
  },
  {
    id: "F3-04",
    worldId: "bakery-blend",
    subtopic: "F3",
    conceptTitle: "BAKING SUGAR TOTAL",
    stemText: "Mia used 3/6 kg of sugar for muffins and 2/6 kg of sugar for cake. How much sugar did she use in total?",
    correctAnswer: "5/6 kg",
    distractors: ["5/12 kg", "1 kg", "4/6 kg"],
    hint: "Add the numerators 3 + 2 = 5, keeping the denominator 6."
  },
  {
    id: "F3-05",
    worldId: "bakery-blend",
    subtopic: "F3",
    conceptTitle: "SUM TO ONE WHOLE",
    stemText: "What is 7/12 + 5/12?",
    correctAnswer: "1",
    distractors: ["12/24", "1 1/12", "11/12"],
    hint: "7 + 5 = 12/12. Any fraction with equal numerator and denominator equals 1 whole."
  },
  {
    id: "F3-06",
    worldId: "bakery-blend",
    subtopic: "F3",
    conceptTitle: "IMPROPER TO MIXED SUM",
    stemText: "Add 4/5 + 3/5.",
    correctAnswer: "1 2/5",
    distractors: ["7/10", "1 1/5", "1 3/5"],
    hint: "4 + 3 = 7/5. 7 divided by 5 is 1 with a remainder of 2, so 1 and 2/5."
  },
  {
    id: "F3-07",
    worldId: "bakery-blend",
    subtopic: "F3",
    conceptTitle: "ADD THREE LIKE FRACTIONS",
    stemText: "Find 1/9 + 4/9 + 2/9.",
    correctAnswer: "7/9",
    distractors: ["7/27", "6/9", "8/9"],
    hint: "Add all three numerators: 1 + 4 + 2 = 7 over 9."
  },
  {
    id: "F3-08",
    worldId: "bakery-blend",
    subtopic: "F3",
    conceptTitle: "ADD & SIMPLIFY FIFTEENTHS",
    stemText: "Calculate 3/15 + 7/15 in simplest form.",
    correctAnswer: "2/3",
    distractors: ["10/15", "10/30", "1/3"],
    hint: "3 + 7 = 10/15. Divide both 10 and 15 by 5 to get 2/3."
  },
  {
    id: "F3-09",
    worldId: "bakery-blend",
    subtopic: "F3",
    conceptTitle: "PIE SHARE COMBINATION",
    stemText: "Noah ate 2/7 of a pie and Sophia ate 3/7 of the same pie. What fraction of the pie did they eat together?",
    correctAnswer: "5/7",
    distractors: ["5/14", "6/7", "4/7"],
    hint: "Simply add 2/7 and 3/7: 2 + 3 = 5 sevenths."
  },
  {
    id: "F3-10",
    worldId: "bakery-blend",
    subtopic: "F3",
    conceptTitle: "ADD FOURTEENTHS",
    stemText: "What is 5/14 + 3/14 in simplest form?",
    correctAnswer: "4/7",
    distractors: ["8/14", "8/28", "3/7"],
    hint: "5 + 3 = 8/14. Divide both 8 and 14 by 2 to get 4/7."
  },

  // ==========================================
  // WORLD 4: Garden Grove (F4 Adding Unlike Fractions)
  // ==========================================
  {
    id: "F4-01",
    worldId: "garden-grove",
    subtopic: "F4",
    conceptTitle: "ADD THIRDS AND FOURTHS",
    stemText: "What is 1/3 + 1/4?",
    correctAnswer: "7/12",
    distractors: ["2/7", "2/12", "5/12"],
    hint: "Find common denominator 12: 1/3 is 4/12 and 1/4 is 3/12. 4 + 3 = 7/12."
  },
  {
    id: "F4-02",
    worldId: "garden-grove",
    subtopic: "F4",
    conceptTitle: "ADD HALVES AND FIFTHS",
    stemText: "Calculate 1/2 + 2/5.",
    correctAnswer: "9/10",
    distractors: ["3/7", "7/10", "3/10"],
    hint: "Common denominator is 10: 1/2 is 5/10 and 2/5 is 4/10. 5 + 4 = 9/10."
  },
  {
    id: "F4-03",
    worldId: "garden-grove",
    subtopic: "F4",
    conceptTitle: "GARDEN FLOWER FRACTION",
    stemText: "Liam planted sunflowers in 2/5 of his garden and roses in 1/3. What fraction of his garden has flowers?",
    correctAnswer: "11/15",
    distractors: ["3/8", "7/15", "9/15"],
    hint: "Common denominator is 15: 2/5 is 6/15 and 1/3 is 5/15. 6 + 5 = 11/15."
  },
  {
    id: "F4-04",
    worldId: "garden-grove",
    subtopic: "F4",
    conceptTitle: "ADD FOURTHS AND SIXTHS",
    stemText: "Find 3/4 + 1/6 in simplest form.",
    correctAnswer: "11/12",
    distractors: ["4/10", "4/12", "5/6"],
    hint: "Least common denominator of 4 and 6 is 12: 3/4 is 9/12 and 1/6 is 2/12. 9 + 2 = 11/12."
  },
  {
    id: "F4-05",
    worldId: "garden-grove",
    subtopic: "F4",
    conceptTitle: "ADD UNLIKE TO MIXED",
    stemText: "Calculate 2/3 + 3/4.",
    correctAnswer: "1 5/12",
    distractors: ["5/7", "1 1/12", "1 7/12"],
    hint: "Common denominator 12: 8/12 + 9/12 = 17/12, which equals 1 and 5/12."
  },
  {
    id: "F4-06",
    worldId: "garden-grove",
    subtopic: "F4",
    conceptTitle: "FIND LCD OF 8 AND 6",
    stemText: "What is the least common denominator needed to add 3/8 and 1/6?",
    correctAnswer: "24",
    distractors: ["48", "14", "16"],
    hint: "Multiples of 8 are 8, 16, 24. Multiples of 6 are 6, 12, 18, 24. The smallest common multiple is 24."
  },
  {
    id: "F4-07",
    worldId: "garden-grove",
    subtopic: "F4",
    conceptTitle: "ADD EIGHTHS AND SIXTHS",
    stemText: "What is 3/8 + 1/6?",
    correctAnswer: "13/24",
    distractors: ["4/14", "11/24", "15/24"],
    hint: "Convert to 24ths: 3/8 is 9/24 and 1/6 is 4/24. 9 + 4 = 13/24."
  },
  {
    id: "F4-08",
    worldId: "garden-grove",
    subtopic: "F4",
    conceptTitle: "POURING WATER TOTAL",
    stemText: "Amelia poured 1/4 liter of water, then added 3/10 liter more. How much water did she pour in total?",
    correctAnswer: "11/20 L",
    distractors: ["4/14 L", "7/20 L", "9/20 L"],
    hint: "Common denominator of 4 and 10 is 20: 1/4 is 5/20 and 3/10 is 6/20. 5 + 6 = 11/20."
  },
  {
    id: "F4-09",
    worldId: "garden-grove",
    subtopic: "F4",
    conceptTitle: "ADD SIXTHS AND FOURTHS",
    stemText: "Calculate 5/6 + 1/4.",
    correctAnswer: "1 1/12",
    distractors: ["6/10", "1 5/12", "1 3/12"],
    hint: "Common denominator is 12: 10/12 + 3/12 = 13/12, which equals 1 and 1/12."
  },
  {
    id: "F4-10",
    worldId: "garden-grove",
    subtopic: "F4",
    conceptTitle: "GARDENING TIME SUM",
    stemText: "Harper spent 1/3 hour weeding and 2/5 hour watering. How many hours did she spend in total?",
    correctAnswer: "11/15 hr",
    distractors: ["3/8 hr", "7/15 hr", "13/15 hr"],
    hint: "Convert to 15ths: 1/3 is 5/15 and 2/5 is 6/15. 5 + 6 = 11/15."
  },

  // ==========================================
  // WORLD 5: Lemonade Lane (F5 Subtracting Fractions)
  // ==========================================
  {
    id: "F5-01",
    worldId: "lemonade-lane",
    subtopic: "F5",
    conceptTitle: "SUBTRACT FROM WHOLE NUMBER",
    stemText: "What is 1 - 3/8?",
    correctAnswer: "5/8",
    distractors: ["2/8", "4/8", "1 3/8"],
    hint: "Rename 1 whole as 8/8. Then subtract 8/8 minus 3/8 to get 5/8."
  },
  {
    id: "F5-02",
    worldId: "lemonade-lane",
    subtopic: "F5",
    conceptTitle: "SUBTRACT FROM TWO WHOLES",
    stemText: "Calculate 2 - 3/5.",
    correctAnswer: "1 2/5",
    distractors: ["1 3/5", "2/5", "1 1/5"],
    hint: "Borrow 1 whole from 2 to make 1 and 5/5. 5/5 minus 3/5 leaves 2/5, giving 1 and 2/5."
  },
  {
    id: "F5-03",
    worldId: "lemonade-lane",
    subtopic: "F5",
    conceptTitle: "SUBTRACT UNLIKE FRACTIONS",
    stemText: "What is 3/4 - 1/3?",
    correctAnswer: "5/12",
    distractors: ["2/1", "2/12", "1/4"],
    hint: "Common denominator is 12: 3/4 is 9/12 and 1/3 is 4/12. 9 minus 4 = 5/12."
  },
  {
    id: "F5-04",
    worldId: "lemonade-lane",
    subtopic: "F5",
    conceptTitle: "LEMONADE REMAINING",
    stemText: "Benjamin had 7/8 L of lemonade. He drank 1/4 L. How much lemonade is left?",
    correctAnswer: "5/8 L",
    distractors: ["6/8 L", "3/8 L", "1/2 L"],
    hint: "Convert 1/4 to 2/8. Then 7/8 minus 2/8 = 5/8 L."
  },
  {
    id: "F5-05",
    worldId: "lemonade-lane",
    subtopic: "F5",
    conceptTitle: "SUBTRACT AND SIMPLIFY",
    stemText: "Calculate 5/6 - 1/2.",
    correctAnswer: "1/3",
    distractors: ["4/4", "2/6", "1/6"],
    hint: "Convert 1/2 to 3/6. 5/6 minus 3/6 = 2/6, which simplifies to 1/3."
  },
  {
    id: "F5-06",
    worldId: "lemonade-lane",
    subtopic: "F5",
    conceptTitle: "SUBTRACT FROM MIXED NUMBER",
    stemText: "What is 3 1/4 - 1/2?",
    correctAnswer: "2 3/4",
    distractors: ["2 1/4", "3 1/4", "2 1/2"],
    hint: "Convert 1/2 to 2/4. Borrow 1 whole from 3 to get 2 and 5/4 minus 2/4 = 2 and 3/4."
  },
  {
    id: "F5-07",
    worldId: "lemonade-lane",
    subtopic: "F5",
    conceptTitle: "SUBTRACT TENTHS AND FIFTHS",
    stemText: "Find 7/10 - 2/5.",
    correctAnswer: "3/10",
    distractors: ["5/10", "1/10", "2/10"],
    hint: "Convert 2/5 to 4/10. 7/10 minus 4/10 = 3/10."
  },
  {
    id: "F5-08",
    worldId: "lemonade-lane",
    subtopic: "F5",
    conceptTitle: "LEMONADE SALE BALANCE",
    stemText: "Ella made 5 liters of lemonade and sold 3 2/3 liters. How many liters remain?",
    correctAnswer: "1 1/3 L",
    distractors: ["2 1/3 L", "1 2/3 L", "2 L"],
    hint: "Rewrite 5 as 4 and 3/3. Subtract 3 and 2/3: 4 - 3 = 1, and 3/3 - 2/3 = 1/3."
  },
  {
    id: "F5-09",
    worldId: "lemonade-lane",
    subtopic: "F5",
    conceptTitle: "SUBTRACT FIFTHS AND TENTHS",
    stemText: "What is 4/5 - 3/10?",
    correctAnswer: "1/2",
    distractors: ["1/5", "5/10", "2/5"],
    hint: "Convert 4/5 to 8/10. 8/10 minus 3/10 = 5/10, which simplifies to 1/2."
  },
  {
    id: "F5-10",
    worldId: "lemonade-lane",
    subtopic: "F5",
    conceptTitle: "LEMON WEIGHT BALANCE",
    stemText: "Mason had 1 1/2 kg of lemons. He used 3/4 kg to make lemonade. How many kg are left?",
    correctAnswer: "3/4 kg",
    distractors: ["1/2 kg", "1 kg", "1/4 kg"],
    hint: "Convert 1 and 1/2 to 6/4. Subtract 3/4 to leave 3/4 kg."
  },

  // ==========================================
  // WORLD 6: Marble Mountain (F6 Mixed Numbers ⇄ Improper)
  // ==========================================
  {
    id: "F6-01",
    worldId: "marble-mountain",
    subtopic: "F6",
    conceptTitle: "MIXED TO IMPROPER",
    stemText: "Convert 3 2/5 to an improper fraction.",
    correctAnswer: "17/5",
    distractors: ["11/5", "15/5", "13/5"],
    hint: "Multiply whole number 3 by denominator 5 to get 15, then add numerator 2: (15 + 2) / 5 = 17/5."
  },
  {
    id: "F6-02",
    worldId: "marble-mountain",
    subtopic: "F6",
    conceptTitle: "IMPROPER TO MIXED",
    stemText: "Express 19/4 as a mixed number.",
    correctAnswer: "4 3/4",
    distractors: ["4 1/4", "3 3/4", "5 1/4"],
    hint: "Divide 19 by 4: 4 goes in 4 times with a remainder of 3, so 4 and 3/4."
  },
  {
    id: "F6-03",
    worldId: "marble-mountain",
    subtopic: "F6",
    conceptTitle: "MIXED NUMBER CONVERSION",
    stemText: "What is 2 5/8 written as an improper fraction?",
    correctAnswer: "21/8",
    distractors: ["18/8", "16/8", "19/8"],
    hint: "Multiply 2 times 8 to get 16, then add 5 to get 21 over 8."
  },
  {
    id: "F6-04",
    worldId: "marble-mountain",
    subtopic: "F6",
    conceptTitle: "IMPROPER FRACTION CONVERSION",
    stemText: "Convert 25/6 into a mixed number.",
    correctAnswer: "4 1/6",
    distractors: ["4 5/6", "3 5/6", "4 2/6"],
    hint: "25 divided by 6 is 4 with a remainder of 1, so 4 and 1/6."
  },
  {
    id: "F6-05",
    worldId: "marble-mountain",
    subtopic: "F6",
    conceptTitle: "MARBLE WEIGHT MIXED FORM",
    stemText: "Logan bought 13/3 kg of marbles. Express this weight as a mixed number.",
    correctAnswer: "4 1/3 kg",
    distractors: ["4 2/3 kg", "3 1/3 kg", "5 1/3 kg"],
    hint: "13 divided by 3 is 4 with a remainder of 1, giving 4 and 1/3 kg."
  },
  {
    id: "F6-06",
    worldId: "marble-mountain",
    subtopic: "F6",
    conceptTitle: "CONVERT FIVE AND THREE FOURTHS",
    stemText: "Convert 5 3/4 to an improper fraction.",
    correctAnswer: "23/4",
    distractors: ["20/4", "22/4", "19/4"],
    hint: "5 times 4 is 20, plus 3 equals 23 over 4."
  },
  {
    id: "F6-07",
    worldId: "marble-mountain",
    subtopic: "F6",
    conceptTitle: "CONVERT THIRTY-ONE SEVENTHS",
    stemText: "Express 31/7 as a mixed number.",
    correctAnswer: "4 3/7",
    distractors: ["4 2/7", "3 6/7", "4 5/7"],
    hint: "31 divided by 7 is 4 with a remainder of 3, so 4 and 3/7."
  },
  {
    id: "F6-08",
    worldId: "marble-mountain",
    subtopic: "F6",
    conceptTitle: "EVALUATE EQUIVALENT IMPROPER",
    stemText: "Which improper fraction equals 4 2/3?",
    correctAnswer: "14/3",
    distractors: ["12/3", "11/3", "16/3"],
    hint: "4 times 3 equals 12, plus 2 equals 14 over 3."
  },
  {
    id: "F6-09",
    worldId: "marble-mountain",
    subtopic: "F6",
    conceptTitle: "CONVERT TWENTY-TWO FIFTHS",
    stemText: "Convert 22/5 to a mixed number.",
    correctAnswer: "4 2/5",
    distractors: ["4 1/5", "4 3/5", "3 4/5"],
    hint: "22 divided by 5 is 4 with a remainder of 2, so 4 and 2/5."
  },
  {
    id: "F6-10",
    worldId: "marble-mountain",
    subtopic: "F6",
    conceptTitle: "RACE DISTANCE MIXED NUMBER",
    stemText: "Chloe ran 17/4 miles during marble race practice. Write 17/4 as a mixed number.",
    correctAnswer: "4 1/4 miles",
    distractors: ["4 3/4 miles", "3 3/4 miles", "5 1/4 miles"],
    hint: "17 divided by 4 is 4 with a remainder of 1, so 4 and 1/4 miles."
  },

  // ==========================================
  // WORLD 7: Robot Workshop (F7 Multiply Fraction × Whole)
  // ==========================================
  {
    id: "F7-01",
    worldId: "robot-workshop",
    subtopic: "F7",
    conceptTitle: "FRACTION OF A WHOLE",
    stemText: "What is 3/4 × 8?",
    correctAnswer: "6",
    distractors: ["4", "8", "24"],
    hint: "Multiply 3 times 8 to get 24, then divide by 4 to get 6."
  },
  {
    id: "F7-02",
    worldId: "robot-workshop",
    subtopic: "F7",
    conceptTitle: "MULTIPLY FIFTHS BY WHOLE",
    stemText: "Calculate 2/5 × 15.",
    correctAnswer: "6",
    distractors: ["5", "8", "10"],
    hint: "Divide 15 by 5 to get 3, then multiply by 2 to get 6."
  },
  {
    id: "F7-03",
    worldId: "robot-workshop",
    subtopic: "F7",
    conceptTitle: "ROBOT WIRE LENGTH",
    stemText: "Each robot requires 5/6 meter of wire. How much wire is needed for 12 robots?",
    correctAnswer: "10 m",
    distractors: ["8 m", "12 m", "15 m"],
    hint: "Multiply 5/6 times 12: 12 divided by 6 is 2, and 5 times 2 is 10 meters."
  },
  {
    id: "F7-04",
    worldId: "robot-workshop",
    subtopic: "F7",
    conceptTitle: "MULTIPLY EIGHTHS BY WHOLE",
    stemText: "Find 3/8 × 24.",
    correctAnswer: "9",
    distractors: ["6", "8", "12"],
    hint: "Divide 24 by 8 to get 3, then multiply 3 times 3 to get 9."
  },
  {
    id: "F7-05",
    worldId: "robot-workshop",
    subtopic: "F7",
    conceptTitle: "MIXED NUMBER TIMES WHOLE",
    stemText: "Calculate 1 1/2 × 6.",
    correctAnswer: "9",
    distractors: ["6", "8", "12"],
    hint: "1 and 1/2 is 3/2. 3/2 times 6: 6 divided by 2 is 3, and 3 times 3 is 9."
  },
  {
    id: "F7-06",
    worldId: "robot-workshop",
    subtopic: "F7",
    conceptTitle: "BATTERY DURATION TOTAL",
    stemText: "A robot battery lasts 2/3 of an hour. How many hours will 9 batteries last?",
    correctAnswer: "6 hours",
    distractors: ["3 hours", "4 hours", "9 hours"],
    hint: "Multiply 2/3 times 9: 9 divided by 3 is 3, and 2 times 3 is 6 hours."
  },
  {
    id: "F7-07",
    worldId: "robot-workshop",
    subtopic: "F7",
    conceptTitle: "MULTIPLY SEVENTHS BY WHOLE",
    stemText: "What is 4/7 × 21?",
    correctAnswer: "12",
    distractors: ["10", "14", "16"],
    hint: "Divide 21 by 7 to get 3, then multiply 4 times 3 to get 12."
  },
  {
    id: "F7-08",
    worldId: "robot-workshop",
    subtopic: "F7",
    conceptTitle: "MIXED FRACTION TIMES WHOLE",
    stemText: "What is 2 1/3 × 9?",
    correctAnswer: "21",
    distractors: ["18", "20", "24"],
    hint: "2 and 1/3 is 7/3. 7/3 times 9: 9 divided by 3 is 3, and 7 times 3 is 21."
  },
  {
    id: "F7-09",
    worldId: "robot-workshop",
    subtopic: "F7",
    conceptTitle: "TENTHS TIMES WHOLE",
    stemText: "Calculate 7/10 × 40.",
    correctAnswer: "28",
    distractors: ["21", "30", "35"],
    hint: "Divide 40 by 10 to get 4, then multiply 7 times 4 to get 28."
  },
  {
    id: "F7-10",
    worldId: "robot-workshop",
    subtopic: "F7",
    conceptTitle: "METALLIC PARTS COUNT",
    stemText: "Jackson has 20 robot parts. 3/5 of them are metallic. How many parts are metallic?",
    correctAnswer: "12 parts",
    distractors: ["10 parts", "15 parts", "16 parts"],
    hint: "Divide 20 by 5 to get 4, then multiply 3 times 4 to get 12."
  },

  // ==========================================
  // WORLD 8: Chocolate Chalet (F8 Fraction Division)
  // ==========================================
  {
    id: "F8-01",
    worldId: "chocolate-chalet",
    subtopic: "F8",
    conceptTitle: "DIVIDE WHOLE BY UNIT FRACTION",
    stemText: "What is 6 ÷ 1/3?",
    correctAnswer: "18",
    distractors: ["2", "6", "12"],
    hint: "Dividing by 1/3 is multiplying by 3: 6 times 3 = 18."
  },
  {
    id: "F8-02",
    worldId: "chocolate-chalet",
    subtopic: "F8",
    conceptTitle: "DIVIDE WHOLE BY HALF",
    stemText: "Calculate 4 ÷ 1/2.",
    correctAnswer: "8",
    distractors: ["2", "4", "16"],
    hint: "How many halves are in 4 wholes? 4 times 2 = 8."
  },
  {
    id: "F8-03",
    worldId: "chocolate-chalet",
    subtopic: "F8",
    conceptTitle: "DIVIDE FRACTION BY WHOLE",
    stemText: "What is 3/4 ÷ 2?",
    correctAnswer: "3/8",
    distractors: ["3/2", "6/4", "1/2"],
    hint: "Dividing by 2 is multiplying by 1/2: 3/4 times 1/2 = 3/8."
  },
  {
    id: "F8-04",
    worldId: "chocolate-chalet",
    subtopic: "F8",
    conceptTitle: "CHOCOLATE SERVINGS COUNT",
    stemText: "Lily has 5 chocolate bars. If each serving is 1/4 bar, how many servings does she have?",
    correctAnswer: "20 servings",
    distractors: ["15 servings", "16 servings", "25 servings"],
    hint: "Divide 5 by 1/4, which is 5 times 4 = 20 servings."
  },
  {
    id: "F8-05",
    worldId: "chocolate-chalet",
    subtopic: "F8",
    conceptTitle: "SPLIT FRACTION EQUALLY",
    stemText: "Calculate 4/5 ÷ 4.",
    correctAnswer: "1/5",
    distractors: ["4/20", "1/4", "16/5"],
    hint: "Dividing 4 fifths equally among 4 people gives 1 fifth: 1/5."
  },
  {
    id: "F8-06",
    worldId: "chocolate-chalet",
    subtopic: "F8",
    conceptTitle: "DIVIDE WHOLE BY FRACTION",
    stemText: "Find 8 ÷ 2/3.",
    correctAnswer: "12",
    distractors: ["6", "16", "24"],
    hint: "Multiply 8 by the reciprocal 3/2: 8 times 3 is 24, divided by 2 is 12."
  },
  {
    id: "F8-07",
    worldId: "chocolate-chalet",
    subtopic: "F8",
    conceptTitle: "SHARE FRACTION BLOCK",
    stemText: "James shares 1/2 of a giant chocolate block equally among 3 friends. What fraction does each friend get?",
    correctAnswer: "1/6",
    distractors: ["1/3", "2/3", "1/5"],
    hint: "1/2 divided by 3 is 1/2 times 1/3 = 1/6."
  },
  {
    id: "F8-08",
    worldId: "chocolate-chalet",
    subtopic: "F8",
    conceptTitle: "DIVIDE WHOLE BY THREE FOURTHS",
    stemText: "What is 3 ÷ 3/4?",
    correctAnswer: "4",
    distractors: ["3", "9/4", "12"],
    hint: "Multiply 3 by reciprocal 4/3: 3 times 4 is 12, divided by 3 is 4."
  },
  {
    id: "F8-09",
    worldId: "chocolate-chalet",
    subtopic: "F8",
    conceptTitle: "DIVIDE SIXTHS BY FIVE",
    stemText: "Calculate 5/6 ÷ 5.",
    correctAnswer: "1/6",
    distractors: ["5/30", "1/5", "25/6"],
    hint: "5 sixths divided by 5 equals 1 sixth: 1/6."
  },
  {
    id: "F8-10",
    worldId: "chocolate-chalet",
    subtopic: "F8",
    conceptTitle: "COCOA MOLD FILLING",
    stemText: "A baker has 6 kg of melted cocoa. Each mold needs 3/8 kg. How many molds can be filled?",
    correctAnswer: "16 molds",
    distractors: ["12 molds", "14 molds", "18 molds"],
    hint: "6 divided by 3/8 is 6 times 8/3: 48 divided by 3 is 16 molds."
  },

  // ==========================================
  // WORLD 9: Space Voyage (F9 Fraction as Division & Quantities)
  // ==========================================
  {
    id: "F9-01",
    worldId: "space-voyage",
    subtopic: "F9",
    conceptTitle: "DIVISION AS FRACTION",
    stemText: "Express 3 ÷ 4 as a fraction.",
    correctAnswer: "3/4",
    distractors: ["4/3", "1/4", "3/1"],
    hint: "Any division problem a divided by b can be written directly as the fraction a over b, so 3/4."
  },
  {
    id: "F9-02",
    worldId: "space-voyage",
    subtopic: "F9",
    conceptTitle: "EQUAL SHARING RATIONS",
    stemText: "5 space rations are shared equally among 6 astronauts. What fraction of a ration does each astronaut get?",
    correctAnswer: "5/6",
    distractors: ["6/5", "1/6", "5/1"],
    hint: "Divide the 5 rations by the 6 astronauts to get 5/6 of a ration."
  },
  {
    id: "F9-03",
    worldId: "space-voyage",
    subtopic: "F9",
    conceptTitle: "DIVISION TO MIXED NUMBER",
    stemText: "Express 11 ÷ 3 as a mixed number.",
    correctAnswer: "3 2/3",
    distractors: ["3 1/3", "2 2/3", "4 1/3"],
    hint: "11 divided by 3 equals 3 with a remainder of 2, which gives 3 and 2/3."
  },
  {
    id: "F9-04",
    worldId: "space-voyage",
    subtopic: "F9",
    conceptTitle: "FUEL DISTRIBUTION",
    stemText: "7 liters of rocket fuel are distributed equally into 2 fuel tanks. How much fuel is in each tank?",
    correctAnswer: "3 1/2 L",
    distractors: ["3 L", "4 L", "3 1/4 L"],
    hint: "7 divided by 2 is 3 with remainder 1, which equals 3 and 1/2 liters."
  },
  {
    id: "F9-05",
    worldId: "space-voyage",
    subtopic: "F9",
    conceptTitle: "FRACTION TO DIVISION SENTENCE",
    stemText: "Which division sentence represents 7/10?",
    correctAnswer: "7 ÷ 10",
    distractors: ["10 ÷ 7", "7 ÷ 1", "10 ÷ 1"],
    hint: "Numerator is the dividend and denominator is the divisor: 7 divided by 10."
  },
  {
    id: "F9-06",
    worldId: "space-voyage",
    subtopic: "F9",
    conceptTitle: "SPACE PIZZA SHARING",
    stemText: "4 space pizzas are shared equally among 5 crew members. How much pizza does each member receive?",
    correctAnswer: "4/5",
    distractors: ["5/4", "1/5", "1/4"],
    hint: "Divide 4 pizzas by 5 crew members to get 4/5 of a pizza."
  },
  {
    id: "F9-07",
    worldId: "space-voyage",
    subtopic: "F9",
    conceptTitle: "SIMPLIFIED MIXED QUOTIENT",
    stemText: "Convert 14 ÷ 4 into a simplified mixed number.",
    correctAnswer: "3 1/2",
    distractors: ["3 2/4", "3 1/4", "4 1/2"],
    hint: "14 divided by 4 is 3 and 2/4, which simplifies to 3 and 1/2."
  },
  {
    id: "F9-08",
    worldId: "space-voyage",
    subtopic: "F9",
    conceptTitle: "OXYGEN SHARING",
    stemText: "9 oxygen canisters are shared equally among 4 rovers. How many canisters does each rover get?",
    correctAnswer: "2 1/4",
    distractors: ["2 1/2", "2 3/4", "3 1/4"],
    hint: "9 divided by 4 equals 2 with a remainder of 1, so 2 and 1/4 canisters."
  },
  {
    id: "F9-09",
    worldId: "space-voyage",
    subtopic: "F9",
    conceptTitle: "DIVISION TO SIMPLEST FRACTION",
    stemText: "Express 8 ÷ 12 as a fraction in simplest form.",
    correctAnswer: "2/3",
    distractors: ["8/12", "4/6", "3/4"],
    hint: "Write 8 over 12, then divide both numerator and denominator by 4 to get 2/3."
  },
  {
    id: "F9-10",
    worldId: "space-voyage",
    subtopic: "F9",
    conceptTitle: "LUNAR SOIL SAMPLES",
    stemText: "Commander Oliver has 15 kg of lunar soil split into 6 equal sample containers. How much soil is in each container?",
    correctAnswer: "2 1/2 kg",
    distractors: ["2 1/3 kg", "2 3/6 kg", "3 kg"],
    hint: "15 divided by 6 is 2 and 3/6, which simplifies to 2 and 1/2 kg."
  },

  // ==========================================
  // WORLD 10: Puzzle Peak (F10 Multi-Step Mastery Challenge)
  // ==========================================
  {
    id: "F10-01",
    worldId: "puzzle-peak",
    subtopic: "F10",
    conceptTitle: "TWO-STEP BUDGET PROBLEM",
    stemText: "Emma had $60. She spent 1/3 of it on a book and 1/4 of it on a game. How much money did she spend in total?",
    correctAnswer: "$35",
    distractors: ["$25", "$30", "$40"],
    hint: "1/3 of $60 is $20. 1/4 of $60 is $15. Add $20 + $15 = $35 total."
  },
  {
    id: "F10-02",
    worldId: "puzzle-peak",
    subtopic: "F10",
    conceptTitle: "FRACTION REMAINING OF BOOK",
    stemText: "Lucas read 2/5 of a book on Monday and 1/3 on Tuesday. What fraction of the book is left to read?",
    correctAnswer: "4/15",
    distractors: ["11/15", "1/15", "7/15"],
    hint: "Common denominator 15: 2/5 is 6/15 and 1/3 is 5/15. Total read is 11/15. 1 whole minus 11/15 is 4/15."
  },
  {
    id: "F10-03",
    worldId: "puzzle-peak",
    subtopic: "F10",
    conceptTitle: "FRACTION OF A REMAINDER",
    stemText: "Charlotte has 24 marbles. 1/4 are red. Of the remaining marbles, 1/3 are blue. How many blue marbles does she have?",
    correctAnswer: "6",
    distractors: ["4", "8", "9"],
    hint: "1/4 of 24 is 6 red marbles, leaving 18. Then 1/3 of 18 is 6 blue marbles."
  },
  {
    id: "F10-04",
    worldId: "puzzle-peak",
    subtopic: "F10",
    conceptTitle: "MULTI-STEP FLOUR BALANCE",
    stemText: "Oliver bought 5 kg of flour. He used 1 3/4 kg for bread and 2 1/2 kg for cakes. How much flour is left?",
    correctAnswer: "3/4 kg",
    distractors: ["1/2 kg", "1 kg", "1 1/4 kg"],
    hint: "Flour used: 1 3/4 + 2 2/4 = 4 1/4 kg. Subtract from 5 kg: 5 - 4 1/4 = 3/4 kg."
  },
  {
    id: "F10-05",
    worldId: "puzzle-peak",
    subtopic: "F10",
    conceptTitle: "REVERSE FRACTION WORD PROBLEM",
    stemText: "Jack spent 3/8 of his savings on a toy and had $30 left. How much money did he have originally?",
    correctAnswer: "$48",
    distractors: ["$40", "$50", "$60"],
    hint: "If he spent 3/8, he has 5/8 left. 5 units = $30, so 1 unit = $6. Total 8 units: 8 × $6 = $48."
  },
  {
    id: "F10-06",
    worldId: "puzzle-peak",
    subtopic: "F10",
    conceptTitle: "CUTTING RIBBON PIECES",
    stemText: "Ava had a ribbon of length 4 meters. She cut off 2 pieces of length 3/4 meter each. What length of ribbon is left?",
    correctAnswer: "2 1/2 m",
    distractors: ["2 m", "3 m", "2 1/4 m"],
    hint: "2 pieces of 3/4 m is 6/4 m, which is 1 1/2 m. 4 minus 1 1/2 leaves 2 1/2 meters."
  },
  {
    id: "F10-07",
    worldId: "puzzle-peak",
    subtopic: "F10",
    conceptTitle: "FRUIT BASKET REMAINDER",
    stemText: "A box contains 36 fruits. 1/3 are apples and 1/4 are oranges. The rest are pears. How many pears are in the box?",
    correctAnswer: "15",
    distractors: ["12", "18", "21"],
    hint: "1/3 of 36 is 12 apples. 1/4 of 36 is 9 oranges. 12 + 9 = 21. 36 minus 21 is 15 pears."
  },
  {
    id: "F10-08",
    worldId: "puzzle-peak",
    subtopic: "F10",
    conceptTitle: "MONEY REMAINING AFTER SHARING",
    stemText: "Ethan had $40. He gave 2/5 to his sister and spent 1/4 of the original amount on lunch. How much money does Ethan have now?",
    correctAnswer: "$14",
    distractors: ["$12", "$16", "$20"],
    hint: "2/5 of $40 is $16. 1/4 of $40 is $10. Total spent is $26. $40 minus $26 is $14."
  },
  {
    id: "F10-09",
    worldId: "puzzle-peak",
    subtopic: "F10",
    conceptTitle: "POOL DRAINAGE FRACTION",
    stemText: "A swimming pool is filled with 120 liters of water. 3/8 of the water is drained out. How many liters of water remain in the pool?",
    correctAnswer: "75 L",
    distractors: ["45 L", "60 L", "80 L"],
    hint: "Remaining fraction is 5/8. 1/8 of 120 is 15. 5 times 15 is 75 liters."
  },
  {
    id: "F10-10",
    worldId: "puzzle-peak",
    subtopic: "F10",
    conceptTitle: "BEAD FRACTION REMAINDER",
    stemText: "Mia has 45 colored beads. 2/9 are red, 3/5 are green, and the rest are yellow. How many yellow beads does Mia have?",
    correctAnswer: "8",
    distractors: ["6", "10", "12"],
    hint: "2/9 of 45 is 10 red beads. 3/5 of 45 is 27 green beads. 10 + 27 = 37. 45 minus 37 is 8 yellow beads."
  }
];

export const simulationGuidance = [
  {
    id: "sim_main",
    title: "Fraction Simulation Lab Guidance",
    text: "Welcome to the Fraction Simulation Lab! Explore four interactive stations to slice shapes, build equivalent fractions, find common denominators, and spot math mistakes!",
    spokenText: "Welcome to the Fraction Simulation Lab! Explore four interactive stations to slice shapes, build equivalent fractions, find common denominators, and spot math mistakes!",
    file: "public/audio/simulation/sim_main.mp3",
    url: "/audio/simulation/sim_main.mp3"
  },
  {
    id: "sim_slice_it",
    title: "Station A — Visual Fraction Slicer Guidance",
    text: "Station A: Visual Fraction Slicer. Explore how splitting shapes creates equal unit fractions. Drag the slider to slice the pizza or bar into equal parts!",
    spokenText: "Station A: Visual Fraction Slicer. Explore how splitting shapes creates equal unit fractions. Drag the slider to slice the pizza or bar into equal parts!",
    file: "public/audio/simulation/sim_slice_it.mp3",
    url: "/audio/simulation/sim_slice_it.mp3"
  },
  {
    id: "sim_match_it",
    title: "Station B — Equivalent Fraction Builder Guidance",
    text: "Station B: Equivalent Fraction Builder. Shade segments on two different fraction bars to discover equivalent values!",
    spokenText: "Station B: Equivalent Fraction Builder. Shade segments on two different fraction bars to discover equivalent values!",
    file: "public/audio/simulation/sim_match_it.mp3",
    url: "/audio/simulation/sim_match_it.mp3"
  },
  {
    id: "sim_fraction_slider",
    title: "Station C — Worked Solution Converter Guidance",
    text: "Station C: Worked Solution Converter. Adjust two fractions to see step-by-step common denominator calculations!",
    spokenText: "Station C: Worked Solution Converter. Adjust two fractions to see step-by-step common denominator calculations!",
    file: "public/audio/simulation/sim_fraction_slider.mp3",
    url: "/audio/simulation/sim_fraction_slider.mp3"
  },
  {
    id: "sim_spot_the_slip",
    title: "Station D — Spot the Error Guidance",
    text: "Station D: Spot the Error. Examine the worked problem below, and tap the step that contains a math mistake!",
    spokenText: "Station D: Spot the Error. Examine the worked problem below, and tap the step that contains a math mistake!",
    file: "public/audio/simulation/sim_spot_the_slip.mp3",
    url: "/audio/simulation/sim_spot_the_slip.mp3"
  }
];

// Enrich all questions with audioUrls and spoken pronunciations
export const processedQuestions = allQuestions.map((q, idx) => {
  const safeId = q.id.replace("-", "_");
  const options = buildOptions(q.correctAnswer, q.distractors, idx * 37 + 101);
  const spokenQuestion = toPronunciationText(q.stemText);
  const spokenHint = toPronunciationText(q.hint);
  
  return {
    ...q,
    options,
    spokenQuestion,
    spokenHint,
    audioFile: `public/audio/questions/q_${safeId}.mp3`,
    audioUrl: `/audio/questions/q_${safeId}.mp3`,
    hintAudioFile: `public/audio/hints/hint_${safeId}.mp3`,
    hintAudioUrl: `/audio/hints/hint_${safeId}.mp3`
  };
});

