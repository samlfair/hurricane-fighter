/*

NOTES

- refactor code
- rebuild hurricane objects with composition / factory functions
- eventually: delete "create array" function; move to map.js then import
- to move the hurricane: get the width and height of any div, then use pythagoras + margin-bottom, margin-left to move it
- write a script

- Change cursor; must display clickability

- Write function for adding and removing classes on element

Methods:

- Move hurricane
  - Accept movement x & y as arguments
  - Update object position
  - Update element classes

- Render Hurricane

- Render cities

Notes from Franck:
- use sprite sheet
- Dont use fixed or absolute
- Dont use setInterval

*/

// Map features

const features = {
  cities: {
    newOrleans: {
      type: "city",
      name: "New Orleans",
      colIndex: 14,
      rowIndex: 7,
      position: "col15 row8",
    },
    miami: {
      type: "city",
      name: "Miami",
      colIndex: 23,
      rowIndex: 12,
      position: "col24 row12",
    },
    houston: {
      type: "city",
      name: "Houston",
      colIndex: 9,
      rowIndex: 10,
      position: "col10 row10",
    },
  },
  hurricanes: {
    jim: {
      type: "hurricane",
      id: "jim",
      name: "Hurricane Jim",
      colIndex: 17,
      rowIndex: 13,
      position: "col18 row14",
    },
  },
};

// Game features

const game = {
  rating: 5,
  budget: 5000,
  changeRating: changeRating,
  changeBudget: changeBudget,
};

const ratingBar = document.getElementById("rating");
const budgetBar = document.getElementById("budget");

function changeRating(num) {
  this.rating += num;
  this.rating < 0 ? (this.rating = 0) : null;
  this.rating > 10 ? (this.rating = 10) : null;
  ratingBar.setAttribute("value", this.rating);
  return this.rating;
}

function changeBudget(num) {
  this.budget += num;
  this.rating < 0 ? (this.rating = 0) : null;
  this.rating > 10000 ? (this.rating = 10000) : null;
  budgetBar.setAttribute("value", this.budget);
}

ratingBar.onclick = () => game.changeRating(randomNumber(-2, 2));
budgetBar.onclick = () => game.changeBudget(randomNumber(-2, 2) * 1000);

game.changeRating(-4);
game.changeBudget(-4000);

// Basic Functions

function randomNumber(min, max) {
  let spread = max - min;
  let number = Math.floor(Math.random() * (spread + 1)) + min;
  return number;
}

function randomizeOutcome(functionOne, functionTwo, oddsOne, oddsTwo) {
  // odds are expressed as an X:Y ratio
  let winner = randomNumber(1, oddsOne + oddsTwo);
  console.log(winner);
  return winner <= oddsOne ? functionOne : functionTwo;
}

function move(xMinChange, xMaxChange, yMinChange, yMaxChange) {
  this.htmlNode.classList.remove("col" + this.colIndex);
  this.htmlNode.classList.remove("row" + this.rowIndex);
  this.colIndex += randomNumber(xMinChange, xMaxChange);
  this.rowIndex += randomNumber(yMinChange, yMaxChange);
  this.htmlNode.classList.add("col" + this.colIndex);
  this.htmlNode.classList.add("row" + this.rowIndex);
}

// Imports and Variabls

import startingMap from "./map.js";
let htmlGrid = document.getElementById("grid-container");

// 1. Create the Array

const gridArray = createArray(33, 25);

function createArray(columns, rows) {
  let counter = 0;
  let array = [];
  for (let i = 0; i < 25; i++) {
    let row = [];
    const rowNumber = i + 1;
    for (let i = 0; i < columns; i++) {
      let arrayItem = startingMap[counter];
      let object = {
        type: arrayItem.type,
        startingClasses: arrayItem.classes,
        features: arrayItem.features ? arrayItem.features : null,
        row: rowNumber,
        col: i + 1,
      };
      row.push(object);
      counter++;
    }
    array.push(row);
  }
  return array;
}

// 2. Render the HTML

function renderDivGrid(gridArray) {
  gridArray.forEach(function (row, rowIndex) {
    row.forEach(function (item, colIndex) {
      let div = document.createElement("div");
      div.className = item.startingClasses;
      div.setAttribute("data-row-index", rowIndex);
      div.setAttribute("data-col-index", colIndex);
      htmlGrid.appendChild(div);
      item.htmlNode = div;
      div.onclick = squareClick;
    });
  });
}

// 4. Render Hurricane

const listOfNames = ["Amanda", "Brian", "Caitlin", "Devon", "Elizabeth"];
const hurricanes = [];

