import { useEffect } from 'react';

const useDataFetcher = (endpointsAndKeys, setGlobalData) => {
  useEffect(() => {
    const fetchData = async () => {
      const keys = Object.keys(endpointsAndKeys);
      for (const key of keys) {
        try {
          const response = await fetch(endpointsAndKeys[key].endpoint);
          const data = await response.json();
          // Update the globalData state with the fetched data
          setGlobalData(prevData => ({
            ...prevData,
            [endpointsAndKeys[key].key]: data,
          }));
        } catch (error) {
          console.error(`Failed to fetch data from endpoint: ${JSON.stringify(endpointsAndKeys[key].endpoint)}`, error);
        }
      }
    }
    fetchData();
  }, [endpointsAndKeys, setGlobalData]);
}

export default useDataFetcher;