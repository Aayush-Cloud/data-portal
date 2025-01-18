// import { createApp } from 'vue';
// import App from './App.vue';
// import router from './router'; // Ensure this path matches your file structure

// createApp(App)
//   .use(router) // Register Vue Router
//   .mount('#app'); // Mount the app to the #app div


import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Vue Router
import '@fontsource/nunito';  // Font
// Import PrimeVue
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura'; // Theme
import 'primeicons/primeicons.css'; // Import PrimeIcons CSS
import './styles/theme.css'; // Import global styles
// Create the Vue app
const app = createApp(App);
app.use(PrimeVue, { theme:{ preset: Aura, }});
// Register plugins
app.use(router);     // Register Vue Router


// Mount the app
app.mount('#app');

