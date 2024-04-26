import { useContext, useState } from 'react';
import { Disclosure, RadioGroup } from '@headlessui/react';
import { ChevronUpIcon, CheckIcon } from '@heroicons/react/24/outline';
import { GlobalStateContext } from '../context/GlobalStateContext';
import Config from '../config/CategoryConfig';
import useDataFetcher from '../hooks/useDataFetcher';

const geographies = {
    "tracts": "Fayette County", 
    "msa": "Lexington-Fayette MSA",
    "counties": "Kentucky Counties"
};

const CategoriesPanel = () => {

    const [endpointsAndKeys, setEndpointsAndKeys] = useState({
                endpoint: `https://api.census.gov/data/2022/acs/acs5?get=B25077_001E&for=tract:*&in=state:21&in=county:067`,
                key: `${Config.categories['Demographics'].title} Category Default Mapped Variable: ${Config.categories['Demographics'].defaultMappedVariable.label}`,
                transformationType: Config.categories['Demographics'].defaultMappedVariable.transformationType
            });
            console.log('endpointsAndKeys:', endpointsAndKeys)

    const {setSelectedCategory, selectedGeography, setGlobalData, selectedCategory, setSelectedGeography} = useContext(GlobalStateContext);
  
    const handleSelectCategory = (categoryKey) => {
      setSelectedCategory(categoryKey);
    
    //     const category = Config.categories[categoryKey];

    //     const newEndpointsAndKeys = [
    //         {
    //             endpoint: category.defaultMappedVariable.endpoint,
    //             key: `${category.title} Category Default Mapped Variable: ${category.defaultMappedVariable.label}`,
    //             transformationType: category.defaultMappedVariable.transformationType
    //         },
    //         // ...category.visualization.map(visualization => ({
    //         //     endpoint: visualization.endpoint || "yet to be populated",
    //         //     key: `${category.title} Category Visualization: ${visualization.title} (${visualization.type})`,
    //         //     transformationType: visualization.transformationType || "yet to be populated",
    //         //     dataFormat: visualization.sampleData || "yet to be populated"
    //         // }))
    //     ];

    //     console.log('newEndpointsAndKeys:', newEndpointsAndKeys)

    //   setEndpointsAndKeys(newEndpointsAndKeys);
    };

    // useDataFetcher(endpointsAndKeys, selectedGeography, setGlobalData, selectedCategory);
    
    return (
      <div className="categories-panel col-span-1 h-screen overflow-auto">
<RadioGroup value={selectedGeography} onChange={setSelectedGeography} className="bg-blue-100 p-4 rounded-lg shadow m-2 mb-4">
  <RadioGroup.Label className="text-blue-800 font-semibold mb-2">Study Area</RadioGroup.Label>
  {Object.entries(geographies).map(([key, value]) => (
  <RadioGroup.Option
    key={key}
    value={key}
    className="relative flex items-center p-2 rounded-lg cursor-pointer
               transition duration-300 ease-in-out
               bg-white hover:bg-blue-50 active:bg-blue-100
               text-black hover:text-blue-700 active:text-blue-800
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-blue-50
               ui-checked:bg-blue-500 ui-checked:text-white m-2"
  >
    <CheckIcon className="w-5 h-5 text-blue-600 hidden ui-checked:block" />
    {value}
  </RadioGroup.Option>
))}
</RadioGroup>
        {Object.keys(Config.categories).map((categoryKey) => (
          <Disclosure
            key={Config.categories[categoryKey].title}
            as="div"
            className="m-2"
          >
            {({ open }) => (
              <>
                <Disclosure.Button
                  // key={geojsonData}
                  className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
                  onClick={() => handleSelectCategory(categoryKey)}
                >
                  {categoryKey}
                  <ChevronUpIcon
                    className={`${
                      open ? "transform rotate-180" : ""
                    } w-5 h-5 text-blue-500`}
                  />
                </Disclosure.Button>
                <Disclosure.Panel className="m-2 px-4 pt-4 pb-2 text-sm text-gray-500 transition duration-500 ease-out">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <p>{Config.categories[categoryKey].overview}</p>
                    {/*loops over visualizations in category object */}
                    {Config.categories[categoryKey].visualization.map(
                      (visualization) => (
                        <div key={visualization.title} className="m-2">
                          <h2>{visualization.title}</h2>
                          <p>{Config.categories[categoryKey].impact}</p>
                          <visualization.VisualizationComponent
                            data={visualization.data}
                            options={visualization.options}
                            title={visualization.title}
                          />
                          <h2>Questions</h2>
                          <ol className="text-left">
                            {Config.categories[categoryKey].questions.map(
                              (question) => (
                                <li key={question}>{question}</li>
                              )
                            )}
                          </ol>
                        </div>
                      )
                    )}
                  </div>
                </Disclosure.Panel>
              </>
            )}
          </Disclosure>
        ))}
        <div className="m-2 border h-full border-gray-200 rounded-lg">
          <p>Information about Project</p>
          {/* Charts and additional content will go here */}
        </div>
      </div>
    );
};

export default CategoriesPanel;
