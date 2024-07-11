import PropTypes from "prop-types";
import { GeoJSON } from "react-leaflet";
import React, { useState } from "react";
import { appConfig, referenceData } from "../../config/config";
import generateVariablesReference from "../../utils/generateVariables";
import { formatData } from '../../utils/dataProcessingUtils';

const annotationValues = referenceData.annotationValues;

referenceData.variables = generateVariablesReference(referenceData.categories);

const GeoJSONFeatureLayer = ({ data, kentuckyGeoJSONData, selectedVariable, selectedGeography }) => {

  console.log('kentuckyGeoJSONData:', kentuckyGeoJSONData);

  const kentuckyStyle = {
    fillColor: "transparent",
    weight: 2,
    opacity: 1,
    color: "white",
    fillOpacity: 0,
  };

  const selectedDataset = referenceData.variables[selectedVariable].dataset.displayedDataset;

  const style = (feature) => ({
    fillColor: annotationValues[feature.properties.value] ? "lightgrey" : feature.properties.color || "lightgrey",
    weight: 2,
    opacity: 1,
    color: "white",
    fillOpacity: 0.7,
  });

  const format = referenceData.variables[selectedVariable].format;

  const formattingSuffix = {
    "percentage": '%',
    "percentageDifference": '%',
    "ratePerThousand": ' per 1,000 residents',
    "currency": '',
    "none": ''
  };


  const onEachFeature = (feature, layer) => {
    const value = feature.properties.value;
    const generatePopupContent = (feature, value, selectedVariable, format, formattingSuffix) => {
      const datasetName = referenceData.censusDataAPIs[selectedDataset].datasetName;
      const sourceLink = referenceData.censusDataAPIs[selectedDataset].source;
      const annotation = annotationValues[value]?.annotation;
      const meaning = annotationValues[value]?.meaning;
      const name = selectedGeography === 'fayetteZipcodes' ? `Zipcode ${feature.properties.ZCTA5CE20}` : feature.properties.NAMELSAD;
    
      if (annotation) {
        return `
          <div>
            <h2 class="text-xl">${name}</h2>
            <h2>${selectedVariable}: <b>${annotation}</b></h2>
            <p class="text-sm text-gray-400 truncate hover:untruncate underline">${meaning}</p>
            <p>Source: US Census ${datasetName} Dataset | ${appConfig.initialTimePeriod}</p>
          </div>
        `;
      }
    
      let valueContent = `<b><span class="text-black">Not Available</span></b>`;
      // console.log('Value:', value);
      if (value !== 0 && value !== 'No data' && value !== null && !isNaN(value) && typeof value === 'number') {
        valueContent = `<b><span class="text-black">${formatData(value, format)}${formattingSuffix[format]}</span></b>`;
      } else if (value === 0) {
        valueContent = `
        <b><span class="text-black">Zero</span></b>
          <div>
            <p class="text-sm underline">Disclaimer: Values of zero in this data may occur for several reasons:</p>
            <ul class="list-disc">
              <li>No Occurrence: The category genuinely has no individuals or entities.</li>
              <li>Data Collection Issues: Possible errors or gaps in data reporting.</li>
              <li>Small Sample Size: Insufficient sample to capture occurrences.</li>
              <li>Sociocultural Factors: Influences affecting the presence or measurement of the category.</li>
            </ul>
            <p>Please interpret zero values with these considerations in mind.</p>
          </div>
        `;
        } else {
          valueContent = `
          <b><span class="text-black">No Data</span></b>
          <div>
            <p class="text-sm underline">Disclaimer: The data for this category is not available.</p>
            <p>Reasons for missing data may include:</p>
            <ul class="list-disc">
              <li>Category Not Applicable: The category does not apply to this geography.</li>
              <li>Data Collection Issues: Possible errors or gaps in data reporting.</li>
              <li>Confidentiality: Data is suppressed to protect privacy or confidentiality.</li>
              <li>Small Sample Size: Insufficient sample to capture occurrences.</li>
              <li>Technical Issues: Problems with data collection, processing, or storage.</li>
            </ul>
            <p>Please interpret missing data with these considerations in mind.</p>
          </div>
        `;
        }
      return `
        <div>
          <h2 class="text-2xl text-neutral-500">${name}</h2>
          <p class="text-lg text-left text-pretty text-neutral-500">${selectedVariable}: ${valueContent}</p>
          <p class="text-xxs text-neutral-400">Note: <b>Data is an estimate</b> and may not reflect the exact count or rate. ${datasetName == 'Annual Business Survey' ? `<p class="text-xxs text-neutral-400">Note: Data from the Annual Business Survey is based only on those businesses <b>that responded</b> to the survey and may not be representative of all businesses in the area.</p>` : ''}</p>
          <p class="text-xxs text-neutral-400">Source: US Census Bureau's <a class="text-blue-500 hover:text-blue-700 visited:text-blue-600" href="${sourceLink}" target="blank">${datasetName} Dataset</a> | ${appConfig.initialTimePeriod}</p>
        </div>
      `;
    };
    const popupContent = generatePopupContent(feature, value, selectedVariable, format, formattingSuffix);
    layer.bindPopup(popupContent);

    layer.on({
      mouseover: (e) => {
        layer.setStyle({
          weight: 3,
          opacity: 1,
          color: "white",
          fillOpacity: 1,
        });
      }
      ,
      mouseout: (e) => {
        layer.setStyle({
          weight: 2,
          opacity: 1,
          color: "white",
          fillOpacity: 0.7,
        });
      }
    });

  };

  return (
    <div>
    <GeoJSON
      key={`${data.features[0].properties[selectedVariable]}-${selectedVariable}`}
      data={data}
      style={style}
      onEachFeature={onEachFeature}
    />
    {selectedGeography == "kentuckyMSAs" && <GeoJSON
      key={`${selectedGeography}`}
      data={kentuckyGeoJSONData}
      style={kentuckyStyle} />}
    </div>
  );
};

GeoJSONFeatureLayer.propTypes = {
  data: PropTypes.object.isRequired,
  selectedVariable: PropTypes.string.isRequired,
  selectedGeography: PropTypes.string.isRequired,
};

export default React.memo(GeoJSONFeatureLayer);
