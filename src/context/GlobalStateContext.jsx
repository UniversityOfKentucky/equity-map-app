import React, { createContext, useState, useContext } from 'react';

// Creates a context object to store the shared state variables.
export const GlobalStateContext = createContext();

// Once imported into main.jsx, the GlobalStateProvider component will wrap main.jsx's child components, allowing them to access the shared state variables.
export const GlobalStateProvider = ({ children }) => { // This function manages the shared state variables and returns their values to the children components via props.

    // Shared state variables and their initial values
    // Stores the selected category
    const [selectedCategory, setSelectedCategory] = useState('Population');

    // Value to be passed to provider consumers
    const value = {
        selectedCategory,
        setSelectedCategory,
    };

    return (
        // React's Context API provider component
        <GlobalStateContext.Provider value={value}>
            {children}
        </GlobalStateContext.Provider>
    );
};
