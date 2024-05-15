import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PropTypes from "prop-types";
import { appConfig } from "../../config/config";
import DataLayerContainer from "./DataLayerContainer";
import constructFetchURL from "../../utils/constructFetchURL";
import { processData } from "../../utils/dataProcessingUtils.js";
import { useQuery } from 'react-query';

const MapView = ({ selectedGeography, selectedVariable }) => {
  const [processedData, setProcessedData] = useState(null);

  useQuery(
    ['censusData', selectedGeography, selectedVariable],
    () => fetch(constructFetchURL(selectedGeography, selectedVariable)).then(res => res.json()),
    {
      enabled: selectedVariable !== "No current selection" && !!selectedGeography,
      onSuccess: (data) => {
        const processed = processData(data, selectedVariable, selectedGeography);
        setProcessedData(processed);
      },
      onError: (error) => {
        console.error("Failed to fetch data: ", error);
      }
    }
  );

  useEffect(() => {
    // Reset processed data when geography changes
    setProcessedData(null);
  }, [selectedGeography]);

  const mapSettings = appConfig.geographies[selectedGeography].mapSettings;
  const center = mapSettings.center;
  const maxBounds = [
    [center[0] * 1.005, center[1] * 1.005],
    [center[0] * 0.995, center[1] * 0.995],
  ];
  mapSettings.maxBounds = maxBounds;

  return (
    <div className="col-span-3 relative h-screen">
      <MapContainer
        key={`${selectedVariable}-${selectedGeography}`}
        maxBoundsViscosity={1.0}
        {...mapSettings}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom="19"
        />
        <DataLayerContainer
          processedData={processedData}
          selectedGeography={selectedGeography}
          selectedVariable={selectedVariable}
        />
      </MapContainer>
    </div>
  );
};

MapView.propTypes = {
  selectedGeography: PropTypes.string.isRequired,
  selectedVariable: PropTypes.string.isRequired,
};

export default MapView;
