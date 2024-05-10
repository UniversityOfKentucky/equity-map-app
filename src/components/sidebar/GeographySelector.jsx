import { appConfig } from "../../config/config.js";
// import useDataFetch from '../../hooks/useCustomFetch.js';
import { Field, Label, Radio, RadioGroup } from "@headlessui/react";
import PropTypes from "prop-types";

const GeographySelector = ({ selectedGeography, setSelectedGeography }) => {
  return (
    // Initially, the selectedGeography state variable is set to the initialGeography property in the appConfig object. This is the default geography that is visualized in the map when the app is first loaded. The setSelectedGeography function is used to update the selectedGeography state variable when the user selects a new geography.
    <div className="geography-selector m-2 border border-gray-200 rounded-lg">
      <RadioGroup
        value={selectedGeography}
        onChange={setSelectedGeography}
        className="bg-blue-100 p-4 rounded-lg shadow m-2 mb-4"
      >
        {Object.keys(appConfig.geographies).map((geographyKey) => (
          <Field key={geographyKey} className="flex items-center gap-2">
            <Radio
              value={geographyKey}
              className="group flex size-5 items-center justify-center rounded-full border bg-white data-[checked]:bg-blue-400"
            >
              <span className="invisible size-2 rounded-full bg-white group-data-[checked]:visible" />
            </Radio>
            <Label>{appConfig.geographies[geographyKey].label}</Label>
          </Field>
        ))}
      </RadioGroup>
    </div>
  );
};

GeographySelector.propTypes = {
  selectedGeography: PropTypes.string.isRequired,
  setSelectedGeography: PropTypes.func.isRequired,
};

export default GeographySelector;
