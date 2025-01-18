<template>
  <div id="app" :class="{ 'dark-mode': isDarkMode }">
    <!-- Theme Toggle Button -->
    <div class="theme-toggle">
      <Button
        :icon="isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
        @click="toggleTheme"
        class="p-button-rounded p-button-text"
      />
    </div>

    <!-- Router View -->
    <router-view></router-view>
  </div>
</template>

<script>
import Button from "primevue/button";

export default {
  name: "App",
  components: { Button },
  data() {
    return {
      isDarkMode: false,
    };
  },
  methods: {
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem("darkMode", this.isDarkMode);
    },
  },
  mounted() {
    this.isDarkMode = localStorage.getItem("darkMode") === "true";
  },
};
</script>

<style>
/* Light Theme */
:root {
  --primary-color: #2c3e50;
  --secondary-color: #4a5568;
  --background-color: #f8f9fa;
  --surface-color: #ffffff;
  --text-color: #2c3e50;
  --border-color: rgba(0, 0, 0, 0.1);
  --overlay-bg: rgba(0, 0, 0, 0.5);
  --menu-bg: #ffffff;
  --input-bg: #ffffff;
  --checkbox-bg: #ffffff;
  --menu-text: #2c3e50;
  --menu-icon: #4a5568;
  --menu-hover-bg: #f8f9fa;
}

/* Dark Theme */
.dark-mode {
  --primary-color: #64b5f6;
  --secondary-color: #90caf9;
  --background-color: #121212;
  --surface-color: #1e1e1e;
  --text-color: #e0e0e0;
  --border-color: rgba(255, 255, 255, 0.1);
  --overlay-bg: rgba(0, 0, 0, 0.7);
  --menu-bg: #1e1e1e;
  --input-bg: #333333;
  --checkbox-bg: #1e1e1e;
  --menu-text: #e0e0e0;
  --menu-icon: #90caf9;
  --menu-hover-bg: #2d2d2d;
}

/* Global Styles */
body {
  font-family: "Nunito", sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

/* Theme Toggle Button */
.theme-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
}

/* Transition Effects */
* {
  transition: background-color 0.3s, color 0.3s, border-color 0.3s, box-shadow 0.3s;
}

/* PanelMenu Overrides */
.p-panelmenu {
  background-color: var(--menu-bg) !important;
}

.p-panelmenu .p-panelmenu-header-link {
  background-color: var(--menu-bg) !important;
  color: var(--menu-text) !important;
  border: none !important;
}

.p-panelmenu .p-panelmenu-content {
  background-color: var(--menu-bg) !important;
  border: none !important;
}

.p-panelmenu .p-menuitem-link {
  background-color: var(--menu-bg) !important;
  color: var(--menu-text) !important;
}

.p-panelmenu .p-menuitem-icon,
.p-panelmenu .p-panelmenu-icon {
  color: var(--menu-icon) !important;
}

.p-panelmenu .p-menuitem-link:hover {
  background-color: var(--menu-hover-bg) !important;
}

.p-panelmenu .p-menuitem-link:focus {
  box-shadow: none !important;
  background-color: var(--menu-hover-bg) !important;
}

/* Active state styling */
.p-panelmenu .p-menuitem-link.router-link-active {
  background-color: var(--menu-hover-bg) !important;
  color: var(--primary-color) !important;
}

/* Input Fields */
.p-inputtext {
  background-color: var(--input-bg) !important;
  color: var(--text-color) !important;
}

/* Checkbox Styling */
.p-checkbox-box {
  background: var(--checkbox-bg) !important;
}

.p-checkbox {
  margin-right: 0.5rem !important;
}

/* Sidebar specific styles */
.sidebar {
  background-color: var(--menu-bg) !important;
}

.sidebar-menu {
  background-color: var(--menu-bg) !important;
}
</style>