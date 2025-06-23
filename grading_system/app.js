const{calculateGrade} = require ('./grade/calculator.js');
const{printReport} = require ('./grade/reporter.js');


const studentName = "Tanay";
const studentScore = 86;


const grade = calculateGrade(studentScore);
printReport(studentName, studentScore, grade);
