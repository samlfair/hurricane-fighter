// Imports

import map from "./scripts/map-1.js";
import * as elements from "./scripts/elements.js";
import * as util from "./scripts/utilities.js";
// import { City, Hurricane } from "./scripts/factoryFunctions.js";

// Global Variables

let approvalRating = 5;
let budget = 5000;
var gameState = null;
var itemToPurchase = null;

setTimeout(function () {
  let titleCard = document.querySelector(".title-card-visible");
  titleCard.classList.add("title-card-hidden");
  titleCard.classList.remove("title-card-visible");
}, 3000);

function endGame(boolean, reason) {
  gameState = "over";
  clearDialogueBox();
  if (boolean) {
    elements.endGameText.innerText = "Congratulations! ";
  } else {
    elements.endGameText.innerText = "Game over! ";
  }
  elements.endGame.classList.remove("hidden");
  elements.endGameText.innerText += reason;
  elements.playAgain.addEventListener("click", function () {
    window.location.reload(true);
  });
}

const gameStatePurchasing = () => (gameState = "purchasing");
const gameStateShooting = () => (gameState = "shooting");
const gameStateInstruction = () => (gameState = "instruction");
const gameStateStorm = () => (gameState = "storm");

// gameState = "instruction", "shooting", "storm", "purchasing"

gameStateInstruction();

elements.introButton.onclick = () => {
  if (gameState === "instruction") {
    elements.introduction.classList.add("hidden");
    elements.instructions1.classList.remove("hidden");
  }
};

elements.instructions1Button.onclick = () => {
  if (gameState === "instruction") {
    elements.instructions1.classList.add("hidden");
    elements.instructions2.classList.remove("hidden");
  }
};

elements.instructions2Button.onclick = () => {
  if (gameState === "instruction") {
    elements.instructions2.classList.add("hidden");
    elements.buttonBox.classList.add("hidden");
    elements.dialogueBox.classList.remove("hidden");
    gameStateShooting();
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
  }
};

elements.closePurchaseBox.onclick = () => {
  elements.purchaseBox.classList.add("hidden");
  elements.buttonBox.classList.add("hidden");
  gameStateShooting();
};

elements.buyWall.onclick = () => {
  gameStatePurchasing();
  elements.purchaseBox.classList.add("hidden");
  elements.wallInstrux.classList.remove("hidden");
  itemToPurchase = "wall";
  elements.htmlGrid.classList.add("wall");
};

elements.cancelAmmoPurchase.onclick = () => {
  elements.ammoInstrux.classList.add("hidden");
  elements.htmlGrid.classList.remove("wall");
  elements.purchaseBox.classList.remove("hidden");
  elements.buttonBox.classList.remove("hidden");
  elements.htmlGrid.classList.remove("wall");
  itemToPurchase = null;
};

elements.cancelWallPurchase.onclick = () => {
  elements.wallInstrux.classList.add("hidden");
  elements.htmlGrid.classList.remove("wall");
  elements.purchaseBox.classList.remove("hidden");
  elements.buttonBox.classList.remove("hidden");
  elements.htmlGrid.classList.remove("wall");
  itemToPurchase = null;
};

elements.buyAmmo.onclick = () => {
  gameStatePurchasing();
  itemToPurchase = "ammo";
  elements.purchaseBox.classList.add("hidden");
  elements.ammoInstrux.classList.remove("hidden");
};

function lowerBudget(amount) {
  budget -= amount;
  elements.budgetBar.setAttribute("value", budget);
  if (budget <= 0) {
    budget = 0;
    endGame(
      false,
      "You ran out of money! Congress is enraged, and your party has turned on you. Sad!"
    );
  }
}

function raiseBudget(amount) {
  budget += amount;
  if (budget > 10000) {
    budget = 10000;
  }
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
  elements.dialogueBox.innerHTML += "<p>" + htmlString + "</p>";
  elements.dialogueBox.classList.remove("hidden");
  elements.buttonBox.classList.remove("hidden");
}

function addToDialogueBox(htmlString) {
  elements.dialogueBox.classList.remove("hidden");
  elements.buttonBox.classList.remove("hidden");
  elements.dialogueBox.innerHTML += "<p>" + htmlString + "</p>";
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
  elements.htmlGrid.insertBefore(div, elements.buttonBox);
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

// Generate random coordinates for hurricane movement
function randomizeHurricaneMovement(hurricane) {
  // Add a random number to starting x, depending on y
  console.log(hurricane.rowIndex < 10 ? -2 : -4);
  console.log(hurricane.rowIndex < 10 ? 2 : -1);
  let xFinal =
    hurricane.colIndex +
    util.random(
      hurricane.rowIndex < 10 ? -2 : -4,
      hurricane.rowIndex < 10 ? 2 : -1
    );
  // Add a random number to y
  let yFinal = hurricane.rowIndex + util.random(-4, -1);
  if (xFinal < 1) {
    xFinal = 1;
  }
  if (yFinal < 1) {
    yFinal = 1;
  }
  // Return an array with x and y
  hurricane.col2 = xFinal;
  hurricane.row2 = yFinal;
}

function hitWall(hurricane, traversion) {
  traversion.forEach(function (square, traversion) {
    if (square.type === "wall") {
      hurricane.col2 = traversion[traversion.length - 1].col;
      hurricane.row2 = traversion[traversion.length - 1].row;
      traversion.splice(traversion.findIndex((object) => object === hurricane));
      setTimeout(function () {
        renderDialogueBox(
          `${hurricane.name} hit a wall! Your approval rating jumps!`
        );
        raiseApprovalRating(3);
        while (hurricane.strength > 0) {
          hurricane.weaken();
        }
      });
    }
  }, 3000);
}

const mover = (state) => ({
  move() {
    var floodCount = 0;
    var col1 = state.colIndex;
    var row1 = state.rowIndex;

    randomizeHurricaneMovement(state);

    // Hitting map boundaries
    let traversion = util.diagonal(col1, row1, state.col2, state.row2, map);
    state.col2 = traversion[traversion.length - 1].col;
    state.row2 = traversion[traversion.length - 1].row;

    // Hitting walls
    hitWall(state, traversion);

    // Collisions

    traversion.forEach(function (square, index) {
      setTimeout(function () {
        if (square.type === "land") {
          if (square.feature) {
            addToDialogueBox(
              `${state.name} has hit ${square.feature.city.name}! Your approval rating drops 3 points.`
            );
            lowerApprovalRating(3);
          } else if (square.country === "USA" && square.type === "land") {
            floodCount++;
          }
          flood(square);
        }
      }, (3000 / traversion.length) * index);
    });

    animateMovement(state, state.col2 - col1, state.row2 - row1);

    // Move

    state.colIndex = state.col2;
    state.rowIndex = state.row2;

    setTimeout(function () {
      state.htmlNode.classList.remove("col" + col1, "row" + row1);
      state.htmlNode.classList.remove("transition");

      state.htmlNode.style.transform = ``;
      console.log("just wait");

      state.htmlNode.classList.add("col" + state.col2, "row" + state.row2);
      if (state.colIndex === 1 || state.rowIndex === 1) {
        addToDialogueBox(`${state.name} disappeared.`);
        util.deleteHurricane(state);
      }
      if (util.hurricanes.length === 0) {
        util.hurricanes.push(Hurricane().render());
      }
    }, 3000);

    // Approval Rating
    setTimeout(function () {
      if (floodCount > 1) {
        addToDialogueBox(`Large swaths of the South have been flooded.`);
        lowerApprovalRating(Math.floor(floodCount / 2));
      }
      gameStateShooting();
    }, 3000);
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
    if (util.hurricanes.length === 0 && util.hurricanes.length === 0) {
      endGame(
        true,
        "You survived hurricane season and kept your approval rating high! You win another four years in office."
      );
      return;
    }
    console.log("Weaken!");
    state.strength--;
    if (state.strength <= 0) {
      addToDialogueBox(`${state.name} died.`);
      state.htmlNode.remove();
      util.hurricanes.splice(
        util.hurricanes.findIndex((object) =>
          object === state ? true : false
        ),
        1
      );
    }
    if (util.hurricanes.length === 0) {
      util.hurricanes.push(Hurricane().render());
    }
  },
});

function Hurricane() {
  let hurricane = {
    name: "Hurricane " + util.listOfNames.shift(),
    colIndex: util.random(19, 30),
    rowIndex: util.random(16, 22),
    strength: 2,
    htmlNode: document.createElement("div"),
    iconNode: document.createElement("span"),
    titleNode: document.createElement("h2"),
    subtitleNode: document.createElement("p"),
    type: "hurricane",
    icon: `<img src="./images/hurricane.png">`,
    subtitle: null,
    col2: null,
    row2: null,
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
    ammo: util.random(2, 5),
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
  map[rowIndex - 1][colIndex - 1].feature = { city: city };

  return Object.assign(city, renderer(city));
}

function htmlNodeConstructor(object) {
  object.subtitleNode.innerHTML = object.subtitle;
  object.htmlNode.classList.add(object.type);
  object.titleNode.innerText = object.name;
  object.htmlNode.appendChild(object.iconNode);
  object.htmlNode.appendChild(object.titleNode);
  object.htmlNode.appendChild(object.subtitleNode);
  elements.htmlGrid.insertBefore(object.htmlNode, elements.buttonBox);
}

// TURN CHANGE
// TURN CHANGE
// TURN CHANGE

elements.dialogueButton.onclick = () => {
  console.log("dialogue box");
  clearDialogueBox();
  if (gameState === "storm") {
    raiseBudget(100);
    turnClick();
  } else if (gameState === "shooting") {
    clearDialogueBox();
  }
};

function turnClick() {
  [...util.hurricanes].forEach((hurricane, index, array) =>
    hurricaneTurn(hurricane, index, array)
  );
  if (
    (util.random(0, 5) === 0 && util.hurricanes.length < 3) ||
    util.hurricanes.length === 0
  ) {
    util.hurricanes.push(Hurricane().render());
  }
}

// only define xMax

function hurricaneTurn(hurricane) {
  hurricane.move();

  // remove hurricane from off the map
  if (
    hurricane.colIndex < 1 ||
    hurricane.rowIndex < 1 ||
    hurricane.colIndex > 32
  ) {
    util.deleteHurricane(hurricane);
  }
  // weaken hurricane on land
  setTimeout(function () {
    if (map[hurricane.rowIndex][hurricane.colIndex].type === "land") {
      hurricane.weaken();
    } else {
      let rand = util.random(0, 5);
      if (rand < 2) {
        hurricane.strengthen();
      }
      if (rand === 5 && hurricane.strength !== 6) {
        hurricane.weaken();
      }
    }
    hurricane.render();
  }, 3000);
}

// Click on Square //

function squareClick(object) {
  console.log(object);
  deselect();
  if (gameState === "shooting") {
    clearDialogueBox();
  } else if (
    gameState === "purchasing" &&
    itemToPurchase === "wall" &&
    object.country === "USA" &&
    object.type !== "wall"
  ) {
    object.type = "wall";
    object.htmlNode.classList.add("wall");
    lowerBudget(500);
  }
}

// INITIALIZE
// INITIALIZE
// INITIALIZE

util.hurricanes.push(Hurricane().render());
let newOrleans = City("New Orleans", 15, 8, "./images/city-1.png").render();
let miami = City("Miami", 24, 12, "./images/city-1.png").render();
let houston = City("Houston", 10, 10, "./images/city-1.png").render();
let dallas = City("Dallas", 8, 4, "./images/city-1.png").render();
let atlanta = City("Atlanta", 20, 3, "./images/city-1.png").render();

renderDivGrid(map);

// CHARACTER CLICKING
// CHARACTER CLICKING
// CHARACTER CLICKING

function cityClick(city) {
  if (gameState === "shooting") {
    clearDialogueBox();
    if (util.selected.itemOne.type) {
      util.selected.itemOne.htmlNode.classList.remove("selected");
    }
    util.selected.itemOne = city;
    city.htmlNode.classList.add("selected");
  } else if (gameState === "purchasing" && itemToPurchase === "ammo") {
    city.ammo++;
    city.render();
    lowerBudget(100);
  }
}

function hurricaneClick(hurricane) {
  console.log(hurricane);
  if (gameState === "shooting") {
    if (util.selected.itemOne.type === "city") {
      shoot(util.selected.itemOne, hurricane, 1);
    }
    deselect();
  }
}

function deselect() {
  if (util.selected.itemOne.type) {
    util.selected.itemOne.htmlNode.classList.remove("selected");
  }
  util.selected.itemOne = { type: null };
}

// SHOOTING
// SHOOTING
// SHOOTING

function addAmmo(city, amount) {
  city.ammo += amount;
  city.render;
}

function shoot(shooter, target) {
  gameStateStorm();
  if (shooter.ammo > 0) {
    let hit;
    let distance = util.pythagorean(
      shooter.colIndex - target.colIndex,
      shooter.rowIndex - target.rowIndex
    );
    addAmmo(shooter, -1);
    shooter.render();
    if (distance < 6) {
      hit = !!util.random(0, 2);
    } else {
      hit = !util.random(0, distance / 3);
    }
    hit && target.type === "hurricane"
      ? hurricaneHit(shooter, target)
      : renderDialogueBox(`Miss!`);
  } else {
    renderDialogueBox("You're out of ammo!");
    gameStateShooting();
  }
}

function hurricaneHit(shooter, target) {
  renderDialogueBox(`${shooter.name} hit ${target.name}!`);
  var resultText = "";

  // Category 1 + 2
  if (target.strength < 3) {
    let result = util.random(0, 5);
    if (result === 4) {
      target.strengthen();
      target.render();
      addToDialogueBox(
        `You enraged ${target.name}. It has gotten stronger, and is now a category ${target.strength}.`
      );
    } else if (result === 5) {
      addToDialogueBox(`${target.name} shot back!!!`);
      lowerApprovalRating(1);
    } else {
      target.weaken();
      target.render();
      raiseApprovalRating(1);
      addToDialogueBox(
        `${target.name} was weakened to a category ${target.strength}`
      );
    }

    // Category 3 & 4
  } else if (target.strength > 2 && target.strength < 5) {
    let result = util.random(0, 2);
    if (result === 2) {
      target.strengthen();
      target.render();
      addToDialogueBox(
        `You enraged ${target.name}. It has gotten stronger, and is now a category ${target.strength}.`
      );
    } else if (result === 1) {
      addToDialogueBox(`${target.name} shot back!!!`);
      lowerApprovalRating(1);
    } else {
      target.weaken();
      target.render();
      raiseApprovalRating(1);
      addToDialogueBox(
        `${target.name} was weakened to a category ${target.strength}`
      );
    }
  }

  // Category 5 & 6
  else {
    let result = util.random(0, 2);
    if (result === 2) {
      target.strengthen(true);
      target.render();
      addToDialogueBox(
        `You enraged ${target.name}. It has gotten stronger, and is now a category ${target.strength}.`
      );
    } else if (result === 1) {
      addToDialogueBox(`${target.name} shot back!!!`);
      lowerApprovalRating(1);
    } else {
      target.weaken();
      target.render();
      raiseApprovalRating(1);
      addToDialogueBox(
        `${target.name} was weakened to a category ${target.strength}`
      );
    }
  }
  addToDialogueBox(resultText);
}

// APPROVAL RATING
// APPROVAL RATING
// APPROVAL RATING

function lowerApprovalRating(amount) {
  approvalRating--;
  if (approvalRating <= 0) {
    endGame(false, "Your approval rating dropped too low!");
    return;
  }
  addToDialogueBox(
    `Your approval rating has dropped ${amount} point${
      amount > 1 ? "s" : ""
    } to ${approvalRating}.`
  );
  elements.approvalBar.setAttribute("value", approvalRating);
}

function raiseApprovalRating(amount) {
  if (approvalRating === 10) {
    addToDialogueBox(
      "Your approval rating is already so high, the people couldn't love you more!"
    );
  }
  if (approvalRating + amount > 10) {
    amount = 10 - approvalRating;
  }
  approvalRating += amount;
  addToDialogueBox(
    `Your approval rating has increased ${amount} point${
      amount == 1 ? "" : "s"
    } to ${approvalRating}.`
  );
  elements.approvalBar.setAttribute("value", approvalRating);
}

function flood(object) {
  object.htmlNode.classList.remove(
    "land",
    "ocean-left",
    "ocean-right",
    "ocean-above",
    "ocean-below",
    "border-top-left",
    "border-top-right",
    "border-bottom-right",
    "border-bottom-left",
    "usa"
  );
  object.htmlNode.classList.add("ocean");
  object.type = "ocean";
  let surroundings = getSurroundingSquares(object);

  // edges
  if (surroundings[1].type === "land") {
    surroundings[1].htmlNode.classList.add("ocean-below");
    surroundings[1].htmlNode.classList.remove(
      "border-top-left",
      "border-top-right",
      "border-bottom-right",
      "border-bottom-left"
    );
  }
  if (surroundings[3].type === "land") {
    surroundings[3].htmlNode.classList.add("ocean-right");
    surroundings[3].htmlNode.classList.remove(
      "border-top-left",
      "border-top-right",
      "border-bottom-right",
      "border-bottom-left"
    );
  }
  if (surroundings[4].type === "land") {
    surroundings[4].htmlNode.classList.add("ocean-left");
    surroundings[4].htmlNode.classList.remove(
      "border-top-left",
      "border-top-right",
      "border-bottom-right",
      "border-bottom-left"
    );
  }
  if (surroundings[6].type === "land") {
    surroundings[6].htmlNode.classList.add("ocean-above");
    surroundings[6].htmlNode.classList.remove(
      "border-top-left",
      "border-top-right",
      "border-bottom-right",
      "border-bottom-left"
    );
  }

  // corners
  if (
    surroundings[3].type !== "ocean" &&
    surroundings[1].type !== "ocean" &&
    surroundings[0].type !== "ocean"
  ) {
    surroundings[0].htmlNode.classList.add("border-bottom-right");
  } else {
    surroundings[0].htmlNode.classList.remove("border-bottom-right");
  }
  if (
    surroundings[1].type !== "ocean" &&
    surroundings[4].type !== "ocean" &&
    surroundings[2].type !== "ocean"
  ) {
    surroundings[2].htmlNode.classList.add("border-bottom-left");
  } else {
    surroundings[2].htmlNode.classList.remove("border-bottom-left");
  }
  if (
    surroundings[4].type !== "ocean" &&
    surroundings[6].type !== "ocean" &&
    surroundings[7].type !== "ocean"
  ) {
    surroundings[7].htmlNode.classList.add("border-top-left");
  } else {
    surroundings[7].htmlNode.classList.remove("border-top-left");
  }
  if (
    surroundings[6].type !== "ocean" &&
    surroundings[3].type !== "ocean" &&
    surroundings[5].type !== "ocean"
  ) {
    surroundings[5].htmlNode.classList.add("border-top-right");
  } else {
    surroundings[5].htmlNode.classList.remove("border-top-right");
  }
}

/*
0 1 2
3   4
5 6 7
*/

function getSurroundingSquares(object) {
  let array = [];
  let dummyDiv = document.createElement("div");
  if (object.row === 1) {
    array.push({ type: "land", htmlNode: dummyDiv });
    array.push({ type: "land", htmlNode: dummyDiv });
    array.push({ type: "land", htmlNode: dummyDiv });
    array.push(map[object.row - 1][object.col - 2]);
    array.push(map[object.row - 1][object.col]);
    array.push(map[object.row][object.col - 2]);
    array.push(map[object.row][object.col - 1]);
    array.push(map[object.row][object.col]);
  } else if (object.col === 1) {
    array.push({ type: "land", htmlNode: dummyDiv });
    array.push(map[object.row - 2][object.col - 1]);
    array.push(map[object.row - 2][object.col]);
    array.push({ type: "land", htmlNode: dummyDiv });
    array.push(map[object.row - 1][object.col]);
    array.push({ type: "land", htmlNode: dummyDiv });
    array.push(map[object.row][object.col - 1]);
    array.push(map[object.row][object.col]);
  } else {
    array.push(map[object.row - 2][object.col - 2]);
    array.push(map[object.row - 2][object.col - 1]);
    array.push(map[object.row - 2][object.col]);
    array.push(map[object.row - 1][object.col - 2]);
    array.push(map[object.row - 1][object.col]);
    array.push(map[object.row][object.col - 2]);
    array.push(map[object.row][object.col - 1]);
    array.push(map[object.row][object.col]);
  }
  return array;
}
