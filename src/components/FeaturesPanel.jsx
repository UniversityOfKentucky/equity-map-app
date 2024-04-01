import React, { useState } from 'react'; // Imports React's 'useState' hook for internal state management

const FeaturesPanel = () => {
    // Array destructuring is used to assign values to 'modalIsOpen' variable and 'setModalIsOpen' function.
    // 'useState' hook sets 'modalIsOpen' to false initially and implicitly sets 'setModalIsOpen' function to update it. 
    const [modalIsOpen, setModalIsOpen] = useState(false);
    // Array destructuring is used to assign values to 'selectedFeature' variable and 'setSelectedFeature' function.
    // 'useState' hook sets 'selectedFeature' to an empty string initially and implicitly sets 'setSelectedFeature' function to update it.
    const [selectedFeature, setSelectedFeature] = useState('');
    const features = ['Feature 1', 'Feature 2', 'Feature 3']; 

    // Function to open the modal and set the selected feature. 
    // It takes the feature as an argument and updates the state accordingly.
    const openModal = (feature) => {
        setSelectedFeature(feature); // Update the 'selectedFeature' state with the chosen feature
        setModalIsOpen(true); // Open the modal by setting 'modalIsOpen' state to true
    };

    return (
        <div>
            {/* Maps over the 'features' array to render a button for each feature.
                The button, when clicked, will call 'openModal' with the feature. */}
            {features.map((feature, index) => (
                <button key={index} onClick={() => openModal(feature)}>
                    {feature}
                </button>
            ))}

        </div>
    );
};

export default FeaturesPanel;
