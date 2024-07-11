import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PropTypes from "prop-types";
import { appConfig } from "../../config/config";
import DataLayerContainer from "./DataLayerContainer";
import FeaturesPanel from "./FeaturesPanel";
import { useEffect, useRef } from "react";
import CallToActionControl from "./CallToActionControl";
import GeographyTitle from "./GeographyTitle";

const MapView = ({ selectedGeography, selectedVariable, comparisonVariable, setIsTourOpen }) => {
  const mapSettings = appConfig.geographies[selectedGeography].mapSettings;
  const center = mapSettings.center;

  // Custom hook to synchronize maps
  const useSyncMaps = (map1, map2) => {
    useEffect(() => {
      if (!map1 || !map2) return;

      const syncMaps = (source, target) => {
        source.on('moveend', () => {
          if (!source._syncing) {
            target._syncing = true;
            target.setView(source.getCenter(), source.getZoom(), { animate: false });
            target._syncing = false;
          }
        });
        source.on('zoomend', () => {
          if (!source._syncing) {
            target._syncing = true;
            target.setView(source.getCenter(), source.getZoom(), { animate: false });
            target._syncing = false;
          }
        });
      };

      syncMaps(map1, map2);
      syncMaps(map2, map1);
    }, [map1, map2]);
  };

  // Refs for the map instances
  const mapRef1 = useRef(null);
  const mapRef2 = useRef(null);

  useEffect(() => {
    const maxBounds = [
      [center[0] * 1.1, center[1] * 1.1],
      [center[0] * 0.9, center[1] * 0.9],
    ];
    mapSettings.maxBounds = maxBounds;
  }, [center, mapSettings]);

  useSyncMaps(mapRef1.current, mapRef2.current);

  return (
    <div className="grid grid-cols-2 col-span-6 relative h-screen">
      <div className={comparisonVariable ? "col-span-1 h-screen" : "col-span-2 h-screen"}>
      <MapContainer
          ref={mapRef1}
          // key={selectedGeography} // syncs but uncentered, doesn't work on new geos unless comparison var is deselected and reselected
          key={`${selectedGeography}-${comparisonVariable}`} // centered but doesn't sync at all
          className="map-container"
          maxBoundsViscosity={1.0}
          {...mapSettings}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          {/* Basemap tile layer */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
            // url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            opacity={0.7}
            maxZoom="19"
          />
          <GeographyTitle selectedGeography={selectedGeography} />
          <CallToActionControl setIsTourOpen={setIsTourOpen} />
          <ZoomControl position="topright" />
          {/* Label tile layer */}
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
            maxZoom="19"
            zIndex="1000"
          />
          <DataLayerContainer
            selectedGeography={selectedGeography}
            selectedVariable={selectedVariable}
          />

          {!comparisonVariable && <FeaturesPanel />}
        </MapContainer>
      </div>
      <div className="col-span-1 h-screen">
        <MapContainer
          ref={mapRef2}
          key={`${selectedGeography}-${comparisonVariable}`} // centered but doesn't sync at all
          // key={selectedGeography} // syncs but uncentered, doesn't work on new geos unless comparison var is deselected and reselected
          className="map-container"
          maxBoundsViscosity={1.0}
          {...mapSettings}
          style={{ height: "100%", width: "100%" }}
          zoomControl={true}
        >
            {/* Basemap tile layer */}
            <TileLayer
            // url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
            // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            opacity={0.7}  
            maxZoom="19"
          />
            {/* Label tile layer */}
            {/* <TileLayer
              url="https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png"
              maxZoom="19"
              zIndex="1000"
            /> */}
          <DataLayerContainer
            selectedGeography={selectedGeography}
            selectedVariable={comparisonVariable}
          />
        </MapContainer>
      </div>
    </div>
  );
};

MapView.propTypes = {
  selectedGeography: PropTypes.string.isRequired,
  selectedVariable: PropTypes.string.isRequired,
};

export default MapView;