<!-- Dashboard.vue -->
<template>
  <div class="dashboard-container">
    <!-- Header -->
    <h1 class="header">Machine Dashboard</h1>

    <div class="header-actions">
      <Button 
        label="Export Data" 
        icon="pi pi-download" 
        class="p-button-outlined"
        @click="exportToCSV" 
        :loading="exporting"
      />
    </div>

   <!-- Controls Section -->
<div class="controls">
  <div class="search-bar">
    <InputText 
      v-model="searchTerm" 
      placeholder="Search machines..." 
      class="p-inputtext-lg w-full" 
      @input="filterResources" 
    />
    <Button 
      icon="pi pi-search" 
      class="p-button-outlined p-button-primary ml-2" 
    />
  </div>

  <Button 
    label="Filter" 
    icon="pi pi-filter" 
    class="p-button-outlined p-button-secondary" 
    @click="showFilterOverlay = true" 
  />
</div>

<!-- Loading State -->
<div v-if="loading" class="loading-overlay">
  <ProgressSpinner />
</div>

<!-- Error Message -->
<Message v-if="error" severity="error" :text="error" class="mb-4" />

<!-- Resources Grid -->
<div class="resources">
  <h2>Automation Systems</h2>
  <div 
    v-for="machine in filteredResources" 
    :key="machine._id" 
    class="resource-card"
  >
    <div class="resource-details">
      <h3>{{ machine.name }}</h3>
      <p>{{ machine.description }}</p>
      <Tag 
        :severity="machine.healthStatus === 'healthy' ? 'success' : 'danger'"
        class="health-tag"
      >
        {{ machine.healthStatus }}
      </Tag>
    </div>

    <div class="resource-actions">
      <Button 
        icon="pi pi-info-circle" 
        class="p-button-rounded p-button-info" 
        @click="showResourceDetails(machine)" 
      />
      <Button 
        icon="pi pi-pencil" 
        class="p-button-rounded p-button-warning" 
        @click="editResource(machine)" 
      />
      <Button 
        icon="pi pi-trash" 
        class="p-button-rounded p-button-danger" 
        @click="confirmDelete(machine)" 
      />
    </div>
  </div>
</div>

<!-- Filter Overlay -->
<Transition name="fade">
  <div v-if="showFilterOverlay" class="overlay">
    <div class="overlay-content">
      <div class="overlay-header">
        <h2>Filter by Health Status</h2>
        <i class="pi pi-times close-icon" @click="showFilterOverlay = false"></i>
      </div>
      <div class="filter-options">
        <div class="filter-option">
          <Checkbox 
            inputId="healthy" 
            value="healthy" 
            v-model="healthStatusFilter" 
            @change="filterResources" 
          />
          <label for="healthy" class="filter-label">Healthy</label>
        </div>
        <div class="filter-option">
          <Checkbox 
            inputId="unhealthy" 
            value="unhealthy" 
            v-model="healthStatusFilter" 
            @change="filterResources" 
          />
          <label for="unhealthy" class="filter-label">Unhealthy</label>
        </div>
      </div>
      <div class="overlay-footer">
        <Button 
          label="Apply Filters" 
          class="p-button-primary" 
          @click="showFilterOverlay = false" 
        />
      </div>
    </div>
  </div>
</Transition>

