import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, Popup } from 'react-leaflet'; 
import 'leaflet/dist/leaflet.css';

const MapView = () => {
  const position = [38.0406, -84.5037];

  // Array destructuring to set the state of 'geojsonData' and 'setGeojsonData' function
  const [geojsonData, setGeojsonData] = useState(null);

  // Fetches GeoJSON data from the local file 'fayette.geojson' and sets the 'setGeojsonData' state
  useEffect(() => {
    fetch('src/assets/data/fayette-county.geojson')
      .then(response => response.json())
      .then(data => setGeojsonData(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div className="h-screen w-screen">
      <MapContainer center={position} zoom={11} style={{ height: '100%', width: '100%' }}>
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
    </div>
  );
};

export default MapView;