import { useState, useEffect } from 'react';
import GeoJSONFeatureLayer from './GeoJSONFeatureLayer';
import PropTypes from 'prop-types';
import { appConfig } from '../../config/config';

const DataLayerContainer = ({ selectedGeography, selectedVariable, processedData }) => {
  const [geojsonData, setGeojsonData] = useState(null);

useEffect(() => {
  async function fetchGeojson() {
    const fileName = appConfig.geographies[selectedGeography].geoJSONfileName;
    try {
      const response = await fetch(`data/${fileName}`);
      const geoJSON = await response.json();
      
      if (processedData) {
        geoJSON.features.forEach(feature => {
          const geoCode = feature.properties[appConfig.geographies[selectedGeography].geoCodeField];
          const data = processedData[geoCode];
          feature.properties = { ...feature.properties, ...data };
        });
      }
      
      setGeojsonData(geoJSON);
    } catch (e) {
      console.error("Failed to fetch GeoJSON: ", e);
    }
  }
  fetchGeojson();
}, [selectedGeography]);  // Removed `processedData` from dependencies


  return (
    geojsonData && (
      <GeoJSONFeatureLayer
        data={geojsonData}
        selectedGeography={selectedGeography}
        selectedVariable={selectedVariable}
      />
    )
  );
};

DataLayerContainer.propTypes = {
  selectedGeography: PropTypes.string.isRequired,
  selectedVariable: PropTypes.string.isRequired,
// processedData isn't required on initial load
  processedData: PropTypes.object
}; 

export default DataLayerContainer;
