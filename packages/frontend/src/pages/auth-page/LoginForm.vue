<template>
  <q-form @submit.prevent="handleLogin">
    <q-input
      v-model="login.email"
      type="email"
      label="Email"
      outlined
      dense
      :rules="[
        (val) => !!val || 'Email é obrigatório',
        (val) => isValidEmail(val) || 'Email inválido',
      ]"
      lazy-rules
    >
      <template v-slot:prepend>
        <q-icon name="email" />
      </template>
    </q-input>

    <q-input
      v-model="login.password"
      :type="showLoginPassword ? 'text' : 'password'"
      label="Senha"
      outlined
      dense
      :rules="[(val) => !!val || 'Senha é obrigatória']"
      lazy-rules
    >
      <template v-slot:prepend>
        <q-icon name="lock" />
      </template>
      <template v-slot:append>
        <q-icon
          :name="showLoginPassword ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="showLoginPassword = !showLoginPassword"
        />
      </template>
    </q-input>

    <q-btn type="submit" color="primary" label="Entrar" class="full-width" unelevated />
  </q-form>
</template>

<script lang="ts">
import type { LoginRequest } from 'src/schemas/auth.schemas';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'LoginForm',

  components: {},

  props: {},

  emits: ['submit'],

  data() {
    const login: LoginRequest = {
      email: '',
      password: '',
    };
    return {
      login,
      showLoginPassword: false,
    };
  },

  computed: {},

  methods: {
    isValidEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    handleLogin() {
      this.$emit('submit', this.login);
    },
  },

  created() {},

  mounted() {},
});
</script>

<style scoped>
/* Estilos locais aqui */
</style>
