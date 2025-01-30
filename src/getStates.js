const allStates = [
  "new_york",
  "washington",
  "alabama",
  "arizona",
  "arkansas",
  "california",
  "colorado",
  "connecticut",
  "delaware",
  "florida",
  "georgia",
  "idaho",
  "illinois",
  "indiana",
  "iowa",
  "kansas",
  "kentucky",
  "louisiana",
  "maine",
  "maryland",
  "massachusetts",
  "michigan",
  "minnesota",
  "mississippi",
  "missouri",
  "montana",
  "nebraska",
  "nevada",
  "new_hampshire",
  "new_jersey",
  "new_mexico",
  "new_york",
  "north_carolina",
  "north_dakota",
  "ohio",
  "oklahoma",
  "oregon",
  "pennsylvania",
  "rhode_island",
  "south_carolina",
  "south_dakota",
  "tennessee",
  "texas",
  "utah",
  "vermont",
  "virginia",
  "washington",
  "west_virginia",
  "wisconsin",
  "wyoming",
  // "hawaii"
  // "alaska"
];

function formatCountryName(name) {
  //console.log(name);
  name = String(name).toLowerCase();
  name = name.replaceAll(" ", "_");
  return name;
}

function isValidCountry(country) {
  const formattedCountry = formatCountryName(country);
  return allStates.includes(formattedCountry);
}

export { formatCountryName, isValidCountry };
