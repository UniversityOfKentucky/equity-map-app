import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Field,
  Label,
  Checkbox,
  Description,
} from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from '@heroicons/react/16/solid';
import { appConfig, referenceData } from "../../config/config";
import propTypes from "prop-types";
import { useMemo, useState, useEffect } from "react";
import generateVariablesReference from "../../utils/generateVariables";

const VariableSelector = ({
  selectedVariable,
  setSelectedVariable,
  comparisonVariable,
  setComparisonVariable,
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

  // Initialize selectedVariables state with the selectedVariable prop
  const [selectedVariables, setSelectedVariables] = useState([selectedVariable]);
  const [showLimitMessage, setShowLimitMessage] = useState(false); // * State to manage limit message
  const [limitMessageVariable, setLimitMessageVariable] = useState(null); // * State to manage variable key of limit message

  useEffect(() => {
    if (selectedVariables.length === 2) {
      setComparisonVariable(selectedVariables[1]);
    } else {
      setComparisonVariable(null);
    }
    setSelectedVariable(selectedVariables[0] || null);
  }, [selectedVariables, setSelectedVariable, setComparisonVariable]);

  // Handler to manage variable selection with a limit of two
  const handleVariableChange = (variable) => {
    if (selectedVariables.includes(variable)) {
      // If the variable is already selected, remove it
      const newVariables = selectedVariables.filter((v) => v !== variable);
      setSelectedVariables(newVariables);
      // console.log("Selected Variables:", newVariables);
      setShowLimitMessage(false); // * Hide limit message
    } else if (selectedVariables.length < 2) {
      // If less than two variables are selected, add the new one
      const newVariables = [...selectedVariables, variable];
      setSelectedVariables(newVariables);
      // console.log("Selected Variables:", newVariables);
      setShowLimitMessage(false); // * Hide limit message
    } else {
      // console.log("Cannot select more than two variables.");
      setLimitMessageVariable(variable); // * Set variable key of limit message
      setShowLimitMessage(true); // * Show limit message
    }
  };

  return (
    <div className="variable-selector m-2 border border-gray-200 rounded-lg">
      <h1 className="font-bold text-xl text-pretty m-2">
        Target Populations and General Equity Indicators
      </h1>
      {Object.keys(referenceData.categories).map((categoryKey) =>
        categoryKey !== "_reference" ? (
          <Disclosure
            as="div"
            className="m-2 border h-full border-gray-200 rounded-lg"
            key={categoryKey}
            // * Add defaultOpen prop for "Demographics (Total Population)" category
            defaultOpen={categoryKey === "Demographics (Total Population)"}
          >
            {({ open }) => (
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
                          {Object.keys(
                            referenceData.categories[categoryKey].data
                              .subcategories[subcategoryKey]
                          ).map((variableKey, index) => (
                            isGeographyAvailable(variableKey) && (
                              <div key={variableKey}>
                                {showLimitMessage && limitMessageVariable === variableKey && (
                                  <div className="text-red-500 text-sm mb-2">
                                    You can only select up to two variables at a time.
                                  </div>
                                )}
                                <Field className="flex items-stretch gap-2 self-start">
                                  <Checkbox
                                    value={variableKey}
                                    checked={selectedVariables.includes(variableKey)}
                                    onChange={() => handleVariableChange(variableKey)}
                                    className="group size-6 rounded-md bg-white/10 p-1 ring-1 ring-white/15 ring-inset data-[checked]:bg-white m-1"
                                  >
                                    <CheckIcon className="hidden size-4 fill-black group-data-[checked]:block" />
                                  </Checkbox>
                                  <Label className="text-left">
                                    {variableKey}
                                    <Description>
                                      {selectedVariables.includes(variableKey) || comparisonVariable === variableKey ? (
                                        <span className="text-xs text-gray-400">
                                          Dataset:{" "}
                                          {referenceData.censusDataAPIs[
                                            referenceData.variables[variableKey].dataset.displayedDataset
                                          ].datasetName}
                                        </span>
                                      ) : null}
                                    </Description>
                                  </Label>
                                </Field>
                              </div>
                            )
                          ))}
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
      {/* * Add a user-friendly message */}
      <div className="text-sm text-gray-700 mt-4">
        Please note: You can select up to two variables at a time for comparison.
      </div>
    </div>
  );
};

VariableSelector.propTypes = {
  selectedVariable: propTypes.string.isRequired,
  setSelectedVariable: propTypes.func.isRequired,
  comparisonVariable: propTypes.string,
  setComparisonVariable: propTypes.func.isRequired,
  selectedGeography: propTypes.string.isRequired,
};

export default VariableSelector;