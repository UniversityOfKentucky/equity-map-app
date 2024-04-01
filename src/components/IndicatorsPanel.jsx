import React from 'react';

const IndicatorsPanel = () => {
    const indicators = ['Population', 'Income', 'Education'];

    return (
        <div className="indicators-panel">
            <h2>Select an Indicator:</h2>
            <ul>
                {indicators.map((indicator, index) => (
                    <li key={index}>
                        <button onClick={() => console.log(`Selected: ${indicator}`)}>
                            {indicator}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default IndicatorsPanel;
