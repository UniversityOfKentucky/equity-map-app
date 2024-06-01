import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PropTypes from "prop-types";
import { appConfig } from "../../config/config";
import DataLayerContainer from "./DataLayerContainer";
import FeaturesPanel from "./FeaturesPanel";
import { useEffect } from "react";

const MapView = ({ selectedGeography, selectedVariable }) => {
  const mapSettings = appConfig.geographies[selectedGeography].mapSettings;
  const center = mapSettings.center;

  useEffect(() => {
  const maxBounds = [
    [center[0] * 1.1, center[1] * 1.1],
    [center[0] * 0.9, center[1] * 0.9],
  ];
  mapSettings.maxBounds = maxBounds;
  
  }, [center, mapSettings]);


  return (
    <div className="col-span-3 relative h-screen">
      <MapContainer
        key={selectedGeography}
        maxBoundsViscosity={1.0}
        {...mapSettings}
        style={{ height: "100%", width: "100%" }}
      >
        {/* Basemap tile layer */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom="19"
        />
        {/* Label tile layer */}
        {/* <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
          maxZoom="19"
        /> */}
        <DataLayerContainer
          selectedGeography={selectedGeography}
          selectedVariable={selectedVariable}
        />
        <FeaturesPanel />
      </MapContainer>
    </div>
  );
};

MapView.propTypes = {
  selectedGeography: PropTypes.string.isRequired,
  selectedVariable: PropTypes.string.isRequired,
};

export default MapView;
