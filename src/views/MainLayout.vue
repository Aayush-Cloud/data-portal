<template>
  <div class="layout-wrapper">
    <div class="sidebar">
      <PanelMenu :model="menuItems" />
    </div>
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import PanelMenu from 'primevue/panelmenu';

export default {
  name: 'MainLayout',
  components: { PanelMenu },
  data() {
    return {
      menuItems: [
        {
          label: 'Main Menu',
          items: [
            { label: 'Dashboard', icon: 'pi pi-home', command: () => this.$router.push('/app/dashboard') },
            { label: 'Profile', icon: 'pi pi-user', command: () => this.$router.push('/app/profile') },
            { label: 'Graphs & Charts', icon: 'pi pi-chart-bar', command: () => this.$router.push('/app/graphs') },
            { label: 'Visualizations', icon: 'pi pi-chart-pie', command: () => this.$router.push('/app/visualizations') },
            { label: 'Error Logs', icon: 'pi pi-exclamation-circle', command: () => this.$router.push('/app/logs') },
            { label: 'Alerts', icon: 'pi pi-bell', command: () => this.$router.push('/app/alerts') },
          ],
        },
      ],
    };
  },
};
</script>

<style scoped>
.layout-wrapper {
  display: flex;
  min-height: 100vh;
}

.sidebar {
  width: 250px;
  background: var(--surface-color);
}

.main-content {
  flex: 1;
  padding: 2rem;
}
</style>