import React, { useContext } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { GlobalStateContext } from '../context/GlobalStateContext';
import CategoryConfig from '../config/CategoryConfig';

const CategoriesPanel = () => {
    // Destructures the undefined setSelectedCategory function from the GlobalStateContext object and assigns it to the setSelectedCategory variable.
    const { setSelectedCategory } = useContext(GlobalStateContext);
    // Handler to update the global state
    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
    };
    
    return (
        <div className="categories-panel col-span-1 h-screen">
            {CategoryConfig.map((category) => (
                <Disclosure key={category.title} as="div" className="m-2">
                    {({ open }) => (
                        <>
                            <Disclosure.Button 
                                className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                                onClick={() => handleSelectCategory(category.title)}
                            >
                                {category.title}
                                <ChevronUpIcon
                                    className={`${open ? 'transform rotate-180' : ''} w-5 h-5 text-blue-500`}
                                />
                            </Disclosure.Button>
                            <Disclosure.Panel className="m-2 px-4 pt-4 pb-2 text-sm text-gray-500 transition duration-500 ease-out">
                                <div className="p-4 border border-gray-200 rounded-lg">
                                    <p>Information about {category.title}</p>
                                    {/*loops over visualizations in category object */}
                                    {category.visualization.map((visualization) => (
                                        <div key={visualization.title} className="m-2">
                                            <p>{visualization.title}</p>
                                            <visualization.VisualizationComponent data={visualization.data} options={visualization.options} title={visualization.title}/>
                                        </div>
                                    ))}
                                </div>
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
            ))}
            {/* code below creates an information panel for the entire category panel */}
        <div className="m-2 border h-full border-gray-200 rounded-lg">
                    <p>Information about Project</p>
                    {/* Charts and additional content will go here */}
                </div>
        </div>
    );
};

export default CategoriesPanel;
