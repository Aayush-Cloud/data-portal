<template>
    <div class="dashboard-container">
      <h1 class="header">Machine Dashboard</h1>
  
      <!-- Search and Filter Controls -->
      <SearchFilter
        @search="handleSearch"
        @show-filter="showFilterOverlay = true"
      />
  
      <!-- Resources Grid -->
      <div class="resources">
        <h2>Automation Systems</h2>
        <ResourceCard
          v-for="machine in filteredResources"
          :key="machine._id"
          :resource="machine"
          @show-details="showResourceDetails"
          @edit="editResource"
          @delete="confirmDelete"
        />
      </div>
  
      <!-- Filter Overlay -->
      <BaseOverlay :show="showFilterOverlay" @close="showFilterOverlay = false">
        <h2>Filter by Health Status</h2>
        <div class="filter-options">
          <div class="filter-option">
            <Checkbox
              inputId="healthy"
              value="healthy"
              v-model="healthStatusFilter"
              @change="filterResources"
            />
            <label for="healthy">Healthy</label>
          </div>
          <div class="filter-option">
            <Checkbox
              inputId="unhealthy"
              value="unhealthy"
              v-model="healthStatusFilter"
              @change="filterResources"
            />
            <label for="unhealthy">Unhealthy</label>
          </div>
          <div class="overlay-footer">
            <Button 
              label="Apply Filters" 
              class="p-button-primary" 
              @click="showFilterOverlay = false" 
            />
          </div>
        </div>
      </BaseOverlay>
  
      <!-- Details Overlay -->
      <BaseOverlay :show="showDetailsOverlay" @close="showDetailsOverlay = false">
        <h2>{{ selectedResource?.name }}</h2>
        <div class="resource-details">
          <p><strong>Description:</strong> {{ selectedResource?.description }}</p>
          <p><strong>Health Status:</strong> {{ selectedResource?.healthStatus }}</p>
          <p><strong>Type:</strong> {{ selectedResource?.type }}</p>
          <p><strong>Project:</strong> {{ selectedResource?.automationProject }}</p>
        </div>
      </BaseOverlay>
  
      <!-- Edit Overlay -->
      <BaseOverlay :show="showEditOverlay" @close="showEditOverlay = false">
        <h2>Edit Resource</h2>
        <form @submit.prevent="saveResource" class="edit-form">
          <div class="form-field">
            <label>Description</label>
            <InputText v-model="editingResource.description" />
          </div>
          <div class="form-field">
            <label>Health Status</label>
            <Dropdown 
              v-model="editingResource.healthStatus" 
              :options="['healthy', 'unhealthy']" 
            />
          </div>
          <div class="form-field">
            <label>Type</label>
            <InputText v-model="editingResource.type" />
          </div>
          <div class="form-field">
            <label>Project</label>
            <InputText v-model="editingResource.automationProject" />
          </div>
          <div class="form-actions">
            <Button label="Cancel" @click="showEditOverlay = false" class="p-button-text" />
            <Button label="Save" type="submit" class="p-button-primary" />
          </div>
        </form>
      </BaseOverlay>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import BaseOverlay from '../components/BaseOverlay.vue';
  import ResourceCard from '../components/ResourceCard.vue';
  import SearchFilter from '../components/SearchFilter.vue';
  import MachineService from '../api/MachineService';
  
  export default {
    name: 'Dashboard',
    components: {
      BaseOverlay,
      ResourceCard,
      SearchFilter,
    },
    setup() {
      const resources = ref([]);
      const filteredResources = ref([]);
      const searchTerm = ref('');
      const healthStatusFilter = ref([]);
      const showFilterOverlay = ref(false);
      const showDetailsOverlay = ref(false);
      const showEditOverlay = ref(false);
      const selectedResource = ref(null);
      const editingResource = ref(null);
  
      const fetchResources = async () => {
        try {
          const response = await MachineService.getMachines();
          resources.value = response.data;
          filterResources();
        } catch (error) {
          console.error('Error fetching resources:', error);
        }
      };
  
      const filterResources = () => {
        filteredResources.value = resources.value.filter((resource) => {
          const matchesSearch = searchTerm.value
            ? resource.name.toLowerCase().includes(searchTerm.value.toLowerCase())
            : true;
          const matchesFilter = healthStatusFilter.value.length
            ? healthStatusFilter.value.includes(resource.healthStatus)
            : true;
          return matchesSearch && matchesFilter;
        });
      };
  
      const handleSearch = (query) => {
        searchTerm.value = query;
        filterResources();
      };
  
      const showResourceDetails = (resource) => {
        selectedResource.value = resource;
        showDetailsOverlay.value = true;
      };
  
      const editResource = (resource) => {
        editingResource.value = { ...resource };
        showEditOverlay.value = true;
      };
  
      const saveResource = async () => {
        try {
          await MachineService.updateMachine(
            editingResource.value._id,
            editingResource.value
          );
          await fetchResources();
          showEditOverlay.value = false;
        } catch (error) {
          console.error('Error updating resource:', error);
        }
      };
  
      const confirmDelete = async (resource) => {
        if (confirm('Are you sure you want to delete this resource?')) {
          try {
            await MachineService.deleteMachine(resource._id);
            await fetchResources();
          } catch (error) {
            console.error('Error deleting resource:', error);
          }
        }
      };
  
      onMounted(fetchResources);
  
      return {
        filteredResources,
        searchTerm,
        healthStatusFilter,
        showFilterOverlay,
        showDetailsOverlay,
        showEditOverlay,
        selectedResource,
        editingResource,
        handleSearch,
        filterResources,
        showResourceDetails,
        editResource,
        saveResource,
        confirmDelete,
      };
    },
  };
  </script>
  
  <style scoped>
  .dashboard-container {
    padding: 2rem;
    background: var(--background-color);
    min-height: 100vh;
  }
  
  .header {
    color: var(--text-color);
    margin-bottom: 2rem;
  }
  
  .resources h2 {
    color: var(--text-color);
    margin-bottom: 1.5rem;
  }
  
  .form-field {
    margin-bottom: 1.5rem;
  }
  
  .form-field label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-color);
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }
  
  .filter-option {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 1rem 0;
  }
  
  .filter-option label {
    color: var(--text-color);
    cursor: pointer;
  }
  
  .overlay-footer {
    margin-top: 2rem;
    display: flex;
    justify-content: flex-end;
  }
  
  .resource-details {
    margin-top: 1rem;
  }
  
  .resource-details p {
    margin: 0.5rem 0;
    color: var(--text-color);
  }
  </style>