<script setup lang="ts">
import { RouterView, RouterLink } from 'vue-router'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()
</script>

<template>
  <div class="app">
    <header class="topbar">
      <div class="brand">
        <span class="logo">XTB</span>
        <span class="subtitle">Trading Lite — warsztat</span>
      </div>
      <nav class="nav">
        <RouterLink v-if="auth.isLoggedIn" to="/dashboard" data-testid="nav-dashboard">Dashboard</RouterLink>
        <RouterLink v-if="auth.isLoggedIn" to="/order" data-testid="nav-order">Nowe zlecenie</RouterLink>
        <RouterLink v-if="!auth.isLoggedIn" to="/login" data-testid="nav-login">Logowanie</RouterLink>
        <button
          v-if="auth.isLoggedIn"
          data-testid="nav-logout"
          class="btn-link"
          @click="auth.logout()"
        >
          Wyloguj ({{ auth.username }})
        </button>
      </nav>
    </header>
    <main class="main">
      <RouterView />
    </main>
  </div>
</template>
