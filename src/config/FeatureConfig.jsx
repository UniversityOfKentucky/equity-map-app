import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    ArcElement
  } from 'chart.js';
import { Bar, Line, Pie, Bubble } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

const FeatureConfig = [
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
          "VisualizationComponent": Line,
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
          "VisualizationComponent": Bar,
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
          "VisualizationComponent": Pie,
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
          "VisualizationComponent": Line,
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
  ];  

export default FeatureConfig;