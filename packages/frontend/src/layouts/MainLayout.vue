<template>
  <q-layout view="hHh Lpr lff">
    <!-- Header -->
    <q-header>
      <MainHeader @toggle-drawer="leftDrawer = !leftDrawer" />
    </q-header>

    <!-- Sidebar -->
    <q-drawer v-model="leftDrawer" show-if-above bordered class="bg-grey-1" :width="260">
      <MainSidebar />
    </q-drawer>

    <!-- Main Content -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MainHeader from '../layouts/main-layout/MainHeader.vue';
import MainSidebar from '../layouts/main-layout/MainSidebar.vue';

export default defineComponent({
  name: 'MainLayout',

  components: { MainHeader, MainSidebar },

  props: {},

  emits: [],

  data() {
    return {
      leftDrawer: true,
    };
  },

  computed: {},

  methods: {},

  created() {},

  mounted() {},
});
</script>

<style scoped>
/* Estilos locais aqui */
</style>
