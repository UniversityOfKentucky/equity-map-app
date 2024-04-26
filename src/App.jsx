import { useState } from 'react'
import React from 'react';
import './App.css'
import MapView from './components/MapView';
import CategoriesPanel from './components/CategoriesPanel';

function App() {
  return (
    <div className="App grid grid-cols-4 h-screen w-screen m-0 p-0">
      <CategoriesPanel />
      <MapView />
    </div>
  );
}

export default App
