import PropTypes from "prop-types";
import { GeoJSON } from "react-leaflet";
import React from "react";
import { appConfig, referenceData } from "../../config/config";
import generateVariablesReference from "../../utils/generateVariables";


const annotationValues = referenceData.annotationValues;

referenceData.variables = generateVariablesReference(referenceData.categories);

console.log('referenceData.variables: ', referenceData.variables)


const GeoJSONFeatureLayer = ({ data, selectedVariable }) => {

  const selectedDataset = referenceData.variables[selectedVariable].dataset.displayedDataset;

  const style = (feature) => ({
    fillColor: annotationValues[feature.properties.formattedData] ? "lightgrey" : feature.properties.color || "lightgrey",
    weight: 2,
    opacity: 1,
    color: "white",
    fillOpacity: 0.7,
  });

  const onEachFeature = (feature, layer) => {
    const formattedData = feature.properties.formattedData;
const popupContent =
      annotationValues[formattedData] ? (
        `<div>
          <h2 class="text-xl">${feature.properties.NAMELSAD}</h2>
          <h2>${selectedVariable}: <b>${annotationValues[formattedData].annotation}</b></h2>
          <p>${annotationValues[formattedData].meaning}</p>
          <p>Source: US Census ${referenceData.censusDataAPIs.datasetName} Dataset | ${appConfig.initialTimePeriod}</p>
        </div>`
      ) : (
        `<div>
        <h2 class="text-xl">${feature.properties.NAMELSAD}</h2>
        <h2>${selectedVariable}: <b>${formattedData ? formattedData : "No Data"}</b></h2>
          <p>Source: US Census Bureau's <a href="${referenceData.censusDataAPIs[selectedDataset].source}">${referenceData.censusDataAPIs[selectedDataset].datasetName} Dataset</a> | ${appConfig.initialTimePeriod}</p>
          </div>`
      );
    layer.bindPopup(popupContent);
  };

  return (
    <GeoJSON
      key={`${data.features[0].properties[selectedVariable]}-${selectedVariable}`}
      data={data}
      style={style}
      onEachFeature={onEachFeature}
    />
  );
};

GeoJSONFeatureLayer.propTypes = {
  data: PropTypes.object.isRequired,
  selectedVariable: PropTypes.string.isRequired,
};

export default React.memo(GeoJSONFeatureLayer);
