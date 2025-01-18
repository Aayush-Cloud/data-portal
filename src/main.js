import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Vue Router
import '@fontsource/nunito';  // Font
// Import PrimeVue
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura'; // Theme
import 'primeicons/primeicons.css'; // Import PrimeIcons CSS
import './styles/theme.css'; // Import global styles
import Chart from 'primevue/chart'; // Import Chart component
import ThemeText from './styles/ThemeText.vue'; // Import ThemeText component

// Create the Vue app
const app = createApp(App);
app.use(router);     // Register Vue Router
app.use(PrimeVue, { theme:{ preset: Aura, }});
app.component('Chart', Chart); // Register Chart component
app.component('ThemeText', ThemeText); // Register ThemeText component

// Mount the app
app.mount('#app');

