<template>
  <div class="viz-container">
    <div class="header-section">
      <h2>System Visualizations</h2>
      <Dropdown v-model="selectedViz" :options="vizTypes" optionLabel="label" class="viz-selector" />
    </div>

    <div class="viz-content">
      <!-- Uptime Timeline -->
      <div v-if="selectedViz.value === 'uptime'" class="viz-card">
        <Timeline :value="uptimeData" layout="horizontal">
          <template #content="slotProps">
            <div class="status-marker" :class="slotProps.item.status">
              <small>{{ slotProps.item.date }}</small>
              <span>{{ slotProps.item.status }}</span>
              <p>{{ slotProps.item.description }}</p>
            </div>
          </template>
        </Timeline>
      </div>

      <!-- Heatmap -->
      <div v-if="selectedViz.value === 'heatmap'" class="viz-card">
        <Chart type="heatmap" :data="heatmapData" :options="heatmapOptions" />
      </div>

      <!-- Resource Usage -->
      <div v-if="selectedViz.value === 'resources'" class="viz-card">
        <div v-for="machine in machines" :key="machine._id" class="resource-meter">
          <h3>{{ machine.name }}</h3>
          <ProgressBar :value="machine.resourceUsage" />
          <small>CPU: {{ machine.cpu }}% | Memory: {{ machine.memory }}%</small>
        </div>
      </div>

      <!-- Error Analysis -->
      <div v-if="selectedViz.value === 'errors'" class="viz-card">
        <Chart type="line" :data="errorData" :options="errorOptions" />
      </div>

      <!-- Error Analysis Timeline -->
      <div v-if="selectedViz.value === 'errors'" class="viz-card">
        <Timeline :value="errorAnalysisData" layout="horizontal">
          <template #content="slotProps">
            <div class="error-timeline-marker"
                 :title="`${slotProps.item.details.unhealthy.label}: ${slotProps.item.details.unhealthy.count}
