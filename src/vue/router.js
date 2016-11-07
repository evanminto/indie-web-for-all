import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from './routes/Login.vue';
import Signup from './routes/Signup.vue';

Vue.use(VueRouter);

export default new VueRouter({
  mode: 'history',
  routes: [
    {path: '/signup', component: Signup},
    {path: '/login', component: Login},
    {path: '/', redirect: '/login'},
  ],
});
