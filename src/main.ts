import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura'
import ToastService from 'primevue/toastservice';

const app = createApp(App);
app.use(PrimeVue, { ripple: true, theme: { preset: Aura } });
app.use(ToastService);

app.mount('#app');
