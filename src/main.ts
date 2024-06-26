import '@/assets/main.scss'

import { createApp } from 'vue'
import { Lazyload } from 'vant'

import App from './App.vue'
import router from './router'
import pinia from './stores/index'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(Lazyload)
app.mount('#app')
