import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import PrimeVue from 'primevue/config';
import { createPinia } from 'pinia'; // Import Pinia
import Aura from '@primevue/themes/aura'; // PrimeVue Theme
import 'primeicons/primeicons.css';
import './styles/theme.css'; // Centralized styles
import Chart from 'primevue/chart';
import ThemeText from './styles/ThemeText.vue'; // Custom text component

const app = createApp(App);
const pinia = createPinia(); // Initialize Pinia

app.use(pinia);
app.use(router);
app.use(PrimeVue, { theme: { preset: Aura } });
app.component('Chart', Chart);
app.component('ThemeText', ThemeText);
app.mount('#app');
