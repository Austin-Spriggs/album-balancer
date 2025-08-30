import { createApp } from 'vue';
import { createPinia } from 'pinia';;
import { registerSW } from 'virtual:pwa-register';

import App from './App.vue';
import router from './router/router';

const app = createApp(App);

const updateSW = registerSW({
    onNeedRefresh() {
        if (confirm('New version available. Reload?')) {
            updateSW(true);
        }
    },
    onOfflineReady() {
        console.log('App ready to work offline');
    }
});

app.use(createPinia());
app.use(router);

app.mount('#app');
