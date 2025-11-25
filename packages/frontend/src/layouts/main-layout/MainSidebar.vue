<template>
  <div class="column no-wrap">
    <q-list padding class="menu-list">
      <q-item
        clickable
        v-ripple
        :active="$route.name === 'health'"
        @click="$router.push({ name: 'health' })"
        active-class="bg-primary text-white"
      >
        <q-item-section avatar>
          <q-icon name="favorite" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Health Check</q-item-label>
        </q-item-section>
      </q-item>

      <q-item
        clickable
        v-ripple
        :active="$route.name === 'home'"
        @click="$router.push({ name: 'link' })"
        active-class="bg-primary text-white"
      >
        <q-item-section avatar>
          <q-icon name="link" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Short Link</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MainSidebar',

  components: {},

  props: {},

  emits: [],

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
.menu-list {
  padding-top: 20px;
}
</style>
