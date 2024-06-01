import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import PropTypes from 'prop-types';
import { formatData } from '../../utils/dataProcessingUtils';
import { appConfig, referenceData } from '../../config/config';
import generateVariablesReference from '../../utils/generateVariables';

const Legend = ({ selectedVariable, selectedGeography, breaks, colors}) => {
  const map = useMap();
  generateVariablesReference(referenceData.categories);
  const format = referenceData.variables[selectedVariable].format;
  
  useEffect(() => {
    const legend = L.control({ position: 'topright', class: 'w=1/2' });
    // // console.log('selectedVariable.format);', selectedVariable);
    legend.onAdd = () => {

      const formattingSuffix = {
        "percentage": '%',
        "percentageDifference": '%',
        "ratePerThousand": ' per 1,000 residents',
        "currency": '',
        "none": ''
      };

      const div = L.DomUtil.create('div', 'bg-white p-4 rounded-lg shadow m-2 mb-4 text-gray-500');
      div.innerHTML = `
        <h2 class="text-2xl text-neutral-500">${appConfig.geographies[selectedGeography].label}</h2>
        <h3 class="text-lg text-left text-pretty text-neutral-500">${selectedVariable}</h3>`;

        if (breaks) {
          // console.log('breaks:', breaks)
          for (let i = 0; i < breaks.length; i++) {
            let startingBreak, endingBreak;
  
            if (format) {
              startingBreak = formatData(breaks[i], format);
              endingBreak = breaks[i + 1] ? formatData(breaks[i + 1], format): null;
            } else {
              startingBreak = breaks[i];
              endingBreak = breaks[i + 1];
            } 
  
            const label = format && format !== 'none'
              ? endingBreak
                ? `${startingBreak} -- ${endingBreak + formattingSuffix[format]}` 
                : format === "ratePerThousand" ? `${startingBreak}+ ${formattingSuffix[format]}` : `${startingBreak + formattingSuffix[format]} +`
              : endingBreak
                ? `${startingBreak} -- ${endingBreak}` 
                : `${startingBreak} +`
  
            div.innerHTML += `
              <div class="flex items-center gap-2 bg-black-100">
                <span class="group flex size-5 items-center justify-center rounded-full border" style="background-color:${colors[i]}">
                  <span class="invisible size-2 rounded-full" style="background-color:${colors[i]}"></span>
                </span>
                <label>${label}</label>
              </div>`;
          }
        }

      return div;
    };

    legend.addTo(map);

    return () => {
      map.removeControl(legend);
    };
  }, [map, selectedVariable, selectedGeography, breaks, colors]);

  return null;
};

Legend.propTypes = {
  selectedVariable: PropTypes.string.isRequired,
  selectedGeography: PropTypes.string.isRequired,
  breaks: PropTypes.array.isRequired,
  colors: PropTypes.array.isRequired
};

export default Legend;
