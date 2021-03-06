export {
  random,
  pythagorean,
  bresenham,
  diagonal,
  deleteHurricane,
  listOfNames,
  hurricanes,
  selected,
};

// Arrays

const hurricanes = [];

// Global Variables

const selected = {
  itemOne: { type: null },
  itemTwo: { type: null },
  function: null,
};

// Functions

function deleteHurricane(hurricane) {
  hurricanes.splice(
    hurricanes.findIndex((object) => object === hurricane),
    1
  );
  hurricane.htmlNode.remove();
}

function random(min, max) {
  let spread = max - min;
  let number = Math.floor(Math.random() * (spread + 1)) + min;
  return number;
}

function pythagorean(sideA, sideB) {
  return Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2));
}

function bresenham(x1, y1, x2, y2) {
  const coordinatesArray = [];
  let dx = Math.abs(x2 - x1);
  let dy = Math.abs(y2 - y1);
  let sx = x1 < x2 ? 1 : -1;
  let sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;
  coordinatesArray.push([y1, x1]);
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
    coordinatesArray.push([y1, x1]);
  }
  return coordinatesArray;
}

function diagonal(x1, y1, x2, y2, map) {
  const coordinatesArray = bresenham(x1, y1, x2, y2);
  const mapSquares = [];
  coordinatesArray.forEach(function (coordinate) {
    if (
      coordinate[1] >= 1 &&
      coordinate[1] <= 33 &&
      coordinate[0] >= 1 &&
      coordinate[0] <= 25
    ) {
      mapSquares.push(map[coordinate[0] - 1][coordinate[1] - 1]);
    }
  });
  mapSquares.shift;
  return mapSquares;
}

const boysNames = [
  [
    "Aaron",
    "Abel",
    "Abram",
    "Al",
    "Alberto",
    "Alex",
    "Alexis",
    "Alfredo",
    "Ali",
    "Alphonse",
    "Amado",
    "Andreas",
    "Antoine",
    "Antony",
    "Arden",
    "Art",
    "Ashley",
    "Aurelio",
  ],
  [
    "Bart",
    "Ben",
    "Bernard",
    "Bill",
    "Billie",
    "Blaine",
    "Bob",
    "Boris",
    "Bradly",
    "Brendan",
    "Brett",
    "Broderick",
    "Bruce",
    "Bryce",
    "Bryon",
    "Burt",
  ],
  [
    "Cary",
    "Casey",
    "Cecil",
    "Chang",
    "Chase",
    "Chester",
    "Chet",
    "Christoper",
    "Clayton",
    "Clement",
    "Cletus",
    "Clinton",
    "Clyde",
    "Corey",
    "Cory",
    "Craig",
    "Cristobal",
    "Cyrus",
  ],
  [
    "Dale",
    "Dan",
    "Danial",
    "Danilo",
    "Dannie",
    "Darrel",
    "Darrick",
    "Dave",
    "Deandre",
    "Deangelo",
    "Dennis",
    "Denny",
    "Derick",
    "Devin",
    "Dewitt",
    "Dick",
    "Dillon",
    "Dino",
    "Donn",
    "Donny",
    "Dudley",
  ],
  ["Edgardo", "Eli", "Elisha", "Ellis", "Enrique", "Ernest", "Ernie", "Ezra"],
  [
    "Ferdinand",
    "Fernando",
    "Fidel",
    "Fletcher",
    "Franklyn",
    "Frederic",
    "Fredric",
    "Fredrick",
    "Fritz",
  ],
  ["Garth", "Genaro", "Geoffrey", "Gerry", "Glenn", "Gordon", "Granville"],
  ["Hal", "Heath", "Hilario"],
  ["Isreal", "Ivory"],
  [
    "Jacob",
    "Jacques",
    "Jae",
    "Jake",
    "Jan",
    "Jarod",
    "Jasper",
    "Javier",
    "Javier",
    "Jay",
    "Jean",
    "Jefferson",
    "Jeffery",
    "Jeffry",
    "Jerrell",
    "Jess",
    "Jewel",
    "Johnny",
    "Jonas",
    "Josue",
  ],
  [
    "Keenan",
    "Kendrick",
    "Kermit",
    "Kerry",
    "Kevin",
    "King",
    "Kirby",
    "Kris",
    "Kurtis",
  ],
  [
    "Lacy",
    "Lamar",
    "Lamont",
    "Lance",
    "Larry",
    "Leandro",
    "Leif",
    "Lenny",
    "Leonardo",
    "Lesley",
    "Lester",
    "Logan",
    "Long",
    "Lorenzo",
    "Luigi",
    "Lupe",
    "Luther",
  ],
  [
    "Mariano",
    "Marlon",
    "Mason",
    "Mel",
    "Miles",
    "Milo",
    "Milo",
    "Modesto",
    "Morris",
  ],
  ["Nathanial", "Ned", "Norman"],
  ["Olen", "Ollie", "Oren", "Orlando", "Orville", "Oswaldo", "Otto"],
  ["Pablo", "Pat"],
  ["Quentin"],
  [
    "Ramiro",
    "Rashad",
    "Raul",
    "Reggie",
    "Reginald",
    "Ricardo",
    "Ricardo",
    "Rickie",
    "Roberto",
    "Rod",
    "Rodrigo",
    "Ronnie",
    "Rosario",
    "Ross",
    "Ross",
    "Royal",
    "Royce",
    "Ruben",
    "Rudolf",
    "Rupert",
    "Russel",
  ],
  [
    "Sammie",
    "Sang",
    "Sean",
    "Seth",
    "Shayne",
    "Sherwood",
    "Sid",
    "Son",
    "Stacy",
    "Stevie",
    "Stewart",
  ],
  ["Ted", "Terrance", "Theron", "Titus", "Tomas", "Tracy", "Travis", "Tyler"],
  ["Usher", "Ulrich", "Umberto", "Ulysses"],
  ["Valentine", "Vern", "Vernon", "Virgilio"],
  ["Wayne", "Wes", "Wilfredo", "Willie", "Willy", "Wilton", "Woodrow"],
  ["Xander", "Xavier", "Xeno"],
  ["Yong", "Young", "Young"],
  ["Zabe", "Zach", "Zed", "Zeke"],
];

