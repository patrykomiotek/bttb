<script setup lang="ts">
import { useRouter } from 'vue-router'
import LoginForm from '@/components/LoginForm.vue'

const router = useRouter()

function onLoggedIn() {
  router.push('/dashboard')
}
</script>

<template>
  <div style="max-width: 420px; margin: 0 auto">
    <LoginForm @logged-in="onLoggedIn" />
  </div>
</template>
