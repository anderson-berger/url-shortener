<template>
  <div class="q-pa-md">
    <q-card>
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
      </q-card-section>

      <q-card-section>
        <q-btn
          color="primary"
          label="Verificar Health"
          icon="health_and_safety"
          :loading="loading"
          @click="checkHealth"
        />
      </q-card-section>

      <!-- Resultado -->
      <q-card-section v-if="healthData">
        <q-separator class="q-mb-md" />

        <div class="q-gutter-sm">
          <div class="row items-center">
            <q-icon
              :name="getStatusIcon(healthData.status)"
              :color="getStatusColor(healthData.status)"
              size="sm"
              class="q-mr-sm"
            />
            <span class="text-weight-medium">Status:</span>
            <q-badge :color="getStatusColor(healthData.status)" class="q-ml-sm">
              {{ healthData.status }}
            </q-badge>
          </div>

          <div><strong>Serviço:</strong> {{ healthData.service }}</div>
          <div><strong>Versão:</strong> {{ healthData.version }}</div>
          <div><strong>Timestamp:</strong> {{ formatTimestamp(healthData.timestamp) }}</div>

          <!-- DynamoDB Check (se existir) -->
          <div v-if="healthData.checks?.dynamodb" class="q-mt-md">
            <q-separator class="q-mb-sm" />
            <div class="text-subtitle2">Checks:</div>
            <div class="row items-center q-mt-xs">
              <q-icon
                :name="getStatusIcon(healthData.checks.dynamodb.status)"
                :color="getStatusColor(healthData.checks.dynamodb.status)"
                size="sm"
                class="q-mr-sm"
              />
              <span>DynamoDB: {{ healthData.checks.dynamodb.status }}</span>
              <span v-if="healthData.checks.dynamodb.latency" class="q-ml-sm text-grey">
                ({{ healthData.checks.dynamodb.latency }}ms)
              </span>
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- Erro -->
      <q-card-section v-if="error">
        <q-banner class="bg-negative text-white">
          <template #avatar>
            <q-icon name="error" />
          </template>
          {{ error }}
        </q-banner>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import healthService from 'src/services/health.service';
import type { HealthCheckResponse } from '../services/health.service';

export default defineComponent({
  name: 'HealthCheckComponent',

  props: {
    title: {
      type: String,
      default: 'API Health Check',
    },
  },

  data() {
    return {
      healthData: null as HealthCheckResponse | null,
      loading: false,
      error: null as string | null,
    };
  },

  methods: {
    async checkHealth() {
      this.loading = true;
      this.error = null;

      try {
        this.healthData = await healthService.check();
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Erro ao verificar health';
      } finally {
        this.loading = false;
      }
    },

    getStatusColor(status: string): string {
      if (status === 'healthy') return 'positive';
      if (status === 'degraded') return 'warning';
      return 'negative';
    },

    getStatusIcon(status: string): string {
      if (status === 'healthy') return 'check_circle';
      if (status === 'degraded') return 'warning';
      return 'error';
    },

    formatTimestamp(timestamp: string): string {
      return new Date(timestamp).toLocaleString('pt-BR');
    },
  },
});
</script>
