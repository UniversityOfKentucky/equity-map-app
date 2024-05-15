import chroma from "chroma-js";

const appConfig = { // This object defines the configuration settings for the app. It includes the default settings for the app, such as the initial geography, category, and subcategory to be displayed, as well as the available geographies, categories, and subcategories that are rendered in the SelectionPanel. It also includes the default variables that are visualized in the map features' popups by default (in contrast to the user-selected variable visualization (which is also displayed in the popups after selection). These settings can be customized to fit the specific needs of the app.
geographies: {
    fayetteCountyTracts: {
      label: "Fayette County",
      geoCodeField: "TRACTCE", // This property is used to match the location code in the geojson features with the location code in the census data. It must be a unique identifier for each feature in the geojson file.
      apiEndpoints: {
        countyFIPScode: "067",
        stateFIPScode: "21",
        apiQuery: "tract:*&in=state:21&in=county:067",
      },

      geoJSONfileName: "tracts.geojson",
      mapSettings: {
        center: [38, -84.5037],
        zoom: 11,
        minZoom: 11,
        maxZoom: 18
      }
    },
    kentuckyMSAs: {
      label: "Kentucky Metro Statistical Areas",
      geoCodeField: "GEOID", 
      apiEndpoints: {
        // Lexington-Fayette, KY MSA
        MSAFIPScode: "30460", // Not used in the current implementation. This is an example of how a specific MSA FIPS code can be defined for fetching data.
        apiQuery: "metropolitan%20statistical%20area/micropolitan%20statistical%20area:30460,17300,23180,23190,23980,25775,31580,32460,37140,49080,21060,14540,18340,34460,36980,43700,15820,17140,19220,34660,26580,31140,33180,382107",

      }, // All MSA FIPS codes for Kentucky
      geoJSONfileName: "msa.geojson",
      mapSettings: {
        center: [37.7153, -85.8569],
        zoom: 7.25, 
        minZoom: 7.25, 
        maxZoom: 18
      }
    },
    kentuckyCounties: {
      label: "Kentucky Counties",
      geoCodeField: "COUNTYFP",
      apiEndpoints: {
        stateFIPScode: "21",
        apiQuery: "county:*&in=state:21",
      },
      geoJSONfileName: "counties.geojson",
      mapSettings: {
        center: [37.8223, -85.7682],
        zoom: 7.25,
        minZoom: 7.25,
        maxZoom: 18
      }
    },
  },
initialGeography: "fayetteCountyTracts", // This is the default geography that is visualized in the map when the app is first loaded.
initialCategory: "Demographics", // This is the default category that is visualized in the SelectionPanel when the app is first loaded.
initialSubcategory: "Age and Gender", // This is the default subcategory that is visualized in the SelectionPanel when the app is first loaded.
popupVisualizationsVariables: [
  "Total Population",
  "Median Household Income",
  "Percentage of Population with a Bachelor's Degree or Higher",
  "Percentage Without Health Insurance",
  "Median Value of Owner-Occupied Housing Units",
  "Percent Self-Employed",
], // These are the variables that are always visualized in the map features' popups by default (in contrast to the user-selected variable visualization (which is also displayed in the popups after selection). They do not change based on user selection. Ensure they are properly defined and nested in the categories object below to ensure proper fetching and data transformation.
initialTimePeriod: "2022", // This is the default time period for the data. In the current implementation, this must be a single year (not a range, such as "2012-2017"). This value is used in the API call to the Census Bureau and though only one year is passed, in the case of the ACS 5 year dataset, the data is still an estimate based on the five years ending in the selected year).
colorScale: chroma.scale(['rgb(219, 234, 254)', 'rgb(59, 130, 246)']).mode('lch').colors(6), // This is the color scale used to color the map features based on the normalized values of the selected variable.

};

// how to run js file in term



