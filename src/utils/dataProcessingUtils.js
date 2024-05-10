import config from "../config/config";

function processData(acsData, selectedVariables) {
  // The processData function takes the response array from the ACS API and the selected variables from the user and processes the data according to the selected variables

  let parsedData = parseData(acsData, selectedVariables.transformationType); // Example: { '000101': { variablesValues: [1650, 3163], baseValue: 3163 }, '000102': { variablesValues: [1554, 18887], baseValue: 18887 } }

  let transformedData = transformData(parsedData, selectedVariables.transformationType); // Example: { '000101': 52.11, '000102': 8.23 }
  
  let processedData = {};
  // Loop through the transformed data and format the data according to the selected variables
  for (const geoCode in transformedData) { 
    const value = transformedData[geoCode]; // Get the value for the current geographic code
    processedData[geoCode] = formatData(value, selectedVariables.format); // Format the value according to the selected format
  }
  return processedData; // Example output: { '000101': '52.11%', '000102': '8.23%' }
}

function parseData(acsData, selectedGeography, selectedVariables) {

  let parsedData = {};
  
  if (selectedVariables.transformationType) {  // If the selected variable has a transformation type, we need to parse the data differently

    for (let i = 1; i < acsData.length; i++) { // Loop through the response array, skipping the first row since it's header information
        const row = acsData[i];
        const geoCode = row[row.length - 1]; // The geographic code which will be used to join the data to the geojson file is always the last value in the row

        // Parse the response array to identify the variable values and base variable value
        // THis logic identifies all of the variable data and the base variable data in the response array

        // We begin by identifying and storing the index of the first location-based data in the response array
        const locationIndex = selectedGeography === 'tracts' ? row.length - 3 : selectedGeography === 'counties' ? row.length - 2 : row.length - 1;
      
        // EXAMPLE A - 'tracts' geography response
        // ['B01001_002E', 'B01001_001E', 'state', 'county', 'tract'],
1               // ['1650', '3163', '21', '067', '000101']
        //  locationIndex = (row.length - 3) = 2 ('state' in this example')

        // EXAMPLE B - 'counties' geography response
        // ['B01001_002E', 'B01001_001E' 'state', 'county']
        // ['1554', '18887', '21', '001']
        // In this example, locationIndex will be set to 2 ('state') (row.length - 2)

        //EXAMPLE C - 'msa' geography response
        // ['B01001_002E', 'B01001_001E' "metropolitan statistical area/micropolitan statistical area"]
        // ["15754", "515954", "30460"]
        // In this example, locationIndex will be set to 1 ('metropolitan statistical area/micropolitan statistical area') (row.length - 1)

        //////////// NOTE //////////
        // If additional geographies are added to the app or the ACS API schema is altered by the Census Bureau, the response array selection logic will need to be checked and potentially updated depending on the structure of the response array.
        ////////////////////////////

        let variablesValues;
        let baseValue;

        // Store the base value to send it to the transformData function
        baseValue = row[locationIndex - 1]; // The last variable value before location data, in the case of example A, that would be the base value 'B01001_001E'

        // Variable values are all the values that come before the base variable and location values
        variablesValues = row.slice(0, locationIndex - 1);
        variablesValues = variablesValues.map(Number);

        // Mapping Logic
        parsedData[geoCode] = { variablesValues, baseValue }; // Store the variable values and base value keyed by the geographic code
    }
    } else { //For 'Total Population' and other variables that don't require transformation, we simply loop through the response array and map the variable values to the geographic codes

      // Example response array ('Total Population' variable for 'tracts' geography)
      // ['B01001_001E', 'state', 'county', 'tract']
      // ['3163', '21', '067', '000101']

    for (let i = 1; i < acsData.length; i++) { // Skip the first row since it's header information
        const row = acsData[i];
        const geoCode = row[row.length - 1]; // the geographic code is the last value in the row
        const variableValue = row[0]; // The variable value is the first value (and the only variable value) in the row

        // // Store the variable value keyed by the geographic code
        // transformedData[geoCode] = parseInt(variableValue, 10); // Convert to integer for mapping
        parsedData[geoCode] = variableValue;
        // example: transformedData['000101'] = 3163
    }
  }
  return parsedData;
}

function transformData(parsedData, transformationType) {
  switch (transformationType) { // transformationType is a string that specifies the type of transformation to be applied
    case "percentage": // in the case that the value is a single number that needs to be divided by the baseValue to get a percentage
      return (parsedData.variablesValues / parsedData.baseValue * 100).toFixed(2);
    case "ratePerThousand": // in the case that the value is a single number that needs to be divided by the baseValue and then multiplied by 1000 to get a rate per thousand
      return (parsedData.variablesValues / parsedData.baseValue * 1000).toFixed(2);
    case 'summedPercentage': // in the case that the value is an array of numbers that need to be summed and then divided by the baseValue to get a percentage
      { const sum = parsedData.variablesValues.reduce((acc, curr) => acc + curr, 0);
      return (sum / parsedData.baseValue * 100).toFixed(2); }
    default: // If the transformationType is not recognized, return the value as is
      return console.error("Transformation type not recognized");
  }
}

function formatData(value, format) {
  if (value === null) { // If the value is null, return null
    return null;
  }
  if (value in config.annotationValues) { // If the value is an annotation, return the annotation and meaning
    return config.annotationValues[value].annotation, config.annotationValues[value].meaning;
  } else { 
    switch (format) { // If the value is not an annotation, apply the specified format
      case "currency": 
        return `$${value.toLocaleString()}`;
      case "percentage":
        return `${value}%`;
      case "ratePerThousand":
        return `${value}/1,000`;
      case "rawNumber":
      case "none":
        return value.toLocaleString();
      default: // If the format is not recognized, return the value as is
        return console.error("Format not recognized");
    }
  }
}

export { processData }