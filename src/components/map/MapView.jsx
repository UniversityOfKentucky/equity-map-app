import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import PropTypes from "prop-types";
import { appConfig } from '../../config/config';
import GeoJSONFeatureLayer from './GeoJSONFeatureLayer';

const MapView = ({ selectedGeography, selectedVariable }) => {

  const mapSettings = appConfig.geographies[selectedGeography].mapSettings;
  const center = mapSettings.center;

  const maxBounds = [
    [center[0] * 1.005, center[1] * 1.005], // top left corner
    [center[0] * 0.995, center[1] * 0.995]  // bottom right corner
  ];
  mapSettings.maxBounds = maxBounds;

  return (

    <div className="col-span-3 relative h-screen">
      {/* Add property to prevent map from animating and 'bouncing' back when attempting to escape bounds */}
      <MapContainer 
        key={`${selectedVariable}-${selectedGeography}`} 
        maxBoundsViscosity={1.0}
        {...appConfig.geographies[selectedGeography].mapSettings} 
        style={{ height: '100%', width: '100%'}}
      > 
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom='19'
        />
        <GeoJSONFeatureLayer 
          selectedGeography={selectedGeography} 
          selectedVariable={selectedVariable}
        />
      </MapContainer>
      {/* <FeaturesPanel /> */}
    </div>
  );
}

MapView.propTypes = {
  selectedGeography: PropTypes.string.isRequired,
  selectedVariable: PropTypes.string.isRequired,
};

export default MapView;