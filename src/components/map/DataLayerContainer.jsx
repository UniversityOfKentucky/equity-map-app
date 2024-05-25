import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useQuery } from "react-query";
import { referenceData, appConfig } from "../../config/config";
import constructFetchURL from "../../utils/constructFetchURL";
import { processData } from "../../utils/dataProcessingUtils";
import GeoJSONFeatureLayer from "./GeoJSONFeatureLayer";
import generateVariablesReference from "../../utils/generateVariables";

const fetchGeoJSON = async (selectedGeography) => {
  const response = await fetch(
    `data/${appConfig.geographies[selectedGeography].geoJSONfileName}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

referenceData.variables = generateVariablesReference(referenceData.categories);

const fetchVariableData = async (selectedGeography, selectedVariable) => {
  const selectedVariablesProps = referenceData.variables[selectedVariable];

  // Construct the main data query URL
  const dataQueryURL = constructFetchURL(selectedGeography, selectedVariable, 'data0');
  const queries = [dataQueryURL];
  console.log('QUERY', queries);

  // If there's a base filter, add the base data query URL
  if (selectedVariablesProps.baseFilter) {
    const baseQueryURL = constructFetchURL(selectedGeography, selectedVariable, 'base');
    queries.push(baseQueryURL);
    console.log('QUERIES', queries);
  }

  // Fetch data from all queries
  const responses = await Promise.all(
    queries.map(query => fetch(query).then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    }))
  );

  // Aggregate data if there are multiple responses
  const data = responses.length === 1 ? responses[0] : aggregateData(responses[0], responses[1]);
  return data;
};

// Ensure the aggregateData function returns data in a format similar to ACS responses
const aggregateData = (data1, data2) => {
  const aggregatedData = data1.map((row, index) => {
    const geoCode = row[row.length - 1];
    const data = row.slice(0, 1).concat(data2[index].slice(0, 1));
    return data.concat(geoCode);

  });

  return aggregatedData;
};

const DataLayerContainer = ({ selectedGeography, selectedVariable }) => {
  const { data: geoJSONData, error: geoJSONError } = useQuery(
    ["geoJSON", selectedGeography],
    () => fetchGeoJSON(selectedGeography),
    { enabled: !!selectedGeography }
  );

  const { data: variableData, error: variableError } = useQuery(
    ["variableData", selectedGeography, selectedVariable],
    () => fetchVariableData(selectedGeography, selectedVariable),
    { enabled: !!selectedGeography && !!selectedVariable }
  );

  const joinedData = useMemo(() => {
    if (geoJSONData && variableData) {
      const processedData = processData(
        variableData,
        selectedVariable,
        selectedGeography
      );
      const updatedGeoJSONData = { ...geoJSONData };
      updatedGeoJSONData.features.forEach((feature) => {
        const geoCode =
          feature.properties[
            appConfig.geographies[selectedGeography].geoCodeField
          ];
        const data =
          processedData[geoCode] && processedData[geoCode].formattedData !== 0
            ? processedData[geoCode]
            : { formattedData: "No data", color: "lightgrey" };
        feature.properties = { ...feature.properties, ...data };
      });
      return updatedGeoJSONData;
    }
    return null;
  }, [geoJSONData, variableData, selectedGeography, selectedVariable]);

  if (geoJSONError || variableError) {
    return <div>Error loading data</div>;
  }

  if (!geoJSONData || !variableData || !joinedData) {
    return <div>Loading...</div>;
  }

  return <GeoJSONFeatureLayer data={joinedData} selectedVariable={selectedVariable} />;
};

DataLayerContainer.propTypes = {
  selectedGeography: PropTypes.string.isRequired,
  selectedVariable: PropTypes.string.isRequired,
};

export default DataLayerContainer;
