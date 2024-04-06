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

const CategoryConfig = [
    {
      title: "Demographics",
      subtitle: "A Foundational Category for Understanding Socio-Economic and Demographic Dynamics.",
      defaultMappedVariable: { label: "Total Population", code: "B01001_001E" },
      visualization: [
        // {
        //   title: "Population Distribution",
        //   description: "Intended to be visualized with a demographic pyramid, illustrating the population breakdown by age and sex. This visualization will be explored in a future iteration.",
        //   type: "Demographic Pyramid",
        //   chartJS: false,
        //   data: {}, // Placeholder for future iteration
        //   VisualizationComponent: "none",
        //   options: {}
        // },
        {
          title: "Demographics and Socio-economic Factors",
          description: "An interactive bar chart explores demographic data alongside socio-economic indicators.",
          type: "Bar Chart",
          chartJS: true,
          data: {
            labels: ["Income", "Education Level", "Health Access"],
            datasets: [{
                label: "Community A",
                data: [100, 12, 80],
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
              },
              {
                label: "Community B",
                data: [100, 15, 90],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
              }
            ]
          },
          VisualizationComponent: Bar,
          options: {
            indexAxis: '',
            plugins: {
              legend: {
                position: 'right',
              },
              title: {
                display: true,
                text: 'Demographics and Socio-economic Factors',
              },
            },
          } // Placeholder for Chart.js options
        },
        {
          title: "Age and Gender Composition",
          description: "A stacked bar chart to represent the composition of different age groups within genders, offering a complementary view to the demographic pyramid.",
          type: "Stacked Bar Chart",
          chartJS: true,
          data: {
            labels: ["0-14", "15-24", "25-54", "55-64", "65+"],
            datasets: [
              {
                label: "Male",
                data: [10, 20, 30, 40, 50],
                backgroundColor: 'rgba(255, 159, 64, 0.5)',
              },
              {
                label: "Female",
                data: [5, 15, 25, 35, 45],
                backgroundColor: 'rgba(153, 102, 255, 0.5)',
              }
            ]
          },
          VisualizationComponent: Bar,
          options: {
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true
              }
            }
          }
        },
      ],
      questions: [
        "How does the age distribution vary across different communities?",
        "What are the correlations between demographic compositions and socio-economic factors like income and education levels?"
      ],
      overview: "A foundational category for understanding socio-economic and demographic dynamics.",
      keyInsights: "Highlight significant findings, trends, and disparities within the data.",
      impact: "Discuss the real-world implications of these insights on minorities, women, and veterans.",
      tags:   ["demographics", "socio-economic factors", "age distribution", "gender composition", "bar chart", "stacked bar chart"]
    },
    {
      title: "Income & Employment",
      subtitle: "Central to Equality and Economic Opportunity Discussions.",
      defaultMappedVariable: { label: "Median Household Income", code: "B19013_001E" },
      visualization: [
        // {
        //   title: "Income Distribution",
        //   description: "A choropleth map displays median household income, utilizing color gradients. To be explored in a future iteration.",
        //   type: "Choropleth Map",
        //   chartJS: false,
        //   data: {}, // Placeholder for future iteration
        //   VisualizationComponent: "none",
        //   options: {}
        // },
        {
          title: "Employment and Poverty",
          description: "Dual-axis charts compare employment rates and poverty levels, showing their relationship.",
          type: "Dual Axis Chart",
          chartJS: true,
          data: {
            labels: ["Community A", "Community B", "Community C"],
            datasets: [
              {
                label: "Employment Rate",
                data: [75, 68, 80],
                yAxisID: 'y',
              },
              {
                label: "Poverty Level",
                data: [15, 25, 10],
                yAxisID: 'y1',
              }
            ],
          },
          VisualizationComponent: Line,
          options: {
            scales: {
              y: {
                type: 'linear',
                position: 'left',
              },
              y1: {
                type: 'linear',
                position: 'right',
                grid: {
                  drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
              },
            }
          }
        },
        {
          title: "Income Level Trends",
          description: "A line chart to display trends in median household income over time, offering a dynamic perspective on economic changes.",
          type: "Line Chart",
          chartJS: true,
          data: {
            labels: ["2000", "2005", "2010", "2015", "2020"],
            datasets: [
              {
                label: "Median Household Income",
                data: [45000, 48000, 50000, 52000, 55000],
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
              }
            ]
          },
          VisualizationComponent: Line,
          options: {}
        },
      ],
      questions: [
        "Which areas show the most significant disparities in income distribution?",
        "How does employment status affect poverty levels in different communities?"
      ],
      overview: "An analysis of income levels, sources, employment rates, and their relationship with other socio-economic factors.",
      keyInsights: "Highlight significant findings, trends, and disparities within the data.",
      impact: "Discuss the real-world implications of these insights on policy and individual communities.",
      tags:   ["income distribution", "employment rates", "poverty levels", "choropleth map", "dual axis chart", "line chart"]
    },
    {
      title: "Education",
      subtitle: "Critical for Long-term Socio-economic Mobility.",
      defaultMappedVariable: { label: "Percentage of Population with a Bachelor's Degree or Higher", code: "B15003_022E, B15003_023E, B15003_024E, B15003_025E" },
      visualization: [
        {
          title: "Educational Attainment Distribution",
          description: "A bar chart shows the population distribution across different educational levels.",
          type: "Bar Chart",
          chartJS: true,
          data: {
            labels: ["Less Than High School", "High School Graduate", "Some College", "Bachelor's Degree or Higher"],
            datasets: [{
              label: 'Population Distribution',
              data: [15, 25, 35, 25],
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)'
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
              ],
              borderWidth: 1
            }]
          },
          VisualizationComponent: Bar,
          options: { scales: { y: { beginAtZero: true } } }
        },
        {
          title: "Income by Educational Level",
          description: "A line graph plots median household income against educational levels, revealing income disparities.",
          type: "Line Chart",
          chartJS: true,
          data: {
            labels: ["Less Than High School", "High School Graduate", "Some College", "Bachelor's Degree or Higher"],
            datasets: [{
              label: 'Median Household Income',
              data: [30000, 35000, 40000, 50000],
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }]
          },
          VisualizationComponent: Line,
          options: {}
        },
        // { **Employment Rate by Education:** A scatter plot examines the relationship between education levels and employment rates.}
        {
          title: "Educational Programs Impact",
          description: "A new bar chart visualizing the impact of educational programs on employment rates.",
          type: "Bar Chart",
          chartJS: true,
          data: {
            labels: ["Program A", "Program B", "Program C"],
            datasets: [{
              label: 'Employment Rate Post-Completion',
              data: [80, 75, 90],
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1
            }]
          },
          VisualizationComponent: Bar,
          options: { scales: { y: { beginAtZero: true } } }
        }
      ],
      questions: [
        "How does educational attainment affect income levels in different demographics?",
        "What is the impact of education on employment opportunities?"
      ],
      overview: "Insights into educational attainment levels, disparities, and impacts on income and employment.",
      keyInsights: "Significant findings, trends, and disparities within the data.",
      impact: "Real-world implications of these insights on minorities, women, and veterans.",
      tags: ["educational attainment", "income disparities by education", "educational programs impact", "bar chart", "line chart"]
    },
    {
      title: "Public Health",
      subtitle: "Highlights Disparities in Health Access and Outcomes.",
      defaultMappedVariable: { label: "Percentage Without Health Insurance", code: "B27001_017E" },
      visualization: [
        {
          title: "Health Insurance Coverage",
          description: "Use pie charts to display the insurance coverage status across different regions.",
          type: "Pie Chart",
          chartJS: true,
          data: {
            labels: ["Insured", "Uninsured"],
            datasets: [{
              data: [70, 30],
              backgroundColor: ['rgba(54, 162, 235, 0.2)', 'rgba(255, 99, 132, 0.2)'],
              borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
              borderWidth: 1
            }]
          },
          VisualizationComponent: Pie,
          options: {}
        },
        // {**Health Outcomes vs. Socio-economic Status:** Use a heatmap or scatter plots as a proxy for heatmaps to represent correlations between health outcomes and socio-economic factors.}
        {
  
          title: "Public vs. Private Health Facilities",
          description: "A new bar chart showcasing the distribution of public vs. private health facilities across different regions.",
          type: "Bar Chart",
          chartJS: true,
          data: {
            labels: ["Region A", "Region B", "Region C"],
            datasets: [{
              label: 'Number of Facilities',
              data: [{x: "Public", y: 120}, {x: "Private", y: 80}, {x: "Public", y: 150}, {x: "Private", y: 60}, {x: "Public", y: 90}, {x: "Private", y: 120}],
              backgroundColor: 'rgba(255, 159, 64, 0.2)',
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1
            }]
          },
          VisualizationComponent: Bar,
          options: { scales: { y: { beginAtZero: true } } }
        }
      ],
      questions: [
        "Which communities face the most significant challenges in accessing healthcare?",
        "How do health outcomes correlate with income and education levels?"
      ],
      overview: "Information on health disparities, access to healthcare, and correlations with socio-economic conditions.",
      keyInsights: "Significant findings, trends, and disparities within the data.",
      impact: "Real-world implications of these insights on minorities, women, and veterans.",
      tags:   ["public health", "health insurance coverage", "health facilities distribution", "pie chart", "bar chart"]
    },
    {
      title: "Housing & Infrastructure",
      subtitle: "Reflects Living Standards and Access to Resources.",
      defaultMappedVariable: { label: "Median Value of Owner-Occupied Housing Units", code: "B25077_001E" },
      visualization: [
        {
          title: "Housing Cost Burden",
          description: "A histogram displays the distribution of housing costs as a percentage of household income.",
          type: "Bar Chart",
          chartJS: true,
          data: {
            labels: ["<30%", "30%-50%", ">50%"],
            datasets: [{
              label: 'Percentage of Households',
              data: [40, 35, 25],
              backgroundColor: 'rgba(153, 102, 255, 0.2)',
              borderColor: 'rgba(153, 102, 255, 1)',
              borderWidth: 1
            }]
          },
          VisualizationComponent: Bar,
          options: { scales: { y: { beginAtZero: true } } }
        },
        // {- **Access to Services:** Dot maps with overlays for essential services relative to housing areas indicate the level of access.},
        {
          title: "Infrastructure Quality Index",
          description: "A line chart depicting the infrastructure quality index across different neighborhoods.",
          type: "Line Chart",
          chartJS: true,
          data: {
            labels: ["Neighborhood A", "Neighborhood B", "Neighborhood C"],
            datasets: [{
              label: 'Quality Index',
              data: [80, 65, 90],
              fill: false,
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1
            }]
          },
          VisualizationComponent: Line,
          options: {}
        }
      ],
      questions: [
        "What percentage of income do different demographics spend on housing?",
        "How does access to essential services like healthcare and education vary across communities?"
      ],
      overview: "Examination of housing affordability, quality, and access to essential services.",
      keyInsights: "Significant findings, trends, and disparities within the data.",
      impact: "Real-world implications of these insights on minorities, women, and veterans.",
      tags: ["housing affordability", "infrastructure quality", "access to services", "histogram", "line chart"]
    },
    {
      title: "Entrepreneurship",
      subtitle: "Sheds Light on Economic Activities and Opportunities, with a Focus on Minorities, Women, and Veterans.",
      defaultMappedVariable: { label: "Total Number of Firms", code: "FIRMPDEMP" }, // Assuming FIRMPDEMP is the code, replace with actual code if different
      visualization: [
        {
          title: "Demographic Breakdown of Business Ownership",
          description: "Stacked bar charts display business ownership proportions among different demographic groups.",
          type: "Bar Chart",
          chartJS: true,
          data: {
            labels: ["Minorities", "Women", "Veterans"],
            datasets: [{
              label: 'Number of Firms',
              data: [300, 200, 50],
              backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(54, 162, 235, 0.2)'],
              borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 206, 86, 1)', 'rgba(54, 162, 235, 1)'],
              borderWidth: 1
            }]
          },
          VisualizationComponent: Bar,
          options: { scales: { y: { beginAtZero: true } } }
        },
        {
          title: "Sector Analysis of Minority-Owned Businesses",
          description: "A new bubble chart to visualize the sectors of minority-owned businesses by number and proportion.",
          type: "Bubble Chart",
          chartJS: true,
          data: {
            datasets: [{
              label: ['Tech', 'Retail', 'Manufacturing'],
              data: [{x:20, y:30, r:15}, {x:40, y:10, r:10}, {x:10, y:40, r:20}],
              backgroundColor: 'rgba(255, 99, 132, 0.2)'
            }]
          },
          VisualizationComponent: Bubble,
          options: {}
        }
      ],
      questions: [
        "What are the characteristics of businesses owned by minorities, women, and veterans?",
        "How does business size and sector distribution vary among different owner demographics?"
      ],
      overview: "Characteristics of Business Owners and Businesses, Focusing on Minorities, Women, and Veterans.",
      keyInsights: "Significant findings, trends, and disparities within the data.",
      impact: "Real-world implications of these insights on minorities, women, and veterans.",
      tags: ["entrepreneurship", "business ownership demographics", "sector analysis", "minority-owned businesses", "bar chart", "bubble chart"]
    }
  ];  

export default CategoryConfig;


