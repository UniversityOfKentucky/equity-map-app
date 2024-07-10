import { useState, useMemo } from "react";
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

  const dataQueryURL = constructFetchURL(selectedGeography, selectedVariable, 'data');
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
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);

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
      const updatedGeoJSONData = { ...geoJSONData };
      
      updatedGeoJSONData.features.forEach((feature) => {
        const geoCode =
          feature.properties[
            appConfig.geographies[selectedGeography].geoCodeField
          ];
        const data = processedData[geoCode] || { value: null };

        feature.properties = { ...feature.properties, ...data };
      });

      setMaxValue(Math.max(...Object.values(processedData).filter((data) => data.value).map((data) => data.value)));
      setMinValue(Math.min(...Object.values(processedData).filter((data) => data.value > 0).map((data) => data.value)));
    }
  }, [geoJSONData, variableData, selectedGeography, selectedVariable]);

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
        selectedGeography={selectedGeography}
      />
      <Legend
        selectedVariable={selectedVariable}
        selectedGeography={selectedGeography}
        breaks={breaks}
        colors={colors}
        minValue={minValue}
        maxValue={maxValue} 
      />
    </>
  );
};

DataLayerContainer.propTypes = {
  selectedGeography: PropTypes.string.isRequired,
  selectedVariable: PropTypes.string.isRequired
};

export default DataLayerContainer;
