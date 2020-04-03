// CREATE COLUMNS AND ROWS

function createColumnCSS(numOfColumns) {
  for (i = 1; i <= numOfColumns; i++) {
    i < 10 ? (num = "0" + i) : (num = i);
    console.log(
      `.col${num} {grid-column-start: ${i}; grid-column-end: ${i + 1};}`
    );
  }
}

// createColumnCSS(33);

function createRowCSS(numOfRows) {
  for (i = 1; i <= numOfRows; i++) {
    i < 10 ? (num = "0" + i) : (num = i);
    console.log(`.col${num} {grid-row-start: ${i}; grid-row-end: ${i + 1};}`);
  }
}

// createRowCSS(25);
