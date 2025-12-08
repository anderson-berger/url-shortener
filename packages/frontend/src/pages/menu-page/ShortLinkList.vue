<template>
  <q-card style="width: 80vw; max-width: 1200px">
    <!-- Header -->
    <q-card-section class="bg-primary text-white">
      <div class="row items-center">
        <q-icon name="link" size="32px" class="q-mr-md" />
        <div>
          <div class="text-h5 text-weight-bold">Meus Links</div>
          <div class="text-caption">Gerencie todos os seus links curtos</div>
        </div>
        <q-space />
        <q-btn
          flat
          dense
          round
          icon="close"
          color="white"
          size="md"
          v-close-popup
          @click="$emit('close')"
        >
          <q-tooltip>Fechar</q-tooltip>
        </q-btn>
      </div>
    </q-card-section>

    <!-- Search Bar -->
    <q-card-section class="bg-grey-2">
      <q-input
        v-model="search"
        filled
        dense
        placeholder="Pesquisar por título, URL ou código..."
        bg-color="white"
      >
        <template v-slot:prepend>
          <q-icon name="search" />
        </template>
        <template v-slot:append v-if="search">
          <q-icon name="close" @click="search = ''" class="cursor-pointer" />
        </template>
      </q-input>

      <!-- Stats -->
      <div class="row q-mt-md q-gutter-sm" v-if="!isLoading && links.length > 0">
        <q-chip color="primary" text-color="white" icon="link">
          {{ filteredLinks.length }} {{ filteredLinks.length === 1 ? 'link' : 'links' }}
        </q-chip>
        <q-chip color="secondary" text-color="white" icon="visibility">
          {{ totalClicks }} cliques totais
        </q-chip>
      </div>
    </q-card-section>

    <!-- Content -->
    <q-card-section style="max-height: 60vh; overflow-y: auto" class="q-pa-md">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-container">
        <q-spinner color="primary" size="3em" />
        <div class="text-grey-7 q-mt-md">Carregando links...</div>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredLinks.length === 0" class="empty-state">
        <q-icon name="link_off" size="80px" color="grey-4" />
        <div class="text-h6 text-grey-7 q-mt-md">Nenhum link encontrado</div>
        <div class="text-body2 text-grey-6 q-mt-sm">
          {{
            search ? 'Tente buscar por outro termo' : 'Crie seu primeiro link curto para começar'
          }}
        </div>
        <q-btn
          v-if="!search"
          color="primary"
          label="Criar Link"
          icon="add"
          class="q-mt-lg"
          @click="$emit('create')"
        />
      </div>

      <!-- Links List -->
      <div v-else class="links-container">
        <q-card
          v-for="link in filteredLinks"
          :key="link.id"
          flat
          bordered
          class="link-item q-mb-md"
        >
          <!-- Link Header -->
          <q-card-section class="row items-center q-pb-none">
            <div class="col">
              <div class="text-h6 text-weight-medium">
                {{ link.title || 'Sem título' }}
              </div>
            </div>
            <div class="col-auto">
              <q-btn-group flat>
                <q-btn flat dense icon="content_copy" color="grey-7" @click="copyLink(link)">
                  <q-tooltip>Copiar</q-tooltip>
                </q-btn>
                <q-btn flat dense icon="edit" color="primary" @click="handleEdit(link)">
                  <q-tooltip>Editar</q-tooltip>
                </q-btn>
                <q-btn flat dense icon="delete" color="negative" @click="confirmDelete(link)">
                  <q-tooltip>Excluir</q-tooltip>
                </q-btn>
              </q-btn-group>
            </div>
          </q-card-section>

          <!-- Link Content -->
          <q-card-section>
            <!-- Short URL -->
            <div class="short-url-container q-mb-md">
              <div class="row items-center">
                <q-icon name="link" size="20px" color="primary" class="q-mr-sm" />
                <a :href="getShortUrl(link.shortCode)" target="_blank" class="short-url-link">
                  {{ getShortUrl(link.shortCode) }}
                </a>
                <q-space />
                <q-btn
                  flat
                  dense
                  size="sm"
                  color="primary"
                  icon="open_in_new"
                  @click="openLink(link)"
                >
                  <q-tooltip>Abrir em nova aba</q-tooltip>
                </q-btn>
              </div>
            </div>

            <!-- Original URL -->
            <div class="original-url-container">
              <div class="text-caption text-grey-7 q-mb-xs">
                <q-icon name="arrow_forward" size="14px" /> Redireciona para:
              </div>
              <div class="original-url text-body2">
                {{ link.originalUrl }}
              </div>
            </div>
          </q-card-section>

          <!-- Link Footer -->
          <q-separator />
          <q-card-section class="row items-center q-py-sm bg-grey-1">
            <div class="col-auto">
              <q-chip dense size="sm" icon="event" color="grey-3" text-color="grey-8">
                {{ formatDate(link.createdAt) }}
              </q-chip>
            </div>
            <q-space />
            <div class="col-auto">
              <q-chip dense size="sm" icon="visibility" color="primary" text-color="white">
                {{ link.clicks || 0 }} {{ (link.clicks || 0) === 1 ? 'clique' : 'cliques' }}
              </q-chip>
            </div>
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
import { copyToClipboard, Notify, Dialog } from 'quasar';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('pt-br');

