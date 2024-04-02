import React, { useState } from 'react'; // Imports React's 'useState' hook for internal state management
import { Tab } from '@headlessui/react';
import ReactModal from 'react-modal';

ReactModal.setAppElement('#root');

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
        <div className="features-panel absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4">
            {/*HeadlessUI's 'Tab.Group' component is used to create a tabbed interface of features.*/}
            <Tab.Group>
                <Tab.List>
                    {features.map((feature, index) => (
                        <Tab key={index}>
                            {feature}
                        </Tab>
                    ))}
                </Tab.List>
                    {/* Maps over the 'features' array to render a tab for each feature.The tab, when clicked, will call 'openModal' with the feature. */}
                {features.map((feature, index) => (
                    <Tab.Panel key={index} onClick={() => openModal(feature)}>
                        <h2>{feature}</h2>
                        <p>This is a placeholder content for {feature}.</p>
                    </Tab.Panel>
                ))}
            </Tab.Group>
            {/* ReactModal component is used to display the selected feature in a modal. */}
            <ReactModal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)}>
                <h2>{selectedFeature}</h2>
                <p>This is a placeholder content for {selectedFeature}.</p>
                <button onClick={() => setModalIsOpen(false)}>Close</button>
            </ReactModal>
        </div>
    );
};

export default FeaturesPanel;
