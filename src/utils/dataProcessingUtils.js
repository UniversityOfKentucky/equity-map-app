import { appConfig, referenceData } from '../config/config';

function processData(acsData, selectedVariables, selectedGeography) {
  const currentVariableProps = referenceData.variables[selectedVariables];

  let parsedData = parseData(acsData, currentVariableProps, selectedGeography);
  console.log('PARSED DATA RETURNED TO PROCESSDATA | LINE 16', parsedData);

  let transformedData = transformData(parsedData, currentVariableProps.transformationType);
  console.log('TRANSFORMED DATA RETURNED TO PROCESSDATA | LINE 15', transformedData);

  // Extract numeric values for normalization
  const validValues = Object.values(transformedData).map(value => 
    value in referenceData.annotationValues || isNaN(value) ? 0 : value
  );

  const min = Math.min(...validValues);
  const max = Math.max(...validValues);
  console.log('MIN', min, 'MAX', max);

  // Create a color scale using chroma.js
  const colorScale = appConfig.colorScale;

  // Initialize processedData object
  let processedData = {};

  // Normalize values and store processed data
  for (const geoCode in transformedData) {
    
    if (transformedData[geoCode] in referenceData.annotationValues || transformedData[geoCode] == 0) { // If the transformedData value is an annotation value, we assign the transformedData value to the processedData object without normalizing the value or assigning a color
      processedData[geoCode] = {
        formattedData: transformedData[geoCode]
      }
      continue;
    }

    const value = transformedData[geoCode];
    const normalizedValue = isNaN(value) ? 0 : (value - min) / (max - min);
    const colorIndex = Math.floor(normalizedValue * (colorScale.length - 1));


    processedData[geoCode] = { 
      formattedData: formatData(value, currentVariableProps.format),
      color: colorScale[colorIndex],
    };
  }

  return processedData; 
}

function formatData(value, format) {
  if (value === null || isNaN(value)) {
    return 'No data';
  }

  switch (format) {
    case "currency":
      return value === 0 ? "No data" : value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    case "percentage":
      return value === 0 ? "No data" : `${value}%`;
    case "ratePerThousand":
      return value === 0 ? "No data" : `${value} per 1,000 residents`;
    case "none":
      return value === 0 ? "No data" : value.toLocaleString("en-US");
    default:
      console.error("Format not recognized");
      return value;
  }
}


function parseData(acsData, currentVariableProps, selectedGeography) {
  let parsedData = {};
  
  if (currentVariableProps.transformationType !== "none") {
    for (let i = 1; i < acsData.length; i++) {
      const row = acsData[i];
      const geoCode = row[row.length - 1];  // The geographic code, which is the last value in the row
      let locationIndex = currentVariableProps.dataset.displayedDataset === 'acs5'
      ? (selectedGeography === 'fayetteCountyTracts' ? row.length - 3
        : selectedGeography === 'kentuckyCounties' ? row.length - 2
        : row.length - 1)
      : (currentVariableProps.dataset.displayedDataset === 'abscs' ? row.length - 1
        : row.length - 1
      );
    console.log('row.length', row.length, 'locationIndex', locationIndex, 'geoCode', geoCode, 'row', row, 'selectedGeography', selectedGeography, 'currentVariableProps', currentVariableProps, 'acsData', acsData)

      let censusEstimates = row.slice(0, locationIndex); // The census estimates are all values up to the location index

      currentVariableProps.dataset.displayedDataset === 'abscs' && currentVariableProps.baseFilter
      ? currentVariableProps.baseCode = currentVariableProps.baseFilter
      : "none";
      
      
      let baseEstimates = [];

      if (currentVariableProps.baseCode) {
        if (currentVariableProps.baseCode.length > 1) { // If there are multiple base estimates, we loop through the baseCode array and push the corresponding base estimates to the baseEstimates array

        // Loop through baseCode array
        currentVariableProps.baseCode.forEach((baseCode) => {
          const baseIndex = acsData[0].indexOf(baseCode);
          baseIndex !== -1 ? baseEstimates.push(row[baseIndex]) : baseEstimates.push(null); // If the baseCode is not found, push null to the baseEstimates array otherwise push the base estimate to the baseEstimates array
        });

        // Remove the baseCode values from the censusEstimates array 
        let nunberOfBaseCodes = currentVariableProps.baseCode.length;
        let startIndex = censusEstimates.length - nunberOfBaseCodes;
        censusEstimates.splice(startIndex, nunberOfBaseCodes);

        } else { // If there is only one base estimate, we remove the baseCode from the censusEstimates array and assign it to the baseEstimate variable by popping it off the array
          baseEstimates = censusEstimates.pop();
        }
      }

      // This code block is for variables that require transformation. The ternary operator checks if the baseEstimate is defined and if so assigns the censusEstimates and baseEstimate to the parsedData object. If the baseEstimate is not defined, only the censusEstimates are assigned to the parsedData object under a censusEstimates key as well.
      parsedData[geoCode] = currentVariableProps.baseCode
        ? { censusEstimates, baseEstimates }
        : { censusEstimates: censusEstimates };
      
    }
  } else { // For 'Total Population' and other variables that don't require transformation

    for (let i = 1; i < acsData.length; i++) {
      const row = acsData[i];
      const geoCode = row[row.length - 1]; // the geographic code is the last value in the row
      const censusEstimates = row[0]; // The variable value is the first value in the row
      
      // adds value as a value to a 'censusEstimates' key in the parsedData[geocode] object
      parsedData[geoCode] = { censusEstimates: [parseInt(censusEstimates, 10)] }; // Check for annotation values
    }
  }
  return parsedData; 
}

function transformData(parsedData, transformationType) {
  const annotationValues = referenceData.annotationValues;

  const convertValues = (data) => {
    if (!data) return data;
    const dataArray = Array.isArray(data) ? data : [data]; // Ensure data is an array
    for (let i = 0; i < dataArray.length; i++) {
      const value = dataArray[i];
      if (value in annotationValues) {
        return value; // Return the annotation value if found
      }
      dataArray[i] = parseFloat(value); // Convert to float otherwise
    }
    return dataArray;
  };

  const processEstimates = (estimates) => {
    if (Array.isArray(estimates)) {
      const result = estimates.length > 1 ? estimates.reduce((a, b) => a + b, 0) : estimates[0];
      return result;
    }
    return estimates;
  };

  const applyTransformation = (census, base, type) => {
    switch (type) {
      case "percentage":
        return ((census / base) * 100).toFixed(2);
      case "ratePerThousand":
        return ((census / base) * 1000).toFixed(2);
      case "summedPercentage":
        return ((census / base) * 100).toFixed(2);
      case "subtractedPercentage":
        return ((base - census) / base * 100).toFixed(2);
      case "none":
      default:
        return census;
    }
  };

  let transformedData = {};

  for (const key in parsedData) {
    // Convert census and base estimates
    let convertedCensus = convertValues(parsedData[key]["censusEstimates"]);
    let convertedBase = convertValues(parsedData[key]["baseEstimates"]);

    // Check for annotation values
    if (convertedCensus in annotationValues) {
      transformedData[key] = convertedCensus;
    } else if (convertedBase in annotationValues) {
      transformedData[key] = convertedBase;
    } else {
      // Process and transform data
      let targetCensusEstimates = processEstimates(convertedCensus);
      let targetBaseEstimates = processEstimates(convertedBase);
      transformedData[key] = applyTransformation(targetCensusEstimates, targetBaseEstimates, transformationType);
    }
  }
  console.log('TRANSFORMED DATA', transformedData);

  return transformedData;
}

export { processData }