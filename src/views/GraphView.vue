<template>
    <div class="graph-container">
      <div class="header-section">
        <h2>System Health Analytics</h2>
        <div class="chart-controls">
          <Dropdown
            v-model="selectedChart"
            :options="chartTypes"
            optionLabel="label"
            placeholder="Select Chart Type"
            class="chart-selector"
          />
        </div>
      </div>
  
      <div v-if="loading" class="loading">
        <ProgressSpinner />
      </div>
  
      <div v-else-if="error" class="error-message">
        {{ error }}
      </div>
  
      <div v-else class="chart-wrapper">
        <Chart
          :type="selectedChart.value"
          :data="getChartData"
          :options="getChartOptions"
        />
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import Chart from 'primevue/chart';
  import Dropdown from 'primevue/dropdown';
  import ProgressSpinner from 'primevue/progressspinner';
  import MachineService from '../api/MachineServices';
  
  export default {
    name: 'GraphView',
    components: {
      Chart,
      Dropdown,
      ProgressSpinner
    },
    setup() {
      const loading = ref(false);
      const error = ref(null);
      const machines = ref([]);
  
      const chartTypes = [
        { label: 'Pie Chart', value: 'pie' },
        { label: 'Bar Chart', value: 'bar' },
        { label: 'Line Chart', value: 'line' },
        { label: 'Radar Chart', value: 'radar' },
        { label: 'Polar Area', value: 'polarArea' },
        { label: 'Doughnut', value: 'doughnut' },
        { label: 'Bubble', value: 'bubble' },
        { label: 'Scatter', value: 'scatter' }
      ];
  
      const selectedChart = ref(chartTypes[0]);
  
      const getChartData = computed(() => {
  const healthyCount = machines.value.filter(m => m.healthStatus === 'healthy').length;
  const unhealthyCount = machines.value.filter(m => m.healthStatus === 'unhealthy').length;
  
  switch(selectedChart.value.value) {
    case 'bar':
      return {
        labels: ['System Health Status'],
        datasets: [
          {
            label: 'Healthy Systems',
            backgroundColor: '#4CAF50',
            data: [healthyCount]
          },
          {
            label: 'Unhealthy Systems',
            backgroundColor: '#f44336',
            data: [unhealthyCount]
          }
        ]
      };
    case 'line':
    case 'radar':
      return {
        labels: ['System Health'],
        datasets: [
          {
            label: 'Healthy Systems',
            data: [healthyCount],
            borderColor: '#4CAF50',
            tension: 0.4
          },
          {
            label: 'Unhealthy Systems',
            data: [unhealthyCount],
            borderColor: '#f44336',
            tension: 0.4
          }
        ]
      };
    default:
      return {
        labels: ['Healthy', 'Unhealthy'],
        datasets: [{
          data: [healthyCount, unhealthyCount],
          backgroundColor: ['#4CAF50', '#f44336'],
          borderColor: ['#45a049', '#e53935'],
          borderWidth: 1
        }]
      };
  }
});
  
      const getChartOptions = computed(() => {
        const baseOptions = {
          plugins: {
            legend: {
              labels: { color: 'var(--text-color)' }
            }
          },
          responsive: true,
          maintainAspectRatio: false
        };
  
        switch(selectedChart.value.value) {
          case 'bar':
            return {
              ...baseOptions,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { color: 'var(--text-color)' }
                },
                x: {
                  ticks: { color: 'var(--text-color)' }
                }
              }
            };
          case 'radar':
            return {
              ...baseOptions,
              scales: {
                r: {
                  pointLabels: { color: 'var(--text-color)' },
                  grid: { color: 'var(--border-color)' }
                }
              }
            };
          default:
            return baseOptions;
        }
      });
  
      const fetchData = async () => {
        try {
          loading.value = true;
          const response = await MachineService.getMachines();
          machines.value = response.data;
        } catch (err) {
          error.value = 'Failed to load chart data';
          console.error(err);
        } finally {
          loading.value = false;
        }
      };
  
      onMounted(fetchData);
  
      return {
        loading,
        error,
        selectedChart,
        chartTypes,
        getChartData,
        getChartOptions
      };
    }
  };
  </script>
  
  <style scoped>
  .graph-container {
    padding: 2rem;
    background: var(--surface-color);
    min-height: 100vh;
    width: 100%;
  }
  
  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
    padding: 0 2rem;
  }
  
  .chart-controls {
    min-width: 250px;
  }
  
  .chart-wrapper {
    background: var(--surface-color);
    padding: 3rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    height: 85vh;
    min-height: 900px;
    width: 95%;
    margin: 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .loading, .error-message {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
    color: var(--text-color);
  }
  
  :deep(.p-dropdown) {
    background: var(--surface-color);
    border-color: var(--border-color);
  }
  
  :deep(.p-dropdown-label),
  :deep(.p-dropdown-item) {
    color: var(--text-color);
  }

  :deep(.p-chart) {
    width: 100% !important;
    height: 100% !important;
    max-width: 1600px;
  }

  @media (max-width: 768px) {
    .chart-wrapper {
      height: 70vh;
      min-height: 600px;
      padding: 1.5rem;
    }
  }
  </style>