${slotProps.item.details.severe.label}: ${slotProps.item.details.severe.count}
${slotProps.item.details.critical.label}: ${slotProps.item.details.critical.count}`">
              <small>{{ slotProps.item.date }}</small>
              <span class="error-count">{{ slotProps.item.totalErrors }} Issues Found</span>
            </div>
          </template>
        </Timeline>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import Chart from 'primevue/chart'
import Timeline from 'primevue/timeline'
import ProgressBar from 'primevue/progressbar'
import Dropdown from 'primevue/dropdown'
import MachineService from '../api/MachineServices'

export default {
  name: 'Visualizations',
  components: {
    Chart,
    Timeline,
    ProgressBar,
    Dropdown
  },
  setup() {
    const selectedViz = ref({ label: 'Uptime Timeline', value: 'uptime' })
    const vizTypes = [
      { label: 'Uptime Timeline', value: 'uptime' },
      { label: 'Health Heatmap', value: 'heatmap' },
      { label: 'Resource Usage', value: 'resources' },
      { label: 'Error Analysis', value: 'errors' }
    ]

    const machines = ref([])
    const loading = ref(false)

    // Uptime Timeline Data
    const uptimeData = computed(() => {
      return machines.value.map(machine => ({
        date: new Date().toLocaleDateString(),
        status: machine.healthStatus,
        description: `${machine.name} - ${machine.type}`,
        icon: machine.healthStatus === 'healthy' ? 'pi pi-check' : 'pi pi-times'
      }))
    })

    // Heatmap Data
    const heatmapData = computed(() => ({
      labels: ['00:00', '06:00', '12:00', '18:00'],
      datasets: machines.value.map(machine => ({
        label: machine.name,
        data: [
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100
        ],
        backgroundColor: machine.healthStatus === 'healthy' ? '#4CAF50' : '#f44336'
      }))
    }))

    const heatmapOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: { color: 'var(--text-color)' }
        },
        title: {
          display: true,
          text: 'System Health Heatmap',
          color: 'var(--text-color)'
        }
      },
      scales: {
        x: { ticks: { color: 'var(--text-color)' } },
        y: { ticks: { color: 'var(--text-color)' } }
      }
    }

    // Error Analysis Data
    const errorData = computed(() => {
      const months = [
        'Aug 2024', 'Sep 2024', 'Oct 2024', 'Nov 2024', 'Dec 2024',
        'Jan 2025', 'Feb 2025', 'Mar 2025', 'Apr 2025'
      ]
      
      const today = new Date()
      const isFeb9 = today.getDate() === 9 && today.getMonth() === 1
    
      const data = months.map(month => {
        if (month === 'Feb 2025' && isFeb9) {
          return 3 // Three errors on Jan 27
        }
        return 0 // No errors on other dates
      })
    
      return {
        labels: months,
        datasets: [{
          label: 'System Issues',
          data: data,
          borderColor: '#f44336',
          backgroundColor: 'rgba(244, 67, 54, 0.1)',
          tension: 0.4,
          fill: true,
          pointRadius: data.map(value => value > 0 ? 6 : 3),
          pointHoverRadius: 8
        }]
      }
    })

    const errorOptions = {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) => {
              if (context.raw === 3) {
                return [
                  'Total Issues: 3',
                  'Unhealthy Systems: 1',
                  'Severely Unhealthy: 1',
                  'Critically Unhealthy: 1'
                ]
              }
              return `Issues: ${context.raw}`
            }
          }
        }
      },
      scales: {
        x: { 
          grid: { color: 'var(--surface-border)' },
          ticks: { color: 'var(--text-color)' }
        },
        y: {
          beginAtZero: true,
          grid: { color: 'var(--surface-border)' },
          ticks: { color: 'var(--text-color)' }
        }
      }
    }

    // Add new computed property for error analysis
    const errorAnalysisData = computed(() => {
      const unhealthyCount = machines.value.filter(m => m.healthStatus === 'unhealthy').length
      const severeCount = machines.value.filter(m => m.healthStatus === 'severe').length
      const criticalCount = machines.value.filter(m => m.healthStatus === 'critically unhealthy').length
  
      return [{
        date: new Date().toLocaleDateString(),
        totalErrors: unhealthyCount + severeCount + criticalCount,
        details: {
          unhealthy: {
            count: unhealthyCount,
            label: 'Unhealthy Systems'
          },
          severe: {
            count: severeCount,
            label: 'Severely Unhealthy'
          },
          critical: {
            count: criticalCount,
            label: 'Critically Unhealthy'
          }
        }
      }]
    })

    const fetchData = async () => {
      try {
        loading.value = true
        const response = await MachineService.getMachines()
        machines.value = response.data.map(machine => ({
          ...machine,
          resourceUsage: Math.random() * 100,
          cpu: Math.floor(Math.random() * 100),
          memory: Math.floor(Math.random() * 100)
        }))
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        loading.value = false
      }
    }

    onMounted(fetchData)

    return {
      selectedViz,
      vizTypes,
      machines,
      loading,
      uptimeData,
      heatmapData,
      heatmapOptions,
      errorData,
      errorOptions,
      errorAnalysisData // Update template section for error analysis
    }
  }
}
</script>

<style scoped>
.viz-container {
  padding: 2rem;
  background: var(--surface-color);
  min-height: 100vh;
}

.viz-card {
  background: var(--surface-color);
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-top: 2rem;
  min-height: 500px;
}

.resource-meter {
  margin: 1.5rem 0;
  padding: 1rem;
  border-radius: 8px;
  background: var(--surface-ground);
}

.status-marker {
  padding: 1rem;
  border-radius: 6px;
  background: var(--surface-ground);
}

.status-marker.healthy {
  border-left: 4px solid #4CAF50;
}

.status-marker.unhealthy {
  border-left: 4px solid #f44336;
}

.error-timeline-marker {
  background: linear-gradient(to right, rgba(244, 67, 54, 0.1), transparent);
  border-left: 4px solid var(--red-500);
  padding: 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.error-count {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--red-500);
  margin: 0.5rem 0;
  display: block;
}
</style>