import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useQuery } from "react-query";
import { referenceData, appConfig } from "../../config/config";
import constructFetchURL from "../../utils/constructFetchURL";
import { processData } from "../../utils/dataProcessingUtils";
import GeoJSONFeatureLayer from "./GeoJSONFeatureLayer";
import generateVariablesReference from "../../utils/generateVariables";
import Legend from "./Legend";

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

  const dataQueryURL = constructFetchURL(selectedGeography, selectedVariable, 'data0');
  const queries = [dataQueryURL];

  if (selectedVariablesProps.baseFilter) {
    const baseQueryURL = constructFetchURL(selectedGeography, selectedVariable, 'base');
    queries.push(baseQueryURL);
  }

  const responses = await Promise.all(
    queries.map(query => fetch(query).then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    }))
  );

  const data = responses.length === 1 ? responses[0] : aggregateData(responses[0], responses[1]);
  return data;
};

const aggregateData = (data1, data2) => {
  const aggregatedData = data1.map((row, index) => {
    const geoCode = row[row.length - 1];
    const data = row.slice(0, 1).concat(data2[index].slice(0, 1));
    return data.concat(geoCode);
  });

  return aggregatedData;
};

const DataLayerContainer = ({ selectedGeography, selectedVariable }) => {
  const [breaks, setBreaks] = useState([]);
  const [colors, setColors] = useState([]);

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

  useMemo(() => {
    if (geoJSONData && variableData) {
      const { processedData, breaks, colors } = processData(variableData, selectedVariable, selectedGeography);
      setBreaks(breaks);
      setColors(colors);
      // console.log('processedData', processedData);
      const updatedGeoJSONData = { ...geoJSONData };
      updatedGeoJSONData.features.forEach((feature) => {
        const geoCode =
          feature.properties[
            appConfig.geographies[selectedGeography].geoCodeField
          ];
          // the following line is a ternary operator that checks if the processedData object has a key that matches the geoCode. If it does, it assigns the formattedData and color properties to the feature.properties object. If it doesn't, it assigns the formattedData property the string "No data" and the color property the string "lightgrey".
        const data =
          processedData[geoCode] && processedData[geoCode].formattedData !== 0
            ? processedData[geoCode]
            : { formattedData: "No data", color: "lightgrey" };
        feature.properties = { ...feature.properties, ...data };
      });
      // setFormat(referenceData.variables[selectedVariable].format);
    }
  }, [geoJSONData, variableData, selectedGeography, selectedVariable]); // runs only when these dependencies change. If you want it to run on initial render and when these 

  if (geoJSONError || variableError) {
    return <div>Error loading data</div>;
  }

  if (!geoJSONData || !variableData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <GeoJSONFeatureLayer
        data={geoJSONData}
        selectedVariable={selectedVariable}
      />
      <Legend
        selectedVariable={selectedVariable}
        selectedGeography={selectedGeography}
        position="leaflet-top leaflet-right"
        breaks={breaks}
        colors={colors}
        // format={format}
      />
    </>
  );
};

DataLayerContainer.propTypes = {
  selectedGeography: PropTypes.string.isRequired,
  selectedVariable: PropTypes.string.isRequired
};

export default DataLayerContainer;
