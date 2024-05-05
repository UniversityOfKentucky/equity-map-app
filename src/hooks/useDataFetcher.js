import { useState, useEffect } from 'react';
import { transformData } from '../utils/transform';

const useDataFetcher = (endpointsAndKeys, selectedGeography, setGlobalData) => {

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
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
            setError('No transformationType defined for endpoint:', endpointsAndKeys[key].endpoint);
          }
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
      }
      }
    }
    fetchData();
  }, [endpointsAndKeys, setGlobalData]);
}

export default useDataFetcher;