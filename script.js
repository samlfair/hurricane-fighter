/*

Notes from Franck:
- use sprite sheet
- Dont use fixed or absolute
- Dont use setInterval

*/

// Imports

import startingMap from "./map-1.js";

// Basic Functions

function randomNumber(min, max) {
  let spread = max - min;
  let number = Math.floor(Math.random() * (spread + 1)) + min;
  return number;
}

function pythagorean(sideA, sideB) {
  return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
}

// ELEMENTS

// Grid
let htmlGrid = document.getElementById("grid-container");

// Progress Bars
let approvalBar = document.getElementById("rating");
let budgetBar = document.getElementById("budget");

// Text boxes
let introduction = document.getElementById("introduction");
let choiceList = document.getElementById("city-choices");
let shootingInstructions = document.getElementById("shooting-instructions");
let hurricaneBox = document.getElementById("hurricane-click");

// Buttons
let startButton = document.querySelector("#introduction .enter");
let choiceButton = document.querySelector("#city-choices .enter");
let citySelectButton = document.querySelector("#shooting-instructions .enter");

// Initial variables

const listOfNames = ["Amanda", "Brian", "Caitlin", "Devon", "Elizabeth"];
const hurricanes = [];

const selected = {
  itemOne: null,
  itemTwo: null,
  function: null,
};

let approvalRating = 5;
let budget = 5000;

// 1. Script

// Introduction

startButton.addEventListener("click", function () {
  introduction.classList.add("hidden");
  choiceList.classList.remove("hidden");
});

// Choice

choiceButton.addEventListener("click", function () {
  choiceList.classList.add("hidden");
  shootingInstructions.classList.remove("hidden");
  selected.function = shoot;
});

// Select City

citySelectButton.addEventListener("click", function () {
  shootingInstructions.classList.add("hidden");
  hurricaneBox.classList.remove("hidden");
  setTimeout(function () {
    turnClick();
    hurricaneBox.innerHTML = "<p>Click on a hurricane to shoot at it.</p>";
    choiceList.classList.remove("hidden");
    hurricaneBox.classList.add("hidden");
  }, 5000);
});

// 2. Render the HTML

function renderDivGrid(array) {
  array.forEach(function (row, rowIndex) {
    row.forEach(function (item, colIndex) {
      createOneGridDiv(item, rowIndex, colIndex);
    });
  });
}

function createOneGridDiv(item, rowIndex, colIndex) {
  let div = document.createElement("div");
  div.className = item.startingClasses;
  htmlGrid.appendChild(div);
  item.htmlNode = div;
  div.addEventListener("click", function () {
    squareClick(item);
  });
}

// 4. Create Hurricane

const renderer = (state) => ({
  render() {
    state.htmlNode.classList.add(
      state.type,
      "col" + state.colIndex,
      "row" + state.rowIndex
    );
    state.iconNode.innerHTML = state.icon;
    switch (state.type) {
      case "hurricane":
        state.subtitle = `Category ${state.strength}`;
        break;
      case "city":
        state.subtitle = `Ammo: ${state.ammo}`;
        break;
    }
    state.subtitleNode.innerText = state.subtitle;
    return state;
  },
});

// MOVE
// MOVE
// MOVE

const mover = (state) => ({
  move(xMinChange, xMaxChange, yMinChange, yMaxChange) {
    let hurricaneInitial = JSON.parse(JSON.stringify(state));
    var cols = randomNumber(xMinChange, xMaxChange);
    var rows = randomNumber(yMinChange, yMaxChange);
    state.colIndex += cols;
    state.rowIndex += rows;

    // Animation

    let xUnit = startingMap[0][0].htmlNode.offsetWidth;
    let yUnit = startingMap[0][0].htmlNode.offsetHeight;

    let dx = cols * xUnit;
    let dy = rows * yUnit;

    state.htmlNode.classList.add("transition");
    state.htmlNode.style.transform = `translate(${dx}px, ${dy}px)`;

    // Traversion

    let traversion = diagonal(hurricaneInitial, state);
    traversion.shift();
    var floodCount = 0;

    traversion.forEach(function (square, i) {
      setTimeout(function () {
        if (square.type === "land") {
          if (square.feature) {
            console.log(
              `${state.name} has hit ${square.feature.city.name}! Your approval rating drops 3 points.`
            );
            lowerApprovalRating(3);
          } else {
            floodCount++;
          }
          square.htmlNode.classList.add("flooded");
        }
      }, (3000 / traversion.length) * i);
    });

    // Move

    setTimeout(function () {
      state.htmlNode.classList.remove(
        "col" + hurricaneInitial.colIndex,
        "row" + hurricaneInitial.rowIndex,
        "transition"
      );

      state.htmlNode.style.transform = ``;

      state.htmlNode.classList.add(
        "col" + state.colIndex,
        "row" + state.rowIndex
      );
      if (
        state.colIndex < 1 ||
        state.colIndex > 32 ||
        state.rowIndex < 1 ||
        state.rowIndex > 24
      ) {
        console.log(`${state.name} disappeared.`);
        state.htmlNode.remove();
        hurricanes.splice(
          hurricanes.findIndex((object) => (object === state ? true : false)),
          1
        );
      }
    }, 3000);

    // Approval Rating
    setTimeout(function () {
      console.log(`flood count: ${floodCount}`);
      if (floodCount > 1) {
        console.log(`${floodCount} squares of countryside were flooded.`);
        lowerApprovalRating(Math.floor(floodCount / 2));
      }
    }, 3500);
  },
});

