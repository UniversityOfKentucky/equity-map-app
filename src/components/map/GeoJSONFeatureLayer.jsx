import { useMemo } from 'react';
import { GeoJSON } from 'react-leaflet';
import PropTypes from 'prop-types';

const GeoJSONFeatureLayer = ({ data, selectedGeography, selectedVariable }) => {
  const memoizedOptions = useMemo(() => {
    const style = (feature) => ({
      fillColor: feature.properties.color || 'rgb(29, 78, 216)',
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

  return data ? <GeoJSON key={selectedGeography} data={data} {...memoizedOptions} /> : null;

};

GeoJSONFeatureLayer.propTypes = {
  data: PropTypes.object.isRequired,
  selectedGeography: PropTypes.string.isRequired,
  selectedVariable: PropTypes.string.isRequired
};

export default GeoJSONFeatureLayer;