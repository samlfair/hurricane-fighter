// Imports

import startingMap from "./scripts/map-1.js";
import * as basics from "./scripts/utilities.js";
import * as elements from "./scripts/elements.js";
import * as utilities from "./scripts/utilities.js";
// import { City, Hurricane } from "./scripts/factoryFunctions.js";

document.getElementById("anon").addEventListener("click", function () {
  clearDialogueBox();
  turnClick();
});

function nextTurn() {
  clearDialogueBox();
  turnClick();
}

function proceed() {
  if (playersTurn) {
    clearDialogueBox();
    turnClick();
  } else {
    clearDialogueBox();
  }
}

// If true, player's turn. If false, hurricane's turn.
var playersTurn = true;

elements.introButton.onclick = () => {
  elements.introduction.classList.add("hidden");
  elements.instructions1.classList.remove("hidden");
};

elements.instructions1Button.onclick = () => {
  elements.instructions1.classList.add("hidden");
  elements.instructions2.classList.remove("hidden");
};

elements.instructions2Button.onclick = () => {
  elements.instructions2.classList.add("hidden");
  elements.buttonBox.classList.add("hidden");
  elements.dialogueBox.classList.remove("hidden");
};

elements.dialogueButton.onclick = () => {
  proceed();
};

function clearDialogueBox() {
  elements.dialogueBox.innerHTML = "";
  elements.dialogueBox.classList.add("hidden");
  elements.buttonBox.classList.add("hidden");
}

function renderDialogueBox(htmlString) {
  elements.dialogueBox.innerHTML = "";
  elements.dialogueBox.innerHTML += htmlString;
  elements.dialogueBox.classList.remove("hidden");
  elements.buttonBox.classList.remove("hidden");
}

function addToDialogueBox(htmlString) {
  elements.dialogueBox.classList.remove("hidden");
  elements.buttonBox.classList.remove("hidden");
  elements.dialogueBox.innerHTML += htmlString;
}

// Global Variables

let approvalRating = 5;
let budget = 5000;

// 1. Script

// Introduction

// RENDER MAP
// RENDER MAP
// RENDER MAP

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
  elements.htmlGrid.appendChild(div);
  item.htmlNode = div;
  div.addEventListener("click", function () {
    squareClick(item);
  });
}

// RENDER METHOD
// RENDER METHOD
// RENDER METHOD

const renderer = (state) => ({
  render() {
    state.htmlNode.classList.add(
      state.type,
      "col" + state.colIndex,
      "row" + state.rowIndex
    );
    state.iconNode.innerHTML = state.icon;
    setSubtitle(state);
    return state;
  },
});

const setSubtitle = (state) => {
  switch (state.type) {
    case "hurricane":
      state.subtitle = `Category ${state.strength}`;
      break;
    case "city":
      state.subtitle = `Ammo: ${state.ammo}`;
      break;
  }
  state.subtitleNode.innerText = state.subtitle;
};

// MOVE METHOD
// MOVE METHOD
// MOVE METHOD

function animateMovement(state, colChange, rowChange) {
  state.htmlNode.classList.add("transition");
  // Important! Remove class "transition" when movement ends.
  let xUnit = document.querySelector(".land").offsetWidth;
  let yUnit = document.querySelector(".land").offsetHeight;
  let dx = colChange * xUnit;
  let dy = rowChange * yUnit;
  state.htmlNode.style.transform = `translate(${dx}px, ${dy}px)`;
}