export default defineComponent({
  name: 'ShortLinkList',

  setup() {
    const { links } = useLinks();

    return {
      links,
    };
  },

  emits: ['edit', 'delete', 'close', 'create'],

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
          link.originalUrl.toLowerCase().includes(searchLower) ||
          link.shortCode.toLowerCase().includes(searchLower) ||
          (link.title && link.title.toLowerCase().includes(searchLower)),
      );
    },

    isLoading(): boolean {
      return loadingManager.isLoading('fetch-links');
    },

    totalClicks(): number {
      return this.links.reduce((total, link) => total + (link.clicks || 0), 0);
    },
  },

  methods: {
    getShortUrl(shortCode: string): string {
      return `${window.location.origin}/go/${shortCode}`;
    },

    copyLink(link: ShortLink) {
      const shortUrl = this.getShortUrl(link.shortCode);
      copyToClipboard(shortUrl)
        .then(() => {
          Notify.create({
            type: 'positive',
            message: 'Link copiado! ✓',
            position: 'top',
            timeout: 1500,
            actions: [{ icon: 'close', color: 'white' }],
          });
        })
        .catch(() => {
          Notify.create({
            type: 'negative',
            message: 'Erro ao copiar link',
            position: 'top',
            timeout: 2000,
          });
        });
    },

    confirmDelete(link: ShortLink) {
      Dialog.create({
        title: 'Confirmar exclusão',
        message: `Tem certeza que deseja excluir o link "${link.title || link.shortCode}"? Esta ação não pode ser desfeita.`,
        cancel: {
          label: 'Cancelar',
          color: 'grey-7',
          flat: true,
        },
        ok: {
          label: 'Excluir',
          color: 'negative',
          unelevated: true,
        },
        persistent: true,
      }).onOk(() => {
        this.$emit('delete', link);
      });
    },

    openLink(link: ShortLink) {
      const shortUrl = this.getShortUrl(link.shortCode);
      window.open(shortUrl, '_blank');
    },

    formatDate(dateString: string): string {
      const date = dayjs(dateString);
      const now = dayjs();
      const diffDays = now.diff(date, 'day');

      if (diffDays === 0) {
        return 'Hoje';
      } else if (diffDays === 1) {
        return 'Ontem';
      } else if (diffDays < 7) {
        return date.fromNow();
      }
      return date.format('DD/MM/YYYY');
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
  padding: 4rem 1rem;
  min-height: 300px;
}

.links-container {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.link-item {
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
}

.link-item:hover {
  border-left-color: var(--q-primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateX(4px);
}

.short-url-container {
  background-color: #f5f7fa;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.short-url-link {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: var(--q-primary);
  text-decoration: none;
  font-size: 0.95em;
  word-break: break-all;
}

.short-url-link:hover {
  text-decoration: underline;
}

.original-url-container {
  background-color: #fafafa;
  padding: 12px;
  border-radius: 8px;
}

.original-url {
  color: #555;
  word-break: break-all;
  line-height: 1.5;
}

/* Scrollbar customization */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
