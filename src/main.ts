import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'; 
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import VueStarPlus from 'vue-star-plus'
import 'vue-star-plus/style.css'

const app = createApp(App)

const pinia = createPinia()

pinia.use(piniaPluginPersistedstate);

app.use(pinia)

app.use(router)
app.use(ElementPlus);
app.component('VueStarPlus', VueStarPlus)

app.mount('#app')
