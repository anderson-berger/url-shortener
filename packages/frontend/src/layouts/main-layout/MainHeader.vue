<template>
  <q-toolbar>
    <q-toolbar-title class="row items-center">
      <!-- <q-btn flat dense round icon="menu" @click="$emit('toggle-drawer')" /> -->
    </q-toolbar-title>
  </q-toolbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainHeader',

  components: {},

  props: {},

  emits: ['toggle-drawer'],

  data() {
    return {};
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