<!-- Resource Details Overlay -->
<Transition name="fade">
  <div v-if="showDetailsOverlay" class="overlay">
    <div class="overlay-content">
      <div class="overlay-header">
        <h2>{{ selectedResource?.name }}</h2>
        <i class="pi pi-times close-icon" @click="showDetailsOverlay = false"></i>
      </div>
      <div v-if="selectedResource" class="resource-details-content">
        <div class="info-section">
          <h3>Basic Information</h3>
          <p><strong>Description:</strong> {{ selectedResource.description }}</p>
          <p><strong>Health Status:</strong> {{ selectedResource.healthStatus }}</p>
          <p><strong>Type:</strong> {{ selectedResource.type }}</p>
          <p><strong>Project:</strong> {{ selectedResource.automationProject }}</p>
          <p><strong>Status:</strong> {{ selectedResource.status }}</p>
        </div>

        <div class="info-section">
          <h3>OEE Metrics</h3>
          <div class="metrics-grid">
            <p><strong>Availability:</strong> {{ selectedResource.availability }}%</p>
            <p><strong>Performance:</strong> {{ selectedResource.performance }}%</p>
            <p><strong>Quality:</strong> {{ selectedResource.quality }}%</p>
            <p><strong>OEE:</strong> {{ selectedResource.oee }}%</p>
          </div>
        </div>

        <div class="info-section">
          <h3>Production Information</h3>
          <p><strong>Planned Production:</strong> {{ selectedResource.plannedProductionTime }} min</p>
          <p><strong>Operating Time:</strong> {{ selectedResource.operatingTime }} min</p>
          <p><strong>Ideal Cycle Time:</strong> {{ selectedResource.idealCycleTime }} sec</p>
          <p><strong>Ideal Output Rate:</strong> {{ selectedResource.idealOutputRate }} pcs/min</p>
        </div>

        <div class="info-section" v-if="!influxLoading && influxData">
          <h3>Real-time Status</h3>
          
          <!-- Application Status -->
          <div class="module-section">
            <h4>Application Status</h4>
            <div class="module-grid">
              <div v-for="(status, module) in influxData.application" :key="module" class="module-card">
                <h5>{{ module }}</h5>
                <div class="status-indicators">
                  <p><i :class="['pi', status.active ? 'pi-check' : 'pi-times']"></i> Active</p>
                  <p><i :class="['pi', status.error ? 'pi-exclamation-triangle' : 'pi-check']"></i> Error</p>
                  <p><i :class="['pi', status.ready ? 'pi-check' : 'pi-times']"></i> Ready</p>
                </div>
              </div>
            </div>
          </div>
      
          <!-- Conveyor Status -->
          <div class="module-section">
            <h4>Conveyor Status</h4>
            <div class="module-grid">
              <div v-for="(status, module) in influxData.conveyor" :key="module" class="module-card">
                <h5>{{ module }}</h5>
                <p><strong>Status:</strong> {{ status.running ? 'Running' : 'Stopped' }}</p>
              </div>
            </div>
          </div>
      
          <!-- RFID Data -->
          <div class="module-section">
            <h4>RFID Carriers</h4>
            <div class="module-grid">
              <div v-for="(data, id) in influxData.rfid" :key="id" class="module-card">
                <h5>Carrier {{ data.carrierId }}</h5>
                <p><strong>Code:</strong> {{ data.code || 'N/A' }}</p>
                <p><strong>Last Update:</strong> {{ data.timestamp ? formatDate(data.timestamp) : 'N/A' }}</p>
              </div>
            </div>
          </div>
        </div>
      
        <div v-if="influxLoading" class="info-section">
          <ProgressSpinner />
        </div>
      
        <div v-if="influxError" class="info-section error">
          <Message severity="error" :text="influxError" />
        </div>
      </div>
      <div class="overlay-footer">
        <Button label="Close" class="p-button-outlined" @click="showDetailsOverlay = false" />
      </div>
    </div>
  </div>
</Transition>

<!-- Edit Resource Overlay -->
<Transition name="fade">
  <div v-if="showEditOverlay" class="overlay">
    <div class="overlay-content">
      <div class="overlay-header">
        <h2>Edit Resource</h2>
        <i class="pi pi-times close-icon" @click="showEditOverlay = false"></i>
      </div>
      <div v-if="editingResource" class="p-fluid">
        <div class="form-section">
          <h3>Basic Information</h3>
          <div class="form-field">
            <label>Name</label>
            <InputText v-model="editingResource.name" required />
          </div>
          <div class="form-field">
            <label>Description</label>
            <InputText v-model="editingResource.description" />
          </div>
          <div class="form-field">
            <label>Type</label>
            <InputText v-model="editingResource.type" />
          </div>
          <div class="form-field">
            <label>Project</label>
            <InputText v-model="editingResource.automationProject" />
          </div>
          <div class="form-field">
            <label>Status</label>
            <Dropdown v-model="editingResource.status" 
                     :options="['running', 'stopped', 'maintenance']" />
          </div>
        </div>

        <div class="form-section">
          <h3>Production Settings</h3>
          <div class="form-field">
            <label>Planned Production Time (minutes)</label>
            <InputNumber v-model="editingResource.plannedProductionTime" />
          </div>
          <div class="form-field">
            <label>Operating Time (minutes)</label>
            <InputNumber v-model="editingResource.operatingTime" />
          </div>
          <div class="form-field">
            <label>Ideal Cycle Time (seconds)</label>
            <InputNumber v-model="editingResource.idealCycleTime" />
          </div>
          <div class="form-field">
            <label>Ideal Output Rate (pieces/minute)</label>
            <InputNumber v-model="editingResource.idealOutputRate" />
          </div>
        </div>
      </div>
      <div class="overlay-footer">
        <Button label="Cancel" class="p-button-outlined" @click="showEditOverlay = false" />
        <Button label="Save" class="p-button-primary" @click="saveResource" />
      </div>
    </div>
  </div>
</Transition>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import MachineService from '../api/MachineServices';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import ProgressSpinner from 'primevue/progressspinner';
import Message from 'primevue/message';
import Tag from 'primevue/tag';
import Dropdown from 'primevue/dropdown';
import InputNumber from 'primevue/inputnumber'
import { convertToCSV, downloadCSV } from '../utils/exportUtils';

