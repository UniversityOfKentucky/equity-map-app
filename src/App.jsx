import './App.css'
import MapView from './components/map/MapView';
import SelectionPanel from './components/sidebar/SelectionPanel';
import { useState } from 'react';
import { appConfig } from './config/config';
import Tour from 'reactour';

function App() {
  const [selectedGeography, setSelectedGeography] = useState(appConfig.initialGeography);
  const [selectedVariable, setSelectedVariable] = useState('Total Population');
  const [comparisonVariable, setComparisonVariable] = useState('');
  const [isTourOpen, setIsTourOpen] = useState(true);

  const steps = [
    {
      selector: '.geography-selector',
      content: 'Select your study area.',
    },
    {
      selector: '.variable-selector',
      content: 'Choose a category and topic to explore.',
    },
    {
      selector: '.map-container',
      content: 'Once you have selected your area and topic, the map will display the data. You can zoom in and out, and pan around by clicking and dragging.',
    },
    {
      selector: '.legend-tour-step',
      content: 'This is the legend. It shows the range of values for your selected topic.',
    },
    
  ];

  return (
    <div className="App grid grid-cols-8 h-screen w-screen m-0 p-0">
      <SelectionPanel
        className="selection-panel"
        selectedGeography={selectedGeography}
        setSelectedGeography={setSelectedGeography}
        selectedVariable={selectedVariable}
        setSelectedVariable={setSelectedVariable}
        comparisonVariable={comparisonVariable}
        setComparisonVariable={setComparisonVariable}
        setIsTourOpen={setIsTourOpen}
      />
      <MapView
        className=""
        selectedGeography={selectedGeography}
        selectedVariable={selectedVariable}
        comparisonVariable={comparisonVariable}
        setIsTourOpen={setIsTourOpen}
      />
      <Tour
        steps={steps}
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
        styles={{
          options: {
            textColor: '#1a202c',
          },
        }}

      />
    </div>
  );
}

export default App;