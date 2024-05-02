import { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'; 
import 'leaflet/dist/leaflet.css';
import { GlobalStateContext } from '../context/GlobalStateContext';
import FeaturesPanel from './FeaturesPanel';
import Config from '../config/CategoryConfig';
import chroma from 'chroma-js';
import { useMapSettings } from '../hooks/useMapSettings';

const MapView = () => {
  const { selectedCategory, selectedGeography, globalData, geojsonData, setGeojsonData } = useContext(GlobalStateContext);
  const mapSettings = useMapSettings(selectedGeography);
  const maxBounds = [[mapSettings.center[0]*1.005, mapSettings.center[1]*1.005], [mapSettings.center[0]*.995, mapSettings.center[1]*.995]];
  const [geojsonKey, setGeojsonKey] = useState(Date.now());

  useEffect(() => {
    async function fetchGeojson() {
      const response = await fetch(`src/assets/data/${selectedGeography}.geojson`);
      const data = await response.json();
      const transformedData = globalData[`${selectedGeography} - ${selectedCategory} Category Default Mapped Variable: ${Config.categories[selectedCategory].defaultMappedVariable.label}`];
      data.features.forEach(feature => {
        const geoCode = feature.properties[{ 'tracts': 'TRACTCE', 'counties': 'COUNTYFP', 'msa': 'GEOID' }[selectedGeography]];
        let value = transformedData[geoCode];
        if (value < 0 || isNaN(value) || value === undefined) value = null;
        feature.properties.variableValue = value;
      });
      const colorScale = chroma.scale(['rgb(219, 234, 254)', 'rgb(59, 130, 246)']).mode('lch').colors(6);
      const values = data.features.map(f => f.properties.variableValue);
      const min = Math.min(...values);
      const max = Math.max(...values);
      const normalize = (value, min, max) => ((value - min) / (max - min)) * (colorScale.length - 1);
      setGeojsonData({ colorScale, data, min, max, normalize });
      setGeojsonKey(Date.now());
    }
    fetchGeojson();
  }, [globalData, selectedCategory, selectedGeography, setGeojsonData]);

  return (
    <div className="col-span-3 relative h-screen">
      <MapContainer key={`${selectedCategory}-${selectedGeography}`} {...mapSettings} style={{ height: '100%', width: '100%' }} maxBounds={maxBounds}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom='19'
        />
        {geojsonData && (
          <GeoJSON
            key={geojsonKey}
            data={geojsonData.data}
            style={(feature) => ({
              fillColor: geojsonData.colorScale[Math.floor(geojsonData.normalize(feature.properties.variableValue, geojsonData.min, geojsonData.max))],
              weight: 2,
              opacity: 1,
              color: 'white',
              fillOpacity: 0.7
            })}
            onEachFeature={(feature, layer) => {
              if (feature.properties && feature.properties.variableValue) {
                let nameLabelString = `<b>${feature.properties.NAMELSAD}</b><br> ${Config.categories[selectedCategory].defaultMappedVariable.label}:`;
                let value = feature.properties.variableValue;
                switch (Config.categories[selectedCategory].defaultMappedVariable.transformationType) {
                  case 'percentage':
                  case 'summedPercentage':
                    layer.bindPopup(`${nameLabelString} ${value}%`);
                    break;
                  case 'convertToDollars':
                    layer.bindPopup(`${nameLabelString} $${value.toLocaleString()}`);
                    break;
                  case 'ratePerThousand':
                    layer.bindPopup(`${nameLabelString} ${value}/1,000`);
                    break;
                  case 'none':
                    layer.bindPopup(`${nameLabelString} ${value.toLocaleString()}`);
                    break;
                }
              } else {
                layer.bindPopup(`${feature.properties.NAMELSAD}: No data available`);
              }
            }}
          />
        )}
      </MapContainer>
      <FeaturesPanel />
    </div>
  );
};

export default MapView;
