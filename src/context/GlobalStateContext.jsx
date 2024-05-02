import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { initFlatFileData } from '../assets/data/initFlatFileData.js';

// Creates a context object to store the shared state variables.
export const GlobalStateContext = createContext();

// Once imported into main.jsx, the GlobalStateProvider component will wrap main.jsx's child components, allowing them to access the shared state variables.
export const GlobalStateProvider = ({ children }) => { // This function manages the shared state variables and returns their values to the children components via props.

    // Shared state variables and their initial values
    const [selectedCategory, setSelectedCategory] = useState('Demographics');
    const [globalData, setGlobalData] = useState(initFlatFileData); // Temporarily initializes from the flat file data for development
    const [selectedGeography, setSelectedGeography] = useState('tracts');
    const [geojsonData, setGeojsonData] = useState();

    // Value to be passed to provider consumers
    const value = {
        selectedCategory,
        setSelectedCategory,
        globalData,
        setGlobalData,
        selectedGeography,
        setSelectedGeography,
        geojsonData,
        setGeojsonData,
    };

    return (
        // React's Context API provider component
        <GlobalStateContext.Provider value={value}>
            {children}
        </GlobalStateContext.Provider>
    );
};

// Prop types validation
GlobalStateProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

