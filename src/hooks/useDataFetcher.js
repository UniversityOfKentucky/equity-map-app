import { useEffect } from 'react';

const useDataFetcher = (selectedCategory, setGlobalData) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.census.gov/data/2022/acs/acs5?get=B01001_001E&for=state%3A21&key=648f41eb22438d2f70b071d809f753df5c5c66e9`);
        const data = await response.json();
        // Update globalData with fetched data
        setGlobalData(prevData => ({
          ...prevData,
          [selectedCategory]: [data],
        }));
      } catch (error) {
        console.error("Failed to fetch data for category:", selectedCategory, error);
      }
    };

    if (selectedCategory) {
      fetchData();
    }
  }, [selectedCategory, setGlobalData]);
};

export default useDataFetcher;
