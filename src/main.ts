import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import './assets/styles/base.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)

app.config.errorHandler = (err, _instance, info) => {
  console.error('[app error]', info, err)
}

app.mount('#app')
