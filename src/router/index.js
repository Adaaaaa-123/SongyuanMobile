import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/login'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/set',
    name: 'Set',
    component: () => import(/* webpackChunkName: "about" */ '../views/set')
  },
  {
    path: '/total',
    name: 'Total',
    component: () => import(/* webpackChunkName: "about" */ '../views/total')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/place',
    name: 'Place',
    component: () => import(/* webpackChunkName: "about" */ '../views/place')
  },
  {
    path: '/feedback',
    name: 'Feedback',
    component: () => import(/* webpackChunkName: "about" */ '../views/feedback')
  },
]

const router = new VueRouter({
  routes
})

export default router
