<template>
  <q-card flat bordered class="links-container">
    <q-card-section class="header-section">
      <div class="text-h6 text-weight-bold">Meus Links</div>
      <q-input v-model="search" dense outlined placeholder="Buscar links..." class="search-input">
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
      </q-input>
    </q-card-section>

    <q-separator />

    <q-card-section class="links-section">
      <!-- Loading state -->
      <div v-if="isLoading" class="loading-container">
        <q-spinner color="primary" size="3em" />
        <div class="text-grey-7 q-mt-md">Carregando links...</div>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredLinks.length === 0" class="empty-state">
        <q-icon name="link_off" size="4em" color="grey-5" />
        <div class="text-h6 text-grey-7 q-mt-md">Nenhum link encontrado</div>
        <div class="text-body2 text-grey-6">
          {{ search ? 'Tente buscar por outro termo' : 'Crie seu primeiro link curto' }}
        </div>
      </div>

      <!-- Links list -->
      <div v-else class="links-grid">
        <q-card v-for="link in filteredLinks" :key="link.id" class="link-card" flat bordered>
          <q-card-section class="link-card-header">
            <div class="link-code-badge">
              <q-icon name="link" size="16px" />
              <span class="text-weight-bold">{{ link.shortCode }}</span>
            </div>
            <div class="link-actions">
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
            </div>
          </q-card-section>

          <q-separator />

          <q-card-section class="link-card-body">
            <div class="link-url-section">
              <div class="text-caption text-grey-7 q-mb-xs">URL Original</div>
              <div class="link-url text-body2 ellipsis-2-lines">
                {{ link.originalUrl }}
              </div>
            </div>

            <div class="link-meta">
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

          <q-card-section class="link-card-footer">
            <q-btn
              outline
              color="primary"
              label="Abrir"
              icon="open_in_new"
              size="sm"
              @click="openLink(link)"
            />
            <q-btn
              flat
              color="primary"
              label="Ver Analytics"
              icon="analytics"
              size="sm"
              @click="viewAnalytics(link)"
            />
          </q-card-section>
        </q-card>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import type { ShortLink } from 'src/schemas/ShortLink.Schemas';
import { defineComponent } from 'vue';
import { useLinks } from 'src/composables/useLinks';
import { loadingManager } from 'src/plugins/loading';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'ShortLinkList',

  setup() {
    const { links } = useLinks();
    const $q = useQuasar();

    return {
      links,
      $q,
    };
  },

  emits: ['edit', 'delete'],

  data() {
    return {
      search: '',
    };
  },

  computed: {
    isLoading(): boolean {
      return loadingManager.isLoading('fetch-links');
    },

    filteredLinks(): ShortLink[] {
      if (!this.search) return this.links;

      const searchLower = this.search.toLowerCase();
      return this.links.filter(
        (link) =>
          link.shortCode.toLowerCase().includes(searchLower) ||
          link.originalUrl.toLowerCase().includes(searchLower),
      );
    },
  },

  methods: {
    handleEdit(shortLink: ShortLink) {
      this.$emit('edit', 'edit', shortLink);
    },

    confirmDelete(shortLink: ShortLink) {
      this.$q
        .dialog({
          title: 'Confirmar exclusão',
          message: `Deseja realmente excluir o link "${shortLink.shortCode}"?`,
          cancel: {
            label: 'Cancelar',
            flat: true,
            color: 'grey-7',
          },
          ok: {
            label: 'Excluir',
            color: 'negative',
          },
          persistent: true,
        })
        .onOk(() => {
          this.$emit('delete', shortLink);
        });
    },

    copyLink(link: ShortLink) {
      const fullUrl = `${window.location.origin}/${link.shortCode}`;
      navigator.clipboard.writeText(fullUrl).then(() => {
        this.$q.notify({
          type: 'positive',
          message: 'Link copiado!',
          position: 'top',
          timeout: 2000,
        });
      });
    },

    openLink(link: ShortLink) {
      window.open(link.originalUrl, '_blank');
    },

    viewAnalytics(link: ShortLink) {
      // TODO: Implementar visualização de analytics
      this.$q.notify({
        type: 'info',
        message: 'Analytics em breve!',
        position: 'top',
      });
    },

    formatDate(dateString: string): string {
      return new Date(dateString).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    },
  },
});
</script>

<style scoped lang="scss">
.links-container {
  max-width: 100%;
  border-radius: 12px;
}

.header-section {
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (min-width: 600px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.search-input {
  width: 100%;

  @media (min-width: 600px) {
    max-width: 300px;
  }
}

.links-section {
  padding: 16px;
  min-height: 400px;
}

.loading-container,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.links-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.link-card {
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1);
  }
}

.link-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.02);
}

.body--dark .link-card-header {
  background: rgba(255, 255, 255, 0.05);
}

.link-code-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: var(--q-primary);
  color: white;
  border-radius: 16px;
  font-size: 0.875rem;
}

.link-actions {
  display: flex;
  gap: 4px;
}

.link-card-body {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.link-url-section {
  min-height: 60px;
}

.link-url {
  word-break: break-all;
  line-height: 1.4;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.link-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.link-card-footer {
  padding: 12px 16px;
  display: flex;
  gap: 8px;
  background: rgba(0, 0, 0, 0.02);

  @media (max-width: 599px) {
    flex-direction: column;
  }
}

.body--dark .link-card-footer {
  background: rgba(255, 255, 255, 0.05);
}
</style>
