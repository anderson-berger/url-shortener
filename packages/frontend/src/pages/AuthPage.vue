<template>
  <div class="flex flex-center full-height">
    <q-card style="min-width: 400px">
      <q-card-section>
        <q-tabs v-model="tab" dense class="text-primary">
          <q-tab name="login" label="Login" />
          <q-tab name="register" label="Registro" />
        </q-tabs>
        <q-separator />
        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="login">
            <LoginForm @submit="onSubmitLogin" />
          </q-tab-panel>
          <q-tab-panel name="register">
            <RegisterForm @submit="onSubmitRegister" />
          </q-tab-panel>
        </q-tab-panels>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AuthService from 'src/services/Auth.Service';
import LoginForm from 'src/pages/auth-page/LoginForm.vue';
import RegisterForm from 'src/pages/auth-page/RegisterForm.vue';
import type { LoginRequest, RegisterRequest } from 'src/schemas/auth.schemas';

export default defineComponent({
  name: 'AuthPage',

  components: {
    LoginForm,
    RegisterForm,
  },

  data() {
    return {
      tab: 'login' as 'login' | 'register',
    };
  },

  methods: {
    async onSubmitLogin(loginRequest: LoginRequest) {
      try {
        await this.$load.execute('login', async () => {
          console.log('passando aqui');

          await AuthService.login(loginRequest);

          this.$q.notify({
            type: 'positive',
            message: 'Login realizado com sucesso!',
            position: 'top',
          });

          await this.$router.push('/app');
        });
      } catch (error) {
        console.log('passando aqui');
        this.$q.notify({
          type: 'negative',
          message: error instanceof Error ? error.message : 'Erro ao fazer login',
          position: 'top',
        });
      }
    },

    async onSubmitRegister(registerRequest: RegisterRequest) {
      try {
        await this.$load.execute('register', async () => {
          await AuthService.register(registerRequest);

          this.$q.notify({
            type: 'positive',
            message: 'Registro realizado com sucesso! Faça login para continuar.',
            position: 'top',
          });

          this.tab = 'login';
        });
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error instanceof Error ? error.message : 'Erro ao fazer registro',
          position: 'top',
        });
      }
    },
  },
});
</script>

<style scoped>
.full-height {
  min-height: 100vh;
}
</style>
