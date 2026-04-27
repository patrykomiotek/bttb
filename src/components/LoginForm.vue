<script setup lang="ts">
import { ref, computed } from 'vue'
import { validateEmail, validatePassword } from '@/utils/validators'
import { useAuthStore } from '@/stores/auth'

const email = ref('')
const password = ref('')
const touched = ref({ email: false, password: false })

const emit = defineEmits<{ (e: 'logged-in'): void }>()

const auth = useAuthStore()

const emailError = computed(() =>
  touched.value.email ? validateEmail(email.value).message : undefined,
)
const passwordError = computed(() =>
  touched.value.password ? validatePassword(password.value).message : undefined,
)

const canSubmit = computed(
  () =>
    validateEmail(email.value).valid &&
    validatePassword(password.value).valid &&
    !auth.loading,
)

async function submit() {
  touched.value = { email: true, password: true }
  if (!canSubmit.value) return
  const ok = await auth.login(email.value, password.value)
  if (ok) emit('logged-in')
}
</script>

<template>
  <form class="card" data-testid="login-form" @submit.prevent="submit">
    <h2>Logowanie</h2>
    <div class="field">
      <label class="label" for="email">Email</label>
      <input
        id="email"
        v-model="email"
        class="input"
        type="email"
        data-testid="login-email"
        autocomplete="username"
        @blur="touched.email = true"
      />
      <div v-if="emailError" class="error" data-testid="login-email-error">{{ emailError }}</div>
    </div>
    <div class="field">
      <label class="label" for="password">Hasło</label>
      <input
        id="password"
        v-model="password"
        class="input"
        type="password"
        data-testid="login-password"
        autocomplete="current-password"
        @blur="touched.password = true"
      />
      <div v-if="passwordError" class="error" data-testid="login-password-error">
        {{ passwordError }}
      </div>
    </div>
    <div v-if="auth.error" class="error" data-testid="login-error">{{ auth.error }}</div>
    <button class="btn" type="submit" :disabled="!canSubmit" data-testid="login-submit">
      {{ auth.loading ? 'Logowanie…' : 'Zaloguj' }}
    </button>
    <p class="label" style="margin-top: 0.75rem">
      Demo: <code>demo@xtb.local</code> / <code>Passw0rd</code>
    </p>
  </form>
</template>
