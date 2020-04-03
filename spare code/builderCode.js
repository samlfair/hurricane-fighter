function updateClasses(square) {
  let surrounderClasses = getSurroundingClasses(square);
  let classList = `${square.type} col${square.col} row${square.row} ${surrounderClasses}`;
  console.log(classList);
  square.htmlNode.className = classList;
}

function getSurroundingClasses(square) {
  let surroundingSquares = getSurroundingSquares(square);
  let classes = ``;
  if (square.type === "land") {
    if (surroundingSquares[0].type === "ocean") {
      classes += " ocean-above";
    }
    if (surroundingSquares[1].type === "ocean") {
      classes += " ocean-right";
    }
    if (surroundingSquares[2].type === "ocean") {
      classes += " ocean-below";
    }
    if (surroundingSquares[3].type === "ocean") {
      classes += " ocean-left";
    }
  }
  return classes;
}

function getSurroundingSquares(square) {
  // returns surrounding squares in order of: top, right, bottom, left
  let surroundingSquares = [
    gridArray[square.row - 2][square.col - 1],
    gridArray[square.row - 1][square.col],
    gridArray[square.row][square.col - 1],
    gridArray[square.row - 1][square.col - 2]
  ];
  return surroundingSquares;
}
