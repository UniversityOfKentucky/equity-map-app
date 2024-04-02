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
        <div className="features-panel absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 bg-white rounded-lg shadow-lg p-4">
            {/*HeadlessUI's 'Tab.Group' component is used to create a tabbed interface of features.*/}
            <Tab.Group>
                <Tab.List className="flex space-x-1">
                    {features.map((feature, index) => (
                        <Tab key={index} className={({ selected }) => 
                            `w-full py-2 text-sm font-medium leading-5 text-center rounded-lg 
                            ${selected ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`
                        }>
                            {feature}
                        </Tab>
                    ))}
                </Tab.List>
                <Tab.Panels className="mt-2">
                    {/* Maps over the 'features' array to render a tab for each feature.The tab, when clicked, will call 'openModal' with the feature. */}
                    {features.map((feature, index) => (
                        <Tab.Panel key={index} className="p-3 bg-blue-50 rounded-lg text-slate-700" onClick={() => openModal(feature)}>
                            <h2 className="font-semibold">{feature}</h2>
                            <p>This is a placeholder content for {feature}.</p>
                        </Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>
            {/* ReactModal component is used to display the selected feature in a modal. */}
            <ReactModal
                isOpen={modalIsOpen} 
                onRequestClose={() => setModalIsOpen(false)}
                className=""
                overlayClassName=""
            >
                <h2 className="text-xl font-bold">{selectedFeature}</h2>
                <p className="mt-4">{selectedFeature}</p>
                <button 
                    onClick={() => setModalIsOpen(false)}
                    className=""
                >
                    Close
                </button>
            </ReactModal>
        </div>
    );
};

export default FeaturesPanel;
