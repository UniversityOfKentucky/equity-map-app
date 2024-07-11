import PropTypes from "prop-types";
import { useMap } from "react-leaflet";
import { appConfig } from "../../config/config";

const GeographyTitle = ({ selectedGeography }) => {
    const map = useMap();
    const title = appConfig.geographies[selectedGeography].label;
    const titleControl = L.control({ position: "topleft"});
    titleControl.onAdd = () => {
        const div = L.DomUtil.create("div", "bg-white p-1 rounded-lg shadow m-1 mb-4 text-gray-500 geography-title");
        div.innerHTML = `
      <h2 class="text-2xl text-neutral-500">${title}</h2>
    `;
        return div;
    };

    // ensures title is only added to the map once
    if (!map.titleControl) {
        titleControl.addTo(map);
        map.titleControl = titleControl;
    }

    return null;
};



GeographyTitle.propTypes = {
    selectedGeography: PropTypes.string.isRequired,
};
export default GeographyTitle;
