// app.js
const readline = require('readline');
const { calculateGrade } = require('./grade/calculator');
const { printReport } = require('./grade/reporter');

// Setup readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Ask for name and score
rl.question("Enter student name: ", (name) => {
  rl.question("Enter student score (0–100): ", (scoreStr) => {
    const score = parseFloat(scoreStr);
    
    if (isNaN(score) || score < 0 || score > 100) {
      console.log("❌ Invalid score. Please enter a number between 0 and 100.");
    } else {
      const grade = calculateGrade(score);
      printReport(name, score, grade);
    }

    rl.close();
  });
});
