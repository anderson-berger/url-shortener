<template>
  <div class="shortlinks-container">
    <div class="header q-mb-sm">
      <div class="text-h6 q-my-none">Meus Links Encurtados</div>
      <div class="text-caption text-grey-7">{{ items.length }} link(s)</div>
    </div>

    <div v-if="items.length === 0" class="text-center q-pa-xl text-grey-6">
      <q-icon name="link_off" size="64px" class="q-mb-md" />
      <div class="text-h6">Nenhum link encurtado ainda</div>
      <div class="text-caption">Crie seu primeiro link acima</div>
    </div>

    <div v-else class="cards-grid">
      <q-card v-for="item in sortedItems" :key="item.id" class="shortlink-card" bordered flat>
        <q-card-section class="card-header q-pa-sm">
          <div class="row items-center justify-between no-wrap">
            <div class="col ellipsis">
              <div class="text-caption text-grey-7">{{ formatDate(item.createdAt) }}</div>
              <div class="text-subtitle2 text-weight-medium q-mt-xs ellipsis">
                {{ item.title || 'Sem título' }}
              </div>
            </div>
            <div class="col-auto">
              <q-btn flat round dense size="sm" icon="more_vert" color="grey-7">
                <q-menu>
                  <q-list dense style="min-width: 140px">
                    <q-item clickable v-close-popup @click="$emit('edit', item)">
                      <q-item-section avatar>
                        <q-icon name="edit" size="xs" color="primary" />
                      </q-item-section>
                      <q-item-section>Editar</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="$emit('delete', item)">
                      <q-item-section avatar>
                        <q-icon name="delete" size="xs" color="negative" />
                      </q-item-section>
                      <q-item-section>Excluir</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="card-content q-pa-sm">
          <div class="info-row q-mb-sm">
            <div class="info-label-inline">
              <q-icon name="link" size="16px" class="q-mr-xs" />
              <span class="label-text">Link:</span>
              <q-chip
                clickable
                dense
                size="sm"
                color="primary"
                text-color="white"
                icon="content_copy"
                class="q-ml-xs"
                @click="copyToClipboard(getShortUrl(item.shortCode))"
              >
                {{ item.shortCode }}
              </q-chip>
            </div>
          </div>

          <div class="info-row">
            <div class="info-label-inline">
              <q-icon name="language" size="16px" class="q-mr-xs" />
              <span class="label-text">URL:</span>
              <a :href="item.originalUrl" target="_blank" class="text-primary q-ml-xs url-link">
                {{ truncateUrl(item.originalUrl, 40) }}
              </a>
              <q-tooltip>{{ item.originalUrl }}</q-tooltip>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-xs">
          <q-btn
            flat
            dense
            size="sm"
            icon="content_copy"
            color="primary"
            @click="copyToClipboard(getShortUrl(item.shortCode))"
          >
            <q-tooltip>Copiar Link</q-tooltip>
          </q-btn>
          <q-btn
            flat
            dense
            size="sm"
            icon="open_in_new"
            color="primary"
            :href="getShortUrl(item.shortCode)"
            target="_blank"
          >
            <q-tooltip>Abrir</q-tooltip>
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import dayjs from 'dayjs';
import { Notify } from 'quasar';
import type { Shortlink } from 'src/schemas/Shortlink.Schemas';
import type { PropType } from 'vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ShortLinksTable',

  components: {},

  props: {
    items: {
      type: Array as PropType<Shortlink[]>,
      required: true,
      default: () => [],
    },
  },
  emits: ['edit', 'delete'],

  data() {
    return {};
  },

  computed: {
    sortedItems(): Shortlink[] {
      return [...this.items].sort((a, b) => {
        return dayjs(b.createdAt).unix() - dayjs(a.createdAt).unix();
      });
    },
  },

  methods: {
    formatDate(date: string): string {
      return dayjs(date).format('DD/MM/YYYY HH:mm');
    },

    truncateUrl(url: string, maxLength = 50): string {
      if (url.length <= maxLength) return url;
      return url.substring(0, maxLength) + '...';
    },

    getShortUrl(shortCode: string): string {
      return `${window.location.origin}/${shortCode}`;
    },

    async copyToClipboard(text: string): Promise<void> {
      try {
        await navigator.clipboard.writeText(text);
        Notify.create({
          type: 'positive',
          message: 'Link copiado para a área de transferência!',
          position: 'top',
          timeout: 2000,
        });
      } catch {
        Notify.create({
          type: 'negative',
          message: 'Erro ao copiar link',
          position: 'top',
          timeout: 2000,
        });
      }
    },
  },

  created() {},

  mounted() {},
});
</script>

<style scoped lang="scss">
.shortlinks-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 12px;
  padding: 4px 0;
}

/* Responsividade para mobile */
@media (max-width: 768px) {
  .cards-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}

@media (max-width: 400px) {
  .cards-grid {
    grid-template-columns: 1fr;
  }
}

.shortlink-card {
  transition: all 0.2s ease;
  background: white;
  border-radius: 6px;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
}

.card-header {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  min-height: 50px;
}

.card-content {
  background: #fafafa;
}

.info-row {
  display: flex;
  align-items: center;
  min-height: 28px;
}

.info-label-inline {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #555;
  flex-wrap: wrap;
  gap: 4px;

  .label-text {
    font-weight: 600;
    color: #666;
  }
}

.url-link {
  text-decoration: none;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 200px;
  display: inline-block;
  vertical-align: middle;

  &:hover {
    text-decoration: underline;
  }
}

/* Melhorias para mobile */
@media (max-width: 768px) {
  .shortlink-card {
    border-radius: 8px;
  }

  .info-label-inline {
    font-size: 11px;
  }

  .url-link {
    font-size: 11px;
    max-width: 150px;
  }

  .q-card-actions {
    justify-content: space-around !important;
  }
}
</style>
