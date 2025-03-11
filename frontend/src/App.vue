<template>
  <div id="app" :data-theme="themeStore.isDarkMode ? 'dark' : 'light'">
    <!-- Theme Toggle Button -->
    <div class="theme-toggle">
      <Button
        :icon="themeStore.isDarkMode ? 'pi pi-sun' : 'pi pi-moon'"
        @click="themeStore.toggleTheme"
        class="p-button-rounded p-button-text"
      />
    </div>

    <!-- Router View -->
    <router-view />
  </div>
</template>

<script>
import { useThemeStore } from './stores/theme';
import Button from 'primevue/button';
import CustomText from './components/CustomText.vue';

export default {
  name: 'App',
  components: { Button, CustomText },
  setup() {
    const themeStore = useThemeStore();
    themeStore.loadTheme(); // Load the theme on mount
    return { themeStore };
  },
};
</script>
