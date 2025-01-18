<template>
  <div class="dashboard-container">
    <h1>Dashboard</h1>
    <div class="controls">
      <!-- Search Section -->
      <div class="search-bar">
        <InputText
          v-model="searchTerm"
          placeholder="Search..."
          @input="filterResources"
          class="p-inputtext-lg w-full"
        />
        <Button
          icon="pi pi-search"
          class="p-button-outlined p-button-primary"
        />
      </div>

      <!-- Filter Button -->
      <div class="filter-section">
        <Button
          label="Filter"
          icon="pi pi-filter"
          class="p-button-outlined p-button-secondary"
          @click="showFilterOverlay = true"
        />
      </div>
    </div>

    <!-- Filter Overlay -->
    <Transition name="fade">
      <div v-if="showFilterOverlay" class="filter-overlay">
        <div class="overlay-content">
          <h2>Filter by Health Status</h2>
          <i class="pi pi-times close-icon" @click="showFilterOverlay = false"></i>
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
        </div>
      </div>
    </Transition>

    <!-- Resource Cards -->
    <div class="resources">
      <h2>Automation Systems</h2>
      <div
        class="resource-card"
        v-for="(resource, index) in filteredResources"
        :key="index"
      >
        <div class="resource-details">
          <h3>{{ resource.name }}</h3>
          <p>{{ resource.description }}</p>
        </div>
        <div class="resource-actions">
          <Button
            icon="pi pi-info-circle"
            class="p-button-rounded p-button-info"
            @click="showResourceDetails(resource)"
          />
          <Button
            icon="pi pi-pencil"
            class="p-button-rounded p-button-warning"
            @click="editResource(resource)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-danger"
            @click="deleteResource(index)"
          />
        </div>
      </div>
    </div>

    <!-- Resource Details Overlay -->
    <div v-if="showOverlayinfo && shownResource" class="overlay">
      <div class="overlay-content">
        <i class="pi pi-times close-icon" @click="showOverlayinfo = false"></i>
        <h2>{{ shownResource.name }}</h2>
        <p><strong>Description:</strong> {{ shownResource.description }}</p>
        <p><strong>Health Status:</strong> {{ shownResource.healthStatus }}</p>
        <p><strong>Type:</strong> {{ shownResource.type }}</p>
        <p><strong>Automation Project:</strong> {{ shownResource.automationProject }}</p>
      </div>
    </div>

    <!-- Edit Resource Overlay -->
    <div v-if="showOverlayEdit && shownResource" class="overlay">
      <div class="overlay-content">
        <i class="pi pi-times close-icon" @click="showOverlayEdit = false"></i>
        <form @submit.prevent="handleEditResource">
          <h2>Edit Resource</h2>
          <div class="form-field">
            <label>Description</label>
            <InputText v-model="shownResource.description" />
          </div>
          <div class="form-field">
            <label>Health Status</label>
            <InputText v-model="shownResource.healthStatus" />
          </div>
          <div class="form-field">
            <label>Type</label>
            <InputText v-model="shownResource.type" />
          </div>
          <div class="form-field">
            <label>Automation Project</label>
            <InputText v-model="shownResource.automationProject" />
          </div>
          <Button type="submit" label="Save" class="p-button-success" />
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';

export default {
  name: 'Dashboard',
  components: { InputText, Button, Checkbox },
  data() {
    return {
      resources: [
        {
          name: 'System A',
          description: 'Description A',
          healthStatus: 'healthy',
          type: 'Type A',
          automationProject: 'Project A',
        },
        {
          name: 'System B',
          description: 'Description B',
          healthStatus: 'unhealthy',
          type: 'Type B',
          automationProject: 'Project B',
        },
      ],
      filteredResources: [],
      searchTerm: '',
      healthStatusFilter: [],
      showFilterOverlay: false,
      showOverlayinfo: false,
      showOverlayEdit: false,
      shownResource: null,
    };
  },
  created() {
    this.filterResources();
  },
  methods: {
    filterResources() {
      this.filteredResources = this.resources.filter((resource) => {
        const matchesSearch = this.searchTerm
          ? resource.name.toLowerCase().includes(this.searchTerm.toLowerCase())
          : true;
        const matchesFilter = this.healthStatusFilter.length
          ? this.healthStatusFilter.includes(resource.healthStatus)
          : true;
        return matchesSearch && matchesFilter;
      });
    },
    showResourceDetails(resource) {
      this.shownResource = resource;
      this.showOverlayinfo = true;
    },
    editResource(resource) {
      this.shownResource = resource;
      this.showOverlayEdit = true;
    },
    handleEditResource() {
      this.showOverlayEdit = false;
      this.filterResources();
    },
    deleteResource(index) {
      this.resources.splice(index, 1);
      this.filterResources();
    },
  },
};
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}
.header h1 {
  color: var(--text-color);
}
.controls {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.resource-card {
  background: var(--surface-color);
  color: var(--text-color);
  box-shadow: 0px 2px 6px var(--border-color);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.overlay,
.filter-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
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

.form-field {
  margin-bottom: 1rem;
}

.form-field label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.resource-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1rem;
}
</style>
