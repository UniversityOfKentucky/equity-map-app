import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Field,
  Label,
  Radio,
  RadioGroup,
} from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { appConfig, referenceData } from "../../config/config";
import propTypes from "prop-types";
import { useMemo } from "react";
import generateVariablesReference from "../../utils/generateVariables";

const VariableSelector = ({
  selectedVariable,
  setSelectedVariable,
  selectedGeography,
}) => {
  useMemo(() => {
    referenceData.variables = generateVariablesReference(
      referenceData.categories
    );
  }, []);

  const isGeographyAvailable = (variableKey) => {
    const variableDataset =
      referenceData.variables[variableKey].dataset.displayedDataset;
    const availableGeographies =
      referenceData.censusDataAPIs[variableDataset].geographiesAvailable;
    let selectedGeosType =
      appConfig.geographies[selectedGeography].typeOfGeography;
    return availableGeographies.includes(selectedGeosType);
  };

  return (
    <div className="category-selector m-2 border border-gray-200 rounded-lg">
      {/* Loop over the categories in the referenceData object creating an element for each which will hold selection elements for the categories' subcategories and variables */}
      {Object.keys(referenceData.categories).map((categoryKey) =>
        categoryKey !== "_reference" ? (
          <Disclosure
            as="div"
            className="m-2 border h-full border-gray-200 rounded-lg"
            key={categoryKey}
          >
            {({ False }) => (
              <>
                <DisclosureButton className="flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75">
                  {categoryKey}
                  <ChevronUpIcon
                    className={`${
                      open ? "transform rotate-180" : ""
                    } w-5 h-5 text-blue-500`}
                  />
                </DisclosureButton>
                <DisclosurePanel className="m-2 px-4 pt-4 pb-2 text-sm text-gray-500 transition duration-500 ease-out">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    {/* Loop over the subcategories in the category object*/}
                    {Object.keys(
                      referenceData.categories[categoryKey].data.subcategories
                    ).map((subcategoryKey) =>
                      Object.keys(
                        referenceData.categories[categoryKey].data
                          .subcategories[subcategoryKey]
                      ).some((variableKey) =>
                        isGeographyAvailable(variableKey)
                      ) ? (
                        <div key={subcategoryKey} className="m-2">
                          <h2 className="font-bold text-lg">
                            {subcategoryKey}
                          </h2>
                          <RadioGroup
                            value={selectedVariable}
                            onChange={setSelectedVariable}
                            className="bg-blue-100 p-4 rounded-lg shadow m-2 mb-4"
                          >
                            {/* Loop over the variables in the subcategory object creating an element for each which will hold the selection element for the variable */}
                            {Object.keys(
                              referenceData.categories[categoryKey].data
                                .subcategories[subcategoryKey]
                            ).map(
                              (variableKey) =>
                                isGeographyAvailable(variableKey) ? (
                                  <Field
                                    key={variableKey}
                                    className="flex items-stretch gap-2 self-start"
                                  >
                                    <Radio
                                      value={variableKey}
                                      className="group flex size-5 items-center justify-center rounded-full border bg-white data-[checked]:bg-blue-400"
                                    >
                                      <span className="invisible size-2 rounded-full bg-white group-data-[checked]:visible flex-wrap" />
                                    </Radio>
                                    <Label className="text-left">
                                      {variableKey}
                                    </Label>
                                    {/* <Description className="opacity-50">{variableKey.description}</Description>
                              // To be added to the config file for each variable to provide a description of the variable to the user
                              */}
                                  </Field>
                                ) : null
                              // (
                              // <Field key={variableKey} className="flex items-stretch gap-2 self-start">
                              //   <Radio
                              //     value={variableKey}
                              //     className="group flex size-5 items-center justify-center rounded-full border bg-white data-[checked]:bg-blue-400"
                              //     disabled
                              //   >
                              //     <span className="invisible size-2 rounded-full bg-white group-data-[checked]:visible flex-wrap" />
                              //   </Radio>
                              //   <Label className="text-left opacity-50" title="This variable is not available for the selected geography">
                              //     {variableKey}
                              //   </Label>
                              // </Field>
                              // )
                            )}
                          </RadioGroup>
                        </div>
                      ) : null
                    )}
                  </div>
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        ) : null
      )}
    </div>
  );
};

VariableSelector.propTypes = {
  selectedVariable: propTypes.string.isRequired,
  setSelectedVariable: propTypes.func.isRequired,
  selectedGeography: propTypes.string.isRequired,
};

export default VariableSelector;
