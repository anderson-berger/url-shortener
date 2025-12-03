<template>
  <q-form @submit.prevent="handleRegister">
    <q-input
      v-model="registerForm.email"
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
      v-model="registerForm.password"
      :type="showRegisterPassword ? 'text' : 'password'"
      label="Senha"
      outlined
      dense
      :rules="[
        (val) => !!val || 'Senha é obrigatória',
        (val) => val.length >= 8 || 'Senha deve ter pelo menos 8 caracteres',
      ]"
      lazy-rules
    >
      <template v-slot:prepend>
        <q-icon name="lock" />
      </template>
      <template v-slot:append>
        <q-icon
          :name="showRegisterPassword ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="showRegisterPassword = !showRegisterPassword"
        />
      </template>
    </q-input>

    <q-btn type="submit" color="primary" label="Criar conta" class="full-width" unelevated />
  </q-form>
</template>

<script lang="ts">
import type { RegisterRequest } from 'src/schemas/auth.schemas';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'RegisterForm',

  components: {},

  props: {},

  emits: ['submit'],

  data() {
    const registerForm: RegisterRequest = {
      email: '',
      password: '',
    };
    return {
      registerForm,
      showRegisterPassword: false,
    };
  },

  computed: {},

  methods: {
    isValidEmail(email: string): boolean {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    handleRegister() {
      this.$emit('submit', this.registerForm);
    },
  },

  created() {},

  mounted() {},
});
</script>

<style scoped>
/* Estilos locais aqui */
</style>
