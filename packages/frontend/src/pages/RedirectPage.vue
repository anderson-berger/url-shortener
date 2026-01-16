<!-- src/pages/RedirectPage.vue -->
<template>
  <div class="flex flex-center column q-pa-md">
    <template v-if="!error">
      <q-spinner-dots color="primary" size="50px" />
      <div class="q-mt-md text-h6">Redirecting...</div>
    </template>

    <template v-else>
      <q-icon name="error_outline" color="negative" size="50px" />
      <div class="q-mt-md text-h6">{{ error }}</div>
      <q-btn flat color="primary" label="Go to Home" class="q-mt-md" @click="goHome" />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RedirectService from 'src/services/Redirect.Service';

export default defineComponent({
  name: 'RedirectPage',

  data() {
    return {
      error: '',
    };
  },

  mounted() {
    const shortCode = this.$route.params.shortCode as string;

    if (!shortCode) {
      this.error = 'Invalid short code';
      return;
    }

    try {
      RedirectService.redirect(shortCode);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to redirect';

      this.$q.notify({
        type: 'negative',
        message: this.error,
        position: 'top',
      });
    }
  },

  methods: {
    goHome() {
      void this.$router.push({ name: 'auth' });
    },
  },
});
</script>
