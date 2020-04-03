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
      position: "col15 row8"
    },
    miami: {
      type: "city",
      name: "Miami",
      colIndex: 23,
      rowIndex: 12,
      position: "col24 row12"
    },
    houston: {
      type: "city",
      name: "Houston",
      colIndex: 9,
      rowIndex: 10,
      position: "col10 row10"
    }
  },
  hurricanes: {
    jim: {
      type: "hurricane",
      id: "jim",
      name: "Hurricane Jim",
      colIndex: 17,
      rowIndex: 13,
      position: "col18 row14"
    }
  }
};

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
        col: i + 1
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
  gridArray.forEach(function(row, rowIndex) {
    row.forEach(function(item, colIndex) {
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

// 3. Render Features

function renderHurricane(hurricane) {
  let hurricaneDiv = document.createElement("div");
  hurricaneDiv.innerHTML = `<p>${hurricane.name}</p>`;
  hurricaneDiv.className += " hurricane " + hurricane.position;
  hurricaneDiv.innerHTML += `<span class="icon">🌊</span>`;
  hurricaneDiv.setAttribute("data-hurricane", hurricane.id);
  hurricaneDiv.addEventListener("click", clickOnHurricane);
  hurricane.htmlNode = hurricaneDiv;
  htmlGrid.appendChild(hurricaneDiv);
}

function clickOnHurricane(e) {
  // RANDOMIZE FUNCTION ARGS: (RANGE, OFFSET)
  let moveX = Math.floor(Math.random() * 4) - 1;
  let moveY = Math.floor(Math.random() * 4);
  // END REFACTOR
  let object = getHurricaneFromHtmlElement(e.target);
  object.htmlNode.classList.remove(`col${object.colIndex + 1}`);
  object.htmlNode.classList.remove(`row${object.rowIndex + 1}`);
  object.colIndex -= moveX;
  object.rowIndex -= moveY;
  object.position = `col${object.colIndex + 1} row${object.rowIndex + 1}`;
  object.htmlNode.className += " " + object.position;
}

function renderCities() {
  let cities = features.cities;
  for (const city in cities) {
    let cityDiv = document.createElement("div");
    cityDiv.innerHTML = `<p>${cities[city].name}</p><img class="city" src="./images/city-1.png">`;
    cityDiv.className += " " + cities[city].position;
    htmlGrid.appendChild(cityDiv);
  }
}

renderCities();

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
renderHurricane(features.hurricanes.jim);
