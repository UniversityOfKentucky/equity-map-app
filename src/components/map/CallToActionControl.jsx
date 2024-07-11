import PropTypes from "prop-types";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

const CallToActionControl = ({ setIsTourOpen }) => {
  const map = useMap();

  const ctaControl = L.control({ position: "bottomleft" });

  ctaControl.onAdd = () => {
    const div = L.DomUtil.create("div", "cta-button-container");
    div.innerHTML = `
      <button
        class="bg-blue-100 text-blue-700 hover:bg-blue-200 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75 p-2 rounded-lg w-3/4 m-2 cta-button"
        id="cta-button"
      >
        Reopen Tour
      </button>
    `;

    return div;
  };

  // Adds the control to the map only once
  if (!map.ctaControl) {
    ctaControl.addTo(map);
    map.ctaControl = ctaControl;
  }

  // Attaches the click event listener to the button after it has been added to the map
  useEffect(() => {
    const button = document.getElementById("cta-button");
    if (button) {
      button.addEventListener("click", () => setIsTourOpen(true));
    }

    return () => {
      if (button) {
        button.removeEventListener("click", () => setIsTourOpen(true));
      }
    };
  }, [setIsTourOpen]);

  return null;
};

CallToActionControl.propTypes = {
  setIsTourOpen: PropTypes.func.isRequired,
};

export default CallToActionControl;