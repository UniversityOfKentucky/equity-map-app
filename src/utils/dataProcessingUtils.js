import { appConfig, referenceData } from '../config/config';

function processData(acsData, selectedVariables, selectedGeography) {
  // The processData function takes the response array from the ACS API and the selected variables from the user and processes the data according to the selected variables

const currentVariableProps = referenceData.variables[selectedVariables];

// console.log(
//   `CURRENT VARIABLE ${selectedVariables}
//   BASE CODE ${currentVariableProps.baseCode} 
//   TRANSFORMATION TYPE ${currentVariableProps.transformationType}
//   CURRENT GEOGRAPHY ${selectedGeography}`)

  let parsedData = parseData(acsData, currentVariableProps, selectedGeography); // Example: { '000101': { variablevalue: [1650, 3163], baseEstimate: 3163 }, '000102': { variablevalue: [1554, 18887], baseEstimate: 18887 } }

  // console.log('PARSED DATA RETURNED TO PROCESSDATA | LINE 16', parsedData)

  let transformedData = transformData(parsedData, currentVariableProps.transformationType); // example: { '000101': '52.11%', '000102': '8.23%' }

  // console.log('TRANSFORMED DATA RETURNED TO PROCESSDATA | LINE 15 ', transformedData)
  // Extract values for normalization
  const values = Object.values(transformedData).map(value => parseFloat(value));
  const min = Math.min(...values);
  const max = Math.max(...values);
  // console.log('MIN', min, 'MAX', max)

  // Create a color scale using chroma.js
  const colorScale = appConfig.colorScale;
  
  let processedData = {};

  // Loop through the transformed data and normalize the values to a color scale, storing the values and colors in the processedData object
  for (const geoCode in transformedData) {
    const value = parseFloat(transformedData[geoCode]);
    // console.log('VALUE', value)

    const normalizedValue = (value - min) / (max - min);

    const colorIndex = Math.floor(normalizedValue * (colorScale.length - 1));

    processedData[geoCode] = { // Store the processed data keyed by the geographic code
      formattedData: formatData(value, currentVariableProps.format),
      color: colorScale[colorIndex]
    };
  }

  // console.log('processedData', processedData)

  return processedData; // Example: { '000101': { formattedData: '52.11%', color: 'rgb(219, 234, 254)' }, '000102': { formattedData: '8.23%', color: 'rgb(59, 130, 246)' } }
}

