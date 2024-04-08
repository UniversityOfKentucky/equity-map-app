import { useEffect } from 'react';

/**
 * A generic data fetching hook that can fetch data based on a key (e.g., selectedCategory)
 * and update the global state. An optional updater function can be provided for custom update logic.
 * 
 * @param {string} key - The key to fetch data for (e.g., 'selectedCategory').
 * @param {Function} setGlobalData - The state setter function for the global data.
 * @param {Function} [updater] - Optional. Custom function to update the global state with fetched data.
 */
const useDataFetcher = (key, setGlobalData, updater) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.census.gov/data/2022/acs/acs5?get=B01001_001E&for=state%3A21&key=${import.meta.env.VITE_APP_API_KEY}`);
        const data = await response.json();
        console.log("Fetched data for key:", key, data);
        // Invoke updater function if provided, else update globalData directly
        setGlobalData(prevData => {
          const update = updater ? updater(prevData[key], data) : data;
          return {
            ...prevData,
            [key]: update,
          };
        });
      } catch (error) {
        console.error("Failed to fetch data for key:", key, error);
      }
    };

    if (key) {
      fetchData();
    }
  }, [key, setGlobalData, updater]); // Include updater in the dependency array
};

export default useDataFetcher;
