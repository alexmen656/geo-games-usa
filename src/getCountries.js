const statePairs = [
  { from: "California", to: "Texas" },
  { from: "California", to: "Florida" },
  { from: "California", to: "New York" },
  { from: "California", to: "Illinois" },
  { from: "California", to: "Ohio" },
  { from: "Texas", to: "New York" },
  { from: "Texas", to: "Illinois" },
  { from: "Texas", to: "Pennsylvania" },
  { from: "Florida", to: "Illinois" },
  { from: "Florida", to: "Ohio" },
  { from: "New York", to: "Georgia" },
  { from: "Illinois", to: "Georgia" },
  { from: "Illinois", to: "North Carolina" },
  { from: "Illinois", to: "Michigan" },
  { from: "Ohio", to: "North Carolina" },
  { from: "Ohio", to: "Tennessee" },
  { from: "Ohio", to: "Virginia" },
  { from: "Georgia", to: "Michigan" },
  { from: "Georgia", to: "Tennessee" },
  { from: "Georgia", to: "Virginia" },
  { from: "North Carolina", to: "Michigan" },
  { from: "North Carolina", to: "Tennessee" },
  { from: "North Carolina", to: "Virginia" },
  { from: "Michigan", to: "Georgia" },
  { from: "Michigan", to: "Tennessee" },
  { from: "Michigan", to: "Virginia" },
  { from: "Tennessee", to: "New York" },
  { from: "Tennessee", to: "Florida" },
  { from: "Tennessee", to: "California" },
  { from: "Washington", to: "Texas" },
  { from: "Washington", to: "Florida" },
  { from: "Washington", to: "New York" },
  { from: "Washington", to: "Illinois" },
  { from: "Washington", to: "Ohio" },
  { from: "Nevada", to: "Texas" },
  { from: "Nevada", to: "Florida" },
  { from: "Nevada", to: "New York" },
  { from: "Nevada", to: "Illinois" },
  { from: "Nevada", to: "Ohio" },
  { from: "Arizona", to: "Texas" },
  { from: "Arizona", to: "Florida" },
  { from: "Arizona", to: "New York" },
  { from: "Arizona", to: "Illinois" },
  { from: "Arizona", to: "Ohio" },
];

