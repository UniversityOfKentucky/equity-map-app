import React, { useContext } from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/24/outline';
import { GlobalStateContext } from '../context/GlobalStateContext';

const CategoriesPanel = () => {
    // Destructures the undefined setSelectedCategory function from the GlobalStateContext object and assigns it to the setSelectedCategory variable.
    const { setSelectedCategory } = useContext(GlobalStateContext);
    const categories = ['Population', 'Income', 'Education'];

    // Handler to update the global state
    const handleSelectCategory = (category) => {
        setSelectedCategory(category);
    };

    return (
        <div className="categories-panel col-span-1">
            {categories.map((category) => (
                <Disclosure key={category} as="div" className="m-2">
                    {({ open }) => (
                        <>
                            <Disclosure.Button 
                                className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-purple-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75"
                                onClick={() => handleSelectCategory(category)}
                            >
                                {category}
                                <ChevronUpIcon
                                    className={`${open ? 'transform rotate-180' : ''} w-5 h-5 text-purple-500`}
                                />
                            </Disclosure.Button>
                            <Disclosure.Panel className="px-4 pt-4 pb-2 text-sm text-gray-500 transition duration-500 ease-out">
                                <div className="p-4 border border-gray-200 rounded-lg">
                                    <p>Information about {category}</p>
                                    {/* Charts and additional content will go here */}
                                </div>
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
            ))}
        </div>
    );
};

export default CategoriesPanel;
