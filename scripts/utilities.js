export {
  randomNumber,
  pythagorean,
  bresenham,
  listOfNames,
  hurricanes,
  selected,
  approvalRating,
  budget,
};

// Global Variables

let approvalRating = 5;
let budget = 5000;
const selected = {
  itemOne: null,
  itemTwo: null,
  function: null,
};

// Arrays

const listOfNames = ["Amanda", "Brian", "Caitlin", "Devon", "Elizabeth"];
const hurricanes = [];

// Functions

function randomNumber(min, max) {
  let spread = max - min;
  let number = Math.floor(Math.random() * (spread + 1)) + min;
  return number;
}

function pythagorean(sideA, sideB) {
  return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
}

function bresenham(x1, y1, x2, y2) {
  const coordinatesArray = [];
  let dx = Math.abs(x2 - x1);
  let dy = Math.abs(y2 - y1);
  let sx = x1 < x2 ? 1 : -1;
  let sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;
  coordinatesArray.push([y1, x1]);
  while (!(x1 == x2 && y1 == y2)) {
    let e2 = err << 1;
    if (e2 > -dy) {
      err -= dy;
      x1 += sx;
    }
    if (e2 < dx) {
      err += dx;
      y1 += sy;
    }
    coordinatesArray.push([y1, x1]);
  }
  return coordinatesArray;
}