const mover = (state) => ({
  move(xMinChange, xMaxChange, yMinChange, yMaxChange) {
    var colChange = basics.randomNumber(xMinChange, xMaxChange);
    var rowChange = basics.randomNumber(yMinChange, yMaxChange);
    var colInitial = state.colIndex;
    var rowInitial = state.rowIndex;
    var colFinal = colInitial + colChange;
    colFinal < 1 ? (colFinal = 1) : null;
    rowFinal < 1 ? (rowFinal = 1) : null;
    var rowFinal = rowInitial + rowChange;
    var floodCount = 0;

    let traversion = diagonal(colInitial, rowInitial, colFinal, rowFinal);
    traversion.shift;

    traversion.forEach(function (square, index, array) {
      if (square.col === 1 || square.row === 1) {
        array.splice(index + 1);
        let lastSquare = traversion[traversion.length - 1];
        colChange = lastSquare.col - colInitial;
        rowChange = lastSquare.row - rowInitial;
        colFinal = lastSquare.col;
        rowFinal = lastSquare.row;
      }
    });

    state.colIndex = colFinal;
    state.rowIndex = rowFinal;

    // Animation

    animateMovement(state, colChange, rowChange);

    // Paint

    traversion.forEach(function (square, i) {
      setTimeout(function () {
        if (square.type === "land") {
          if (square.feature) {
            addToDialogueBox(
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
      state.htmlNode.classList.remove("col" + colInitial, "row" + rowInitial);
      state.htmlNode.classList.remove("transition");

      state.htmlNode.style.transform = ``;

      state.htmlNode.classList.add("col" + colFinal, "row" + rowFinal);
      if (state.colIndex === 1 || state.rowIndex === 1) {
        addToDialogueBox(`${state.name} disappeared.`);
        state.htmlNode.remove();
        utilities.hurricanes.splice(
          utilities.hurricanes.findIndex((object) =>
            object === state ? true : false
          ),
          1
        );
      }
    }, 3000);

    // Approval Rating
    setTimeout(function () {
      console.log(`flood count: ${floodCount}`);
      if (floodCount > 1) {
        addToDialogueBox(`${floodCount} squares of countryside were flooded.`);
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
      addToDialogueBox(`${state.name} died.`);
      state.htmlNode.remove();
      utilities.hurricanes.splice(
        utilities.hurricanes.findIndex((object) =>
          object === state ? true : false
        ),
        1
      );
    }
  },
});

function Hurricane() {
  let hurricane = {
    name: "Hurricane " + basics.listOfNames.shift(),
    colIndex: basics.randomNumber(19, 30),
    rowIndex: basics.randomNumber(16, 22),
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
    ammo: basics.randomNumber(2, 5),
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
  elements.htmlGrid.appendChild(object.htmlNode);
}

// TURN CHANGE
// TURN CHANGE
// TURN CHANGE

document.getElementById("turn").onclick = turnClick;

function turnClick() {
  console.log([...utilities.hurricanes]);
  [...utilities.hurricanes].forEach((hurricane, index, array) =>
    hurricaneTurn(hurricane, index, array)
  );
  if (basics.randomNumber(0, 5) === 0 && utilities.hurricanes.length < 4) {
    let newHurricane = Hurricane();
    utilities.hurricanes.push(newHurricane);
    console.log(newHurricane);
    newHurricane.render();
  }
  if (utilities.hurricanes.length === 0) {
    let newHurricane = Hurricane();
    utilities.hurricanes.push(newHurricane);
    console.log(newHurricane);
    newHurricane.render();
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
    let rand = basics.randomNumber(0, 5);
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
  deselect();
}

// INITIALIZE
// INITIALIZE
// INITIALIZE

utilities.hurricanes.push(Hurricane().render());
let newOrleans = City("New Orleans", 15, 8, "./images/city-1.png").render();
let miami = City("Miami", 24, 12, "./images/city-1.png").render();
let houston = City("Houston", 10, 10, "./images/city-1.png").render();
let dallas = City("Dallas", 8, 4, "./images/city-1.png").render();
let atlanta = City("Atlanta", 20, 3, "./images/city-1.png").render();

renderDivGrid(startingMap);

// CHARACTER CLICKING
// CHARACTER CLICKING
// CHARACTER CLICKING

function cityClick(city) {
  if (utilities.selected.itemOne.type) {
    utilities.selected.itemOne.htmlNode.classList.remove("selected");
  }
  utilities.selected.itemOne = city;
  city.htmlNode.classList.add("selected");
}

function hurricaneClick(hurricane) {
  if (utilities.selected.itemOne.type === "city") {
    shoot(utilities.selected.itemOne, hurricane, 1);
  }
  deselect();
}

function deselect() {
  if (utilities.selected.itemOne.type) {
    utilities.selected.itemOne.htmlNode.classList.remove("selected");
  }
  utilities.selected.itemOne = { type: null };
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
    let distance = Math.round(basics.pythagorean(deltaX, deltaY));

    // subtract from ammo
    if (shooter.type === "city") {
      shooter.ammo--;
      shooter.render();
    }

    // determine hit
    if (distance < 6) {
      hit = !!basics.randomNumber(0, 2);
    } else {
      hit = !basics.randomNumber(0, Math.round(distance / 3));
    }
    hit && target.type === "hurricane"
      ? hurricaneHit(shooter, target)
      : renderDialogueBox(`<p>Miss!</p>`);
  } else {
    console.log("You're out of ammo!");
  }
}

function hurricaneHit(shooter, target) {
  renderDialogueBox(`<p>${shooter.name} hit ${target.name}!</p>`);
  var resultText = "";

  // Category 1 + 2
  if (target.strength < 3) {
    let result = basics.randomNumber(0, 5);
    if (result === 4) {
      target.strengthen();
      target.render();
      resultText += `<p>You enraged ${target.name}. It has gotten stronger, and is now a category ${target.strength}.</p>`;
    } else if (result === 5) {
      resultText += `<p>${target.name} shot back!!!</p>`;
      lowerApprovalRating(1);
    } else {
      target.weaken();
      target.render();
      raiseApprovalRating(1);
      resultText += `<p>${target.name} was weakened to a category ${target.strength}</p>`;
    }

    // Category 3 & 4
  } else if (target.strength > 2 && target.strength < 5) {
    let result = basics.randomNumber(0, 2);
    if (result === 2) {
      target.strengthen();
      target.render();
      resultText += `<p>You enraged ${target.name}. It has gotten stronger, and is now a category ${target.strength}.</p>`;
    } else if (result === 1) {
      resultText += `<p>${target.name} shot back!!!</p>`;
      lowerApprovalRating(1);
    } else {
      target.weaken();
      target.render();
      raiseApprovalRating(1);
      resultText += `<p>${target.name} was weakened to a category ${target.strength}</p>`;
    }
  }

  // Category 5 & 6
  else {
    let result = basics.randomNumber(0, 2);
    if (result === 2) {
      target.strengthen(true);
      target.render();
      resultText += `<p>You enraged ${target.name}. It has gotten stronger, and is now a category ${target.strength}.</p>`;
    } else if (result === 1) {
      resultText += `<p>${target.name} shot back!!!</p>`;
      lowerApprovalRating(1);
    } else {
      target.weaken();
      target.render();
      raiseApprovalRating(1);
      resultText += `<p>${target.name} was weakened to a category ${target.strength}</p>`;
    }
  }
  addToDialogueBox(resultText);
}

// APPROVAL RATING
// APPROVAL RATING
// APPROVAL RATING

function lowerApprovalRating(amount) {
  approvalRating--;
  addToDialogueBox(
    `Your approval rating has dropped ${amount} point${
      amount > 1 ? "s" : ""
    } to ${approvalRating}.`
  );
  elements.approvalBar.setAttribute("value", approvalRating);
}

function raiseApprovalRating(amount) {
  approvalRating++;
  addToDialogueBox(
    `Your approval rating has increased ${amount} point${
      amount > 1 ? "s" : ""
    } to ${approvalRating}.`
  );
  elements.approvalBar.setAttribute("value", approvalRating);
}

function diagonal(x1, y1, x2, y2) {
  const coordinatesArray = utilities.bresenham(x1, y1, x2, y2);
  const mapSquares = [];
  coordinatesArray.forEach(function (coordinate) {
    mapSquares.push(startingMap[coordinate[0] - 1][coordinate[1] - 1]);
  });
  return mapSquares;
}
