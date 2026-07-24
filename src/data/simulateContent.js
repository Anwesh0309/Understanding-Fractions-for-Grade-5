export const simulateStations = [
  {
    id: "slice-it",
    tabName: "Slice It",
    icon: "🍕",
    title: "Station A — Visual Fraction Slicer",
    subtitle: "Explore how splitting shapes creates equal unit fractions — no wrong answers!",
    mascotText: "Drag the slider to slice the pizza or bar into equal parts!"
  },
  {
    id: "match-it",
    tabName: "Match It",
    icon: "🧩",
    title: "Station B — Equivalent Fraction Builder",
    subtitle: "Shade segments on two different fraction bars to discover equivalent values!",
    mascotText: "Can you make Bar A and Bar B shade the exact same fraction?"
  },
  {
    id: "fraction-slider",
    tabName: "Fraction Slider",
    icon: "🎚️",
    title: "Station C — Worked Solution Converter",
    subtitle: "Adjust two fractions to see live LCD conversion & worked steps!",
    mascotText: "Watch the denominators convert to a common LCD automatically!"
  },
  {
    id: "spot-the-slip",
    tabName: "Spot the Slip",
    icon: "🔍",
    title: "Station D — Spot the Error",
    subtitle: "Examine the worked problem below. Tap the line that contains a math mistake!",
    mascotText: "Find the step where someone made a fraction slip-up!"
  }
];

export const spotTheSlipProblems = [
  {
    id: "slip-1",
    title: "Problem: Calculate 2/3 + 1/4",
    steps: [
      { line: 1, text: "Step 1: Find the common denominator of 3 and 4, which is 12.", isError: false },
      { line: 2, text: "Step 2: Convert 2/3 = 8/12 and 1/4 = 3/12.", isError: false },
      { line: 3, text: "Step 3: Add numerators and denominators: (8+3) / (12+12) = 11/24.", isError: true, correction: "Incorrect! Do NOT add denominators. Keep the denominator 12, so 8/12 + 3/12 = 11/12." }
    ]
  },
  {
    id: "slip-2",
    title: "Problem: Simplify 8/12 to lowest terms",
    steps: [
      { line: 1, text: "Step 1: Identify common factors of 8 and 12 (factor is 4).", isError: false },
      { line: 2, text: "Step 2: Divide numerator by 4: 8 ÷ 4 = 2.", isError: false },
      { line: 3, text: "Step 3: Divide denominator by 2: 12 ÷ 2 = 6, giving 2/6.", isError: true, correction: "Incorrect! You must divide BOTH numerator and denominator by the SAME number (4), giving 2/3." }
    ]
  },
  {
    id: "slip-3",
    title: "Problem: Subtract 2 - 3/5",
    steps: [
      { line: 1, text: "Step 1: Rename whole number 2 as a fraction: 2 = 1 5/5.", isError: false },
      { line: 2, text: "Step 2: Subtract fractions: 5/5 - 3/5 = 2/5.", isError: false },
      { line: 3, text: "Step 3: Forget the whole number 1 and write final answer as 2/5.", isError: true, correction: "Incorrect! Remember to keep the remaining whole number 1, giving 1 2/5." }
    ]
  }
];
