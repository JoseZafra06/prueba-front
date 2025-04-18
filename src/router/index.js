import Vue from 'vue'
import VueRouter from 'vue-router'
import Comensales from '@/components/Maintenance/Comensales.vue'
import Mesas from '@/components/Maintenance/Mesas.vue'
import Reservas from '@/components/Maintenance/Reservas.vue'

Vue.use(VueRouter)

export default new VueRouter({
    mode: 'history',
    routes: [
        { path: '/comensales', component: Comensales },
        { path: '/mesas', component: Mesas },
        { path: '/reservas', component: Reservas }
    ]
})