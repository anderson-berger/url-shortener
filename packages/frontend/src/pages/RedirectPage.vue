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

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Notify } from 'quasar';
import RedirectService from 'src/services/Redirect.Service';

const route = useRoute();
const router = useRouter();
const error = ref<string>('');

onMounted(async () => {
  const shortCode = route.params.shortCode as string;

  if (!shortCode) {
    error.value = 'Invalid short code';
    return;
  }

  try {
    const url = await RedirectService.redirect(shortCode);

    if (!url) {
      throw new Error('URL not found');
    }

    // Redireciona para a URL
    window.location.href = url;
  } catch (err) {
    console.error('Redirect error:', err);
    error.value = err instanceof Error ? err.message : 'Failed to redirect';

    Notify.create({
      type: 'negative',
      message: error.value,
      position: 'top',
    });
  }
});

const goHome = () => {
  router.push('/');
};
</script>