const girlsNames = [
  [
    "Anglea",
    "Analisa",
    "Asha",
    "Arianne",
    "Alejandra",
    "Annis",
    "Angelic",
    "Angla",
    "Amy",
    "Arlene",
    "Angelina",
    "Alysa",
    "Alona",
    "Alaina",
    "Aileen",
    "Arlyne",
    "Alesha",
    "Anisa",
    "Alysia",
    "Alexa",
    "Alaine",
    "Alda",
    "Agustina",
    "Alane",
    "Annamaria",
  ],
  ["Brigitte", "Belkis", "Beryl", "Bette", "Barabara", "Bonita", "Beth"],
  [
    "Carin",
    "Charlette",
    "Claretta",
    "Cecelia",
    "Candis",
    "Cordia",
    "Catrina",
    "Cherish",
    "Collene",
    "Clora",
    "Cathryn",
    "Camila",
    "Celena",
    "Crissy",
    "Cyndi",
  ],
  ["Dannette", "Delcie", "Delena", "Deann", "Dia", "Deloise"],
  [
    "Edelmira",
    "Ernestina",
    "Emilie",
    "Emilee",
    "Ela",
    "Edie",
    "Elisa",
    "Elenor",
    "Ellan",
    "Elene",
    "Elma",
    "Elizebeth",
    "Elina",
    "Eva",
    "Elvia",
    "Elouise",
    "Eusebia",
    "Eunice",
  ],
  ["Freda", "Florentina", "Faith", "Flo", "Florencia"],
  ["Gwenn", "Gena", "Gidget", "Gertie", "Genna", "Griselda"],
  ["Heather", "Holley", "Hanna"],
  ["Ivette", "Ivey", "Irmgard", "Ilana"],
  [
    "Jacquelynn",
    "Jacquelin",
    "Jacquiline",
    "Jenine",
    "Jeana",
    "Janise",
    "Jeanna",
    "Joellen",
    "Josie",
    "Jaimie",
    "Jaymie",
    "Joy",
    "Jerrie",
    "Junie",
    "Jeanne",
    "Janita",
  ],
  [
    "Kellie",
    "Kourtney",
    "Kia",
    "Kiera",
    "Kenya",
    "Kristine",
    "Kiley",
    "Kallie",
    "Kasie",
    "Karmen",
    "Kera",
    "Kanesha",
    "Kara",
    "Katina",
    "Keesha",
    "Kathryn",
    "Krystyna",
    "Kristi",
    "Kiana",
  ],
  [
    "Leontine",
    "Lorina",
    "Loria",
    "Lucienne",
    "Latarsha",
    "Lucinda",
    "Lucie",
    "Lesia",
    "Lynne",
    "Luella",
    "Lana",
    "Leora",
    "Lucy",
    "Loris",
    "Laticia",
    "Laurine",
    "Leonia",
    "Latanya",
    "Lorna",
    "Louvenia",
    "Luanne",
    "Louise",
    "Loriann",
    "Lieselotte",
  ],
  [
    "Marry",
    "Maragret",
    "Madelyn",
    "Mammie",
    "Mila",
    "Myra",
    "Marnie",
    "Maye",
    "Maryrose",
    "Maryann",
    "Marivel",
    "Meggan",
    "Mamie",
    "Michell",
    "Margaretta",
    "Michaela",
    "Mirella",
  ],
  ["Nikki", "Nikia", "Neomi", "Norah", "Nobuko", "Neta", "Nia", "Na", "Nicola"],
  ["Olivia", "Olive", "Ophelia", "Opal", "Odessa"],
  ["Portia", "Peg", "Pamelia", "Paige"],
  ["Quinn", "Queenie", "Quinta", "Qianru"],
  ["Ruthanne", "Rosalie", "Reatha", "Roseline", "Robbi", "Rosalia", "Rashida"],
  [
    "Shasta",
    "Shenita",
    "Sabra",
    "Sonya",
    "Suellen",
    "Sun",
    "Sherley",
    "Serafina",
    "Shirely",
    "Selene",
    "Shameka",
    "Sonja",
    "Shan",
    "Stepanie",
    "Shelli",
    "Simonne",
    "Santa",
    "Shayla",
    "Shelley",
    "Signe",
  ],
  [
    "Tuyet",
    "Tiera",
    "Tera",
    "Tierra",
    "Tesha",
    "Tomasa",
    "Teena",
    "Temple",
    "Tilda",
    "Tonita",
    "Tajuana",
    "Teresia",
    "Talisha",
    "Tayna",
    "Tressa",
    "Tonda",
    "Tomika",
    "Tamara",
    "Tawnya",
    "Tammara",
    "Tanisha",
  ],
  ["Ulrike", "Uma", "Undine", "Ursula"],
  [
    "Vanetta",
    "Vonnie",
    "Vikki",
    "Valrie",
    "Voncile",
    "Venita",
    "Vanna",
    "Vivian",
    "Vernice",
    "Vannessa",
    "Vina",
  ],
  ["Williemae", "Wanda"],
  ["Xyla", "Xena", "Xaviera", "Xiao"],
  ["Yelena", "Yukiko", "Yvone", "Yuonne"],
  [
    "Zabana",
    "Zadie",
    "Zandra",
    "Zara",
    "Zelda",
    "Zenobia",
    "Zeta",
    "Zofia",
    "Zoe",
  ],
];

const names = () => {
  let array = [];
  let gender = !random(0, 1);
  for (let i = 0; i < 26; i++) {
    if (gender) {
      array.push(boysNames[i][random(0, boysNames[i].length - 1)]);
    } else {
      array.push(girlsNames[i][random(0, girlsNames[i].length - 1)]);
    }
    gender = !gender;
  }
  return array;
};

const listOfNames = names();
