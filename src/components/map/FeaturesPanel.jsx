import { useState } from 'react';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'
import ReactModal from 'react-modal';
import { referenceData } from '../../config/config';

ReactModal.setAppElement('#root');

const FeaturesPanel = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedFeature, setSelectedFeature] = useState(referenceData.featuredStudies[0]);
    const openModal = (feature) => {
        setSelectedFeature(feature);
        setModalIsOpen(true); 
    };

    return (
        <div className="features-panel absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 bg-white rounded-lg shadow-lg p-4">
            <TabGroup>
                <TabList className="flex space-x-1">
                    {referenceData.featuredStudies.map((feature, index) => (
                        <Tab 
                        key={index} 
                        className={({ selected }) => 
                            `w-full py-2 text-sm font-medium leading-5 text-center rounded-lg 
                            ${selected ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'} `
                        }
                        onClick={() => openModal(feature)}>
                            {feature.title}
                        </Tab>
                    ))}
                </TabList>
                {/* <TabPanels>
                        <TabPanel/>
                    </TabPanels> */}
            </TabGroup>
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
