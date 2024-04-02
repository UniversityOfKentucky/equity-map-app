import React, { useContext, useState } from 'react';
import { GlobalStateContext } from '../context/GlobalStateContext';

const CategoriesPanel = () => {
    // Destructures the undefined setSelectedCategory function from the GlobalStateContext object and assigns it to the setSelectedCategory variable.
    const { setSelectedCategory } = useContext(GlobalStateContext);
    const categories = ['Population', 'Income', 'Education'];

    return (
        <div className="categories-panel col-span-1">
            <h2>Select an Category:</h2>
            {/* Maps over the 'categories' array to render a button for each category.*/}
            {categories.map((category) => (
                // The react 'key' prop is set to the current category value to uniquely identify each button element.
                <button key={category} onClick={() => { {/* On click, calls the setSelectedCategory function with the button's category value as an argument. The value is passed as a prop to the setSelectedCategory function, updating the selected category state in the global context. 
             */}
                    setSelectedCategory(category);
                }}>
                    {category}
                </button>
            ))}
        </div>
    );
};

export default CategoriesPanel;