const referenceData = { // This object defines the reference data for the app. It includes the API endpoints, syntax for querying different geographies, categories, subcategories, and variables, as well as the transformation and formatting types that can be applied to the data. This data is used to fetch, process, and display the data in the app. It can be customized to fit the specific needs of the app.
    
    // Note:
        // Before adding a new variable, dataset, or geography, it is important to double-check the Census Bureau API documentation to ensure the data is available and the syntax is correct.
            // Variables, years, and geographies available in the Census Bureau API can vary between datasets. 
                    // Sometimes the same variable is available between two datasets but the variable code is different. Sometimes, a variable's variable code is different from year to year, even in the same dataset! 
                    // Sometimes the geographies available for a given dataset vary between years.
                    // Sometimes the api syntax for querying the data is different even for the same variable in the same dataset between years.
        // There are many such inconsistencies, and unfortunately, the Census Bureau documentation is not always clear or consistent or available. 
        // For working with ACS data specifically, I recommend using the Census Reporter website to find the variable codes and geographies you need > http://censusreporter.org/

    // To add a new variable from the Census Bureau API:
        // If the variable is available in an existing dataset:
            // 1. Add the variable to the appropriate category and subcategory in the categories object below. This placement is arbitrary and can be adjusted to fit the app's organization.
            // 2. Define the dataset, variable code, transformation type, base code, base label, and format for the variable in the categories object below.
        // If the variable is in a new dataset:
            // 1. Refer to the Census Bureau API documentation to find/doublecheck the appropriate dataset, variable codes, and syntax for querying the data.
            // 2. Add the dataset to the censusDataAPIs object below.
            // 3. Adjust the geographiesAPISyntax object to include the syntax for the new dataset if needed.
            // 4. Follow the steps above to add the variable to the appropriate category and subcategory in the categories object below.

  censusAPIUtilities: {
    "Census TIGERweb GeoServices REST API": {
      description: "Access to geographic and cartographic boundary data",
      apiReference: `https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/{layer}`,
    },
    "Census Geocoding Services": {
      description: "Provides batch and single-address geocoding services",
      apiReference: `https://geocoding.geo.census.gov/geocoder/{endpoints}`,
    },
  },
  geographiesAPISyntax: {
    // This non-exhaustive object defines the syntax for the different geographies that can be queried in the Census Bureau API. Not all datasets are available for all geographies. The syntax must be properly formatted according to the Census Bureau API documentation. Visit https://www.census.gov/data/developers/data-sets.html for more information.
    States: {
      allStates: '&for=state:*',
      specificState: '&for=state:${stateFIPScode}',
    },
    Counties: {
      allCounties: '&for=county:*',
      allCountiesInState: '&for=county:*&in=state:${stateFIPScode}',
      specificCounty: '&for=county:${countyFIPScode}&in=state:${stateFIPScode}',
    },
    "Metropolitan Statistical Areas": {
      allMSAs: '&for=metropolitan%20statistical%20area/micropolitan%20statistical%20area:*',
      specificMSA: '&for=metropolitan%20statistical%20area/micropolitan%20statistical%20area:${MSAFIPScode}',
    },
    "Congressional Districts": '&for=congressional%20district:*',
    Places: '&for=place:*',
    "Census Tracts": {
      allTracts: '&for=tract:*',
      allTractsInCounty: '&for=tract:*&in=state:${stateFIPScode}&in=county:${countyFIPScode}',
      specificTract: '&for=tract:${tractFIPScode}&in=state:${stateFIPScode}&in=county:${countyFIPScode}',
    },
    "Block Groups": '&for=block%20group:*',
    Blocks: '&for=block:*',
    "Cities and Towns": '&for=place:*',
    "ZIP Code Tabulation Areas": '&for=zip%20code%20tabulation%20area:*',
    Regions: '&for=region:*',
    },
  categories: {
    _reference: {
      "Category Title": {
        // This object defines the categories that are rendered in the SelectionPanel. To add a new category, add a new key-value pair to this object.
        "Subcategory Title": {
          // This object defines the subcategories that are rendered in the SelectionPanel under their associated Category. To add a new subcategory, add a new key-value pair to this object.
          "Variable Label": {
            // The variable label is the name that is displayed in the SelectionPanel. It should be a human-readable name that describes the variable.
            dataset: "datasetSlug", // The dataset is a string that specifies the dataset to be used in the API call. It must be equal to a key defined in the censusDataAPIs object below.
            variableCode: "XXXXX_XXXE", // The variable code is the unique identifier for the variable in the Census Bureau API. It is used in the API call to fetch the data. Many variables require multiple variable codes, separated by commas.
            // For instance, in the case of "Educational Attainment" below, the variable code is a list of all the codes for the different levels of educational attainment.
            // In this case, the app will fetch data for all the codes and then process the data as an array.
            transformationType: "none", // The transformationType is a string that specifies the type of transformation to be applied to the data. If no transformation is needed, set this value to "none". If a transformation is needed, set this value to the appropriate transformation type (e.g., "percentage", "summedPercentage", "ratePerThousand", "convertToCurrency"), etc. The transformationType specified, must be defined in the transform function in the dataTransformUtils.js file.
            baseCode: "XXXXX_XXXE", // The baseCode is the variable code of the variable that is used as the base value for the transformation and used to calculate the transformed value. For instance, in the case of a percentage transformation, the base value is used to calculate the percentage of the variable value. This is only needed if the transformationType is not "none".
            baseLabel: "Total Population", // The baseLabel is used to indicate the base value in the user interface. It is a human-readable label that describes the base value. This is only needed if the transformationType is not "none".
            format: "currency", // The format is a string that specifies how the data should be formatted for display. If no formatting is needed, set this value to "none". If formatting is needed, set this value to the appropriate format type (e.g., "percentage", "currency", "ratePerThousand"), etc. The format specified, must be defined in the formatData function in the dataProcessingUtils.js file.
          },
        },
      },
    },
    "Demographics": {
      data: {
        subcategories: {
          "Age and Gender": {
            "Total Population": {
              dataset: "acs5, acs1",
              variableCode: "B01001_001E",
              format: "none",
            },
            "Male Population": {
              dataset: "acs5, acs1",
              variableCode: "B01001_002E",
              transformationType: "percentage",
              baseCode: "B01001_001E",
              baseLabel: "Total Population",
              format: "percentage",
            },
            "Female Population": {
              dataset: "acs5, acs1",
              variableCode: "B01001_026E",
              transformationType: "percentage",
              baseCode: "B01001_001E",
              baseLabel: "Total Population",
              format: "percentage",
            },
          },
          "Race and Ethnicity": {
            "White Alone": {
              dataset: "acs5, acs1",
              variableCode: "B02001_002E",
              transformationType: "percentage",
              baseCode: "B01001_001E",
              baseLabel: "Total Population",
              format: "percentage",
            },
            "Black or African American Alone": {
              dataset: "acs5, acs1",
              variableCode: "B02001_003E",
              transformationType: "percentage",
              baseCode: "B01001_001E",
              baseLabel: "Total Population",
              format: "percentage",
            },
            "Hispanic or Latino": {
              dataset: "acs5, acs1",
              variableCode: "B03001_003E",
              transformationType: "percentage",
              baseCode: "B01001_001E",
              baseLabel: "Total Population",
              format: "percentage",
            },
          },
          "Household Types": {
            "Family Households": {
              dataset: "acs5, acs1",
              variableCode: "B11001_002E",
              transformationType: "percentage",
              baseCode: "B11001_001E",
              baseLabel: "Total Households",
              format: "percentage",
            },
            "Non-family Households": {
              dataset: "acs5, acs1",
              variableCode: "B11001_007E",
              transformationType: "percentage",
              baseCode: "B11001_001E",
              baseLabel: "Total Households",
              format: "percentage",
            },
          },
          "Language Spoken At Home": {
            "English Only": {
              dataset: "acs5, acs1",
              variableCode: "C16001_002E",
              transformationType: "percentage",
              baseCode: "B01001_001E",
              baseLabel: "Total Population",
              format: "percentage",
            },
            Spanish: {
              dataset: "acs5, acs1",
              variableCode: "C16001_003E",
              transformationType: "percentage",
              baseCode: "B01001_001E",
              baseLabel: "Total Population",
              format: "percentage",
            },
            "Other Languages": {
              dataset: "acs5, acs1",
              variableCode: "C16001_004E",
              transformationType: "percentage",
              baseCode: "B01001_001E",
              baseLabel: "Total Population",
              format: "percentage",
            },
          },
          "Veterans Status": {
            "Total Veterans": {
              dataset: "acs5, acs1",
              variableCode: "B21001_001E",
              transformationType: "ratePerThousand",
              baseCode: "B01001_001E",
              baseLabel: "Total Population",
              format: "ratePerThousand",
            },
          },
        },
      },
      narrativeElements: {
        subtitle:
          "A Foundational Category for Understanding Socio-Economic and Demographic Dynamics.",
        overview:
          "Demographics provide a snapshot of the population's composition and characteristics. Understanding the demographic makeup of a community is essential for policymakers, businesses, and researchers to make informed decisions and address the needs of diverse populations.",
        questions: [
          "How does the age distribution vary across different communities?",
          "What are the correlations between demographic compositions and socio-economic factors like income and education levels?",
        ],
        keyInsights:
          "Highlight significant findings, trends, and disparities within the data.",
        impact:
          "Discuss the real-world implications of these insights on minorities, women, and veterans.",
        tags: [
          "demographics",
          "socio-economic factors",
          "age distribution",
          "gender composition",
        ],
      },
    },
    "Income & Employment": {
      data: {
        subcategories: {
          Income: {
            "Median Household Income": {
              dataset: "acs5, acs1",
              variableCode: "B19013_001E",
              format: "currency",
            },
            "Per Capita Income": {
              dataset: "acs5, acs1",
              variableCode: "B19301_001E",
              format: "currency",
            },
          },
          Poverty: {
            "Individuals Below Poverty Level": {
              dataset: "acs5, acs1",
              variableCode: "B17001_002E",
              transformationType: "percentage",
              baseCode: "B01001_001E",
              baseLabel: "Total Population",
              format: "percentage",
            },
            "Households Receiving Food Stamps/SNAP": {
              dataset: "acs5, acs1",
              variableCode: "B22010_002E",
              transformationType: "percentage",
              baseCode: "B11001_001E",
              baseLabel: "Total Households",
              format: "percentage",
            },
          },
          Employment: {
            "Labor Force Participation": {
              dataset: "acs5, acs1",
              variableCode: "B23001_001E",
              transformationType: "ratePerThousand",
              baseCode: "B01001_001E",
              baseLabel: "Total Population",
              format: "ratePerThousand",
            },
            "Unemployment Rate": {
              dataset: "acs5, acs1",
              variableCode: "B23025_005E",
              transformationType: "percentage",
              baseCode: "B23025_002E",
              baseLabel: "Labor Force",
              format: "percentage",
            },
          },
          "Industry and Occupation": {
            "Agriculture, Forestry, Fishing": {
              dataset: "acs5, acs1",
              variableCode: "B24020_003E",
              transformationType: "percentage",
              baseCode: "B23001_001E",
              baseLabel: "Labor Force Population",
              format: "percentage",
            },
            "Education, Health Care, Social Assistance": {
              dataset: "acs5, acs1",
              variableCode: "B24020_019E",
              transformationType: "percentage",
              baseCode: "B23001_001E",
              baseLabel: "Labor Force Population",
              format: "percentage",
            },
            "Professional, Scientific, Management": {
              dataset: "acs5, acs1",
              variableCode: "B24020_015E",
              transformationType: "percentage",
              baseCode: "B23001_001E",
              baseLabel: "Labor Force Population",
              format: "percentage",
            },
          },
        },
      },
      narrativeElements: {
        subtitle: "Central to Equality and Economic Opportunity Discussions.",
        overview:
          "An analysis of income levels, sources, employment rates, and their relationship with other socio-economic factors.",
        questions: [
          "Which areas show the most significant disparities in income distribution?",
          "How does employment status affect poverty levels in different communities?",
        ],
        keyInsights:
          "Highlight significant findings, trends, and disparities within the data.",
        impact:
          "Discuss the real-world implications of these insights on policy and individual communities.",
        tags: ["income distribution", "employment rates", "poverty levels"],
      },
    },
    "Education": {
      data: {
        subcategories: {
          "Educational Attainment": {
            "Less Than High School": {
              dataset: "acs5, acs1",
              variableCode: [
                "B15003_002E",
                "B15003_003E",
                "B15003_004E",
                "B15003_005E",
                "B15003_006E",
                "B15003_007E",
                "B15003_008E",
                "B15003_009E",
                "B15003_010E",
                "B15003_011E",
                "B15003_012E",
                "B15003_013E",
                "B15003_014E",
                "B15003_015E",
                "B15003_016E",
              ],
              transformationType: "summedPercentage",
              baseCode: "B01001_001E",
              baseLabel: "Total Population",
              format: "summedPercentage",
            },
            "High School Graduate": {
              dataset: "acs5, acs1",
              variableCode: "B15003_017E",
              transformationType: "percentage",
              baseCode: "B01001_001E",
              baseLabel: "Total Population",
              format: "percentage",
            },
            "Bachelor's or Higher": {
              dataset: "acs5, acs1",
              variableCode: [
                "B15003_022E",
                "B15003_023E",
                "B15003_024E",
                "B15003_025E",
              ],
              transformationType: "summedPercentage",
              baseCode: "B01001_001E",
              baseLabel: "Total Population",
              format: "summedPercentage",
            },
          },
          "School Enrollment": {
            "Nursery to Grade 4": {
              dataset: "acs5, acs1",
              variableCode: ["B14001_003E", "B14001_004E", "B14001_005E"],
              transformationType: "summedPercentage",
              baseCode: "B01001_001E",
              baseLabel: "Total Population",
              format: "summedPercentage",
            },
            "Grades 5 to 12": {
              dataset: "acs5, acs1",
              variableCode: ["B14001_006E", "B14001_007E", "B14001_008E"],
              transformationType: "summedPercentage",
              baseCode: "B01001_001E",
              baseLabel: "Total Population",
              format: "summedPercentage",
            },
            "College or Graduate School": {
              dataset: "acs5, acs1",
              variableCode: ["B14001_009E", "B14001_010E"],
              transformationType: "summedPercentage",
              baseCode: "B01001_001E",
              baseLabel: "Total Population",
              format: "summedPercentage",
            },
          },
        },
      },
      narrativeElements: {
        subtitle: "Critical for Long-term Socio-economic Mobility.",
        overview:
          "Insights into educational attainment levels, disparities, and impacts on income and employment.",
        questions: [
          "How does educational attainment affect income levels in different demographics?",
          "What is the impact of education on employment opportunities?",
        ],
        keyInsights:
          "Significant findings, trends, and disparities within the data.",
        impact:
          "Real-world implications of these insights on minorities, women, and veterans.",
        tags: [
          "educational attainment",
          "income disparities by education",
          "educational programs impact",
        ],
      },
    },
    "Housing & Infrastructure": {
      data: {
        subcategories: {
          "Ownership and Rent": {
            "Owner-Occupied Units": {
              dataset: "acs5, acs1",
              variableCode: "B25003_002E",
              transformationType: "percentage",
              baseCode: "B25003_001E",
              baseLabel: "Total Housing Units",
              format: "percentage",
            },
            "Renter-Occupied Units": {
              dataset: "acs5, acs1",
              variableCode: "B25003_003E",
              transformationType: "percentage",
              baseCode: "B25003_001E",
              baseLabel: "Total Housing Units",
              format: "percentage",
            },
          },
          "Housing Affordability and Costs": {
            "Median Value of Owner-Occupied Housing Units": {
              dataset: "acs5, acs1",
              variableCode: "B25077_001E",
              format: "currency",
            },
            "Median Gross Rent": {
              dataset: "acs5, acs1",
              variableCode: "B25064_001E",
              format: "currency",
            },
          },
          "Commuting Patterns": {
            "Workers Who Commute by Car, Truck, or Van": {
              dataset: "acs5, acs1",
              variableCode: "B08006_002E",
              transformationType: "percentage",
              baseCode: "B08006_001E",
              baseLabel: "Total Workers Commuting",
              format: "percentage",
            },
            "Public Transportation (excluding taxicab)": {
              dataset: "acs5, acs1",
              variableCode: "B08006_008E",
              transformationType: "percentage",
              baseCode: "B08006_001E",
              baseLabel: "Total Workers Commuting",
              format: "percentage",
            },
          },
        },
      },
      narrativeElements: {
        subtitle: "Reflects Living Standards and Access to Resources.",
        overview:
          "Examination of housing affordability, quality, and access to essential services.",
        questions: [
          "What percentage of income do different demographics spend on housing?",
          "How does access to essential services like healthcare and education vary across communities?",
        ],
        keyInsights:
          "Significant findings, trends, and disparities within the data.",
        impact:
          "Real-world implications of these insights on minorities, women, and veterans.",
        tags: [
          "housing affordability",
          "infrastructure quality",
          "access to services",
        ],
      },
    },
    "Public Health": {
      data: {
        subcategories: {
          "Insurance Coverage": {
            "With Health Insurance": {
              dataset: "acs5, acs1",
              variableCode: "B27001_004E",
              transformationType: "percentage",
              baseCode: "B01001_001E",
              baseLabel: "Total Population",
              format: "percentage",
            },
            "Without Health Insurance": {
              dataset: "acs5, acs1",
              variableCode: "B27001_005E",
              transformationType: "percentage",
              baseCode: "B01001_001E",
              baseLabel: "Total Population",
              format: "percentage",
            },
          },
          Disability: {
            "With a Disability": {
              dataset: "acs5, acs1",
              variableCode: "B18101_004E",
              transformationType: "percentage",
              baseCode: "B01001_001E",
              baseLabel: "Total Civilian Non-institutionalized Population",
              format: "percentage",
            },
          },
        },
      },
      narrativeElements: {
        subtitle: "Highlights Disparities in Health Access and Outcomes.",
        overview:
          "Information on health disparities, access to healthcare, and correlations with socio-economic conditions.",
        questions: [
          "Which communities face the most significant challenges in accessing healthcare?",
          "How do health outcomes correlate with income and education levels?",
        ],
        keyInsights:
          "Significant findings, trends, and disparities within the data.",
        impact:
          "Real-world implications of these insights on minorities, women, and veterans.",
        tags: [
          "public health",
          "health insurance coverage",
          "health facilities distribution",
        ],
      },
    },
    "Entrepreneurship": {
      data: {
        subcategories: {
          "Business Ownership": {
            "Self-Employed in Own Not Incorporated Business Workers": {
              dataset: "acs5, acs1",
              variableCode: "B24080_004E",
              transformationType: "percentage",
              baseCode: "B24080_001E",
              baseLabel: "Total Employed Population",
              format: "percentage",
            },
          },
          "Economic Development Indicators": {
            "Employment Rate": {
              dataset: "acs5, acs1",
              variableCode: "B23025_004E",
              transformationType: "percentage",
              baseCode: "B23025_002E",
              baseLabel: "Labor Force",
              format: "percentage",
            },
          },
        },
      },
      narrativeElements: {
        subtitle:
          "Sheds Light on Economic Activities and Opportunities, with a Focus on Minorities, Women, and Veterans.",
        overview:
          "Characteristics of Business Owners and Businesses, Focusing on Minorities, Women, and Veterans.",
        questions: [
          "What are the characteristics of businesses owned by minorities, women, and veterans?",
          "How does business size and sector distribution vary among different owner demographics?",
        ],
        keyInsights:
          "Significant findings, trends, and disparities within the data.",
        impact:
          "Real-world implications of these insights on minorities, women, and veterans.",
        tags: [
          "entrepreneurship",
          "business ownership demographics",
          "sector analysis",
          "minority-owned businesses",
        ],
      },
    },
  },
  variables: {
    'Total Population': {
      dataset: 'acs5, acs1',
      variableCode: 'B01001_001E',
      transformationType: 'none',
      baseCode: 'none',
      baseLabel: 'none',
      format: 'none'
    },
    'Male Population': {
      dataset: 'acs5, acs1',
      variableCode: 'B01001_002E',
      transformationType: 'percentage',
      baseCode: 'B01001_001E',
      baseLabel: 'Total Population',
      format: 'percentage'
    },
    'Female Population': {
      dataset: 'acs5, acs1',
      variableCode: 'B01001_026E',
      transformationType: 'percentage',
      baseCode: 'B01001_001E',
      baseLabel: 'Total Population',
      format: 'percentage'
    },
    'White Alone': {
      dataset: 'acs5, acs1',
      variableCode: 'B02001_002E',
      transformationType: 'percentage',
      baseCode: 'B01001_001E',
      baseLabel: 'Total Population',
      format: 'percentage'
    },
    'Black or African American Alone': {
      dataset: 'acs5, acs1',
      variableCode: 'B02001_003E',
      transformationType: 'percentage',
      baseCode: 'B01001_001E',
      baseLabel: 'Total Population',
      format: 'percentage'
    },
    'Hispanic or Latino': {
      dataset: 'acs5, acs1',
      variableCode: 'B03001_003E',
      transformationType: 'percentage',
      baseCode: 'B01001_001E',
      baseLabel: 'Total Population',
      format: 'percentage'
    },
    'Family Households': {
      dataset: 'acs5, acs1',
      variableCode: 'B11001_002E',
      transformationType: 'percentage',
      baseCode: 'B11001_001E',
      baseLabel: 'Total Households',
      format: 'percentage'
    },
    'Non-family Households': {
      dataset: 'acs5, acs1',
      variableCode: 'B11001_007E',
      transformationType: 'percentage',
      baseCode: 'B11001_001E',
      baseLabel: 'Total Households',
      format: 'percentage'
    },
    'English Only': {
      dataset: 'acs5, acs1',
      variableCode: 'C16001_002E',
      transformationType: 'percentage',
      baseCode: 'B01001_001E',
      baseLabel: 'Total Population',
      format: 'percentage'
    },
    Spanish: {
      dataset: 'acs5, acs1',
      variableCode: 'C16001_003E',
      transformationType: 'percentage',
      baseCode: 'B01001_001E',
      baseLabel: 'Total Population',
      format: 'percentage'
    },
    'Other Languages': {
      dataset: 'acs5, acs1',
      variableCode: 'C16001_004E',
      transformationType: 'percentage',
      baseCode: 'B01001_001E',
      baseLabel: 'Total Population',
      format: 'percentage'
    },
    'Total Veterans': {
      dataset: 'acs5, acs1',
      variableCode: 'B21001_001E',
      transformationType: 'ratePerThousand',
      baseCode: 'B01001_001E',
      baseLabel: 'Total Population',
      format: 'ratePerThousand'
    },
    'Median Household Income': {
      dataset: 'acs5, acs1',
      variableCode: 'B19013_001E',
      transformationType: 'none',
      baseCode: 'none',
      baseLabel: 'none',
      format: 'currency'
    },
    'Per Capita Income': {
      dataset: 'acs5, acs1',
      variableCode: 'B19301_001E',
      transformationType: 'none',
      baseCode: 'none',
      baseLabel: 'none',
      format: 'currency'
    },
    'Individuals Below Poverty Level': {
      dataset: 'acs5, acs1',
      variableCode: 'B17001_002E',
      transformationType: 'percentage',
      baseCode: 'B01001_001E',
      baseLabel: 'Total Population',
      format: 'percentage'
    },
    'Households Receiving Food Stamps/SNAP': {
      dataset: 'acs5, acs1',
      variableCode: 'B22010_002E',
      transformationType: 'percentage',
      baseCode: 'B11001_001E',
      baseLabel: 'Total Households',
      format: 'percentage'
    },
    'Labor Force Participation': {
      dataset: 'acs5, acs1',
      variableCode: 'B23001_001E',
      transformationType: 'ratePerThousand',
      baseCode: 'B01001_001E',
      baseLabel: 'Total Population',
      format: 'ratePerThousand'
    },
    'Unemployment Rate': {
      dataset: 'acs5, acs1',
      variableCode: 'B23025_005E',
      transformationType: 'percentage',
      baseCode: 'B23025_002E',
      baseLabel: 'Labor Force',
      format: 'percentage'
    },
    'Agriculture, Forestry, Fishing': {
      dataset: 'acs5, acs1',
      variableCode: 'B24020_003E',
      transformationType: 'percentage',
      baseCode: 'B23001_001E',
      baseLabel: 'Labor Force Population',
      format: 'percentage'
    },
    'Education, Health Care, Social Assistance': {
      dataset: 'acs5, acs1',
      variableCode: 'B24020_019E',
      transformationType: 'percentage',
      baseCode: 'B23001_001E',
      baseLabel: 'Labor Force Population',
      format: 'percentage'
    },
    'Professional, Scientific, Management': {
      dataset: 'acs5, acs1',
      variableCode: 'B24020_015E',
      transformationType: 'percentage',
      baseCode: 'B23001_001E',
      baseLabel: 'Labor Force Population',
      format: 'percentage'
    },
    'Less Than High School': {
      dataset: 'acs5, acs1',
      variableCode: [
        'B15003_002E', 'B15003_003E',
        'B15003_004E', 'B15003_005E',
        'B15003_006E', 'B15003_007E',
        'B15003_008E', 'B15003_009E',
        'B15003_010E', 'B15003_011E',
        'B15003_012E', 'B15003_013E',
        'B15003_014E', 'B15003_015E',
        'B15003_016E'
      ],
      transformationType: 'summedPercentage',
      baseCode: 'B01001_001E',
      baseLabel: 'Total Population',
      format: 'percentage'
    },
    'High School Graduate': {
      dataset: 'acs5, acs1',
      variableCode: 'B15003_017E',
      transformationType: 'percentage',
      baseCode: 'B01001_001E',
      baseLabel: 'Total Population',
      format: 'percentage'
    },
    "Bachelor's or Higher": {
      dataset: 'acs5, acs1',
      variableCode: [ 'B15003_022E', 'B15003_023E', 'B15003_024E', 'B15003_025E' ],
      transformationType: 'summedPercentage',
      baseCode: 'B01001_001E',
      baseLabel: 'Total Population',
      format: 'percentage'
    },
    'Nursery to Grade 4': {
      dataset: 'acs5, acs1',
      variableCode: [ 'B14001_003E', 'B14001_004E', 'B14001_005E' ],
      transformationType: 'summedPercentage',
      baseCode: 'B01001_001E',
      baseLabel: 'Total Population',
      format: 'percentage'
    },
    'Grades 5 to 12': {
      dataset: 'acs5, acs1',
      variableCode: [ 'B14001_006E', 'B14001_007E', 'B14001_008E' ],
      transformationType: 'summedPercentage',
      baseCode: 'B01001_001E',
      baseLabel: 'Total Population',
      format: 'percentage'
    },
    'College or Graduate School': {
      dataset: 'acs5, acs1',
      variableCode: [ 'B14001_009E', 'B14001_010E' ],
      transformationType: 'summedPercentage',
      baseCode: 'B01001_001E',
      baseLabel: 'Total Population',
      format: 'percentage'
    },
    'Owner-Occupied Units': {
      dataset: 'acs5, acs1',
      variableCode: 'B25003_002E',
      transformationType: 'percentage',
      baseCode: 'B25003_001E',
      baseLabel: 'Total Housing Units',
      format: 'percentage'
    },
    'Renter-Occupied Units': {
      dataset: 'acs5, acs1',
      variableCode: 'B25003_003E',
      transformationType: 'percentage',
      baseCode: 'B25003_001E',
      baseLabel: 'Total Housing Units',
      format: 'percentage'
    },
    'Median Value of Owner-Occupied Housing Units': {
      dataset: 'acs5, acs1',
      variableCode: 'B25077_001E',
      transformationType: 'none',
      baseCode: 'none',
      baseLabel: 'none',
      format: 'currency'
    },
    'Median Gross Rent': {
      dataset: 'acs5, acs1',
      variableCode: 'B25064_001E',
      transformationType: 'none',
      baseCode: 'none',
      baseLabel: 'none',
      format: 'currency'
    },
    'Workers Who Commute by Car, Truck, or Van': {
      dataset: 'acs5, acs1',
      variableCode: 'B08006_002E',
      transformationType: 'percentage',
      baseCode: 'B08006_001E',
      baseLabel: 'Total Workers Commuting',
      format: 'percentage'
    },
    'Public Transportation (excluding taxicab)': {
      dataset: 'acs5, acs1',
      variableCode: 'B08006_008E',
      transformationType: 'percentage',
      baseCode: 'B08006_001E',
      baseLabel: 'Total Workers Commuting',
      format: 'percentage'
    },
    'With Health Insurance': {
      dataset: 'acs5, acs1',
      variableCode: 'B27001_004E',
      transformationType: 'percentage',
      baseCode: 'B01001_001E',
      baseLabel: 'Total Population',
      format: 'percentage'
    },
    'Without Health Insurance': {
      dataset: 'acs5, acs1',
      variableCode: 'B27001_005E',
      transformationType: 'percentage',
      baseCode: 'B01001_001E',
      baseLabel: 'Total Population',
      format: 'percentage'
    },
    'With a Disability': {
      dataset: 'acs5, acs1',
      variableCode: 'B18101_004E',
      transformationType: 'percentage',
      baseCode: 'B01001_001E',
      baseLabel: 'Total Civilian Non-institutionalized Population',
      format: 'percentage'
    },
    'Self-Employed in Own Not Incorporated Business Workers': {
      dataset: 'acs5, acs1',
      variableCode: 'B24080_004E',
      transformationType: 'percentage',
      baseCode: 'B24080_001E',
      baseLabel: 'Total Employed Population',
      format: 'percentage'
    },
    'Employment Rate': {
      dataset: 'acs5, acs1',
      variableCode: 'B23025_004E',
      transformationType: 'percentage',
      baseCode: 'B23025_002E',
      baseLabel: 'Labor Force',
      format: 'percentage'
    }
  },
  censusDataAPIs: {
    acs5: {
      description:
        "Detailed demographic, social, economic, and housing statistics (5-year estimates)",
      datasetName: "American Community Survey 5-Year Data",
      yearsAvailable: [[2005, 2023]],
      apiReference: `https://api.census.gov/data/{year}/acs/acs5?get=VARIABLE&for=GEOGRAPHY`,
      geographiesAvailable: [ // This array specifies the geographies that are available for the dataset. The values must match the keys defined in the geographiesAPISyntax object above.
        "Nation",
        "States",
        "Counties",
        "Metropolitan Statistical Areas",
        "Congressional Districts",
        "Places",
        "Census Tracts",
        "Block Groups",
      ],
    },
    acs1: {
      description:
        "Detailed demographic, social, economic, and housing statistics (1-year estimates)",
      datasetName: "American Community Survey 1-Year Data",
      yearsAvailable: [[2010, 2023]],
      apiReference: `https://api.census.gov/data/{year}/acs/acs1?get=VARIABLE&for=GEOGRAPHY`,
      geographiesAvailable: [
        "Nation",
        "States",
        "Counties",
        "Metropolitan Statistical Areas",
        "Congressional Districts",
        "Places",
        "Census Tracts",
      ],
    },
    dec: {
      description: "Basic demographic information, conducted every 10 years",
      datasetName: "Decennial Census",
      yearsAvailable: [
        1790, 1800, 1810, 1820, 1830, 1840, 1850, 1860, 1870, 1880, 1890, 1900,
        1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020,
      ],
      apiReference: `https://api.census.gov/data/{year}/dec?get=VARIABLE&for=GEOGRAPHY`,
      geographiesAvailable: [
        "Nation",
        "States",
        "Counties",
        "Places",
        "Census Tracts",
        "Block Groups",
        "Blocks",
      ],
    },
    pep: {
      description:
        "Updated population estimates for the nation, states, counties, cities, and towns",
      datasetName: "Population Estimates Program",
      yearsAvailable: [[1990, 2023]],
      apiReference: `https://api.census.gov/data/{year}/pep/population?get=VARIABLE&for=GEOGRAPHY`,
      geographiesAvailable: [
        "Nation",
        "States",
        "Counties",
        "Metropolitan Statistical Areas",
        "Cities and Towns",
      ],
    },
    cps: {
      description:
        "Labor force statistics, including employment, unemployment, and earnings",
      datasetName: "Current Population Survey",
      yearsAvailable: [[1940, 2023]], // monthly data availability with annual summaries
      apiReference: `https://api.census.gov/data/{year}/cps/basic?get=VARIABLE&for=GEOGRAPHY`,
      geographiesAvailable: ["Nation"], // Typically only national level data is available
    },
    econ: {
      description:
        "Detailed economic data by industry and geography, conducted every 5 years",
      datasetName: "Economic Census",
      yearsAvailable: [
        1967, 1972, 1977, 1982, 1987, 1992, 1997, 2002, 2007, 2012, 2017, 2022,
      ],
      apiReference: `https://api.census.gov/data/{year}/econ?get=VARIABLE&for=GEOGRAPHY`,
      geographiesAvailable: [
        "Nation",
        "States",
        "Counties",
        "Places",
        "Metropolitan Statistical Areas",
      ],
    },
    sbo: {
      description:
        "Economic data by race, ethnicity, gender, and veteran status of business owners",
      datasetName: "Survey of Business Owners",
      yearsAvailable: [
        1972, 1977, 1982, 1987, 1992, 1997, 2002, 2007, 2012, 2017,
      ],
      apiReference: `https://api.census.gov/data/{year}/sbo?get=VARIABLE&for=GEOGRAPHY`,
      geographiesAvailable: [
        "Nation",
        "States",
        "Metropolitan Statistical Areas",
      ],
    },
    "timeseries/bds/firms": {
      description:
        "Measures of business dynamics, such as job creation and destruction",
      datasetName: "Business Dynamics Statistics",
      yearsAvailable: [[1977, 2023]],
      apiReference: `https://api.census.gov/data/timeseries/bds/firms?get=VARIABLE&for=GEOGRAPHY`,
      geographiesAvailable: [
        "Nation",
        "States",
        "Metropolitan Statistical Areas",
        "Counties",
      ],
    },
    cbp: {
      description:
        "Annual subnational economic data by industry, including ZIP Code level",
      datasetName: "County Business Patterns",
      yearsAvailable: [[1964, 2023]],
      apiReference: `https://api.census.gov/data/{year}/cbp?get=VARIABLE&for=GEOGRAPHY`,
      geographiesAvailable: [
        "Nation",
        "States",
        "Counties",
        "Metropolitan Statistical Areas",
        "ZIP Code Tabulation Areas",
      ],
    },
    hvs: {
      description:
        "Quarterly data on rental and homeowner vacancy rates, and homeownership rates",
      datasetName: "Housing Vacancies and Homeownership",
      yearsAvailable: [[1956, 2023]], // quarterly data
      apiReference: `https://api.census.gov/data/{year}/hvs?get=VARIABLE&for=GEOGRAPHY`,
      geographiesAvailable: [
        "Nation",
        "Regions",
        "States",
        "Metropolitan Statistical Areas",
      ],
    },
    ase: {
      description:
        "Timely updates on women, minority, and veteran-owned businesses",
      datasetName: "Annual Survey of Entrepreneurs",
      yearsAvailable: [2014, 2015, 2016],
      apiReference: `https://api.census.gov/data/{year}/ase?get=VARIABLE&for=GEOGRAPHY`,
      geographiesAvailable: [
        "Nation",
        "States",
        "Metropolitan Statistical Areas",
      ],
    },
    sipp: {
      description:
        "Detailed information on the economic situation of U.S. households",
      datasetName: "Survey of Income and Program Participation",
      yearsAvailable: [[1984, 2023]], // longitudinal survey
      apiReference: `https://api.census.gov/data/{year}/sipp?get=VARIABLE&for=GEOGRAPHY`,
      geographiesAvailable: ["Nation", "States"],
    },
    "timeseries/healthins/sahie": {
      description: "State and county health insurance statistics",
      datasetName: "Small Area Health Insurance Estimates",
      yearsAvailable: [[2006, 2023]],
      apiReference: `https://api.census.gov/data/timeseries/healthins/sahie?get=VARIABLE&for=GEOGRAPHY`,
      geographiesAvailable: ["Nation", "States", "Counties"],
    },
    pseo: {
      description:
        "Earnings and employment outcomes for graduates of specific colleges",
      datasetName: "Post-Secondary Employment Outcomes",
      yearsAvailable: [[2018, 2023]], // assumed experimental range
      apiReference: `https://api.census.gov/data/{year}/pseo?get=VARIABLE&for=GEOGRAPHY`,
      geographiesAvailable: [
        "Nation",
        "States",
        "Metropolitan Statistical Areas",
      ],
    },
    ncvs: {
      description:
        "Annual victimization data, including crime trends and victim characteristics",
      datasetName: "National Crime Victimization Survey",
      yearsAvailable: [[1993, 2023]], // available since 1993 annually
      apiReference: `https://api.census.gov/data/{year}/ncvs?get=VARIABLE&for=GEOGRAPHY`,
      geographiesAvailable: ["Nation"], // Typically only national level data is available
    },
  },
  annotationValues: {
    "-666666666": {
      annotation: "-",
      meaning:
        "The estimate could not be computed due to insufficient number of sample observations or one or both of the median estimates falls in the lowest/highest interval of an open-ended distribution. For a 5-year median estimate, the margin of error associated with a median was larger than the median itself.",
    },
    "-999999999": {
      annotation: "N",
      meaning:
        "The estimate or margin of error cannot be displayed due to insufficient number of sample cases in the selected geographic area.",
    },
    "-888888888": {
      annotation: "(X)",
      meaning:
        "The estimate or margin of error is not applicable or not available.",
    },
    "VariesMedianLow": {
      annotation: "median-",
      meaning:
        "The median falls in the lowest interval of an open-ended distribution.",
    },
    "VariesMedianHigh": {
      annotation: "median+",
      meaning:
        "The median falls in the highest interval of an open-ended distribution.",
    },
    "-222222222": {
      annotation: "**",
      meaning:
        "The margin of error could not be computed due to insufficient number of sample observations.",
    },
    "-333333333": {
      annotation: "***",
      meaning:
        "The margin of error could not be computed because the median falls in the lowest or highest interval of an open-ended distribution.",
    },
    "-555555555": {
      annotation: "*****",
      meaning:
        "A margin of error is not appropriate because the estimate is controlled to an independent estimate. The margin of error may be treated as zero.",
    },
    "*": {
      annotation: "N/A",
      meaning:
        "An * indicates that the estimate is significantly different than the estimate from the most current year. A 'c' indicates that both the estimate for that year and the current year are controlled; a statistical test is not appropriate.",
    },
    null: {
      annotation: "null",
      meaning:
        "A null value in the estimate means there is no data available for the requested geography.",
    },
  },
  featuredStudies: [
    {
      "title": "Impact of Education on Income",
      "subtitle": "Analyzing how different levels of education affect income, particularly for minorities and women.",
      "defaultMappedVariable": { "label": "Median Household Income by Education Level", "code": "Custom_Code_EdIncome" },
      "studyObjective": "To analyze how different levels of education affect income, with a focus on disparities impacting minorities and women.",
      "methodology": "Utilizing cross-sectional data from national databases, this study employs regression analysis to explore the relationship between educational attainment and median household income, while controlling for variables such as race, gender, and geographic location.",
      "findings": [
        "Higher education levels correlate with significantly higher income levels.",
        "The income gap between different education levels is more pronounced for minority groups and women."
      ],
      "implications": "The study underscores the critical role of educational attainment in economic advancement and highlights the need for policies that address educational inequalities to reduce income disparities.",
      "visualization": [
        // "infographics": "Summarizes key statistics on the income-education relationship, highlighting disparities.",
        // "interactiveCharts": "Allows users to explore income data by education level, race, and gender.",
        // "maps": "Geographical patterns showing regions with high disparities in education-income correlation."
        {
          "title": "Income by Educational Level",
          "description": "A line graph plots median household income against educational levels, revealing income disparities.",
          "type": "Line Graph",
          "chartJS": true,
          "data": {
            "labels": ["Less Than High School", "High School Graduate", "Some College", "Bachelor's Degree or Higher"],
            "datasets": [{
              "label": "Median Household Income",
              "data": [30000, 35000, 40000, 50000],
              "fill": false,
              "borderColor": "rgb(75, 192, 192)",
              "tension": 0.1
            }]
          },
          "VisualizationComponent": "Line",
          "options": {}
        }
      ],
      "questions": [
        "How do income levels vary by educational attainment?",
        "What are the income disparities between different education levels, especially for minorities and women?"
      ],
      "overview": "This study examines the correlation between education and income, with a focus on the disparities that affect minorities and women.",
      "keyInsights": "The study finds significant income disparities across different education levels, with the gap widening for minority groups and women.",
      "impact": "The findings highlight the importance of educational attainment in achieving economic equity and suggest the need for targeted educational policies.",
      "tags": ["education", "income", "disparities", "minorities", "women", "line graph"]
    },
    {
      "title": "Veteran Entrepreneurship",
      "subtitle": "Characteristics and challenges of businesses owned by veterans.",
      "defaultMappedVariable": { "label": "Number of Veteran-Owned Businesses", "code": "Custom_Code_VetBiz" },
      "studyObjective": "To explore the characteristics and challenges of businesses owned by veterans, focusing on success factors and barriers.",
      "methodology": "Analysis of survey data from veteran business owners across the country, complemented by case studies and interviews.",
      "findings": [
        "Veteran-owned businesses show resilience but face unique challenges in access to capital and networks.",
        "A significant number of veteran entrepreneurs benefit from specific mentoring programs."
      ],
      "implications": "Findings suggest the need for targeted support structures for veteran-owned businesses, including improved access to finance and mentoring networks.",
      "visualization": [
        // "infographics": "Highlights characteristics of veteran-owned businesses and their economic impact.",
        // "interactiveCharts": "Examines success rates, challenges, and support mechanisms for veteran entrepreneurs.",
        // "maps": "Shows the distribution and impact of veteran-owned businesses across regions."
        {
          "title": "Demographic Breakdown of Business Ownership",
          "description": "Stacked bar charts display business ownership proportions among different demographic groups, including veterans.",
          "type": "Stacked Bar Chart",
          "chartJS": true,
          "data": {
            "labels": ["Veterans", "Non-Veterans"],
            "datasets": [{
              "label": "Number of Businesses",
              "data": [1200, 4800],
              "backgroundColor": ["rgba(255, 159, 64, 0.5)", "rgba(153, 102, 255, 0.5)"]
            }]
          },
          "VisualizationComponent": "Bar",
          "options": {
            "scales": {
              "x": {
                "stacked": true
              },
              "y": {
                "stacked": true
              }
            }
          }
        }
      ],
      "questions": [
        "What are the unique challenges faced by veteran-owned businesses?",
        "How do veteran-owned businesses compare to non-veteran-owned businesses in terms of number and sector?"
      ],
      "overview": "Exploring the characteristics and challenges faced by businesses owned by veterans to identify success factors and barriers.",
      "keyInsights": "Veteran-owned businesses demonstrate resilience but encounter specific challenges, notably in accessing capital and networking opportunities.",
      "impact": "The study suggests the need for enhanced support and resources for veteran entrepreneurs, aiming to leverage their unique skills and contributions to the economy.",
      "tags": ["veteran entrepreneurship", "business ownership", "challenges", "stacked bar chart"]
    },
    {
      "title": "Health Disparities by Demographic",
      "subtitle": "How health outcomes vary among different demographic groups and locations.",
      "defaultMappedVariable": { "label": "Health Insurance Coverage Rate", "code": "Custom_Code_HealthCov" },
      "studyObjective": "Investigate how health outcomes vary among different demographic groups and locations, with a focus on access to healthcare.",
      "methodology": "This study combines health data from national surveys with demographic information, using statistical analysis to identify disparities.",
      "findings": [
        "Significant health disparities exist across racial, gender, and socioeconomic lines.",
        "Access to healthcare significantly affects health outcomes, with marginalized communities being the most impacted."
      ],
      "implications": "The research calls for targeted health policies to address disparities and improve access to healthcare for all demographic groups.",
      "visualization": [
        // "infographics": "Visual summary of health disparities and the factors influencing them.",
        // "interactiveCharts": "Interactive exploration of health outcomes by demographic variables.",
        // "maps": "Maps with overlays indicating health disparities and access to care by region."
        {
          "title": "Health Insurance Coverage",
          "description": "Pie charts display the insurance coverage status across different demographic groups, highlighting disparities.",
          "type": "Pie Chart",
          "chartJS": true,
          "data": {
            "labels": ["Insured", "Uninsured"],
            "datasets": [{
              "data": [85, 15],
              "backgroundColor": ["rgba(54, 162, 235, 0.5)", "rgba(255, 99, 132, 0.5)"]
            }]
          },
          "VisualizationComponent": "Pie",
          "options": {}
        }
      ],
      "questions": [
        "Which demographic groups face the greatest challenges in accessing healthcare?",
        "How do health outcomes vary by demographic and location?"
      ],
      "overview": "Investigating the disparities in health access and outcomes among various demographic groups to identify underlying causes and potential solutions.",
      "keyInsights": "The study reveals significant disparities in health insurance coverage and outcomes, particularly affecting marginalized communities.",
      "impact": "Highlighting the urgent need for policy interventions aimed at reducing health disparities and improving access to care for all.",
      "tags": ["public health", "disparities", "insurance coverage", "demographics", "pie chart"]
    },
    {
      "title": "Economic Impact of COVID-19 on Minority-owned Businesses",
      "subtitle": "A study on resilience and recovery.",
      "defaultMappedVariable": { "label": "Change in Revenue", "code": "Custom_Code_CovidImpact" },
      "studyObjective": "To assess the resilience and recovery of minority-owned businesses in the wake of the COVID-19 pandemic.",
      "methodology": "The study analyzes economic data pre- and post-COVID-19 outbreak, focusing on business performance indicators across minority groups.",
      "findings": [
        "Minority-owned businesses were disproportionately affected by the pandemic but showed varying degrees of resilience.",
        "Governmental support played a crucial role in the survival and recovery of these businesses."
      ],
      "implications": "Insights from the study highlight the need for equitable economic policies that ensure the sustainability of minority-owned businesses during crises.",
      "visualization": [
        // "infographics": "Key statistics on the pandemic's impact on minority-owned businesses and their recovery paths.",
        // "interactiveCharts": "Dynamics of business performance indicators before and after the COVID-19 outbreak.",
        // "maps": "Spatial analysis of the economic impact on minority-owned businesses across different areas."
        {
          "title": "Revenue Impact of COVID-19 on Minority-owned Businesses",
          "description": "Line charts showing the revenue trends for minority-owned businesses before and after the onset of the COVID-19 pandemic.",
          "type": "Line Chart",
          "chartJS": true,
          "data": {
            "labels": ["2019", "2020", "2021"],
            "datasets": [{
              "label": "Revenue Change",
              "data": [0, -30, -10],
              "fill": false,
              "borderColor": "rgb(255, 99, 132)",
              "tension": 0.1
            }]
          },
          "VisualizationComponent": "Line",
          "options": {}
        }
      ],
      "questions": [
        "How has the COVID-19 pandemic affected the revenue of minority-owned businesses?",
        "What measures have contributed to the resilience and recovery of these businesses?"
      ],
      "overview": "Assessing the economic impact of the COVID-19 pandemic on minority-owned businesses to understand the factors contributing to their resilience and recovery.",
      "keyInsights": "Minority-owned businesses have been disproportionately affected by the pandemic, with recovery rates varying significantly based on access to resources and support.",
      "impact": "The findings emphasize the need for equitable support measures to ensure the sustainability and growth of minority-owned businesses in post-pandemic recovery efforts.",
      "tags": ["COVID-19", "minority-owned businesses", "economic impact", "resilience", "recovery", "line chart"]
    }
  ]
};

export { appConfig, referenceData };
