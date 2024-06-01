import { referenceData } from '../config/config';
import * as ss from 'simple-statistics';
import { appConfig } from '../config/config';

function processData(acsData, selectedVariables, selectedGeography) {
  const currentVariableProps = referenceData.variables[selectedVariables];

  let parsedData = parseData(acsData, currentVariableProps, selectedGeography);
  let transformedData = transformData(parsedData, currentVariableProps.transformationType);

  // Classify the transformed data
  const { classifiedData, breaks, colors } = classifyValues(transformedData, currentVariableProps);
  // // console.log('classifiedData', classifiedData, 'breaks', breaks, 'colors', colors);

  // Initialize processedData object
  let processedData = {};
  // Process data and assign colors based on classified data
  for (const geoCode in classifiedData) {
    const value = classifiedData[geoCode].value;

    if (value in referenceData.annotationValues || isNaN(value)) {
      processedData[geoCode] = {
        value
      };
      continue;
    }

    // Assign color based on class
    processedData[geoCode] = {
      value,
      color: classifiedData[geoCode].color,
      // format: currentVariableProps.format
    };
  }

  return { processedData, breaks, colors };
}

function classifyValues(data, variableProps) {
  const values = Object.values(data).filter(value => 
    // check if value is not in annotationValues, is a number, and is not and is not less than 0 
    !(value in referenceData.annotationValues) && !isNaN(value) && value > 0
  ); // the 'data' object remains unchanged


  const classificationMethod = variableProps.classificationMethod || 'equalInterval';
  let breaks = [];
  const colorScale = appConfig.colorScale;

  switch (classificationMethod) {
    case 'equalInterval':
      breaks = getEqualIntervalBreaks(values, 5);
      break;
    case 'quantiles':
      breaks = getQuantileBreaks(values, 5);
      break;
    case 'naturalBreaks':
      breaks = ss.jenks(values, 4); 
      break;
    case 'standardDeviation':
      breaks = getStandardDeviationBreaks(values);
      break;
    case 'continuous':
      // No breaks needed, continuous scale
      break;
    default:
      console.error('Unknown classification method');
  }

  let classifiedData = {};

  for (const geoCode in data) {
    const value = data[geoCode];

    // Check if value is an annotation value, not a number, or less than or equal to 0 and if so assign the value and a default color to the classifiedData object
    if (value in referenceData.annotationValues || isNaN(value) || value <= 0) {
      classifiedData[geoCode] = {
        value,
        color: 'lightgrey'
      };
      continue;
    }

    // Classify the value based on the classification method
    if (classificationMethod === 'continuous') {
      const normalizedValue = (value - Math.min(...values)) / (Math.max(...values) - Math.min(...values));
      const colorIndex = Math.floor(normalizedValue * (colorScale.length - 1));
      classifiedData[geoCode] = {
        value,
        color: colorScale[colorIndex]
      };
    } else {
      const classIndex = getClassIndex(value, breaks);
      classifiedData[geoCode] = {
        value,
        color: colorScale[classIndex]
      };
    }
  }

  return { classifiedData, breaks, colors: colorScale };
}

function getClassIndex(value, breaks) {
  for (let i = 0; i < breaks.length; i++) {
    if (value <= breaks[i]) {
      return i;
    }
  }
  return breaks.length;
}

function getEqualIntervalBreaks(values, numClasses) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const interval = (max - min) / numClasses;
  let breaks = [];
  for (let i = 1; i < numClasses; i++) {
    breaks.push(min + i * interval);
  }
  return breaks;
}

function getQuantileBreaks(values, numClasses) {
  return ss.quantile(values, Array.from({ length: numClasses - 1 }, (_, i) => (i + 1) / numClasses));
}

function getStandardDeviationBreaks(values) {
  const mean = ss.mean(values);
  const stdDev = ss.standardDeviation(values);
  return [
    mean - 2 * stdDev,
    mean - stdDev,
    mean,
    mean + stdDev,
    mean + 2 * stdDev
  ];
}

function formatData(value, format) {
  if (value === null || isNaN(value) || typeof value !== 'number') {
    return 'No data';
  }

  let intValue = Math.floor(value);

  switch (format) {
    case "currency":
      return intValue.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 });
    case "percentage":
      return value.toFixed(2);
    case "ratePerThousand":
      return intValue.toLocaleString();
    case "none":
      return value.toLocaleString("en-US");
    default:
      console.error("Format not recognized");
      return value;
  }
}

