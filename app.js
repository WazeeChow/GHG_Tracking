// scripts.js

// Fetch the JSON data
fetch('ghg-data.json')
  .then(response => response.json())
  .then(data => {
    // Get the combined data
    const combinedData = data.data;

    // Extract months, CO2 emissions, and electricity consumption data for charts
    const months = combinedData.map(item => item.month);
    const CO2Emissions = combinedData.map(item => item.CO2_emissions_mt);
    const electricityConsumption = combinedData.map(item => item.electricity_consumption_kWh);

    // Get the canvas elements for the charts
    const ctxCO2 = document.getElementById('CO2Chart').getContext('2d');
    const ctxElectricity = document.getElementById('electricityChart').getContext('2d');

    // Create the CO2 emissions chart
    const CO2Chart = new Chart(ctxCO2, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'CO2 Emissions (mt)',
          data: CO2Emissions,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Monthly CO2 Emissions'
          }
        }
      }
    });

    // Create the electricity consumption chart
    const electricityChart = new Chart(ctxElectricity, {
      type: 'line',
      data: {
        labels: months,
        datasets: [{
          label: 'Electricity Consumption (kWh)',
          data: electricityConsumption,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Monthly Electricity Consumption'
          }
        }
      }
    });

    // Adjust chart size
    CO2Chart.canvas.parentNode.style.width = '50%';
    CO2Chart.canvas.parentNode.style.height = '400px';

    electricityChart.canvas.parentNode.style.width = '50%';
    electricityChart.canvas.parentNode.style.height = '400px';
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });
