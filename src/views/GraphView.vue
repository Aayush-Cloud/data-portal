<template>
  <div class="graph-container">
    <h2>Automation Systems Health Overview</h2>
    
    <div class="chart-wrapper">
      <Chart type="pie" :data="chartData" :options="chartOptions" />
    </div>

    <div class="chart-wrapper">
      <Chart type="bar" :data="barData" :options="barOptions" />
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
    const chartData = ref({
      labels: ['Healthy', 'Unhealthy'],
      datasets: [{
        data: [0, 0],
        backgroundColor: ['#4CAF50', '#f44336'],
        hoverBackgroundColor: ['#45a049', '#e53935']
      }]
    });

    const barData = ref({
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

    const chartOptions = ref({
      plugins: {
        title: {
          display: true,
          text: 'System Health Distribution',
          color: 'var(--text-color)'
        },
        legend: {
          labels: {
            color: 'var(--text-color)'
          }
        }
      }
    });

    const barOptions = ref({
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: 'var(--text-color)'
          }
        },
        x: {
          ticks: {
            color: 'var(--text-color)'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            color: 'var(--text-color)'
          }
        }
      }
    });

    const fetchData = () => {
      // Simulated data - replace with actual API call
      const mockData = {
        healthy: 7,
        unhealthy: 3
      };

      chartData.value.datasets[0].data = [mockData.healthy, mockData.unhealthy];
      barData.value.datasets[0].data = [mockData.healthy];
      barData.value.datasets[1].data = [mockData.unhealthy];
    };

    onMounted(() => {
      fetchData();
    });

    return {
      chartData,
      chartOptions,
      barData,
      barOptions
    };
  }
}
</script>

<style scoped>
.graph-container {
  padding: 2rem;
}

.chart-wrapper {
  margin: 2rem 0;
  padding: 1rem;
  background: var(--surface-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

h2 {
  color: var(--text-color);
  margin-bottom: 2rem;
}
</style>