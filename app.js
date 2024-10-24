import { EWOA } from "./EWOA.js";

const searchAgentsNo = 30;
const problemSize = 30; // dim
const maxIter = 500;
const lb = -500;
const ub = 500;

function mean(arr) {
  return arr.reduce((sum, value) => sum + value, 0) / arr.length;
}

function std(arr) {
  const avg = mean(arr);
  const variance =
    arr.reduce((sum, value) => sum + Math.pow(value - avg, 2), 0) / arr.length;
  return Math.sqrt(variance);
}

const ewoa = new EWOA(searchAgentsNo, maxIter, problemSize, lb, ub);

console.log(ewoa);
ewoa.optimize();
const average = mean(ewoa.fitness);
const standardDeviation = std(ewoa.fitness);
const minimum = ewoa.bestScore;

console.log(`  Average = ${average.toExponential(8)}`);
console.log(`  Std = ${standardDeviation.toExponential(8)}`);
console.log(`  Min = ${minimum.toExponential(8)}`);

const root = document.getElementById("root");
const wrap = document.createElement("div");
const item1 = document.createElement("p");
item1.innerText = `  Average = ${average.toExponential(8)}`;

const item2 = document.createElement("p");
item2.innerText = `  Std = ${standardDeviation.toExponential(8)}`;

const item3 = document.createElement("p");
item3.innerText = `  Min = ${minimum.toExponential(8)}`;
wrap.appendChild(item1);
wrap.appendChild(item2);
wrap.appendChild(item3);
root.appendChild(wrap);
