<template>
  <v-app>
    <!-- Show layout only if authenticated -->
    <template v-if="appStore.isAuthenticated">
      <!-- Top Navigation Bar with Red Theme -->
      <v-app-bar color="primary" dark sticky class="elevation-4">
        <v-app-bar-title class="d-flex align-center gap-3">
          <div class="logo-box">E</div>
          <div>
            <div class="font-weight-bold text-h6">ENGINY</div>
            <div class="text-caption">{{ roleLabel }}</div>
          </div>
        </v-app-bar-title>
        
        <v-spacer></v-spacer>

        <!-- Search Bar (Desktop) -->
        <v-text-field
          v-model="searchQuery"
          label="Cercar..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          class="search-field d-none d-md-flex"
          @keyup.enter="handleSearch"
        ></v-text-field>

        <!-- Notifications -->
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" class="mx-2">
              <v-badge color="error" content="3">
                <v-icon>mdi-bell</v-icon>
              </v-badge>
            </v-btn>
          </template>
          <v-list max-width="300">
            <v-list-item-title class="pa-3 font-weight-bold">Notificacions</v-list-item-title>
            <v-divider></v-divider>
            <v-list-item v-for="i in 3" :key="i" class="py-2">
              <v-icon size="small" color="warning" class="mr-2">mdi-alert-circle</v-icon>
              <v-list-item-title class="text-caption">
                Notificació {{ i }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <!-- Mobile Menu Button -->
        <v-btn icon @click="drawer = !drawer" class="d-lg-none">
          <v-icon>mdi-menu</v-icon>
        </v-btn>

        <!-- User Menu -->
        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props">
              <v-avatar color="secondary" size="32">
                <span class="text-white font-weight-bold">{{ userInitials }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-list>
            <v-list-item disabled>
              <v-list-item-title class="text-caption font-weight-bold">{{ appStore.userName }}</v-list-item-title>
              <v-list-item-subtitle class="text-caption">{{ appStore.userEmail }}</v-list-item-subtitle>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="openSettings">
              <template v-slot:prepend>
                <v-icon>mdi-cog</v-icon>
              </template>
              <v-list-item-title>Configuració</v-list-item-title>
            </v-list-item>
            <v-list-item @click="handleLogout">
              <template v-slot:prepend>
                <v-icon color="error">mdi-logout</v-icon>
              </template>
              <v-list-item-title class="text-error">Tancar Sessió</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>

      <!-- Navigation Drawer -->
      <v-navigation-drawer
        v-model="drawer"
        :permanent="$vuetify.display.lgAndUp"
        :temporary="!$vuetify.display.lgAndUp"
        class="bg-surface"
        elevation="4"
      >
        <v-list nav class="pt-0">
          <!-- Logo Section -->
          <div class="pa-4 drawer-header">
            <div class="d-flex align-center gap-2 mb-2">
              <div class="logo-box">E</div>
              <div>
                <div class="font-weight-bold">ENGINY</div>
                <div class="text-caption">{{ roleLabel }}</div>
              </div>
            </div>
          </div>

          <!-- Navigation Items -->
          <template v-for="item in navigationItems" :key="item.path">
            <v-list-item
              :to="item.path"
              :active="$route.path === item.path"
              class="mb-1 nav-item"
              active-color="primary"
            >
              <template v-slot:prepend>
                <v-icon>{{ item.icon }}</v-icon>
              </template>
              <v-list-item-title>{{ item.label }}</v-list-item-title>
              <template v-if="item.badge" v-slot:append>
                <v-badge :content="item.badge" color="error"></v-badge>
              </template>
            </v-list-item>
          </template>
        </v-list>

        <template v-slot:append>
          <div class="pa-4 drawer-footer">
            <v-btn block @click="handleLogout" variant="tonal" color="error" size="small">
              <v-icon left>mdi-logout</v-icon>
              Tancar sessió
            </v-btn>
          </div>
        </template>
      </v-navigation-drawer>

      <!-- Main Content -->
      <v-main class="bg-grey-50">
        <router-view></router-view>
      </v-main>
    </template>

    <!-- Show only router-view if not authenticated (for login/register pages) -->
    <template v-else>
      <router-view></router-view>
    </template>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from './stores/appStore'

const router = useRouter()
const appStore = useAppStore()
const drawer = ref(false)
const searchQuery = ref('')

const handleLogout = () => {
  appStore.logout()
  router.push('/login')
}

const openSettings = () => {
  console.log('Settings clicked')
}

const handleSearch = () => {
  console.log('Searching for:', searchQuery.value)
}

const userInitials = computed(() => {
  return appStore.userName
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'
})

const navigationItems = computed(() => {
  const role = appStore.userRole
  
  const config = {
    CENTER: [
      { path: '/centre', icon: 'mdi-home', label: 'Inici', badge: null },
      { path: '/centre/cataleg', icon: 'mdi-book-open', label: 'Catàleg de Tallers', badge: null },
      { path: '/centre/peticions', icon: 'mdi-file-document', label: 'Les meves Peticions', badge: 2 },
      { path: '/centre/checklist', icon: 'mdi-checkbox-marked', label: 'Checklist', badge: 1 },
    ],
    ADMIN: [
      { path: '/admin', icon: 'mdi-home', label: 'Dashboard', badge: null },
      { path: '/admin/tallers', icon: 'mdi-book-open', label: 'Gestió Tallers', badge: null },
      { path: '/admin/peticions', icon: 'mdi-file-document', label: 'Peticions', badge: 5 },
      { path: '/admin/professors', icon: 'mdi-account-multiple', label: 'Professors', badge: null },
      { path: '/admin/informes', icon: 'mdi-chart-bar', label: 'Informes', badge: null },
    ],
    PROFESSOR: [
      { path: '/professor', icon: 'mdi-home', label: 'Inici', badge: null },
      { path: '/professor/tallers', icon: 'mdi-book-open', label: 'Els meus Tallers', badge: 1 },
    ],
  }
  
  return config[role] || config.CENTER
})

const roleLabel = computed(() => {
  const labels = {
    CENTER: 'Centre Educatiu',
    ADMIN: 'Administració',
    PROFESSOR: 'Professor/a',
  }
  return labels[appStore.userRole] || 'Centre Educatiu'
})
</script>

<style scoped>
.logo-box {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #FFFFFF, #F0F0F0);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #C41E3A;
  font-size: 18px;
  box-shadow: 0 4px 12px rgba(196, 30, 58, 0.2);
}

:deep(.v-app-bar) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.search-field {
  max-width: 250px;
  margin: 0 16px;
}

:deep(.search-field .v-field__input) {
  font-size: 14px;
}

.drawer-header {
  border-bottom: 2px solid #E5E7EB;
  background: linear-gradient(135deg, rgba(196, 30, 58, 0.05), transparent);
}

.drawer-footer {
  border-top: 2px solid #E5E7EB;
  background: linear-gradient(135deg, transparent, rgba(196, 30, 58, 0.05));
}

.nav-item {
  transition: all 0.3s ease;
  margin: 4px 8px;
  border-radius: 8px;
}

.nav-item:hover {
  background: rgba(196, 30, 58, 0.08);
}

.nav-item.v-list-item--active {
  background: rgba(196, 30, 58, 0.15);
  border-left: 4px solid #C41E3A;
}
</style>