export default {
  name: 'Dashboard',
  components: {
    InputText,
    Button,
    Checkbox,
    ProgressSpinner,
    Message,
    Tag,
    Dropdown,
    InputNumber
  },
  data() {
    return {
      resources: [],
      filteredResources: [],
      searchTerm: '',
      healthStatusFilter: [],
      loading: false,
      error: null,
      showFilterOverlay: false,
      showDetailsOverlay: false,
      showEditOverlay: false,
      showDeleteOverlay: false,
      selectedResource: null,
      editingResource: null,
      resourceToDelete: null,
      influxData: {
        application: {
          Press: { active: false, error: false, ready: false },
          Turning: { active: false, error: false, ready: false }
        },
        conveyor: {
          Press: { running: false },
          Turning: { running: false }
        },
        emergency: {
          Press: { pressed: false },
          Turning: { pressed: false }
        },
        rfid: {
          '0': { carrierId: 0, code: null, timestamp: null },
          '1': { carrierId: 1, code: null, timestamp: null }
        }
      },
      influxLoading: false,
      influxError: null,
      exporting: false
    };
  },
  async created() {
    await this.fetchResources();
  },
  methods: {
    async fetchResources() {
      try {
        this.loading = true;
        const response = await MachineService.getMachines();
        this.resources = response.data;
        this.filterResources();
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to fetch resources';
      } finally {
        this.loading = false;
      }
    },
    filterResources() {
      this.filteredResources = this.resources.filter(resource => {
        const matchesSearch = !this.searchTerm || 
          resource.name.toLowerCase().includes(this.searchTerm.toLowerCase());
        const matchesFilter = !this.healthStatusFilter.length || 
          this.healthStatusFilter.includes(resource.healthStatus);
        return matchesSearch && matchesFilter;
      });
    },
    async fetchInfluxData(machineId) {
      try {
        this.influxLoading = true;
        const [appData, conveyorData, emergencyData, rfidData] = await Promise.all([
          MachineService.getModuleStatus(machineId),
          MachineService.getConveyorStatus(machineId),
          MachineService.getEmergencyStatus(machineId),
          MachineService.getRfidData(machineId)
        ]);

        this.influxData = {
          application: appData.data,
          conveyor: conveyorData.data,
          emergency: emergencyData.data,
          rfid: rfidData.data
        };
      } catch (error) {
        console.error('Error fetching InfluxDB data:', error);
        this.influxError = 'Failed to fetch real-time data';
      } finally {
        this.influxLoading = false;
      }
    },

    async showResourceDetails(machine) {
      this.selectedResource = machine;
      await this.fetchInfluxData(machine._id);
      this.showDetailsOverlay = true;
    },
    editResource(resource) {
      this.editingResource = { ...resource };
      this.showEditOverlay = true;
    },
    async saveResource() {
      try {
        this.loading = true;
        await MachineService.updateMachine(
          this.editingResource._id,
          this.editingResource
        );
        await this.fetchResources();
        this.showEditOverlay = false;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to update resource';
      } finally {
        this.loading = false;
      }
    },
    confirmDelete(resource) {
      this.resourceToDelete = resource;
      this.showDeleteOverlay = true;
    },
    async deleteResourceConfirmed() {
      try {
        this.loading = true;
        await MachineService.deleteMachine(this.resourceToDelete._id);
        await this.fetchResources();
        this.showDeleteOverlay = false;
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to delete resource';
      } finally {
        this.loading = false;
      }
    },
    async exportToCSV() {
      try {
        this.exporting = true;
        const csvContent = convertToCSV(this.resources);
        const filename = `machine-data-${new Date().toISOString().split('T')[0]}.csv`;
        downloadCSV(csvContent, filename);
      } catch (error) {
        console.error('Export failed:', error);
      } finally {
        this.exporting = false;
      }
    }
  },
};
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  background-color: var(--background-color);
  min-height: 100vh;
}

.header {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-bar {
  display: flex;
  gap: 10px;
  flex-grow: 1;
}

.resources {
  margin-top: 20px;
}

.resource-card {
  background: var(--surface-color);
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  transition: transform 0.2s;
}

.resource-card:hover {
  transform: translateY(-2px);
}

.resource-details h3 {
  margin: 0;
}

.health-tag {
  margin-top: 10px;
}

.resource-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

/* Overlay Styles */
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

close-icon:hover {
  color: var(--text-color);
}

.overlay-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--surface-border);
}

.form-field {
  margin-bottom: 1.5rem;
}

.form-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.filter-options {
  margin: 1.5rem 0;
}

.filter-option {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.filter-label {
  margin-left: 0.75rem;
  cursor: pointer;
  font-size: 1rem;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.resource-details-content {
  margin: 1rem 0;
}

.resource-details-content p {
  margin-bottom: 0.75rem;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Add these new styles */
.module-section {
  margin-top: 1rem;
}

.module-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 0.5rem;
}

.module-card {
  background: var(--surface-ground);
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid var(--surface-border);
}

.status-indicators {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.status-indicators p {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-indicators .pi-check {
  color: var(--green-500);
}

.status-indicators .pi-times {
  color: var(--red-500);
}

.status-indicators .pi-exclamation-triangle {
  color: var(--yellow-500);
}

.header-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1rem;
}
</style>