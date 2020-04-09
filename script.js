// Imports

import startingMap from "./scripts/map-1.js";
import * as basics from "./scripts/utilities.js";
import * as elements from "./scripts/elements.js";
import * as utilities from "./scripts/utilities.js";
// import { City, Hurricane } from "./scripts/factoryFunctions.js";

// Global Variables

let approvalRating = 5;
let budget = 5000;
var gameState = null;

function nextTurn() {
  clearDialogueBox();
  turnClick();
}

function proceed() {
  if (gameState === "storm") {
    gameStateShooting();
    clearDialogueBox();
    turnClick();
  } else if (gameState === "shooting") {
    clearDialogueBox();
  }
}

function gameStatePurchasing() {
  gameState = "purchasing";
}

function gameStateShooting() {
  gameState = "shooting";
}

function gameStateInstruction() {
  gameState = "instruction";
}

function gameStateStorm() {
  gameState = "storm";
}

// gameState = "instruction", "shooting", "storm", "purchasing"

gameStateInstruction();

elements.introButton.onclick = () => {
  if (gameState === "instruction") {
    elements.introduction.classList.add("hidden");
    elements.instructions1.classList.remove("hidden");
  } else {
    console.log(gameState);
  }
};

elements.instructions1Button.onclick = () => {
  if (gameState === "instruction") {
    elements.instructions1.classList.add("hidden");
    elements.instructions2.classList.remove("hidden");
  } else {
    console.log(gameState);
  }
};

elements.instructions2Button.onclick = () => {
  if (gameState === "instruction") {
    elements.instructions2.classList.add("hidden");
    elements.buttonBox.classList.add("hidden");
    elements.dialogueBox.classList.remove("hidden");
    gameStateShooting();
  } else {
    console.log(gameState);
  }
};

// End instructions

// Start player 1

// Shooting

// Dialog Box

elements.dialogueButton.onclick = () => {
  if (gameState === "storm") {
    proceed();
  } else if (gameState === "shooting") {
    clearDialogueBox();
  }
};

// PURCHASE
// PURCHASE
// PURCHASE

elements.cashButton.onclick = () => {
  if (gameState === "shooting") {
    clearDialogueBox();
    elements.purchaseBox.classList.remove("hidden");
    elements.buttonBox.classList.remove("hidden");
    gameStateInstruction();
  } else {
    console.log(gameState);
  }
};

elements.closePurchaseBox.onclick = () => {
  elements.purchaseBox.classList.add("hidden");
  elements.buttonBox.classList.add("hidden");
  gameStateShooting();
};

var itemToPurchase = null;

elements.buyWall.onclick = () => {
  gameStatePurchasing();
  elements.purchaseBox.classList.add("hidden");
  elements.wallInstrux.classList.remove("hidden");
  console.log("Buy some wall!");
  itemToPurchase = "wall";
  elements.htmlGrid.classList.add("wall");
};

elements.cancelPurchase.onclick = () => {
  elements.wallInstrux.classList.add("hidden");
  elements.purchaseBox.classList.remove("hidden");
  elements.buttonBox.classList.remove("hidden");
  elements.htmlGrid.classList.remove("wall");
  itemToPurchase = null;
};

elements.buyAmmo.onclick = () => {
  gameStatePurchasing();
  console.log("Buy some ammo!");
  itemToPurchase = "ammo";
  elements.purchaseBox.classList.add("hidden");
  elements.ammoInstrux.classList.remove("hidden");
};

function lowerBudget(amount) {
  budget -= amount;
  elements.budgetBar.setAttribute("value", budget);
}

function raiseBudget(amount) {
  budget += amount;
  elements.budgetBar.setAttribute("value", budget);
}

// Dialogue Box

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

// MOVE
// MOVE
// MOVE

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
            if (!square.country && square.row < 13) {
              floodCount++;
            }
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
    renderer(hurricane)
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

  return Object.assign(city, renderer(city));
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
  if (gameState === "shooting") {
    clearDialogueBox();
  } else if (gameState === "purchasing" && itemToPurchase === "wall") {
    object.type = "wall";
    object.htmlNode.classList.add("wall");
    console.log(object);
    lowerBudget(500);
    elements.htmlGrid.classList.remove("wall");
    gameState = "shooting";
    elements.wallInstrux.classList.add("hidden");
    clearDialogueBox();
  }
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
  if (gameState === "shooting") {
    clearDialogueBox();
    if (utilities.selected.itemOne.type) {
      utilities.selected.itemOne.htmlNode.classList.remove("selected");
    }
    utilities.selected.itemOne = city;
    city.htmlNode.classList.add("selected");
  } else if (gameState === "purchasing" && itemToPurchase === "ammo") {
    city.ammo++;
    city.render();
    lowerBudget(100);
    elements.ammoInstrux.classList.add("hidden");
    gameState = "shooting";
    elements.wallInstrux.classList.add("hidden");
    clearDialogueBox();
  }
}

function hurricaneClick(hurricane) {
  if (gameState === "shooting") {
    if (utilities.selected.itemOne.type === "city") {
      shoot(utilities.selected.itemOne, hurricane, 1);
    }
    deselect();
  }
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
  gameStateStorm();
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
    renderDialogueBox("You're out of ammo!");
    gameStateShooting();
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
