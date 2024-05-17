import { appConfig, referenceData } from '../config/config';
import generateVariablesReference from './generateVariables';

const constructFetchURL = (selectedGeography, selectedVariable) => {

    
 // This function takes the categories object and flattens it into a single object which contains all the variables:
    referenceData.variables = generateVariablesReference(referenceData.categories);
    console.log('referenceData.variables[selectedVariable]: ', referenceData.variables[selectedVariable])

    const baseUrl = "https://api.census.gov/data";
    const year = "2022"; // Adjust as needed
    let dataset = referenceData.variables[selectedVariable].dataset.displayedDataset; // Example dataset, adjust based on your requirement
    const variableCode = referenceData.variables[selectedVariable].variableCode;
    if (dataset.startsWith("acs")) {
        dataset = `acs/${dataset}`;
    }


// Once the variable codes are retrieved, the base code (if not null) is concatenated to the variable code. The base code is used to calculate the transformed value.

    const baseCode = referenceData.variables[selectedVariable].baseCode;

    const queryCodes = baseCode && baseCode !== "none" ? `${variableCode},${baseCode}` : variableCode;

// console.log('appConfig.geographies[selectedGeography]: ', appConfig.geographies[selectedGeography])
    
    const geoCode = appConfig.geographies[selectedGeography].apiEndpoints.apiQuery;
  
    return `${baseUrl}/${year}/${dataset}?get=${queryCodes}&for=${geoCode}`;
  };

  export default constructFetchURL;
