import { useEffect } from 'react';
import { transformData } from '../utils/transform';

const useDataFetcher = (endpointsAndKeys, selectedGeography, setGlobalData) => {
  useEffect(() => {
    const fetchData = async () => {
      const keys = Object.keys(endpointsAndKeys);
      for (const key of keys) {
        try {
          const response = await fetch(`${endpointsAndKeys[key].endpoint}&key=${import.meta.env.VITE_APP_API_KEY}`);

          const data = await response.json();
          /////////////////////////////////////////
          // if transformationType is defined, parse the data
          if (endpointsAndKeys[key].transformationType) {
            
            // console.log(
            //   "data: ", data,
            //   " geography: ", selectedGeography,
            //   " transformationType: ", endpointsAndKeys[key].transformationType);
              // uses the useDataTransformer function to transform the data
            const transformedData = transformData(data, selectedGeography, endpointsAndKeys[key].transformationType);
            console.log("transformedData: ", transformedData);
            // Update the globalData state with the parsed data
            setGlobalData(prevData => ({
              ...prevData,
              [endpointsAndKeys[key].key]: transformedData,
            }));
          } else {
            // If transformationType is not defined, store the data as is
            console.error('No transformationType defined for endpoint:', endpointsAndKeys[key].endpoint);
          }
        } catch (error) {
          console.error(`Failed to fetch data from endpoint: ${JSON.stringify(endpointsAndKeys[key].endpoint)}`, error);
        }
      }
    }
    fetchData();
  }, [endpointsAndKeys, selectedGeography, setGlobalData]);
}

export default useDataFetcher;