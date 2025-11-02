// calculator.js

const readline = require("readline");
// Create interface to read input from user
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});
// Function to perform calculation
function calculate(num1, num2, operator) {
switch (operator) {
case "+":
return num1 + num2;
case "-":
return num1 - num2;
case "*":
return num1 * num2;
case "/":
return num2 !== 0 ? num1 / num2 : "Cannot divide by zero";
default:
return "Invalid operator";
}
}
// Ask user for first number
rl.question("Enter first number: ", (first) => {
const num1 = parseFloat(first);
rl.question("Enter operator (+, -, *, /): ", (op) => {
const operator = op;
rl.question("Enter second number: ", (second) => {
const num2 = parseFloat(second);
const result = calculate(num1, num2, operator);
console.log(`Result: ${result}`);
rl.close();

});
});
});
