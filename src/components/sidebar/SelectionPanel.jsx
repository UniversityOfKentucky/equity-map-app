import GeographySelector from './GeographySelector';
// import TimePeriodSelector from './TimePeriodSelector';
import VariableSelector from './VariableSelector';
// import FeaturesPanel from './FeaturesPanel.jsx';
import propTypes from 'prop-types';

const SelectionPanel = ({ selectedGeography, setSelectedGeography, selectedVariable, setSelectedVariable }) => {

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
            />
            <div className="m-2 border border-gray-200 rounded-lg">
                <p>Information about Project</p>
                {/* <FeaturesPanel /> */}
            </div>
        </div>
    );
}

SelectionPanel.propTypes = {
    selectedGeography: propTypes.string.isRequired,
    setSelectedGeography: propTypes.func.isRequired,
    selectedVariable: propTypes.string.isRequired,
    setSelectedVariable: propTypes.func.isRequired,
}

export default SelectionPanel;
