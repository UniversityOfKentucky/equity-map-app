import { appConfig, referenceData } from '../config/config';
import generateVariablesReference from './generateVariables';

const constructFetchURL = (selectedGeography, selectedVariable, filterType = null) => {
  referenceData.variables = generateVariablesReference(referenceData.categories);
  const selectedVariablesProps = referenceData.variables[selectedVariable];

  console.log('ConstructFetchURL Called');
  const baseUrl = "https://api.census.gov/data";
  let year;
  let dataset = selectedVariablesProps.dataset.displayedDataset;
  const variableCode = selectedVariablesProps.variableCode.join(',');
  let geoCode = appConfig.geographies[selectedGeography].apiEndpoints.apiQuery;

  if (dataset.startsWith("acs")) {
    console.log('ACS Dataset');
    year = "2022";
    dataset = `acs/${dataset}`;
  } else if (dataset.startsWith("abscs")) {
    year = "2021";
    geoCode += filterType === 'base' ? selectedVariablesProps.baseFilter : selectedVariablesProps.filter;
  }
 console.log('Geo Code', geoCode);
 console.log('baseCode', selectedVariablesProps.baseCode)
  const baseCode = selectedVariablesProps.baseCode ? selectedVariablesProps.baseCode.join(',') : null;
  console.log('Base Code', baseCode);
  const queryCodes = baseCode ? `${variableCode},${baseCode}` : variableCode;
  console.log('Query Codes', queryCodes);
  let url = `${baseUrl}/${year}/${dataset}?get=${queryCodes}&for=${geoCode}`;
  console.log('URL', url);
  return url;
};

export default constructFetchURL;