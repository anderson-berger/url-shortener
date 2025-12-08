<template>
  <q-toolbar class="bg-primary text-white">
    <q-toolbar-title class="row items-center q-ml-sm">
      <q-icon name="link" size="sm" class="q-mr-sm" />
      <span class="text-h6">ShortyURL</span>
    </q-toolbar-title>

    <q-space />

    <q-btn flat dense round icon="favorite" aria-label="Health Check" @click="checkHealth">
      <q-tooltip>Verificar API</q-tooltip>
    </q-btn>

    <q-btn
      v-if="isAuthenticated"
      flat
      dense
      round
      icon="logout"
      aria-label="Logout"
      @click="handleLogout"
    >
      <q-tooltip>Sair</q-tooltip>
    </q-btn>

    <q-btn v-else flat label="Login" icon-right="login" @click="$router.push('/login')" />
  </q-toolbar>
</template>

<script lang="ts">
import AuthService from 'src/services/Auth.Service';
import healthService from 'src/services/health.service';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainHeader',

  components: {},

  props: {},

  emits: [],

  data() {
    return {};
  },

  computed: {
    isAuthenticated(): boolean {
      return AuthService.isAuthenticated();
    },
  },

  methods: {
    async checkHealth() {
      try {
        const response = await healthService.check();
        this.$q.notify({
          type: 'positive',
          message: `API: ${response.status} - ${response.service} v${response.version}`,
          position: 'top',
        });
      } catch {
        this.$q.notify({
          type: 'negative',
          message: 'Erro ao verificar API',
          position: 'top',
        });
      }
    },

    handleLogout() {
      this.$q
        .dialog({
          title: 'Confirmar',
          message: 'Deseja realmente sair?',
          cancel: {
            label: 'Cancelar',
            flat: true,
          },
          ok: {
            label: 'Sair',
            color: 'negative',
          },
          persistent: true,
        })
        .onOk(() => {
          AuthService.logout();
          void this.$router.push('/login');
          this.$q.notify({
            type: 'positive',
            message: 'Logout realizado com sucesso',
            position: 'top',
          });
        });
    },
  },

  created() {},

  mounted() {},
});
</script>

<style scoped>
.q-toolbar {
  min-height: 56px;
}
</style>
