import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet'; 
import 'leaflet/dist/leaflet.css';

const MapView = () => {
  const position = [38.0406, -84.5037];

  return (
    <div className="h-screen w-screen">
      <MapContainer center={position} zoom={11} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains='abcd'
          maxZoom= '19'
        />
        {/* GeoJSON layers will be added here */}
      </MapContainer>
    </div>
  );
};

export default MapView;
