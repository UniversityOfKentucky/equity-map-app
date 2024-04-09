import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, TileLayer, GeoJSON, Popup, useMap } from 'react-leaflet'; 
import 'leaflet/dist/leaflet.css';
import { GlobalStateContext } from '../context/GlobalStateContext';
import FeaturesPanel from './FeaturesPanel';

function MapUpdater({ mapSettings }) {
  const map = useMap();

  useEffect(() => {
    const { center, zoom, minZoom, maxZoom } = mapSettings;
    const maxBounds = [[center[0]*1.005, center[1]*1.005], [center[0]*.995, center[1]*.995]];
    map.setView(center, zoom);
    map.setMinZoom(minZoom);
    map.setMaxZoom(maxZoom);
    map.setMaxBounds(maxBounds);
  }, [map, mapSettings]);

  return null;
}

MapUpdater.propTypes = {
  mapSettings: PropTypes.shape({
    center: PropTypes.arrayOf(PropTypes.number).isRequired,
    zoom: PropTypes.number.isRequired,
    minZoom: PropTypes.number.isRequired,
    maxZoom: PropTypes.number.isRequired,
  }).isRequired,
};

const MapView = () => {
  const { selectedCategory, selectedGeography } = useContext(GlobalStateContext);

  const INITIAL_MAP_SETTINGS = {
    center: [38, -84.5037],
    zoom: 11,
    minZoom: 11,
    maxZoom: 19,
  };
 
  const [mapSettings, setMapSettings] = useState(INITIAL_MAP_SETTINGS);
  const [geojsonData, setGeojsonData] = useState(null);
  const INITIAL_GEOJSON_URL = 'src/assets/data/fayette-county.geojson';

  useEffect(() => {
    if (selectedGeography === 'msa') {
      // Update mapSettings based on new geography
      setMapSettings(/* new settings */);
    }
  }, [selectedGeography]);

  useEffect(() => {
    fetch(INITIAL_GEOJSON_URL)
      .then(response => response.json())
      .then(data => setGeojsonData(data))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      // Fetch new GeoJSON data based on the selected category
      const NEW_GEOJSON_URL = `src/assets/data/fayette-county.geojson`;
      fetch(NEW_GEOJSON_URL)
        .then(response => response.json())
        .then(data => setGeojsonData(data))
        .catch(error => console.error(error));
    }
  }, [selectedCategory]);

  return (
    <div className="col-span-4 relative h-screen">
      <MapContainer {...mapSettings} style={{ height: '100%', width: '100%' }}>
        <MapUpdater mapSettings={mapSettings} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains='abcd'
          maxZoom= '19'
        />
        {/* If geojosnData is available, render the GeoJSON component with the data */}
        {geojsonData && (
          <GeoJSON data={geojsonData}>
            <Popup>A sample Popup.</Popup>
          </GeoJSON>
        )}
      </MapContainer>
      <FeaturesPanel />
    </div>
  );
};

export default MapView;