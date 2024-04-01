import React, { createContext, useState, useContext } from 'react';

// Creates a context object to store the shared state variables.
const GlobalStateContext = createContext();

// Creates a hook which returns the context value.
export const useGlobalState = () => useContext(GlobalStateContext);

// Once imported into app.js, the GlobalStateProvider component will wrap app.js's child components, allowing them to access the shared state variables.
export const GlobalStateProvider = ({ children }) => { // This function manages the shared state variables and returns their values to the children components via props.

    // Shared state variables and their initial values
    // Stores the selected indicator
    const [selectedIndicator, setSelectedIndicator] = useState('');
    // Stores the selected feature
    const [selectedFeature, setSelectedFeature] = useState('');
    // Stores the modal open/close state
    const [modalIsOpen, setModalIsOpen] = useState(false);

    // Value to be passed to provider consumers
    const value = {
        selectedIndicator,
        setSelectedIndicator,
        selectedFeature,
        setSelectedFeature,
        modalIsOpen,
        setModalIsOpen,
    };

    return (
        // React's Context API provider component
        <GlobalStateContext.Provider value={value}>
            {children}
        </GlobalStateContext.Provider>
    );
};
