import { createRouter, createWebHistory } from 'vue-router'
import { useAppStore } from '../stores/appStore'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import EmailVerificationView from '../views/EmailVerificationView.vue'
import CenterDashboard from '../views/CenterDashboard.vue'
import CatalogPage from '../views/CatalogPage.vue'
import CenterRequests from '../views/CenterRequests.vue'
import CenterChecklist from '../views/CenterChecklist.vue'
import AdminDashboard from '../views/AdminDashboard.vue'
import AdminWorkshops from '../views/AdminWorkshops.vue'
import AdminRequests from '../views/AdminRequests.vue'
import AdminProfessors from '../views/AdminProfessors.vue'
import AdminReports from '../views/AdminReports.vue'
import ProfessorDashboard from '../views/ProfessorDashboard.vue'

// Definició de les rutes de l'aplicació que es faran en un futur o almenys el previst

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false, public: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresAuth: false, public: true },
  },
  {
    path: '/verify-email',
    name: 'EmailVerification',
    component: EmailVerificationView,
    meta: { requiresAuth: false, public: true },
  },
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: false, public: true },
  },
  {
    path: '/centre',
    name: 'CenterDashboard',
    component: CenterDashboard,
    meta: { requiresAuth: true, roles: ['CENTER'] },
  },
  {
    path: '/centre/cataleg',
    name: 'CatalogPage',
    component: CatalogPage,
    meta: { requiresAuth: true, roles: ['CENTER'] },
  },
  {
    path: '/centre/peticions',
    name: 'CenterRequests',
    component: CenterRequests,
    meta: { requiresAuth: true, roles: ['CENTER'] },
  },
  {
    path: '/centre/checklist',
    name: 'CenterChecklist',
    component: CenterChecklist,
    meta: { requiresAuth: true, roles: ['CENTER'] },
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, roles: ['ADMIN'] },
  },
  {
    path: '/admin/tallers',
    name: 'AdminWorkshops',
    component: AdminWorkshops,
    meta: { requiresAuth: true, roles: ['ADMIN'] },
  },
  {
    path: '/admin/peticions',
    name: 'AdminRequests',
    component: AdminRequests,
    meta: { requiresAuth: true, roles: ['ADMIN'] },
  },
  {
    path: '/admin/professors',
    name: 'AdminProfessors',
    component: AdminProfessors,
    meta: { requiresAuth: true, roles: ['ADMIN'] },
  },
  {
    path: '/admin/informes',
    name: 'AdminReports',
    component: AdminReports,
    meta: { requiresAuth: true, roles: ['ADMIN'] },
  },
  {
    path: '/professor',
    name: 'ProfessorDashboard',
    component: ProfessorDashboard,
    meta: { requiresAuth: true, roles: ['PROFESSOR'] },
  },
  {
    path: '/professor/tallers',
    name: 'ProfessorTallers',
    component: ProfessorDashboard,
    meta: { requiresAuth: true, roles: ['PROFESSOR'] },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})


router.beforeEach((to, from, next) => {
  const appStore = useAppStore()

  // Mira si la ruta és pública, si requereix autenticació i els rols necessaris
  const requiresAuth = to.meta.requiresAuth
  const requiredRoles = to.meta.roles


  if (to.meta.public) {
    next()
    return
  }

 // Si la ruta requereix autenticació i l'usuari no està autenticat, es redirigeix al login
  if (requiresAuth && !appStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }


  // Si la ruta requiere un rol y el usuario no lo tiene pues se le redirige a su dashboard
  if (requiredRoles && !requiredRoles.includes(appStore.userRole)) {

    const dashboards = {
      CENTER: '/centre',
      ADMIN: '/admin',
      PROFESSOR: '/professor',
    }
    next(dashboards[appStore.userRole] || '/')
    return
  }


  next()
})


router.afterEach(() => {
  window.scrollTo(0, 0)
})

export default router