const shooter = (state) => ({
  shoot(accuracy) {
    console.log("Shots fired!");
  },
});

const strengthener = (state) => ({
  strengthen(supercharge = false) {
    if (state.strength < 5 || supercharge) {
      state.strength++;
    }
  },
});

const weakener = (state) => ({
  weaken() {
    state.strength--;
    if (state.strength <= 0) {
      console.log(`${state.name} died.`);
      state.htmlNode.remove();
      hurricanes.splice(
        hurricanes.findIndex((object) => (object === state ? true : false)),
        1
      );
    }
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
    type: "hurricane",
    icon: "🌊",
    subtitle: null,
  };
  hurricane.subtitle = `Category ${hurricane.strength}`;
  htmlNodeConstructor(hurricane);
  hurricane.htmlNode.addEventListener("click", function () {
    hurricaneClick(hurricane);
  });

  return Object.assign(
    hurricane,
    mover(hurricane),
    strengthener(hurricane),
    weakener(hurricane),
    renderer(hurricane),
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
    type: "city",
    icon: `<img src="${iconUrl}"></img>`,
    subtitle: null,
  };

  city.subtitle = `Ammo: ${city.ammo}`;
  htmlNodeConstructor(city);
  city.htmlNode.addEventListener("click", function () {
    cityClick(city);
  });
  startingMap[rowIndex - 1][colIndex - 1].feature = { city: city };

  return Object.assign(city, renderer(city), shooter(city));
}

function htmlNodeConstructor(object) {
  object.subtitleNode.innerHTML = object.subtitle;
  object.htmlNode.classList.add(object.type);
  object.titleNode.innerText = object.name;
  object.htmlNode.appendChild(object.iconNode);
  object.htmlNode.appendChild(object.titleNode);
  object.htmlNode.appendChild(object.subtitleNode);
  htmlGrid.appendChild(object.htmlNode);
}

// TURN CHANGE
// TURN CHANGE
// TURN CHANGE

document.getElementById("turn").onclick = turnClick;

function turnClick() {
  hurricanes.forEach((hurricane, index, array) =>
    hurricaneTurn(hurricane, index, array)
  );
  if (randomNumber(0, 5) === 0 && hurricanes.length < 4) {
    hurricanes.push(Hurricane());
  }
  if (hurricanes.length === 0) {
    hurricanes.push(Hurricane());
  }
}

function hurricaneTurn(hurricane, index, array) {
  hurricane.move(-4, -1, -4, -1);
  // remove hurricane from off the map
  if (hurricane.colIndex < 1 || hurricane.rowIndex < 1) {
    hurricane.htmlNode.remove();
    array.splice(index, 1);
  }
  // weaken hurricane on land
  if (startingMap[hurricane.rowIndex][hurricane.colIndex].type === "land") {
    hurricane.weaken();
  } else {
    let rand = randomNumber(0, 5);
    if (rand < 2) {
      hurricane.strengthen();
    }
    if (rand === 5 && hurricane.strength !== 6) {
      hurricane.weaken();
    }
  }
  // remove weakened hurricane
  hurricane.render();
}

// Click on Square //

function squareClick(object) {
  console.log(object);
}

// INITIALIZE
// INITIALIZE
// INITIALIZE

hurricanes.push(Hurricane().render());
let newOrleans = City("New Orleans", 15, 8, "./images/city-1.png").render();
let miami = City("Miami", 24, 12, "./images/city-1.png").render();
let houston = City("Houston", 10, 10, "./images/city-1.png").render();
let dallas = City("Dallas", 8, 4, "./images/city-1.png").render();
let atlanta = City("Atlanta", 20, 3, "./images/city-1.png").render();

renderDivGrid(startingMap);

// CHARACTER CLICKING
// CHARACTER CLICKING
// CHARACTER CLICKING

const selectedCityText = document.querySelector(
  "#shooting-instructions .selected-city"
);
const selectedCityButton = document.querySelector(
  "#shooting-instructions .enter"
);

function cityClick(city) {
  if (selected.itemOne) {
    selected.itemOne.htmlNode.classList.remove("selected");
  }
  selected.itemOne = city;
  city.htmlNode.classList.add("selected");
  selectedCityText.innerHTML = `<p>You have selected ${city.name}.</p>`;
}

function hurricaneClick(hurricane) {
  if (selected.itemOne.type === "hurricane") {
    selected.itemOne = hurricane;
  } else if (selected.itemOne.type === "city") {
    selected.itemTwo = hurricane;
    shoot(selected.itemOne, selected.itemTwo, 1);
  }
}

// SHOOTING
// SHOOTING
// SHOOTING

function shoot(shooter, target) {
  if (shooter.ammo > 0 || shooter.type !== "city") {
    // starter variables
    let hit = null;
    let deltaX = shooter.colIndex - target.colIndex;
    let deltaY = shooter.rowIndex - target.rowIndex;
    let distance = Math.round(pythagorean(deltaX, deltaY));

    // subtract from ammo
    if (shooter.type === "city") {
      shooter.ammo--;
      shooter.render();
    }

    // determine hit
    if (distance < 6) {
      hit = !!randomNumber(0, 2);
    } else {
      hit = !randomNumber(0, Math.round(distance / 3));
    }
    hit && target.type === "hurricane"
      ? hurricaneHit(shooter, target)
      : (hurricaneBox.innerHTML = `<p>Distance is ${distance}. It's a miss!</p>`);
  } else {
    hurricaneBox.innerHTML = "You're out of ammo!";
  }
}

function hurricaneHit(shooter, target) {
  hurricaneBox.innerHTML = `<p>${shooter.name} hit ${target.name}!</p>`;

  // Category 1 + 2
  if (target.strength < 3) {
    let result = randomNumber(0, 5);
    if (result === 4) {
      target.strengthen();
      target.render();
      hurricaneBox.innerHTML += `<p>You enraged ${target.name}. It has gotten stronger, and is now a category ${target.strength}.</p>`;
    } else if (result === 5) {
      hurricaneBox.innerHTML += `<p>${target.name} shot back!!!</p>`;
      lowerApprovalRating(1);
    } else {
      target.weaken();
      target.render();
      raiseApprovalRating(1);
      hurricaneBox.innerHTML += `<p>${target.name} was weakened to a category ${target.strength}</p>`;
    }

    // Category 3 & 4
  } else if (target.strength > 2 && target.strength < 5) {
    let result = randomNumber(0, 2);
    if (result === 2) {
      target.strengthen();
      target.render();
      hurricaneBox.innerHTML += `<p>You enraged ${target.name}. It has gotten stronger, and is now a category ${target.strength}.</p>`;
    } else if (result === 1) {
      hurricaneBox.innerHTML += `<p>${target.name} shot back!!!</p>`;
      lowerApprovalRating(1);
    } else {
      target.weaken();
      target.render();
      raiseApprovalRating(1);
      hurricaneBox.innerHTML += `<p>${target.name} was weakened to a category ${target.strength}</p>`;
    }
  }

  // Category 5 & 6
  else {
    let result = randomNumber(0, 2);
    if (result === 2) {
      target.strengthen(true);
      target.render();
      hurricaneBox.innerHTML += `<p>You enraged ${target.name}. It has gotten stronger, and is now a category ${target.strength}.</p>`;
    } else if (result === 1) {
      hurricaneBox.innerHTML += `<p>${target.name} shot back!!!</p>`;
      lowerApprovalRating(1);
    } else {
      target.weaken();
      target.render();
      raiseApprovalRating(1);
      hurricaneBox.innerHTML += `<p>${target.name} was weakened to a category ${target.strength}</p>`;
    }
  }
}

// APPROVAL RATING
// APPROVAL RATING
// APPROVAL RATING

function lowerApprovalRating(amount) {
  approvalRating--;
  hurricaneBox.innerHTML += `Your approval rating has dropped ${amount} point${
    amount > 1 ? "s" : ""
  } to ${approvalRating}.`;
  approvalBar.setAttribute("value", approvalRating);
}

function raiseApprovalRating(amount) {
  approvalRating++;
  hurricaneBox.innerHTML += `Your approval rating has increased ${amount} point${
    amount > 1 ? "s" : ""
  } to ${approvalRating}.`;
  approvalBar.setAttribute("value", approvalRating);
}

// LANDFALL
// LANDFALL
// LANDFALL

let dallasToMiami = diagonal(dallas, miami);

// BRESENHAM
// BRESENHAM
// BRESENHAM

function diagonal(obj1, obj2) {
  const coordinatesArray = bresenham(
    obj1.colIndex,
    obj1.rowIndex,
    obj2.colIndex,
    obj2.rowIndex
  );
  const mapSquares = [];
  coordinatesArray.forEach(function (coordinate) {
    mapSquares.push(startingMap[coordinate[0] - 1][coordinate[1] - 1]);
  });
  return mapSquares;
}

function bresenham(x1, y1, x2, y2) {
  const coordinatesArray = [];
  // Define differences and error check
  let dx = Math.abs(x2 - x1);
  let dy = Math.abs(y2 - y1);
  let sx = x1 < x2 ? 1 : -1;
  let sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;
  // Set first coordinates
  coordinatesArray.push([y1, x1]);
  // Main loop
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
    // Set coordinates
    coordinatesArray.push([y1, x1]);
  }
  // Return the result
  return coordinatesArray;
}
