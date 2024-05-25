import './App.css'
import MapView from './components/map/MapView';
import SelectionPanel from './components/sidebar/SelectionPanel';
import { useState } from 'react';
import { appConfig } from './config/config';

function App() {

  const [selectedGeography, setSelectedGeography] = useState(appConfig.initialGeography);
  const [selectedVariable, setSelectedVariable] = useState('Total Population');
  // const [selectedTimePeriod, setSelectedTimePeriod] = useState(appConfig.initialTimePeriod);

  return (
    <div className="App grid grid-cols-4 h-screen w-screen m-0 p-0">
      <SelectionPanel 
        selectedGeography={selectedGeography}
        setSelectedGeography={setSelectedGeography}
        selectedVariable={selectedVariable}
        setSelectedVariable={setSelectedVariable}
        // selectedTimePeriod={selectedTimePeriod}
        // setSelectedTimePeriod={setSelectedTimePeriod}
      />
      <MapView 
        selectedGeography={selectedGeography}
        selectedVariable={selectedVariable}
        // selectedTimePeriod={selectedTimePeriod}
       />
    </div>
  );
}

export default App
