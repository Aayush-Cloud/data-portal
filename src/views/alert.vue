<template>
  <div class="alerts-container">
    <div class="header-section">
      <h2>System Alerts</h2>
      <div class="alert-filters">
        <MultiSelect v-model="selectedPriorities" :options="priorities" placeholder="Filter by Priority" />
        <Button icon="pi pi-bell" :badge="unreadCount" severity="danger" />
      </div>
    </div>

    <!-- Critical Alerts Section -->
    <div class="alert-section">
      <h3>Critical Alerts <Badge :value="criticalCount" severity="danger" /></h3>
      <div class="alert-cards">
        <div v-for="alert in criticalAlerts" :key="alert.id" class="alert-card critical">
          <div class="alert-header">
            <Tag severity="danger" value="Critical" />
            <span class="timestamp">{{ formatDate(alert.timestamp) }}</span>
          </div>
          <div class="alert-content">
            <h4>{{ alert.machineName }}</h4>
            <p class="alert-message">System Performance Critical</p>
            <div class="metrics">
              <span><i class="pi pi-cog"></i> Type: {{ alert.type }}</span>
              <span><i class="pi pi-briefcase"></i> Project: {{ alert.project }}</span>
            </div>
            <p>{{ alert.message }}</p>
          </div>
          <div class="alert-actions">
            <Button label="View Details" class="p-button-danger p-button-outlined" />
            <Button label="Take Action" severity="danger" />
          </div>
        </div>
      </div>
    </div>

    <!-- Warning Alerts Section -->
    <div class="alert-section">
      <h3>Warnings <Badge :value="warningCount" severity="warning" /></h3>
      <div class="alert-cards">
        <div v-for="alert in warningAlerts" :key="alert.id" 
             class="alert-card warning">
          <div class="alert-header">
            <Tag severity="warning" value="Warning" />
            <span class="timestamp">{{ formatDate(alert.timestamp) }}</span>
          </div>
          <p class="alert-message">System Performance Critical</p>
            <div class="metrics">
              <span><i class="pi pi-cog"></i> Type: {{ alert.type }}</span>
              <span><i class="pi pi-briefcase"></i> Project: {{ alert.project }}</span>
            </div>
          <div class="alert-content">
            <h4>{{ alert.machineName }}</h4>
            <p>{{ alert.message }}</p>
          </div>
          <div class="alert-actions">
            <Button label="View Details" class="p-button-outlined p-button-sm" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import MultiSelect from 'primevue/multiselect'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'
import MachineService from '../api/MachineServices'

export default {
  name: 'Alerts',
  components: {
    MultiSelect,
    Button,
    Tag,
    Badge
  },
  setup() {
    const machines = ref([])
    const selectedPriorities = ref([])
    const priorities = ['Critical', 'Warning']

    const criticalAlerts = computed(() => 
    machines.value
    .filter(m => ['critically unhealthy', 'severely unhealthy'].includes(m.healthStatus))
    .map(machine => ({
      id: machine._id,
      machineName: machine.name,
      message: `Critical system failure detected in ${machine.name}`,
      priority: 'Critical',
      timestamp: machine.lastUpdated,
      type: machine.type,
      project: machine.automationProject,
      metrics: {
        cycleTime: machine.idealCycleTime,
        outputRate: machine.idealOutputRate
      }
    }))
)

    const warningAlerts = computed(() => 
      machines.value.filter(m => m.healthStatus === 'unhealthy')
        .map(machine => ({
          id: machine._id,
          machineName: machine.name,
          message: `Performance warning for ${machine.name}`,
          priority: 'Warning',
          timestamp: machine.lastUpdated,
          type: machine.type,
          project: machine.automationProject,
          metrics: {
            cycleTime: machine.idealCycleTime,
            outputRate: machine.idealOutputRate
          }
        }))
    )

    const criticalCount = computed(() => criticalAlerts.value.length)
    const warningCount = computed(() => warningAlerts.value.length)
    const unreadCount = computed(() => criticalCount.value + warningCount.value)

    const formatDate = (date) => {
      return new Date(date).toLocaleString()
    }

    const fetchMachines = async () => {
      try {
        const response = await MachineService.getMachines()
        machines.value = response.data
      } catch (error) {
        console.error('Failed to fetch machines:', error)
      }
    }

    onMounted(() => {
      fetchMachines()
      // Refresh data every minute
      setInterval(fetchMachines, 60000)
    })

    return {
      selectedPriorities,
      priorities,
      criticalAlerts,
      warningAlerts,
      criticalCount,
      warningCount,
      unreadCount,
      formatDate
    }
  }
}
</script>

<style scoped>
.alerts-container {
  padding: 2rem;
  background: var(--surface-color);
  min-height: 100vh;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.alert-sections {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.alert-section h3 {
  margin-bottom: 1rem;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alert-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1rem;
}

.alert-card {
  background: var(--surface-card);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.alert-card.critical {
  border-left: 4px solid var(--red-700);
  background: linear-gradient(to right, rgba(211, 47, 47, 0.1), transparent);
}

.alert-card.critical .alert-message {
  color: var(--red-700);
  font-weight: 600;
}

.metrics {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
  color: var(--text-color-secondary);
}

.metrics i {
  margin-right: 0.5rem;
}

.alert-card.warning {
  border-left: 4px solid var(--yellow-500);
  background: linear-gradient(to right, rgba(255, 167, 38, 0.1), transparent);
}

.alert-card.warning .alert-message {
  color: var(--yellow-700);
  font-weight: 600;
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.timestamp {
  color: var(--text-color-secondary);
  font-size: 0.9rem;
}

.alert-content {
  margin: 1rem 0;
}

.alert-content h4 {
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.alert-content p {
  color: var(--text-color-secondary);
}

.alert-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

:deep(.p-button) {
  padding: 0.5rem 1rem;
}

:deep(.p-button-sm) {
  font-size: 0.875rem;
}
</style>