function createHurricane() {
  let object = {
    name: listOfNames.shift(),
    colIndex: randomNumber(19, 30),
    rowIndex: randomNumber(16, 22),
    path: [],
    strength: 1,
    htmlNode: null,
    move: move,
    getWeaker: getWeaker,
    getStronger: getStronger,
    click: click,
  };
  object.htmlNode = createHtmlNode(object, "hurricane");
  object.htmlNode.innerHTML = `<span class="icon">🌊</span><p>${object.name}</p><p class="small">Category ${object.strength}</p>`;
  function click(object){

  }
  hurricanes.push(object);
  function helpfulFunction() {
    console.log(object);
  }
  function getWeaker(object) {
    // perform function
  }
}

mover(){}
strengthener(){}
weakener(){}


createHurricane();

function getWeaker() {
  this.strength--;
  this.htmlNode.innerHTML = `<span class="icon">🌊</span><p>${this.name}</p><p class="small">Category ${this.strength}</p>`;
  console.log(
    `${this.name} got less strong. It is now category ${this.strength}.`
  );
}

function getStronger() {
  this.strength++;
  this.htmlNode.innerHTML = `<span class="icon">🌊</span><p>${this.name}</p><p class="small">Category ${this.strength}</p>`;
  console.log(
    `${this.name} got stronger. It is now category ${this.strength}.`
  );
  console.log(this);
}

function createHtmlNode(object, divClass) {
  let div = document.createElement("div");
  div.classList.add(divClass, "col" + colIndex, "row" + rowIndex);
  htmlGrid.appendChild(div);
  return div;
}

// TURN CHANGE

document.getElementById("turn").onclick = turnClick;

function turnClick() {
  hurricanes[0].move(-2, 0, -2, 0);
  console.log(hurricanes[0]);
  hurricanes[0].getStronger();
}

// function clickOnHurricane(e) {
//   // RANDOMIZE FUNCTION ARGS: (RANGE, OFFSET)
//   let moveX = Math.floor(Math.random() * 4) - 1;
//   let moveY = Math.floor(Math.random() * 4);
//   // END REFACTOR
//   let object = getHurricaneFromHtmlElement(e.target);
//   object.htmlNode.classList.remove(`col${object.colIndex + 1}`);
//   object.htmlNode.classList.remove(`row${object.rowIndex + 1}`);
//   object.colIndex -= moveX;
//   object.rowIndex -= moveY;
//   object.position = `col${object.colIndex + 1} row${object.rowIndex + 1}`;
//   object.htmlNode.className += " " + object.position;
// }

// 3. Render Features

function renderCities() {
  let cities = features.cities;
  for (const city in cities) {
    let cityDiv = document.createElement("div");
    cityDiv.setAttribute("tabindex", -1);
    cityDiv.innerHTML = `<p>${cities[city].name}</p><img class="city" src="./images/city-1.png">`;
    cityDiv.className += "city " + cities[city].position;
    htmlGrid.appendChild(cityDiv);
  }
}

// CLICK ON SQUARE

function squareClick(e) {
  let object = getObjectFromHtmlElement(e.target);
  console.log(`Row: ${object.row}, column: ${object.col}`);
}

// GET OBJECT FROM ELEMENT

function getObjectFromHtmlElement(htmlElement) {
  let rowIndex = parseInt(htmlElement.getAttribute("data-row-index"));
  let colIndex = parseInt(htmlElement.getAttribute("data-col-index"));
  return gridArray[rowIndex][colIndex];
}

function getHurricaneFromHtmlElement(htmlElement) {
  let id;
  htmlElement.tagName.toLowerCase === "div"
    ? (id = htmlElement.getAttribute("data-hurricane"))
    : (id = htmlElement.parentElement.getAttribute("data-hurricane"));
  let object = features.hurricanes[id];
  return object;
}

function getPositionFromHtmlElement(htmlElement) {
  let rowIndex = parseInt(htmlElement.getAttribute("data-row-index"));
  let colIndex = parseInt(htmlElement.getAttribute("data-col-index"));
  // returns ROW, COLUMN
  return [rowIndex, colIndex];
}

// Init

renderDivGrid(gridArray);
renderCities();

let ammoButton = document.getElementById("ammo-button");

let newOrleans = document.querySelector(".city.col15.row8");

newOrleans.onfocus = function () {
  ammoButton.classList.remove("is-disabled");
};

newOrleans.addEventListener("focusout", () => {
  document.getElementById("ammo-button").classList.add("is-disabled");
});

newOrleans.onfocusout = function () {
  document.getElementById("ammo-button").classList.add("is-disabled");
};

ammoButton.onclick = function (e) {
  console.log("Yeah!");
  let ammo = document.createElement("p");
  ammo.style.width = "100px;";
  ammo.classList.add("ammo");
  ammo.innerText = "💣1";
  newOrleans.appendChild(ammo);
};

// onclick = function () {
//   document.getElementById("stockpilebutton").classList.remove("is-disabled");
// };

// let houston = document.querySelector(".city.col10.row10");