const neighbors = {
  alabama: ["tennessee", "georgia", "florida", "mississippi"],
  alaska: [],
  arizona: ["california", "nevada", "utah", "colorado", "new_mexico"],
  arkansas: [
    "missouri",
    "tennessee",
    "mississippi",
    "louisiana",
    "texas",
    "oklahoma",
  ],
  california: ["oregon", "nevada", "arizona"],
  colorado: ["wyoming", "nebraska", "kansas", "oklahoma", "new_mexico", "utah"],
  connecticut: ["new_york", "massachusetts", "rhode_island"],
  delaware: ["maryland", "new_jersey", "pennsylvania"],
  florida: ["georgia", "alabama"],
  georgia: [
    "florida",
    "alabama",
    "tennessee",
    "north_carolina",
    "south_carolina",
  ],
  hawaii: [],
  idaho: ["washington", "oregon", "nevada", "utah", "wyoming", "montana"],
  illinois: ["wisconsin", "iowa", "missouri", "kentucky", "indiana"],
  indiana: ["michigan", "ohio", "kentucky", "illinois"],
  iowa: [
    "minnesota",
    "wisconsin",
    "illinois",
    "missouri",
    "nebraska",
    "south_dakota",
  ],
  kansas: ["nebraska", "missouri", "oklahoma", "colorado"],
  kentucky: [
    "illinois",
    "indiana",
    "ohio",
    "west_virginia",
    "virginia",
    "tennessee",
    "missouri",
  ],
  louisiana: ["arkansas", "mississippi", "texas"],
  maine: ["new_hampshire"],
  maryland: ["virginia", "west_virginia", "pennsylvania", "delaware"],
  massachusetts: [
    "new_york",
    "vermont",
    "new_hampshire",
    "connecticut",
    "rhode_island",
  ],
  michigan: ["ohio", "indiana", "wisconsin"],
  minnesota: ["wisconsin", "iowa", "south_dakota", "north_dakota"],
  mississippi: ["tennessee", "alabama", "louisiana", "arkansas"],
  missouri: [
    "iowa",
    "illinois",
    "kentucky",
    "tennessee",
    "arkansas",
    "oklahoma",
    "kansas",
    "nebraska",
  ],
  montana: ["north_dakota", "south_dakota", "wyoming", "idaho"],
  nebraska: [
    "south_dakota",
    "iowa",
    "missouri",
    "kansas",
    "colorado",
    "wyoming",
  ],
  nevada: ["california", "oregon", "idaho", "utah", "arizona"],
  new_hampshire: ["maine", "massachusetts", "vermont"],
  new_jersey: ["new_york", "delaware", "pennsylvania"],
  new_mexico: ["arizona", "utah", "colorado", "oklahoma", "texas"],
  new_york: [
    "new_jersey",
    "pennsylvania",
    "connecticut",
    "massachusetts",
    "vermont",
  ],
  north_carolina: ["virginia", "tennessee", "south_carolina", "georgia"],
  north_dakota: ["minnesota", "south_dakota", "montana"],
  ohio: ["michigan", "indiana", "kentucky", "west_virginia", "pennsylvania"],
  oklahoma: [
    "kansas",
    "missouri",
    "arkansas",
    "texas",
    "new_mexico",
    "colorado",
  ],
  oregon: ["washington", "idaho", "nevada", "california"],
  pennsylvania: [
    "new_york",
    "new_jersey",
    "delaware",
    "maryland",
    "west_virginia",
    "ohio",
  ],
  rhode_island: ["massachusetts", "connecticut"],
  south_carolina: ["north_carolina", "georgia"],
  south_dakota: [
    "north_dakota",
    "minnesota",
    "iowa",
    "nebraska",
    "wyoming",
    "montana",
  ],
  tennessee: [
    "kentucky",
    "virginia",
    "north_carolina",
    "georgia",
    "alabama",
    "mississippi",
    "arkansas",
    "missouri",
  ],
  texas: ["oklahoma", "arkansas", "louisiana", "new_mexico"],
  utah: ["idaho", "wyoming", "colorado", "new_mexico", "arizona", "nevada"],
  vermont: ["new_york", "new_hampshire", "massachusetts"],
  virginia: [
    "maryland",
    "north_carolina",
    "tennessee",
    "kentucky",
    "west_virginia",
  ],
  washington: ["oregon", "idaho"],
  west_virginia: ["ohio", "pennsylvania", "maryland", "virginia", "kentucky"],
  wisconsin: ["minnesota", "iowa", "illinois", "michigan"],
  wyoming: ["montana", "south_dakota", "nebraska", "colorado", "utah", "idaho"],
};

function getRandomCountryPair() {
  const randomIndex = Math.floor(Math.random() * statePairs.length);
  return statePairs[randomIndex];
}

function formatCountryName(name) {
  //console.log(name);
  name = String(name).toLowerCase();
  name = name.replaceAll(" ", "_");
  return name;
}

function isConnected(from, to, guessedCountries) {
  console.log("From:", from, "To:", to);
  console.log("Guessed Countries:", guessedCountries);

  // Wir kombinieren das from-Land, die guessedCountries und das to-Land in eine Liste
  const allCountries = [formatCountryName(from), ...guessedCountries.map(formatCountryName), formatCountryName(to)];
  
  // Wir erstellen eine Kopie der Nachbarschaftsdaten, damit wir den Weg durchlaufen können
  let graph = { ...neighbors };

  // Wir müssen alle Länder miteinander verbinden
  let visitedCountries = new Set();

  // Hilfsfunktion für Tiefensuche (DFS)
  function dfs(country) {
    if (visitedCountries.has(country)) return;
    visitedCountries.add(country);
    if (graph[country]) {
      for (let neighbor of graph[country]) {
        if (allCountries.includes(neighbor)) {
          // Nur Nachbarn, die in der Liste sind
          dfs(neighbor);
        }
      }
    }
  }

  // Start bei `from` und tiefenrekursiv die Nachbarn besuchen
  dfs(from);

  // Wenn alle Länder besucht wurden, gibt es eine gültige Verbindung
  for (let country of allCountries) {
    if (!visitedCountries.has(country)) {
      return false; // Wenn auch nur ein Land nicht besucht wurde, ist die Verbindung ungültig
    }
  }

  return true;
}

export { getRandomCountryPair, isConnected, formatCountryName };
