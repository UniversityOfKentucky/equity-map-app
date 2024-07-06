import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

// Creates a context object to store the shared state variables.
const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
    
    const [globalData, setGlobalData] = useState({ geoJsonData: {}, apiData: {}, processedData: {} });

    return (
        <GlobalStateContext.Provider value={{
            globalData,
            setGlobalData 
            }}>
            {children}
        </GlobalStateContext.Provider>
    );
};

GlobalStateProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default GlobalStateContext;

