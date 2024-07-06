import GeographySelector from './GeographySelector';
// import TimePeriodSelector from './TimePeriodSelector';
import VariableSelector from './VariableSelector';
// import FeaturesPanel from './FeaturesPanel.jsx';
import propTypes from 'prop-types';

const SelectionPanel = ({ selectedGeography, setSelectedGeography, selectedVariable, setSelectedVariable, setIsTourOpen }) => {  

  return (
    <div className="selection-panel col-span-1 h-screen overflow-auto">
      <GeographySelector 
        classname=""
        selectedGeography={selectedGeography}
        setSelectedGeography={setSelectedGeography}
      />
      {/* <TimePeriodSelector /> */}
      <VariableSelector 
        classname=""
        selectedVariable={selectedVariable}
        setSelectedVariable={setSelectedVariable}
        selectedGeography={selectedGeography}
      />
      <div className="m-2 border border-gray-200 rounded-lg">
        <p>Information about Project</p>
        <button
          className="bg-blue-100 text-blue-700 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 p-2 rounded-lg w-3/4 m-2"
          onClick={() => setIsTourOpen(true)}
        >
            Show Tour
        </button>
        {/* <FeaturesPanel /> */}
      </div>
    </div>
  );
};

SelectionPanel.propTypes = {
  selectedGeography: propTypes.string.isRequired,
  setSelectedGeography: propTypes.func.isRequired,
  selectedVariable: propTypes.string.isRequired,
  setSelectedVariable: propTypes.func.isRequired,
};

export default SelectionPanel;