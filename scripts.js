// Function to fetch data from CSV file
async function fetchData(filename) {
    const response = await fetch(filename);
    const data = await response.text();
    return data;
}

// Global variables to store chart instance and original data
let chart;
let originalLabels;
let originalDatasets;

// Function to parse CSV data and create line charts
function parseDataAndCreateCharts(csvData) {
    // Split the CSV data into rows
    const rows = csvData.split('\n');

    // Create arrays to store labels and data for each year
    const labels = [];
    const datasets = [];

    // Iterate over each row of the CSV data
    rows.forEach(row => {
        const [year, month, days, usage, co2] = row.split(',');

        // Skip the header row
        if (year === 'Year') return;

        // Add labels and CO2 data
        labels.push(`${year}-${month}`);
        datasets.push(parseFloat(co2));
    });

    return { labels, datasets };
}

// Function to update chart based on selected year
function updateChart(selectedYear, discoveryData, colganData, kjhData) {
    // Filter data based on selected year
    const filteredLabels = [];
    const filteredDatasets = [];

    for (let i = 0; i < discoveryData.labels.length; i++) {
        const year = discoveryData.labels[i].split('-')[0];
        if (selectedYear === 'all' || year === selectedYear) {
            filteredLabels.push(discoveryData.labels[i]);
            filteredDatasets.push([
                discoveryData.datasets[i],
                colganData.datasets[i],
                kjhData.datasets[i],
                discoveryData.datasets[i] + colganData.datasets[i] + kjhData.datasets[i]
            ]);
        }
    }

    // Update chart with filtered data
    chart.data.labels = filteredLabels;
    chart.data.datasets[0].data = filteredDatasets.map(dataset => dataset[0]);
    chart.data.datasets[1].data = filteredDatasets.map(dataset => dataset[1]);
    chart.data.datasets[2].data = filteredDatasets.map(dataset => dataset[2]);
    chart.data.datasets[3].data = filteredDatasets.map(dataset => dataset[3]);
    chart.options.plugins.title.text = `Gov School CO2 Emissions - ${selectedYear}`;
    chart.update();
}

// Main function to initiate data fetching and chart creation
async function main() {
    // Fetch data from CSV files
    const discoveryData = await fetchData('Discovery.csv');
    const colganData = await fetchData('Colgan.csv');
    const kjhData = await fetchData('KJH.csv');

    // Parse data and create charts
    const discoveryChartData = parseDataAndCreateCharts(discoveryData);
    const colganChartData = parseDataAndCreateCharts(colganData);
    const kjhChartData = parseDataAndCreateCharts(kjhData);

    // Merge datasets from different CSV files
    const mergedDatasets = [
        {
            label: 'Discovery',
            data: discoveryChartData.datasets,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        },
        {
            label: 'Colgan',
            data: colganChartData.datasets,
            backgroundColor: 'rgba(255, 159, 64, 0.2)',
            borderColor: 'rgba(255, 159, 64, 1)',
            borderWidth: 1
        },
        {
            label: 'KJH',
            data: kjhChartData.datasets,
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1
        },
        {
            label: 'Net Emissions',
            data: [], // Placeholder for net emissions data
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }
    ];

    // Store original data
    originalLabels = discoveryChartData.labels.slice();
    originalDatasets = discoveryChartData.datasets.slice();

    // Create a canvas element for the chart
    const canvas = document.createElement('canvas');
    document.getElementById('emissions-graph').appendChild(canvas);

    // Create Chart instance and store it globally
    chart = new Chart(canvas, {
        type: 'line',
        data: {
            labels: originalLabels,
            datasets: mergedDatasets
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: 'Gov School CO2 Emissions', // Add your desired title here
                    font: {
                        size: 20 // Adjust the font size as needed
                    }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Year-Month'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'CO2 Emissions (Metric Tons)'
                    }
                }
            }
        }
    });

    // Add event listener for year selector
    document.getElementById('year-selector').addEventListener('change', function() {
        const selectedYear = this.value;
        updateChart(selectedYear, discoveryChartData, colganChartData, kjhChartData);
    });
}

// Call main function when the page loads
window.onload = main;