function parseData(acsData, currentVariableProps, selectedGeography) {
  let parsedData = {};
  console.log('currentVariableProps', currentVariableProps)

  if (currentVariableProps.transformationType !== "none") {
    for (let i = 1; i < acsData.length; i++) {
      const row = acsData[i];
      console.log('row', row);
      const geoCode = row[row.length - 1];  // The geographic code, which is the last value in the row
      let locationIndex;
      console.log('currentVariableProps', currentVariableProps)

      if (currentVariableProps.dataset.displayedDataset === 'acs/acs5' 
        || currentVariableProps.dataset.displayedDataset === 'acs/acs1') {
        if (selectedGeography === 'fayetteCountyTracts') {
          console.log('locationIndex not found test 1')
          locationIndex = row.length - 3;
        } else if (selectedGeography === 'kentuckyCounties') {
        console.log('locationIndex not found test 2')
          locationIndex = row.length - 2;
        } else {
          console.log('locationIndex not found test 3')
          locationIndex = row.length - 1;
        }
      } else if ( currentVariableProps.dataset.displayedDataset === 'abscs') {
        console.log('locationIndex not found test 4')
        locationIndex = row.length - 1;
      } else if ( currentVariableProps.dataset.displayedDataset === 'acs/acs5/subject') {
        if (selectedGeography === 'fayetteCountyTracts') {
          console.log('locationIndex not found test 5')
          locationIndex = row.length - 3;
        } else if (selectedGeography === 'kentuckyCounties') {
          console.log('locationIndex not found test 6')
          locationIndex = row.length - 2;
        } else {
          console.log('locationIndex not found test 7')
          locationIndex = row.length - 1;
        }
      } 


      console.log(`
        currentVariableProps.dataset.displayedDataset: ${currentVariableProps.dataset.displayedDataset}
        selectedGeography: ${selectedGeography}
        locationIndex: ${locationIndex}
      `);

      if (currentVariableProps.dataset.displayedDataset === 'acs/acs1/subject' && selectedGeography === 'fayetteCountyTracts'
        || currentVariableProps.dataset.displayedDataset === 'acs/acs1/subject' && selectedGeography === 'kentuckyCounties') {
        locationIndex = row.length - 3;
      }


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
      parsedData[geoCode] = { censusEstimates: censusEstimates };
    }
  }

console.log('single parsedData', parsedData)
  return parsedData; 
}

function transformData(parsedData, transformationType) {
  const annotationValues = referenceData.annotationValues;

  const convertValues = (data) => {
    console.log('data', data)
    if (!data) return data; // If data is null or undefined, return as is
    const dataArray = Array.isArray(data) ? data : [data]; // Ensure data is an array
    for (let i = 0; i < dataArray.length; i++) {
      const value = dataArray[i];
      if (value in annotationValues) {
        return value; // Return the annotation value if found
      }
      const parsedValue = parseFloat(value);
      console.log('parsedValue', parsedValue)
      if (isNaN(parsedValue)) {
        console.error(`Failed to parse value to float: ${value}`);
        continue; // Skip this value if it can't be parsed
      }
      dataArray[i] = parsedValue; // Convert to float otherwise
    }
    console.log('dataArray', dataArray)
    return dataArray;
  };

  const processEstimates = (estimates) => {
    if (Array.isArray(estimates)) {
      const result = estimates.length > 1 ? estimates.reduce((a, b) => a + b, 0) : estimates[0];
      return result;
    }
    return estimates;
  };

  const applyTransformation = (census, base, type, convertedCensus) => {
    if (isNaN(census) || (base !== undefined && (isNaN(base) || base === 0))) {
      console.error(`Invalid census (${census}) or base (${base}) value for transformation type: ${type}`);
      return NaN;
    }
    switch (type) {
      case "percentage":
        return parseFloat(((census / base) * 100).toFixed(2));
      case "ratePerThousand":
        return parseFloat(((census / base) * 1000).toFixed(2));
      case "summedPercentage":
        return parseFloat(((census / base) * 100).toFixed(2));
      case "percentageDifference":
        return parseFloat(((base - census) / base * 100).toFixed(2));
      // case "percentageDifferenceFromTotal":
      //   return parseFloat(100 - ((census - base) / base * 100).toFixed(2));
      case "precalculation":
        return parseFloat(census).toFixed(1);
      case "averageOfPrecalculations":
        // return the average of the precalculated values by dividing the sum of the precalculated values (census) by the number of precalculated values (length of the convertedCensus array)
        return parseFloat(census / convertedCensus.length).toFixed(1);
      case "none":
      default:
        return census;
    }
  };

  let transformedData = {};

  for (const key in parsedData) {
    try {
      // Convert census and base estimates
      let convertedCensus = convertValues(parsedData[key]["censusEstimates"]);
      let convertedBase = convertValues(parsedData[key]["baseEstimates"]);

      console.log(`
        convertedCensus: ${typeof convertedCensus}
        convertedBase: ${typeof convertedBase}
      `);


      if (Array.isArray(convertedCensus) && convertedCensus.some(value => value in annotationValues)) {
        console.log('census is an annotation value')
        transformedData[key] = convertedCensus.find(value => value in annotationValues);
      } else if (Array.isArray(convertedBase) && convertedBase.some(value => value in annotationValues)) {
        console.log('base is an annotation value')
        transformedData[key] = convertedBase.find(value => value in annotationValues);
      } else {
        console.log('not an array')
        // Process and transform data
        let targetCensusEstimates = processEstimates(convertedCensus);
        let targetBaseEstimates = processEstimates(convertedBase);

        if (isNaN(targetCensusEstimates) || (targetBaseEstimates !== undefined && isNaN(targetBaseEstimates))) { // If the targetCensusEstimates or targetBaseEstimates are NaN, log an error and set the transformedData[key] to NaN
          console.error(`Invalid estimates for key: ${key}. Census: ${targetCensusEstimates}, Base: ${targetBaseEstimates}`);
          transformedData[key] = NaN;
        } else {
          transformedData[key] = applyTransformation(targetCensusEstimates, targetBaseEstimates, transformationType, convertedCensus);
            for (const key in transformedData) {
    if (typeof transformedData[key] === 'string') {
      transformedData[key] = parseFloat(transformedData[key]);
    }
  }
        }
      }
    } catch (error) {
      console.error(`Error processing data for key: ${key}. Error: ${error.message}`);
      transformedData[key] = NaN;
    }
  }

// // ensures all values in the transformedData object are numbers
//   for (const key in transformedData) {
//     if (typeof transformedData[key] === 'string') {
//       transformedData[key] = parseFloat(transformedData[key]);
//     }
//   }

  console.log('transformedData', transformedData)
  return transformedData;
}

export { processData, formatData }