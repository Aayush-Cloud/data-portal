<template>
  <div class="alerts-container">
    <div class="header-section">
      <h2>System Alerts</h2>
      <MultiSelect
        v-model="selectedPriorities"
        :options="priorities"
        placeholder="Filter by Priority"
        class="w-full md:w-20rem"
      />
    </div>

    <div class="alerts-grid">
      <div v-for="alert in alerts" 
           :key="alert.id" 
           class="alert-card"
           :class="[`alert-${alert.priority.toLowerCase()}`]">
        <div class="alert-header">
          <Tag :value="alert.priority" 
               :severity="alert.priority === 'Critical' ? 'danger' : 
                        alert.priority === 'Severe' ? 'warning' : 'info'" />
          <span class="alert-time">{{ new Date(alert.timestamp).toLocaleTimeString() }}</span>
        </div>
        
        <p class="alert-message">{{ alert.message }}</p>
        
        <div class="alert-details">
          <div class="metrics-grid">
            <div class="metric">
              <span>Availability:</span>
              <span>{{ alert.details.availability }}%</span>
            </div>
            <div class="metric">
              <span>Performance:</span>
              <span>{{ alert.details.performance }}%</span>
            </div>
            <div class="metric">
              <span>Quality:</span>
              <span>{{ alert.details.quality }}%</span>
            </div>
            <div class="metric oee">
              <span>OEE:</span>
              <span>{{ alert.details.oee }}%</span>
            </div>
          </div>
        </div>

        <div class="alert-actions">
          <Button 
            label="Dismiss" 
            icon="pi pi-times" 
            class="p-button-outlined p-button-secondary"
            @click="dismissAlert(alert.id)"
          />
        
          <Button 
            v-if="alert.priority !== 'Info'"
            label="Stop Machine" 
            icon="pi pi-power-off" 
            class="p-button-danger"
            @click="confirmStopMachine(alert)"
          />
        </div>
      </div>
    </div>



    <!-- Stop Confirmation Dialog -->
    <Dialog
      v-model:visible="showStopDialog"
      modal
      header="Confirm Stop Machine"
      :style="{ width: '350px' }"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem; color: var(--red-500)" />
        <span>    Are you sure you want to stop this machine?</span>
      </div>
      <template #footer>
        <Button 
          label="No" 
          icon="pi pi-times" 
          class="p-button-text"
          @click="showStopDialog = false" 
        />
        <Button 
          label="Yes" 
          icon="pi pi-check" 
          class="p-button-danger" 
          @click="stopMachine"
          :loading="stoppingMachine" 
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import MultiSelect from 'primevue/multiselect'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'
import Dialog from 'primevue/dialog'
import MachineService from '../api/MachineServices'

export default {
  name: 'Alerts',
  components: {
    MultiSelect,
    Button,
    Tag,
    Badge,
    Dialog
  },
  setup() {
    const machines = ref([])
    const selectedPriorities = ref([])
    const priorities = ['All', 'Critical', 'Severe', 'Warning']
    const loading = ref(false)
    const showEditDialog = ref(false)
    const selectedMachine = ref(null)
    const dismissedAlerts = ref(new Set())
    const stoppingMachine = ref(false)
    const showStopDialog = ref(false)
    const machineToStop = ref(null)

    const alerts = computed(() => {
      return machines.value.map(machine => ({
        id: machine._id,
        name: machine.name,
        status: machine.healthStatus,
        priority: getAlertPriority(machine.healthStatus),
        message: getAlertMessage(machine),
        timestamp: new Date(),
        details: {
          availability: machine.availability,
          performance: machine.performance,
          quality: machine.quality,
          oee: ((machine.availability * machine.performance * machine.quality) / 10000).toFixed(2)
        }
      }))
    })

    const getAlertPriority = (status) => {
      switch (status) {
        case 'critically unhealthy': return 'Critical'
        case 'severely unhealthy': return 'Severe'
        case 'unhealthy': return 'Warning'
        default: return 'Info'
      }
    }

    const getAlertMessage = (machine) => {
      switch (machine.healthStatus) {
        case 'critically unhealthy':
          return `Critical: ${machine.name} requires immediate attention`
        case 'severely unhealthy':
          return `Severe: ${machine.name} performance degrading`
        case 'unhealthy':
          return `Warning: ${machine.name} needs maintenance`
        default:
          return `${machine.name} is operating normally`
      }
    }

    const filteredAlerts = computed(() => {
      return alerts.value
        .filter(alert => !dismissedAlerts.value.has(alert.id))
        .filter(alert => {
          if (!selectedPriorities.value.length || selectedPriorities.value.includes('All')) {
            return true
          }
          return selectedPriorities.value.includes(alert.priority)
        })
    })

    const handleTakeAction = (machine) => {
      selectedMachine.value = machine
      showEditDialog.value = true
    }

    const dismissAlert = (alertId) => {
      dismissedAlerts.value.add(alertId)
    }

    const confirmStopMachine = (machine) => {
      machineToStop.value = machine
      showStopDialog.value = true
    }

    const stopMachine = async () => {
      try {
        stoppingMachine.value = true
        await MachineService.updateMachine(machineToStop.value.id, {
          ...machineToStop.value,
          status: 'stopped'
        })
        showStopDialog.value = false
        await fetchMachines()
      } catch (error) {
        console.error('Failed to stop machine:', error)
      } finally {
        stoppingMachine.value = false
      }
    }

    const fetchMachines = async () => {
      try {
        loading.value = true
        const response = await MachineService.getMachines()
        machines.value = response.data
      } catch (error) {
        console.error('Failed to fetch machines:', error)
      } finally {
        loading.value = false
      }
    }

    onMounted(fetchMachines)

    return {
      alerts: filteredAlerts,
      selectedPriorities,
      priorities,
      loading,
      showEditDialog,
      selectedMachine,
      handleTakeAction,
      dismissAlert,
      stoppingMachine,
      stopMachine,
      showStopDialog,
      machineToStop,
      confirmStopMachine
    }
  }
}
</script>

<style scoped>
.alerts-container {
  padding: 2rem;
  background: var(--surface-ground);
}

.alerts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.alert-card {
  background: var(--surface-card);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.alert-critical {
  border-left: 4px solid var(--red-500);
  background: linear-gradient(to right, var(--red-50), transparent);
}

.alert-severe {
  border-left: 4px solid var(--orange-500);
  background: linear-gradient(to right, var(--orange-50), transparent);
}

.alert-warning {
  border-left: 4px solid var(--yellow-500);
  background: linear-gradient(to right, var(--yellow-50), transparent);
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.alert-message {
  margin: 1rem 0;
  font-weight: 500;
}

.alert-details {
  display: grid;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-border);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.oee {
  font-weight: bold;
  color: var(--primary-color);
}

.alert-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-border);
}

.edit-form {
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

.form-field {
  display: grid;
  gap: 0.5rem;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.overlay-content {
  background: var(--surface-color);
  color: var(--text-color);
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.overlay-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--surface-border);
}

.overlay-header h2 {
  margin: 0;
  font-size: 1.5rem;
}

.close-icon {
  cursor: pointer;
  font-size: 1.5rem;
  color: var(--text-color-secondary);
}

.close-icon:hover {
  color: var(--text-color);
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: var(--text-color);
}

.form-field {
  margin-bottom: 1.5rem;
}

.form-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.overlay-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-border);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.confirmation-content {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 0;
}
</style>