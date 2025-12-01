<template>
  <q-card>
    <q-card-section>
      <div class="text-h6 text-weight-bold">Meus Links</div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div v-if="isLoading" class="loading-container">
        <q-spinner color="primary" size="3em" />
        <div class="text-grey-7 q-mt-md">Carregando links...</div>
      </div>
      <div v-else-if="filteredLinks.length === 0" class="empty-state">
        <q-icon name="link_off" size="4em" color="grey-5" />
        <div class="text-h6 text-grey-7 q-mt-md">Nenhum link encontrado</div>
        <div class="text-body2 text-grey-6">
          {{ search ? 'Tente buscar por outro termo' : 'Crie seu primeiro link curto' }}
        </div>
      </div>
      <div v-else>
        <div class="row q-col-gutter-sm">
          <div class="col-12 col-sm-6 col-md-4" v-for="link in filteredLinks" :key="link.id">
            <q-card flat bordered>
              <q-card-section class="row items-center">
                <q-icon name="link" size="16px" class="q-mr-xs" />
                <span class="text-weight-bold">{{ link.title || 'Sem título' }}</span>
                <q-space></q-space>
                <q-btn
                  flat
                  dense
                  round
                  icon="content_copy"
                  size="sm"
                  color="grey-7"
                  @click="copyLink(link)"
                >
                  <q-tooltip>Copiar link</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="edit"
                  size="sm"
                  color="primary"
                  @click="handleEdit(link)"
                >
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  round
                  icon="delete"
                  size="sm"
                  color="negative"
                  @click="confirmDelete(link)"
                >
                  <q-tooltip>Excluir</q-tooltip>
                </q-btn>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <div>
                  <div class="text-caption text-grey-7 q-mb-xs">URL Original</div>
                  <div class="link-url text-body2 ellipsis-2-lines">
                    {{ link.originalUrl }}
                  </div>
                </div>
                <div class="link-meta q-mt-md">
                  <div class="meta-item">
                    <q-icon name="event" size="16px" color="grey-6" />
                    <span class="text-caption text-grey-7">
                      {{ formatDate(link.createdAt) }}
                    </span>
                  </div>
                  <div class="meta-item">
                    <q-icon name="update" size="16px" color="grey-6" />
                    <span class="text-caption text-grey-7"> v{{ link.version }} </span>
                  </div>
                </div>
              </q-card-section>

              <q-card-section>
                <q-btn
                  outline
                  color="primary"
                  label="Abrir"
                  icon="open_in_new"
                  size="sm"
                  @click="openLink(link)"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import type { ShortLink } from 'src/schemas/ShortLink.Schemas';
import { defineComponent } from 'vue';
import { useLinks } from 'src/composables/useLinks';
import { loadingManager } from 'src/plugins/loading';
import { copyToClipboard, Notify } from 'quasar';
import dayjs from 'dayjs';

export default defineComponent({
  name: 'ShortLinkList',

  setup() {
    const { links } = useLinks();

    return {
      links,
    };
  },

  emits: ['edit', 'delete'],

  data() {
    return {
      search: '',
    };
  },

  computed: {
    filteredLinks(): readonly ShortLink[] {
      if (!this.search) return this.links;

      const searchLower = this.search.toLowerCase();
      return this.links.filter(
        (link) =>
          link.title?.toLowerCase().includes(searchLower) ||
          link.originalUrl.toLowerCase().includes(searchLower) ||
          link.shortCode.toLowerCase().includes(searchLower),
      );
    },

    isLoading(): boolean {
      return loadingManager.isLoading('fetch-links');
    },
  },

  methods: {
    copyLink(link: ShortLink) {
      const shortUrl = `${window.location.origin}/${link.shortCode}`;
      copyToClipboard(shortUrl)
        .then(() => {
          Notify.create({
            type: 'positive',
            message: 'Link copiado!',
            position: 'top',
          });
        })
        .catch(() => {
          Notify.create({
            type: 'negative',
            message: 'Erro ao copiar link',
            position: 'top',
          });
        });
    },

    confirmDelete(link: ShortLink) {
      this.$emit('delete', link);
    },

    openLink(link: ShortLink) {
      const shortUrl = `${window.location.origin}/${link.shortCode}`;
      window.open(shortUrl, '_blank');
    },

    formatDate(dateString: string): string {
      return dayjs(dateString).format('DD/MM/YYYY HH:mm');
    },

    handleEdit(shortLink: ShortLink) {
      this.$emit('edit', 'edit', shortLink);
    },
  },
});
</script>

<style scoped>
.loading-container,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
}

.link-meta {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-all;
}
</style>
