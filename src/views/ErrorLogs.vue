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
            <span class="stat-value">{{ totalErrors }}</span>
            <span class="stat-label">Total Errors</span>
          </div>
        </div>
      </div>
  
      <div class="error-grid">
        <div v-for="machine in unhealthyMachines" :key="machine._id" class="error-card">
          <div class="error-header">
            <h3>{{ machine.name }}</h3>
            <Tag severity="danger" value="Unhealthy" />
          </div>
  
          <div class="error-content">
            <div class="error-detail">
              <i class="pi pi-exclamation-circle"></i>
              <span>Type: {{ machine.type }}</span>
            </div>
            <div class="error-detail">
              <i class="pi pi-clock"></i>
              <span>Last Updated: {{ formatDate(machine.lastUpdated) }}</span>
            </div>
            <div class="error-detail">
              <i class="pi pi-info-circle"></i>
              <span>Project: {{ machine.automationProject }}</span>
            </div>
          </div>
  
          <div class="error-actions">
            <Button label="View Details" class="p-button-outlined" />
            <Button label="Troubleshoot" severity="danger" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue'
  import Button from 'primevue/button'
  import MachineService from '../api/MachineServices'
  
  export default {
    components: {
      Button
    },
    setup() {
      const machines = ref([])
      
      const unhealthyMachines = computed(() => 
        machines.value.filter(m => m.healthStatus === 'unhealthy')
      )
      
      const unhealthyCount = computed(() => unhealthyMachines.value.length)
      const totalErrors = computed(() => machines.value.length)
  
      const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
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
        totalErrors,
        formatDate
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
  </style>