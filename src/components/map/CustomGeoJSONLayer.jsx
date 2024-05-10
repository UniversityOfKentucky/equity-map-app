import { useState, useEffect } from 'react';
import { GeoJSON } from 'react-leaflet';
import { appConfig } from '../../config/config';
import PropTypes from "prop-types";

const CustomGeoJSONLayer = ({ selectedGeography, selectedVariable }) => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [layerKey, setLayerKey] = useState('');

  useEffect(() => {
    async function fetchGeojson() {
        const response = await fetch(`data/${appConfig.geographies[selectedGeography].geoJSONfileName}`);
      const data = await response.json();
      setGeojsonData(data);
      setLayerKey(`${selectedVariable}-${selectedGeography}-${Date.now()}`);
    }
    fetchGeojson();
  }, [selectedGeography, selectedVariable]);

  return (
    geojsonData && (
      <GeoJSON
        key={layerKey}
        data={geojsonData}
        style={() => ({
          fillColor: 'rgb(29, 78, 216)',
          weight: 2,
          opacity: 1,
          color: 'white',
          fillOpacity: 0.7
        })}
        onEachFeature={(feature, layer) => {
          const popupContent = `<div><h2>${feature.properties.NAMELSAD}</h2><p>${selectedVariable}</p></div>`;
          layer.bindPopup(popupContent);
        }}

        // onEachFeature={(feature, layer) => {
        //   if (feature.properties && feature.properties.variableValue !== undefined) {
        //     let nameLabelString = `<b>${feature.properties.NAMELSAD}</b><br> ${Config.categories[selectedVariable].defaultMappedVariable.label}:`;
        //     let value = feature.properties.variableValue;
        //     let popupContent = '';
        
        //     switch (Config.categories[selectedVariable].defaultMappedVariable.transformationType) {
        //       case 'percentage':
        //       case 'summedPercentage':
        //         popupContent = `${nameLabelString} ${value}%`;
        //         break;
        //       case 'convertToDollars':
        //         popupContent = `${nameLabelString} $${value.toLocaleString()}`;
        //         break;
        //       case 'ratePerThousand':
        //         popupContent = `${nameLabelString} ${value}/1,000`;
        //         break;
        //       case 'none':
        //         popupContent = `${nameLabelString} ${value.toLocaleString()}`;
        //         break;
        //     }
        //     layer.bindPopup(popupContent);
        //   } else {
        //     layer.bindPopup(`${feature.properties.NAMELSAD}: No data available`);
        //   }
        // }}
        

      />
    )
  );
};

CustomGeoJSONLayer.propTypes = {
    selectedGeography: PropTypes.string,
    selectedVariable: PropTypes.string
    };

export default CustomGeoJSONLayer;
