<template>
  <div class="layout-wrapper">
    <!-- Sidebar -->
    <div class="sidebar">
      <PanelMenu :model="menuItems" class="sidebar-menu" />
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="dashboard-container">
        <!-- Header Section -->
        <div class="header">
          <h1>Data Portal</h1>
        </div>

        <!-- Search and Filter Section -->
        <div class="controls">
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

        <!-- Resource Section -->
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
    </div>
  </div>
</template>

<script>
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Checkbox from "primevue/checkbox";
import PanelMenu from "primevue/panelmenu";

export default {
  name: "Dashboard",
  components: { InputText, Button, Checkbox, PanelMenu },
  data() {
    return {
      resources: [
        {
          name: "System A",
          description: "Description A",
          healthStatus: "healthy",
          type: "Type A",
          automationProject: "Project A",
        },
        {
          name: "System B",
          description: "Description B",
          healthStatus: "unhealthy",
          type: "Type B",
          automationProject: "Project B",
        },
      ],
      filteredResources: [],
      searchTerm: "",
      healthStatusFilter: [],
      showFilterOverlay: false,
      showOverlayinfo: false,
      showOverlayEdit: false,
      shownResource: null,
      menuItems: [
        {
          items: [
            { label: "Dashboard", icon: "pi pi-home", to: "/dashboard" },
            { label: "Profile", icon: "pi pi-user", to: "/profile" },
            { label: "Graphs & Charts", icon: "pi pi-chart-bar", to: "/graphs" },
            { label: "Visualizations", icon: "pi pi-chart-pie", to: "/visualizations" },
            { label: "Error Logs", icon: "pi pi-exclamation-circle", to: "/logs" },
            { label: "Alerts", icon: "pi pi-bell", to: "/alerts" },
          ],
        },
      ],
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
.layout-wrapper {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 280px;
  background-color: var(--background-color);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding-top: 2rem;
}

.sidebar-menu {
  padding: 1rem;
  height: 100%;
}

.main-content {
  flex: 1;
  background-color: var(--background-color);
  color: var(--text-color);
}

:deep(.p-menuitem-link) {
  color: var(--text-color) !important;
}

.dashboard-container {
  padding: 20px;
  background-color: var(--background-color);
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
}

.overlay {
  background: rgba(0, 0, 0, 0.5);
}

.overlay-content {
  background: var(--surface-color);
  color: var(--text-color);
}
</style>
