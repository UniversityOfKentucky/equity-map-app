// This function takes the categories object and flattens it into a single object which contains all the variables:
function generateVariablesReference(categories) {
  let flatVariables = {};

  function extractVariables(subcategories) {
    for (const subcategoryName in subcategories) {
      const variables = subcategories[subcategoryName];
      for (const variableName in variables) {
        const variableDetails = variables[variableName];
        flatVariables[variableName] = {
          dataset: variableDetails.dataset,
          variableCode: variableDetails.variableCode,
          transformationType: variableDetails.transformationType || "none",
          baseCode: variableDetails.baseCode || "none",
          baseLabel: variableDetails.baseLabel || "none",
          format: variableDetails.format || "none"
        };
      }
    }
  }

  for (const categoryName in categories) {
    const category = categories[categoryName];
    if (category.data && category.data.subcategories) {
      extractVariables(category.data.subcategories);
    }
  }

  return flatVariables;
}

export default generateVariablesReference;