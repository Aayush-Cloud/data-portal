<template>
  <div class="error-logs-container">
    <div class="header-section">
      <h2>System Error Logs</h2>
      <div class="error-stats">
        <div class="stat-card">
          <span class="stat-value">{{ unhealthyCount }}</span>
          <span class="stat-label">Unhealthy Systems</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ severeCount }}</span>
          <span class="stat-label">Severe Systems</span>
        </div>
        <div class="stat-card">
          <span class="stat-value">{{ criticalCount }}</span>
          <span class="stat-label">Critical Systems</span>
        </div>
      </div>
    </div>

    <div class="error-grid">
      <div v-for="machine in unhealthyMachines" 
           :key="machine._id" 
           :class="['error-card', getStatusClass(machine.healthStatus)]">
        <div class="error-header">
          <h3>{{ machine.name }}</h3>
          <Tag :severity="getSeverity(machine.healthStatus)">
            {{ machine.healthStatus }}
          </Tag>
        </div>
        
        <div class="error-content">
          <div class="error-detail">
            <i class="pi pi-info-circle"></i>
            <span>Type: {{ machine.type }}</span>
          </div>
          <div class="error-detail">
            <i class="pi pi-clock"></i>
            <span>Last Updated: {{ formatDate(machine.lastUpdated) }}</span>
          </div>
          <div class="error-detail">
            <i class="pi pi-briefcase"></i>
            <span>Project: {{ machine.automationProject }}</span>
          </div>
        </div>

        <div class="error-actions">
          <Button 
            label="View Details" 
            class="p-button-outlined" 
            @click="showDetails(machine)" 
          />
        </div>
      </div>
    </div>

    <!-- Details Overlay -->
    <BaseOverlay :show="showDetailsOverlay" @close="closeDetails">
      <div v-if="selectedMachine" class="details-content">
        <h2>{{ selectedMachine.name }}</h2>
        <div class="details-grid">
          <p><strong>Description:</strong> {{ selectedMachine.description }}</p>
          <p><strong>Health Status:</strong> {{ selectedMachine.healthStatus }}</p>
          <p><strong>Type:</strong> {{ selectedMachine.type }}</p>
          <p><strong>Project:</strong> {{ selectedMachine.automationProject }}</p>
          <p><strong>Ideal Cycle Time:</strong> {{ selectedMachine.idealCycleTime }} seconds</p>
          <p><strong>Ideal Output Rate:</strong> {{ selectedMachine.idealOutputRate }} pieces/minute</p>
        </div>
      </div>
    </BaseOverlay>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import BaseOverlay from '../components/BaseOverlay.vue'
import Button from 'primevue/button'
import Tag from 'primevue/tag'
import MachineService from '../api/MachineServices'

export default {
  name: 'ErrorLogs',
  components: {
    BaseOverlay,
    Button,
    Tag
  },
  setup() {
    const machines = ref([])
    const showDetailsOverlay = ref(false)
    const selectedMachine = ref(null)

    const unhealthyMachines = computed(() => 
      machines.value.filter(m => m.healthStatus !== 'healthy')
    )

    const unhealthyCount = computed(() => 
      machines.value.filter(m => m.healthStatus === 'unhealthy').length
    )

    const severeCount = computed(() => 
      machines.value.filter(m => m.healthStatus === 'severely unhealthy').length
    )
    const criticalCount = computed(() => 
      machines.value.filter(m => m.healthStatus === 'critically unhealthy').length
    )

    const getSeverity = (status) => {
      return status === 'severe' ? 'danger' : 'warning'
    }

    const getStatusClass = (status) => {
      return {
        'status-unhealthy': status === 'unhealthy',
        'status-severe': status === 'severely unhealthy'
      }
    }

    const showDetails = (machine) => {
      selectedMachine.value = machine
      showDetailsOverlay.value = true
    }

    const closeDetails = () => {
      showDetailsOverlay.value = false
      selectedMachine.value = null
    }

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

    onMounted(fetchMachines)

    return {
      unhealthyMachines,
      unhealthyCount,
      severeCount,
      showDetailsOverlay,
      selectedMachine,
      getSeverity,
      getStatusClass,
      showDetails,
      closeDetails,
      formatDate,
      criticalCount
    }
  }
}
</script>

<style scoped>
.error-logs-container {
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

.error-stats {
  display: flex;
  gap: 2rem;
}

.stat-card {
  background: var(--surface-card);
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  min-width: 150px;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--text-color);
  display: block;
}

.stat-label {
  color: var(--text-color-secondary);
}

.error-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.error-card {
  background: var(--surface-card);
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.error-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.error-content {
  margin: 1.5rem 0;
}

.error-detail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.75rem 0;
  color: var(--text-color);
}

.error-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-border);
}

:deep(.pi) {
  color: var(--text-color-secondary);
}

:deep(.p-button) {
  padding: 0.75rem 1.25rem;
  font-size: 1rem;
  min-width: 120px;
}

:deep(.p-button.p-button-outlined) {
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
}

:deep(.p-button.p-button-danger) {
  background: var(--red-500);
  border: 1px solid var(--red-500);
  color: white;
}

:deep(.p-button .p-button-label) {
  font-weight: 600;
}

:deep(.p-button) {
  height: auto !important;
  padding: 0.75rem 1.5rem !important;
  font-size: 1rem !important;
}

:deep(.p-button-outlined) {
  background-color: transparent !important;
  border: 1px solid var(--primary-color) !important;
  color: var(--primary-color) !important;
  min-width: 130px !important;
}

:deep(.p-button-danger) {
  background-color: var(--red-500) !important;
  border-color: var(--red-500) !important;
  color: white !important;
  min-width: 130px !important;
}

:deep(.p-button-label) {
  font-weight: 600 !important;
  visibility: visible !important;
  display: inline-block !important;
}

.status-unhealthy {
  border-left: 4px solid var(--yellow-500);
}

.status-severe {
  border-left: 4px solid var(--red-700);
  animation: pulse 2s infinite;
}

.details-content {
  padding: 1rem;
}

.details-grid {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.error-card.status-unhealthy {
  border-left: 4px solid #FFA726;
  background: linear-gradient(to right, rgba(255, 167, 38, 0.1), transparent);
}

.error-card.status-severe {
  border-left: 4px solid #D32F2F;
  background: linear-gradient(to right, rgba(211, 47, 47, 0.1), transparent);
}

:deep(.p-tag.p-tag-warning) {
  background: #FFA726;
  color: #ffffff;
}

:deep(.p-tag.p-tag-danger) {
  background: #D32F2F;
  color: #ffffff;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.7; }
  100% { opacity: 1; }
}

</style>