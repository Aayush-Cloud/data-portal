// src/views/Dashboard.vue
<template>
  <div class="layout-wrapper">
    <div class="sidebar">
      <PanelMenu :model="menuItems" class="sidebar-menu" />
    </div>

    <div class="main-content">
      <div class="dashboard-container">
        <div class="header">
          <h1>Data Portal</h1>
        </div>

        <SearchFilter
          v-model:searchTerm="searchTerm"
          @showFilter="showFilterOverlay = true"
        />

        <ModalOverlay
          :show="showFilterOverlay"
          @close="showFilterOverlay = false"
        >
          <h2>Filter by Health Status</h2>
          <div class="filter-option" v-for="status in ['healthy', 'unhealthy']" :key="status">
            <Checkbox
              :inputId="status"
              :value="status"
              v-model="healthStatusFilter"
              @change="filterResources"
            />
            <label :for="status">{{ status.charAt(0).toUpperCase() + status.slice(1) }}</label>
          </div>
        </ModalOverlay>

        <div class="resources">
          <h2>Automation Systems</h2>
          <ResourceCard
            v-for="(resource, index) in filteredResources"
            :key="index"
            :resource="resource"
            @view="showResourceDetails"
            @edit="editResource"
            @delete="deleteResource(index)"
          />
        </div>

        <ModalOverlay
          :show="showOverlayinfo"
          @close="showOverlayinfo = false"
        >
          <template v-if="shownResource">
            <h2>{{ shownResource.name }}</h2>
            <p><strong>Description:</strong> {{ shownResource.description }}</p>
            <p><strong>Health Status:</strong> {{ shownResource.healthStatus }}</p>
            <p><strong>Type:</strong> {{ shownResource.type }}</p>
            <p><strong>Automation Project:</strong> {{ shownResource.automationProject }}</p>
          </template>
        </ModalOverlay>

        <ModalOverlay
          :show="showOverlayEdit"
          @close="showOverlayEdit = false"
        >
          <template v-if="shownResource">
            <form @submit.prevent="handleEditResource">
              <h2>Edit Resource</h2>
              <div class="form-field" v-for="field in ['description', 'healthStatus', 'type', 'automationProject']" :key="field">
                <label>{{ field.charAt(0).toUpperCase() + field.slice(1) }}</label>
                <InputText v-model="shownResource[field]" />
              </div>
              <Button type="submit" label="Save" class="p-button-success" />
            </form>
          </template>
        </ModalOverlay>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import PanelMenu from 'primevue/panelmenu';
import Checkbox from 'primevue/checkbox';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import SearchFilter from '../components/SearchFilter.vue';
import ResourceCard from '../components/ResourceCard.vue';
import ModalOverlay from '../components/ModalOverlay.vue';

export default {
  name: 'Dashboard',
  components: {
    PanelMenu,
    Checkbox,
    InputText,
    Button,
    SearchFilter,
    ResourceCard,
    ModalOverlay
  },
  setup() {
    const resources = ref([
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
    ]);

    const filteredResources = ref([]);
    const searchTerm = ref('');
    const healthStatusFilter = ref([]);
    const showFilterOverlay = ref(false);
    const showOverlayinfo = ref(false);
    const showOverlayEdit = ref(false);
    const shownResource = ref(null);

    const menuItems = [
      {
        items: [
          { label: 'Dashboard', icon: 'pi pi-home', to: '/dashboard' },
          { label: 'Profile', icon: 'pi pi-user', to: '/profile' },
          { label: 'Graphs & Charts', icon: 'pi pi-chart-bar', to: '/graphs' },
          { label: 'Visualizations', icon: 'pi pi-chart-pie', to: '/visualizations' },
          { label: 'Error Logs', icon: 'pi pi-exclamation-circle', to: '/logs' },
          { label: 'Alerts', icon: 'pi pi-bell', to: '/alerts' },
        ],
      },
    ];

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

    const showResourceDetails = (resource) => {
      shownResource.value = resource;
      showOverlayinfo.value = true;
    };

    const editResource = (resource) => {
      shownResource.value = resource;
      showOverlayEdit.value = true;
    };

    const handleEditResource = () => {
      showOverlayEdit.value = false;
      filterResources();
    };

    const deleteResource = (index) => {
      resources.value.splice(index, 1);
      filterResources();
    };

    onMounted(() => {
      filterResources();
    });

    return {
      resources,
      filteredResources,
      searchTerm,
      healthStatusFilter,
      showFilterOverlay,
      showOverlayinfo,
      showOverlayEdit,
      shownResource,
      menuItems,
      filterResources,
      showResourceDetails,
      editResource,
      handleEditResource,
      deleteResource
    };
  }
};
</script>

<style scoped>
layout-wrapper {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 280px;
  background-color: var(--menu-bg, #333);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding-top: 2rem;
}

.sidebar-menu {
  padding: 1rem;
  height: 100%;
}

.main-content {
  flex: 1;
  background-color: var(--background-color, #f9f9f9);
  padding: 2rem;
}

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

.header h1 {
  font-size: 2rem;
  font-weight: bold;
  color: var(--text-color, #333);
  margin-bottom: 1rem;
}

.resources {
  margin-top: 2rem;
}

.resources h2 {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-color, #333);
  margin-bottom: 1rem;
}

.filter-option {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.filter-option label {
  margin-left: 0.5rem;
  font-size: 1rem;
  color: var(--text-color, #333);
}

.form-field {
  margin-bottom: 1rem;
}

.form-field label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  color: var(--text-color, #333);
}

.form-field input,
.form-field .p-inputtext {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color, #ccc);
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
  background: var(--input-bg, #fff);
  color: var(--text-color, #333);
}

.form-field input:focus,
.form-field .p-inputtext:focus {
  border-color: var(--primary-color, #007BFF);
  outline: none;
  box-shadow: 0 0 4px var(--primary-color, #007BFF);
}

button.p-button-success {
  background-color: var(--success-color, #28a745);
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: background-color 0.3s;
}

button.p-button-success:hover {
  background-color: var(--success-hover-color, #218838);
}

button.p-button-success:focus {
  outline: 2px solid var(--primary-color, #007BFF);
}

@media (max-width: 768px) {
  .sidebar {
    display: none;
  }

  .main-content {
    padding: 1.5rem;
  }

  .header h1 {
    font-size: 1.75rem;
  }

  .resources h2 {
    font-size: 1.25rem;
  }

  .filter-option label {
    font-size: 0.9rem;
  }

  .form-field label {
    font-size: 0.9rem;
  }

  .form-field input,
  .form-field .p-inputtext {
    font-size: 0.9rem;
    padding: 0.6rem;
  }

  button.p-button-success {
    font-size: 0.9rem;
    padding: 0.6rem 1rem;
  }
}
</style>