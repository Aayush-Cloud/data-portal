<template>
    <div class="machine-error-card" :class="statusClass">
      <div class="card-header">
        <div class="title-section">
          <h3>{{ machine.name }}</h3>
          <Tag :value="machine.healthStatus" 
               :severity="getSeverity(machine.healthStatus)" />
        </div>
        <div class="timestamp">
          <i class="pi pi-clock"></i>
          {{ formatDate(machine.lastUpdate) }}
        </div>
      </div>
  
      <div class="card-content">
        <div class="metrics-section">
          <div class="metric">
            <label>Availability</label>
            <ProgressBar :value="machine.availability" 
                        :class="getMetricClass(machine.availability)" />
          </div>
          <div class="metric">
            <label>Performance</label>
            <ProgressBar :value="machine.performance" 
                        :class="getMetricClass(machine.performance)" />
          </div>
          <div class="metric">
            <label>Quality</label>
            <ProgressBar :value="machine.quality" 
                        :class="getMetricClass(machine.quality)" />
          </div>
        </div>
  
        <div class="details-section">
          <p><i class="pi pi-tag"></i> {{ machine.type }}</p>
          <p><i class="pi pi-folder"></i> {{ machine.automationProject }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'MachineErrorCard',
    props: {
      machine: {
        type: Object,
        required: true
      }
    },
    computed: {
      statusClass() {
        return `status-${this.machine.healthStatus.toLowerCase()}`;
      }
    },
    methods: {
      getSeverity(status) {
        const severityMap = {
          unhealthy: 'warning',
          severe: 'danger',
          critical: 'danger'
        };
        return severityMap[status.toLowerCase()] || 'info';
      },
      getMetricClass(value) {
        if (value < 50) return 'metric-danger';
        if (value < 75) return 'metric-warning';
        return 'metric-success';
      },
      formatDate(date) {
        return new Date(date).toLocaleString();
      }
    }
  }
  </script>
  
  <style scoped>
  .machine-error-card {
    padding: 1.5rem;
    border-radius: 8px;
    background: var(--surface-card);
    margin-bottom: 1rem;
    transition: transform 0.2s;
  }
  
  .machine-error-card:hover {
    transform: translateY(-2px);
  }
  
  .status-unhealthy {
    border-left: 4px solid var(--yellow-500);
    background: var(--yellow-50);
  }
  
  .status-severe {
    border-left: 4px solid var(--orange-500);
    background: var(--orange-50);
  }
  
  .status-critical {
    border-left: 4px solid var(--red-500);
    background: var(--red-50);
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .title-section {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .metrics-section {
    display: grid;
    gap: 1rem;
    margin: 1rem 0;
  }
  
  .metric {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .details-section {
    display: flex;
    gap: 1rem;
    color: var(--text-color-secondary);
  }
  
  .timestamp {
    font-size: 0.9rem;
    color: var(--text-color-secondary);
  }
  
  .metric-danger :deep(.p-progressbar-value) {
    background: var(--red-500);
  }
  
  .metric-warning :deep(.p-progressbar-value) {
    background: var(--orange-500);
  }
  
  .metric-success :deep(.p-progressbar-value) {
    background: var(--green-500);
  }
  </style>