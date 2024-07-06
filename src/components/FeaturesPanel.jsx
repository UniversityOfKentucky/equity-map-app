import React, { useState } from 'react'; // Imports React's 'useState' hook for internal state management
import { Tab } from '@headlessui/react';
import ReactModal from 'react-modal';
import FeatureConfig from '../config/FeatureConfig';

ReactModal.setAppElement('#root');

const FeaturesPanel = () => {
// Array destructuring is used to assign values to 'modalIsOpen' variable and 'setModalIsOpen' function.
    // 'useState' hook sets 'modalIsOpen' to false initially and implicitly sets 'setModalIsOpen' function to update it. 
    const [modalIsOpen, setModalIsOpen] = useState(false);
// Array destructuring is used to assign values to 'selectedFeature' variable and 'setSelectedFeature' function.
    // 'useState' hook sets 'selectedFeature' to an empty string initially and implicitly sets 'setSelectedFeature' function to update it.
    const [selectedFeature, setSelectedFeature] = useState(FeatureConfig[0]);

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
                    {FeatureConfig.map((feature, index) => (
                        <Tab key={index} className={({ selected }) => 
                            `w-full py-2 text-sm font-medium leading-5 text-center rounded-lg 
                            ${selected ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'}`
                        }>
                            {feature.title}
                        </Tab>
                    ))}
                </Tab.List>
                <Tab.Panels className="mt-2">
                    {/* Maps over the 'features' array to render a tab for each feature.The tab, when clicked, will call 'openModal' with the feature. */}
                    {FeatureConfig.map((feature, index) => (
                        <Tab.Panel key={index} className="p-3 bg-blue-50 rounded-lg text-slate-700" onClick={() => openModal(feature)}>
                            <h2 className="font-semibold">{feature.title}</h2>
                            <p>This is a placeholder content for {feature.title}.</p>
                        </Tab.Panel>
                    ))}
                </Tab.Panels>
            </Tab.Group>
            {/* ReactModal component is used to display the selected feature in a modal. */}
            <ReactModal
                isOpen={modalIsOpen} 
                onRequestClose={() => setModalIsOpen(false)}
                className=""
                overlayClassName="text-slate-700"
            >
                <button 
                    onClick={() => setModalIsOpen(false)}
                    className=""
                >
                    Close
                </button>
                <h1 className="text-center text-xl font-bold text-slate-700">{selectedFeature.title}</h1>
                <h2 className="text-center text-lg font-semibold text-slate-700 mt-4">{selectedFeature.subtitle}</h2><br /> 
                <p>{` • ${selectedFeature.methodology}`}</p><br /><hr />
                {selectedFeature.visualization.map((visualization) => (
                    <div key={visualization.title} className="m-2">
                        <p className="text-center font-semibold">{visualization.title}</p>
                        <div className="flex justify-center">
                            <div className="w-1/2">
                                <p className="text-center">Text Div</p>
                            </div>
                            <div className="w-1/2">
                                <visualization.VisualizationComponent data={visualization.data} options={visualization.options} title={visualization.title}/>
                            </div>
                        </div>
                    </div>
                ))}

                {/*
{selectedFeature.visualization.map((visualization) => (
  <div key={visualization.id} className={visualization.layout.cssClasses}>
    // Generate the rows and columns based on the 
    //layout configuration
    {Array.from({ length: visualization.layout.rows }).map((_, rowIndex) => (
      <div key={rowIndex} className="flex">
        {Array.from({ length: visualization.layout.columns }).map((_, columnIndex) => (
          <div key={columnIndex} className="w-1/4">
            <visualization.VisualizationComponent data={visualization.data} options={visualization.options} title={visualization.title}/>
          </div>
        ))}
      </div>
    ))}
  </div>
))}
                */}

            </ReactModal>
        </div>
    );
};

export default FeaturesPanel;
