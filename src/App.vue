<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <div class="theme-toggle">
      <Button
        :icon="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
        @click="toggleTheme"
        class="p-button-rounded p-button-text"
      />
    </div>
    <router-view />
  </div>
</template>

<script>
import Button from 'primevue/button';

export default {
  name: "App",
  components: { Button },
  data() {
    return {
      isDarkMode: false
    }
  },
  methods: {
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem('darkMode', this.isDarkMode);
    }
  },
  mounted() {
    this.isDarkMode = localStorage.getItem('darkMode') === 'true';
  }
};
</script>

<style>
:root {
  /* Light Theme Variables */
  --primary-color: #2c3e50;
  --secondary-color: #4a5568;
  --background-color: #f8f9fa;
  --surface-color: #ffffff;
  --text-color: #2c3e50;
  --border-color: #dfe7ef;
  --card-bg: #ffffff;
  --sidebar-bg: #ffffff;
}

.dark-mode {
  /* Dark Theme Variables */
  --primary-color: #64b5f6;
  --secondary-color: #90caf9;
  --background-color: #121212;
  --surface-color: #1e1e1e;
  --text-color: #e0e0e0;
  --border-color: #333333;
  --card-bg: #1e1e1e;
  --sidebar-bg: #1e1e1e;
}

/* Global Styles */
body {
  font-family: 'Nunito', sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

/* PrimeVue Component Overrides */
.dark-mode .p-component {
  background-color: var(--surface-color);
  color: var(--text-color);
}

.dark-mode .p-panelmenu .p-panelmenu-header > a,
.dark-mode .p-panelmenu .p-panelmenu-content {
  background-color: var(--sidebar-bg) !important;
  color: var(--text-color) !important;
}

.dark-mode .p-menuitem-link {
  color: var(--text-color) !important;
}

.dark-mode .p-card {
  background-color: var(--card-bg);
  color: var(--text-color);
}

.theme-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
}

/* Transition Effects */
* {
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}
</style>