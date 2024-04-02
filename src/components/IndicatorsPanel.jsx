import React, { useContext } from 'react';
import { GlobalStateContext } from '../context/GlobalStateContext';

const IndicatorsPanel = () => {
    // Destructures the undefined setSelectedIndicator function from the GlobalStateContext object and assigns it to the setSelectedIndicator variable.
    const { setSelectedIndicator } = useContext(GlobalStateContext);
    const indicators = ['Population', 'Income', 'Education'];

    return (
        <div className="indicators-panel">
            <h2>Select an Indicator:</h2>
            {/* Maps over the 'indicators' array to render a button for each indicator.*/}
            {indicators.map((indicator) => (
                // The react 'key' prop is set to the current indicator value to uniquely identify each button element.
                <button key={indicator} onClick={() => { {/* On click, calls the setSelectedIndicator function with the button's indicator value as an argument. The value is passed as a prop to the setSelectedIndicator function, updating the selected indicator state in the global context. 
             */}
                    setSelectedIndicator(indicator);
                }}>
                    {indicator}
                </button>
            ))}
        </div>
    );
};

export default IndicatorsPanel;
