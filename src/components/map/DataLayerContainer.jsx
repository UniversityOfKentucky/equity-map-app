
// Place fetching logic in DataLayerContainer:
// Separates data retrieval concerns from visual layer management.
// Can cache and optimize fetching, reducing redundant network calls.

// Purpose:
    // Encapsulate all data layers related to selected geography and variables.
// Responsibilities:
    // Fetch and prepare GeoJSON data based on the selected geography.
    // Pass data down to relevant visual layer components (e.g., renamed CustomGeoJSONLayer).
    // Components Included:
// RenamedGeoJSONLayer: The component for visualizing GeoJSON data.


import { useState, useEffect } from 'react';
import GeoJSONFeatureLayer from './GeoJSONFeatureLayer';
import PropTypes from 'prop-types';
import { appConfig } from '../../config/config';

// Purpose:
// - Fetch GeoJSON data based on selected geography.
// - Pass the processed GeoJSON data to GeoJSONFeatureLayer for rendering.

const DataLayerContainer = ({ selectedGeography, selectedVariable }) => {
  const [geojsonData, setGeojsonData] = useState(null);

  // Fetch data based on the selected geography
  useEffect(() => {
    async function fetchGeojson() {
      const fileName = appConfig.geographies[selectedGeography].geoJSONfileName;
      const response = await fetch(`data/${fileName}`);
      const data = await response.json();
      setGeojsonData(data);
    }
    fetchGeojson();
  }, [selectedGeography]);

  return (
    // Only render GeoJSONFeatureLayer if geojsonData is available
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
  selectedVariable: PropTypes.string.isRequired
};

export default DataLayerContainer;
