import { appConfig, referenceData } from '../config/config';

// ACS query example: https://api.census.gov/data/2020/acs/acs5?get=B01001_002E&for=tract:000101

const constructFetchURL = (selectedGeography, selectedVariable) => {
    const baseUrl = "https://api.census.gov/data";
    const year = "2022"; // Adjust as needed
    const dataset = "acs/acs5"; // Example dataset, adjust based on your requirement
    const variableCode = referenceData.variables[selectedVariable].variableCode;
    // console.log('selectedVariable', selectedVariable, 'selectedGeography', selectedGeography, 'variableCode', variableCode)


// ONce the variable codes are retrieved, the base code (if not null) is concatenated to the variable code. The base code is used to calculate the transformed value.

    const baseCode = referenceData.variables[selectedVariable].baseCode;

    const queryCodes = baseCode && baseCode !== "none" ? `${variableCode},${baseCode}` : variableCode;

// console.log('appConfig.geographies[selectedGeography]: ', appConfig.geographies[selectedGeography])
    
    const geoCode = appConfig.geographies[selectedGeography].apiEndpoints.apiQuery;
  
    return `${baseUrl}/${year}/${dataset}?get=${queryCodes}&for=${geoCode}`;
  };

  export default constructFetchURL;