function parseData(acsData, currentVariableProps, selectedGeography) {
  let parsedData = {};
  
  if (currentVariableProps.transformationType !== "none") {
    // console.log(`ROUTED THROUGH IF STATEMENT IN PARSE DATA (TX TYPE EXISTS AND IS NOT "none")| LINE 41
    // Transformation Type: ${currentVariableProps.transformationType}`)
    for (let i = 1; i < acsData.length; i++) {
      const row = acsData[i];
      const geoCode = row[row.length - 1];  // The geographic code, which is the last value in the row
      const locationIndex = selectedGeography === 'fayetteCountyTracts' ? row.length - 3 :
                            selectedGeography === 'kentuckyCounties' ? row.length - 2 :
                            row.length - 1;  // Adjust based on geography

      let censusEstimates = row.slice(0, locationIndex); // The census estimates are all values up to the location index

      censusEstimates = censusEstimates.map(value => // Map over the census estimates and convert to integers
        value in referenceData.annotationValues 
          ? value  // Keep as string if it's a known annotation
          : parseInt(value, 10)  // Convert to integer otherwise
      );
      
      let baseEstimate; // The base estimate (if present) is the last value in the census estimates
      if (currentVariableProps.baseCode) {
        // console.log('HAS BASE VALUE IN PARSE DATA ', currentVariableProps.baseCode)
        baseEstimate = censusEstimates.pop(); // Remove and use the last value as baseEstimate if needed
        if (!(baseEstimate in referenceData.annotationValues)) {
          baseEstimate = parseInt(baseEstimate, 10);  // Convert baseEstimate to integer if it's not an annotation
        } else {
          // console.log(
          //   `BASE VALUE IS AN ANNOTATION
          //   ${baseEstimate}
          //   ${referenceData.annotationValues[baseEstimate]}`)
        }
      }

      // This code block is for variables that require transformation. The ternary operator checks if the baseEstimate is defined and if so uses array destructuring to assign the variablevalue and baseEstimate to the parsedData object. If the baseEstimate is not defined, only the variablevalue are assigned to the parsedData object under a variablevalue key as well.
      parsedData[geoCode] = currentVariableProps.baseCode
        ? { censusEstimates, baseEstimate }
        : { censusEstimates: censusEstimates };
      // Unlike in the case of `parsedData[geoCode] = baseEstimate ? { variablevalue, baseEstimate } : variablevalue;` the value is assigned to a key within parsedData object. This is because the baseEstimate is not always present in the data and the parsedData object needs to be consistent across all geographies.
      // console.log('PARSED DATA BEING RETURNED FROM IF STATEMENT IN PARSE DATA: ', parsedData)
      
    }
  } else { // For 'Total Population' and other variables that don't require transformation
    // console.log('ROUTED THROUGH ELSE STATEMENT IN PARSE DATA (TX TYPE IS "none")| LINE 41');

    for (let i = 1; i < acsData.length; i++) {
      const row = acsData[i];
      const geoCode = row[row.length - 1]; // the geographic code is the last value in the row
      const censusEstimates = row[0]; // The variable value is the first value in the row
      
      // adds value as a value to a 'censusEstimates' key in the parsedData[geocode] object
      parsedData[geoCode] = { censusEstimates: [parseInt(censusEstimates, 10)] };
    }
    // console.log('PARSED DATA BEING RETURNED FROM ELSE STATEMENT IN PARSE DATA: ', parsedData)
  }
  return parsedData; 
}




function transformData(parsedData, transformationType) {
  // console.log(`PASSED TO TRANSFORM DATA | LINE 114
  // TRANSFORMATION TYPE: ${transformationType}
  // `);
  // console.log('parsedData', parsedData);

  let transformedData = {};  
  let targetCensusEstimates;
  let targetBaseEstimate;

  for (const key in parsedData) {
    targetCensusEstimates = parsedData[key]["censusEstimates"];
    targetBaseEstimate = parsedData[key].baseEstimate;
    
    switch (transformationType) {
      case "percentage":
        transformedData[key] = (targetCensusEstimates / targetBaseEstimate * 100).toFixed(2); 
        break;
      case "ratePerThousand":
        transformedData[key] = (targetCensusEstimates / targetBaseEstimate * 1000).toFixed(2); 
        break;
      case 'summedPercentage':
        {const sum = targetCensusEstimates.reduce((acc, curr) => acc + curr, 0);
        transformedData[key] = (sum / targetBaseEstimate * 100).toFixed(2); }
        break;
      case 'none':
        transformedData[key] = targetCensusEstimates; 
        break;
      default:
        transformedData[key] = targetCensusEstimates; 
        break;
    }
  }
  
  return transformedData;
}

function formatData(value, format) {
  if (value === null) { // If the value is null, return null
    return null;
  }
  if (value in referenceData.annotationValues) { // If the value is an annotation, return the annotation and meaning
    return referenceData.annotationValues[value].annotation, referenceData.annotationValues[value].meaning;
  } else { 
    switch (format) { // If the value is not an annotation, apply the specified format
      case "currency": 
        return `$${value.toLocaleString()}`;
      case "percentage":
        return `${value}%`;
      case "ratePerThousand":
        return `${value}/1,000`;
      case "none":
        return value.toLocaleString();
      default: // If the format is not recognized, return an error
        return console.error("Format not recognized");
    }
  }
}

export { processData }