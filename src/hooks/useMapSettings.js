import { useMemo } from 'react';

const MAP_SETTINGS = {
  tracts: {
    center: [38, -84.5037],
    zoom: 11,
    minZoom: 11,
    maxZoom: 19,
  },
  msa: {
    center: [38, -84.5037],
    zoom: 6.5,
    minZoom: 7,
    maxZoom: 18,
  },
  counties: {
    center: [38, -84.5037],
    zoom: 6,
    minZoom: 7,
    maxZoom: 19,
  },
};

export const useMapSettings = (selectedGeography) => {
  const settings = useMemo(() => {
    return MAP_SETTINGS[selectedGeography] || MAP_SETTINGS.tracts; // Default to tracts if not found
  }, [selectedGeography]);

  return settings;
};
