import { useState } from 'react'
import React from 'react';
import './App.css'
import MapView from './components/MapView';
import IndicatorsPanel from './components/IndicatorsPanel';
import FeaturesPanel from './components/FeaturesPanel';

function App() {
  return (
    <div className="App h-screen w-screen">
      <MapView />
      <IndicatorsPanel />
      <FeaturesPanel />
    </div>
  );
}

export default App
