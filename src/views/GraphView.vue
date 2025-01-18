<template>
    <div class="graph-container">
      <h2>Automation Systems Health Overview</h2>
  
      <!-- Graph Type Selector -->
      <div class="chart-selector">
        <label for="chart-type">Select Chart Type:</label>
        <select v-model="selectedChart" id="chart-type">
          <option value="pie">Pie Chart</option>
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="radar">Radar Chart</option>
          <option value="doughnut">Doughnut Chart</option>
          <option value="polarArea">Polar Area Chart</option>
          <option value="scatter">Scatter Chart</option>
          <option value="bubble">Bubble Chart</option>
          <option value="area">Area Chart</option>
          <option value="mixed">Mixed Chart</option>
        </select>
      </div>
  
      <!-- Charts Display -->
      <div class="charts">
        <div v-for="(chart, index) in chartsData" :key="index" class="chart-wrapper">
          <Chart :type="selectedChart" :data="chart.data" :options="chart.options" />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import Chart from 'primevue/chart';
  
  export default {
    components: {
      Chart
    },
    setup() {
      // Define the chart data for multiple chart types
      const chartData1 = ref({
        labels: ['Healthy', 'Unhealthy'],
        datasets: [{
          data: [0, 0],
          backgroundColor: ['#4CAF50', '#f44336'],
          hoverBackgroundColor: ['#45a049', '#e53935']
        }]
      });
  
      const chartData2 = ref({
        labels: ['System Health Status'],
        datasets: [
          {
            label: 'Healthy Systems',
            backgroundColor: '#4CAF50',
            data: [0]
          },
          {
            label: 'Unhealthy Systems',
            backgroundColor: '#f44336',
            data: [0]
          }
        ]
      });
  
      // Add more chart data here
      const chartData3 = ref({
        labels: ['A', 'B', 'C'],
        datasets: [{
          label: 'Example Line Chart',
          data: [12, 19, 3],
          fill: false,
          borderColor: '#4CAF50',
          tension: 0.1
        }]
      });
  
      // Store all chart configurations
      const chartsData = ref([
        { data: chartData1.value, options: { plugins: { title: { display: true, text: 'Pie Chart Example' } } } },
        { data: chartData2.value, options: { plugins: { title: { display: true, text: 'Bar Chart Example' } } } },
        { data: chartData3.value, options: { plugins: { title: { display: true, text: 'Line Chart Example' } } } },
        // Add additional charts up to 10 types
      ]);
  
      const selectedChart = ref('pie'); // Default chart type
  
      const fetchData = () => {
        // Simulated data - replace with actual API call
        const mockData = { healthy: 7, unhealthy: 3 };
        chartData1.value.datasets[0].data = [mockData.healthy, mockData.unhealthy];
        chartData2.value.datasets[0].data = [mockData.healthy];
        chartData2.value.datasets[1].data = [mockData.unhealthy];
      };
  
      onMounted(() => {
        fetchData();
      });
  
      return {
        selectedChart,
        chartsData
      };
    }
  }
  </script>
  
  <style scoped>
  .graph-container {
    padding: 2rem;
  }
  
  .chart-selector {
    margin-bottom: 1rem;
  }
  
  .chart-selector label {
    margin-right: 0.5rem;
  }
  
  .chart-selector select {
    padding: 0.5rem;
  }
  
  .charts {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  .chart-wrapper {
    margin: 1rem;
    padding: 1rem;
    background: var(--surface-color);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    width: 45%; /* Reduce the chart size */
  }
  
  .chart-wrapper canvas {
    max-width: 100% !important;
    max-height: 300px; /* Reduce the height */
  }
  
  h2 {
    color: var(--text-color);
    margin-bottom: 2rem;
  }
  </style>
  