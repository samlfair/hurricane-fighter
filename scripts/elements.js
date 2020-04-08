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
let selectedCityText = document.querySelector(
  "#shooting-instructions .selected-city"
);

// Buttons
let startButton = document.querySelector("#introduction .enter");
let choiceButton = document.querySelector("#city-choices .enter");
let citySelectButton = document.querySelector("#shooting-instructions .enter");
let selectedCityButton = document.querySelector(
  "#shooting-instructions .enter"
);

export {
  htmlGrid,
  approvalBar,
  budgetBar,
  introduction,
  choiceList,
  shootingInstructions,
  hurricaneBox,
  selectedCityText,
  startButton,
  choiceButton,
  citySelectButton,
  selectedCityButton,
};
