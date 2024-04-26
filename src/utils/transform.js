// define the transformData function here

function transformData(acsData, geography, transformationType) {

  console.log(
    "acsData: ", acsData, 
    " geography: ", geography, 
    " transformationType: ", transformationType,
  );
  
  let transformedData = {};

  if (transformationType !== "none" && transformationType !== "convertToDollars") {  // If the transformationType does not equal "none" or "convertToDollars" then we need to apply a transformation to the data

      // Parsing Logic 
      for (let i = 1; i < acsData.length; i++) { // Skip the first row since it's header information
          const row = acsData[i];
          const geoCode = row[row.length - 1]; // the geographic code is the last value in the row

          // RESPONSE ARRAY SELECTION LOGIC
          // THis logic identifies all of the variable data and the base variable data in the response array

          // We begin by identifying and storing the index of the first location value
          const locationIndex = geography === "tracts" ? row.length - 3 : row.length - 2; 
          // ^ If geography is equal to "tracts", then locationIndex will be set to row.length - 3. Otherwise, locationIndex will be set to row.length - 2
        
          // EXAMPLE A - 'tracts' geography response
          // ['B01001_002E', 'B01001_001E', 'state', 'county', 'tract'],
1               // ['1650', '3163', '21', '067', '000101']
          // In this example, locationIndex will be set to 2 ('state') (row.length - 3) 

          // EXAMPLE B - 'counties' geography response
          // ['B14001_006E', 'B14001_007E', 'B14001_008E', 'B01001_001E', 'state', 'county']
          // ['909', '764', '1554', '18887', '21', '001']
          // In this example, locationIndex will be set to 4 ('state') (row.length - 2)

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

          // Store the transformed variable value keyed by the geographic code
           transformedData[geoCode] = transform(variablesValues, baseValue, transformationType);
      }
      } else { // If transformationType is equal to "none"

      //For 'Total Population' and other variables that don't require transformation, we simply loop through the response array and store the variable value keyed by the geographic code

      // Example response array (Total Population variable for 'tracts' geography)
      // ['B01001_001E', 'state', 'county', 'tract']
1           // ['3163', '21', '067', '000101']

      for (let i = 1; i < acsData.length; i++) { // Skip the first row since it's header information
          const row = acsData[i];
          const geoCode = row[row.length - 1]; // the geographic code is the last value in the row
          const variableValue = row[0]; // The variable value is the first value (and the only variable value) in the row

          // Store the variable value keyed by the geographic code
          transformedData[geoCode] = parseInt(variableValue, 10); // Convert to integer for mapping
      }
  }

  function transform(variablesValues, baseValue, transformationType) {

    switch (transformationType) { // transformationType is a string that specifies the type of transformation to be applied
      case "percentage": // in the case that the value is a single number that needs to be divided by the baseValue to get a percentage
        return (variablesValues / baseValue * 100).toFixed(2);
      case "ratePerThousand": // in the case that the value is a single number that needs to be divided by the baseValue and then multiplied by 1000 to get a rate per thousand
        return (variablesValues / baseValue * 1000).toFixed(2);
      case 'summedPercentage': // in the case that the value is an array of numbers that need to be summed and then divided by the baseValue to get a percentage
        { const sum = variablesValues.reduce((acc, curr) => acc + curr, 0);
          return (sum / baseValue * 100).toFixed(2); }
      // case "convertToDollars": // in the case that the value is a single number that needs to be converted to a dollar amount and returned as a string with currency formatting
      //   return "$" + variablesValues.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      default: // If the transformationType is not recognized, return the value as is
        return console.error("Transformation type not recognized");
    }
  }
  return transformedData;
}

export { transformData };
    