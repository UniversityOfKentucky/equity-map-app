import { useMemo } from 'react';
import { GeoJSON } from 'react-leaflet';
import PropTypes from 'prop-types';

const GeoJSONFeatureLayer = ({ data, selectedGeography, selectedVariable }) => {
  const memoizedOptions = useMemo(() => {
    const style = () => ({
      fillColor: 'rgb(29, 78, 216)',
      weight: 2,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    });

    const onEachFeature = (feature, layer) => {
      const popupContent = `<div><h2>${feature.properties.NAMELSAD}</h2><p>${selectedVariable}</p></div>`;
      layer.bindPopup(popupContent);
    };

    return { style, onEachFeature };
  }, [selectedVariable]);

  return <GeoJSON key={selectedGeography} data={data} {...memoizedOptions} />;
};

GeoJSONFeatureLayer.propTypes = {
  data: PropTypes.object.isRequired,
  selectedGeography: PropTypes.string.isRequired,
  selectedVariable: PropTypes.string.isRequired
};

export default GeoJSONFeatureLayer;

// import { useMemo } from 'react';
// import { GeoJSON } from 'react-leaflet';
// import PropTypes from 'prop-types';

// // Purpose:
// // - Display GeoJSON data with consistent styling and popups.
// // - Memoize styles and event handlers for optimal rendering.

// const GeoJSONFeatureLayer = ({ data, selectedGeography, selectedVariable }) => {
//   // Define consistent styles for the GeoJSON features
//   const style = () => ({
//     fillColor: 'rgb(29, 78, 216)',
//     weight: 2,
//     opacity: 1,
//     color: 'white',
//     fillOpacity: 0.7
//   });

//   // Event handler to bind popups to features, using selected variable
//   const onEachFeature = (feature, layer) => {
//     const popupContent = `<div><h2>${feature.properties.NAMELSAD}</h2><p>${selectedVariable}</p></div>`;
//     layer.bindPopup(popupContent);
//   };

//   // Memoize GeoJSON options for efficient rendering
//   const memoizedOptions = useMemo(() => ({
//     style: style,
//     onEachFeature: onEachFeature
//   }), [selectedVariable]);

//   return <GeoJSON key={selectedGeography} data={data} {...memoizedOptions} />;
// };

// GeoJSONFeatureLayer.propTypes = {
//   data: PropTypes.object.isRequired,
//   selectedGeography: PropTypes.string.isRequired,
//   selectedVariable: PropTypes.string.isRequired
// };

// export default GeoJSONFeatureLayer;


// import { useState, useEffect } from 'react';
// import { GeoJSON } from 'react-leaflet';
// import { appConfig } from '../../config/config';
// import PropTypes from "prop-types";

// // The GeoJSONFeatureLayer should focus purely on rendering and not handle fetching directly.

// // Purpose:
//   // Display a specific GeoJSON layer on the map with consistent styling and popups.
// // Responsibilities:
//   // Accept processed GeoJSON data and selected variable.
//   // Bind popups or other interactivity to the features.
//   // Style each feature based on data values and normalization.

// const GeoJSONFeatureLayer = ({ selectedGeography, selectedVariable }) => {
//   const [geojsonData, setGeojsonData] = useState(null);
//   const [layerKey, setLayerKey] = useState('');

//   useEffect(() => {
//     async function fetchGeojson() {
//         const response = await fetch(`data/${appConfig.geographies[selectedGeography].geoJSONfileName}`);
//       const data = await response.json();
//       setGeojsonData(data);
//       setLayerKey(`${selectedVariable}-${selectedGeography}-${Date.now()}`);
//     }
//     fetchGeojson();
//   }, [selectedGeography, selectedVariable]);

//   return (
//     geojsonData && (
//       <GeoJSON
//         key={layerKey}
//         data={geojsonData}
//         style={() => ({
//           fillColor: 'rgb(29, 78, 216)',
//           weight: 2,
//           opacity: 1,
//           color: 'white',
//           fillOpacity: 0.7
//         })}
//         onEachFeature={(feature, layer) => {
//           const popupContent = `<div><h2>${feature.properties.NAMELSAD}</h2><p>${selectedVariable}</p></div>`;
//           layer.bindPopup(popupContent);
//         }}

//         // onEachFeature={(feature, layer) => {
//         //   if (feature.properties && feature.properties.variableValue !== undefined) {
//         //     let nameLabelString = `<b>${feature.properties.NAMELSAD}</b><br> ${Config.categories[selectedVariable].defaultMappedVariable.label}:`;
//         //     let value = feature.properties.variableValue;
//         //     let popupContent = '';
        
//         //     switch (Config.categories[selectedVariable].defaultMappedVariable.transformationType) {
//         //       case 'percentage':
//         //       case 'summedPercentage':
//         //         popupContent = `${nameLabelString} ${value}%`;
//         //         break;
//         //       case 'convertToDollars':
//         //         popupContent = `${nameLabelString} $${value.toLocaleString()}`;
//         //         break;
//         //       case 'ratePerThousand':
//         //         popupContent = `${nameLabelString} ${value}/1,000`;
//         //         break;
//         //       case 'none':
//         //         popupContent = `${nameLabelString} ${value.toLocaleString()}`;
//         //         break;
//         //     }
//         //     layer.bindPopup(popupContent);
//         //   } else {
//         //     layer.bindPopup(`${feature.properties.NAMELSAD}: No data available`);
//         //   }
//         // }}
        

//       />
//     )
//   );
// };

// GeoJSONFeatureLayer.propTypes = {
//     selectedGeography: PropTypes.string,
//     selectedVariable: PropTypes.string
//     };

// export default GeoJSONFeatureLayer;
