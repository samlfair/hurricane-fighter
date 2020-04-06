/*

NOTES

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

// Basic Functions

function randomNumber(min, max) {
  let spread = max - min;
  let number = Math.floor(Math.random() * (spread + 1)) + min;
  return number;
}

const listOfNames = ["Amanda", "Brian", "Caitlin", "Devon", "Elizabeth"];
const hurricanes = [];

import startingMap from "./map-1.js";
let htmlGrid = document.getElementById("grid-container");

// 2. Render the HTML

function renderDivGrid(array) {
  array.forEach(function (row, rowIndex) {
    row.forEach(function (item, colIndex) {
      let div = document.createElement("div");
      div.className = item.startingClasses;
      div.setAttribute("data-row-index", rowIndex);
      div.setAttribute("data-col-index", colIndex);
      htmlGrid.appendChild(div);
      item.htmlNode = div;
      div.addEventListener("click", function () {
        squareClick(item);
      });
    });
  });
}

// 4. Create Hurricane

const renderer = (state) => ({
  render() {
    state.htmlNode.classList.add(
      state.htmlClass,
      "col" + state.colIndex,
      "row" + state.rowIndex
    );
    state.iconNode.innerHTML = state.icon;
    switch (state.htmlClass) {
      case "hurricane":
        state.subtitle = `Category ${state.strength}`;
        break;
    }
    state.subtitleNode.innerText = state.subtitle;
  },
});

const mover = (state) => ({
  move(xMinChange, xMaxChange, yMinChange, yMaxChange) {
    state.htmlNode.classList.remove(
      "col" + state.colIndex,
      "row" + state.rowIndex
    );
    state.colIndex += randomNumber(xMinChange, xMaxChange);
    state.rowIndex += randomNumber(yMinChange, yMaxChange);
    state.htmlNode.classList.add(
      "col" + state.colIndex,
      "row" + state.rowIndex
    );
  },
});

const shooter = (state) => ({
  shoot(accuracy) {
    console.log("Shots fired!");
  },
});

const strengthener = (state) => ({
  strengthen() {
    if (state.strength < 5) {
      state.strength++;
    }
  },
});

const weakener = (state) => ({
  weaken() {
    state.strength--;
  },
});

const clicker = (state) => ({
  click() {
    state.htmlNode.addEventListener("click", function () {
      console.log(state);
    });
  },
});

function Hurricane() {
  let hurricane = {
    name: "Hurricane " + listOfNames.shift(),
    colIndex: randomNumber(19, 30),
    rowIndex: randomNumber(16, 22),
    strength: 2,
    htmlNode: document.createElement("div"),
    iconNode: document.createElement("span"),
    titleNode: document.createElement("h2"),
    subtitleNode: document.createElement("p"),
    htmlClass: "hurricane",
    icon: "🌊",
    subtitle: null,
  };
  hurricane.subtitle = `Category ${hurricane.strength}`;
  htmlNodeConstructor(hurricane);
  hurricane.htmlNode.addEventListener("click", function () {
    hurricaneClick(hurricane);
  });

  function hurricaneClick(hurricane) {
    console.log(hurricane);
  }

  return Object.assign(
    hurricane,
    mover(hurricane),
    strengthener(hurricane),
    weakener(hurricane),
    renderer(hurricane),
    clicker(hurricane),
    shooter(hurricane)
  );
}

function City(name, colIndex, rowIndex, iconUrl = "./images/city-1.png") {
  let city = {
    name: name,
    colIndex: colIndex,
    rowIndex: rowIndex,
    ammo: randomNumber(2, 5),
    htmlNode: document.createElement("div"),
    iconNode: document.createElement("span"),
    titleNode: document.createElement("h2"),
    subtitleNode: document.createElement("p"),
    htmlClass: "city",
    icon: `<img src="${iconUrl}"></img>`,
    subtitle: null,
  };

  city.subtitle = `Ammo: ${city.ammo}`;
  htmlNodeConstructor(city);
  city.htmlNode.addEventListener("click", function () {
    cityClick(city);
  });

  function cityClick(city) {
    console.log(city);
  }

  return Object.assign(city, renderer(city), clicker(city), shooter(city));
}

function htmlNodeConstructor(object) {
  object.subtitleNode.innerHTML = object.subtitle;
  object.htmlNode.classList.add(object.htmlClass);
  object.titleNode.innerText = object.name;
  object.htmlNode.appendChild(object.iconNode);
  object.htmlNode.appendChild(object.titleNode);
  object.htmlNode.appendChild(object.subtitleNode);
  htmlGrid.appendChild(object.htmlNode);
}

// Turn Change

document.getElementById("turn").onclick = turnClick;

function turnClick() {
  hurricanes.forEach((hurricane, index, array) =>
    hurricaneTurn(hurricane, index, array)
  );
  if (randomNumber(0, 5) === 0) {
    hurricanes.push(Hurricane());
  }
  if (hurricanes.length === 0) {
    hurricanes.push(Hurricane());
  }
}

function hurricaneTurn(hurricane, index, array) {
  hurricane.move(-4, 0, -4, 0);
  // remove hurricane from off the map
  if (hurricane.colIndex < 1 || hurricane.rowIndex < 1) {
    hurricane.htmlNode.remove();
    array.splice(index, 1);
  }
  // strengthen hurricane on land
  if (startingMap[hurricane.rowIndex][hurricane.colIndex].type === "land") {
    console.log("land!");
    hurricane.weaken();
  } else {
    let rand = randomNumber(0, 5);
    if (rand < 2) {
      hurricane.strengthen();
      console.log(`Strength: ${hurricane.strength}`);
    }
    if (rand === 5) {
      hurricane.weaken();
    }
  }
  // remove weakened hurricane
  if (hurricane.strength === 0) {
    console.log(`${hurricane.name} died.`);
    console.log(array);
    hurricane.htmlNode.remove();
    array.splice(index, 1);
  }
  hurricane.render();
  console.log(hurricane);
}

// Click on Square //

function squareClick(object) {
  console.log(object);
}

// Init

hurricanes.push(Hurricane());
hurricanes[0].render();

let newOrleans = City("New Orleans", 15, 8, "./images/city-1.png");
let miami = City("Miami", 24, 12, "./images/city-1.png");
let houston = City("Houston", 10, 10, "./images/city-1.png");
let dallas = City("Dallas", 8, 4, "./images/city-1.png");
let atlanta = City("Atlanta", 20, 3, "./images/city-1.png");
newOrleans.render();
miami.render();
houston.render();
dallas.render();
atlanta.render();

renderDivGrid(startingMap);

// Random Stuff

let ammoButton = document.getElementById("ammo-button");

let newOrleansSelect = document.querySelector(".city.col15.row8");

newOrleansSelect.onfocus = function () {
  ammoButton.classList.remove("is-disabled");
};

newOrleansSelect.addEventListener("focusout", () => {
  document.getElementById("ammo-button").classList.add("is-disabled");
});

newOrleansSelect.onfocusout = function () {
  document.getElementById("ammo-button").classList.add("is-disabled");
};
