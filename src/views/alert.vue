<template>
    <div class="alerts-container">
      <div class="header-section">
        <h2>System Alerts</h2>
        <div class="alert-filters">
          <MultiSelect
            v-model="selectedPriorities"
            :options="priorities"
            placeholder="Filter by Priority"
            class="p-mr-2"
          />
          <Button icon="pi pi-bell" :badge="unreadCount" severity="danger" />
        </div>
      </div>
  
      <!-- Priority Sections -->
      <div class="alert-sections">
        <!-- Critical Alerts -->
        <div class="alert-section">
          <h3>Critical Alerts <Badge :value="criticalCount" severity="danger" /></h3>
          <div class="alert-cards">
            <div v-for="alert in criticalAlerts" :key="alert.id" 
                 class="alert-card critical">
              <div class="alert-header">
                <Tag severity="danger" value="Critical" />
                <span class="timestamp">{{ formatDate(alert.timestamp) }}</span>
              </div>
              <div class="alert-content">
                <h4>{{ alert.machineName }}</h4>
                <p>{{ alert.message }}</p>
              </div>
              <div class="alert-actions">
                <Button label="View Machine" class="p-button-outlined p-button-sm" />
                <Button label="Acknowledge" severity="danger" class="p-button-sm" />
              </div>
            </div>
          </div>
        </div>
  
        <!-- Warning Alerts -->
        <div class="alert-section">
          <h3>Warnings <Badge :value="warningCount" severity="warning" /></h3>
          <div class="alert-cards">
            <div v-for="alert in warningAlerts" :key="alert.id" 
                 class="alert-card warning">
              <div class="alert-header">
                <Tag severity="warning" value="Warning" />
                <span class="timestamp">{{ formatDate(alert.timestamp) }}</span>
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
      const alerts = ref([])
      const selectedPriorities = ref([])
      const priorities = ['Critical', 'Warning', 'Info']
  
      const criticalAlerts = computed(() => 
        alerts.value.filter(a => a.priority === 'Critical')
      )
      
      const warningAlerts = computed(() => 
        alerts.value.filter(a => a.priority === 'Warning')
      )
  
      const criticalCount = computed(() => criticalAlerts.value.length)
      const warningCount = computed(() => warningAlerts.value.length)
      const unreadCount = computed(() => 
        alerts.value.filter(a => !a.isRead).length
      )
  
      const formatDate = (date) => {
        return new Date(date).toLocaleString()
      }
  
      const fetchAlerts = async () => {
        try {
          // Simulated data until API is ready
          alerts.value = [
            {
              id: 1,
              machineName: 'Machine A',
              message: 'Critical system failure detected',
              priority: 'Critical',
              timestamp: new Date(),
              isRead: false
            },
            {
              id: 2,
              machineName: 'Machine B',
              message: 'Performance degradation warning',
              priority: 'Warning',
              timestamp: new Date(),
              isRead: false
            }
          ]
        } catch (error) {
          console.error('Failed to fetch alerts:', error)
        }
      }
  
      onMounted(fetchAlerts)
  
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
    border-left: 4px solid var(--red-500);
  }
  
  .alert-card.warning {
    border-left: 4px solid var(--yellow-500);
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