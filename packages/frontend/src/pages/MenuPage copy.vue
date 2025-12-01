<template>
  <q-page class="q-pa-md menu-page">
    <div class="page-header q-mb-xl">
      <div class="text-h3 text-weight-bold text-primary">Menu Principal</div>
      <div class="text-subtitle1 text-grey-7 q-mt-sm">Escolha uma opção para começar</div>
    </div>

    <div class="row q-col-gutter-lg justify-center">
      <div v-for="menu in menus" :key="menu.action" class="col-12 col-sm-6 col-md-4">
        <q-card
          class="menu-card cursor-pointer"
          :class="`menu-card--${menu.color}`"
          @click="openDialog(menu.action)"
        >
          <q-card-section class="card-icon-section">
            <div class="icon-wrapper">
              <q-icon :name="menu.icon" size="56px" class="menu-icon" />
            </div>
          </q-card-section>

          <q-card-section class="card-content">
            <div class="text-h5 text-weight-bold q-mb-sm">
              {{ menu.title }}
            </div>
            <div class="text-body2 text-grey-7">
              {{ menu.description }}
            </div>
          </q-card-section>

          <q-card-section class="card-footer">
            <q-btn
              flat
              dense
              no-caps
              label="Acessar"
              :color="menu.color"
              icon-right="arrow_forward"
              class="full-width"
            />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Dialog Criar Link -->
    <q-dialog v-model="createDialog">
      <ShortLinkForm :item="formItem" @create="onCreate" />
    </q-dialog>

    <!-- Dialog Meus Links -->
    <q-dialog v-model="listDialog">
      <ShortLinkList :items="items" @edit="onEdit" />
    </q-dialog>

    <!-- Dialog Analytics -->
    <q-dialog v-model="analyticsDialog">
      <q-card style="min-width: 800px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Analytics</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="analyticsDialog = false" />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <!-- Coloque aqui os componentes de analytics; exemplo placeholder -->
          <div>Analytics content...</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ShortLinkForm from 'src/pages/menu-page/ShortLinkForm.vue';
import ShortLinkList from 'src/pages/menu-page/ShortLinkList.vue';

import type { NewShortLink, ShortLink } from 'src/schemas/ShortLink.Schemas';
import { useLinks } from 'src/composables/useLinks';

export default defineComponent({
  name: 'MenuPage',
  components: {
    ShortLinkForm,
    ShortLinkList,
  },
  data() {
    return {
      linksComposable: useLinks(),
      createDialog: false,
      listDialog: false,
      analyticsDialog: false,

      formItem: {
        originalUrl: '',
      } as NewShortLink,

      menus: [
        {
          title: 'Criar Link',
          description: 'Criar um novo link curto personalizado',
          icon: 'add_link',
          color: 'primary',
          action: 'create',
        },
        {
          title: 'Meus Links',
          description: 'Gerenciar todos os seus links',
          icon: 'list',
          color: 'secondary',
          action: 'list',
        },
        {
          title: 'Analytics',
          description: 'Acompanhar estatísticas e desempenho',
          icon: 'analytics',
          color: 'positive',
          action: 'analytics',
        },
      ],
    };
  },

  computed: {
    items() {
      return this.linksComposable.links;
    },
  },

  methods: {
    async openDialog(action: string) {
      if (action === 'create') {
        this.formItem = { originalUrl: '' } as NewShortLink;
        this.createDialog = true;
      }

      if (action === 'list') {
        this.listDialog = true;
        // Busca os links quando o dialog abre
        await this.linksComposable.fetchLinks();
      }

      if (action === 'analytics') {
        this.analyticsDialog = true;
      }
    },

    onCloseCreate() {
      this.createDialog = false;
      this.formItem = { originalUrl: '' } as NewShortLink;
    },

    async onCreate(newShortLink: NewShortLink) {
      try {
        return this.$load.execute('links.createLink', async () => {
          await this.linksComposable.createLink(newShortLink);
          this.createDialog = false;
          this.createItem = { originalUrl: '' } as NewShortLink;
        });
      } catch (err) {
        console.error('Erro ao criar link', err);
      }
    },
    onEdit(item: ShortLink) {
      this.createItem = item;
      this.createDialog = true;
    },
  },
});
//action = "create precisa vira =form"
//createDialog precisa vira FormDialog
</script>

<style scoped>
.menu-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.page-header {
  text-align: center;
  padding: 2rem 0;
}

.menu-card {
  height: 100%;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.menu-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
}

.menu-card--primary:hover {
  border-color: var(--q-primary);
  box-shadow: 0 12px 28px rgba(var(--q-primary-rgb), 0.2);
}

.menu-card--secondary:hover {
  border-color: var(--q-secondary);
  box-shadow: 0 12px 28px rgba(var(--q-secondary-rgb), 0.2);
}

.menu-card--positive:hover {
  border-color: var(--q-positive);
  box-shadow: 0 12px 28px rgba(var(--q-positive-rgb), 0.2);
}

.card-icon-section {
  padding: 2rem 1rem 1rem;
  text-align: center;
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.1) 0%, rgba(25, 118, 210, 0.05) 100%);
  transition: all 0.3s ease;
}

.menu-card--primary .icon-wrapper {
  background: linear-gradient(135deg, rgba(25, 118, 210, 0.15) 0%, rgba(25, 118, 210, 0.05) 100%);
}

.menu-card--secondary .icon-wrapper {
  background: linear-gradient(135deg, rgba(156, 39, 176, 0.15) 0%, rgba(156, 39, 176, 0.05) 100%);
}

.menu-card--positive .icon-wrapper {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.15) 0%, rgba(76, 175, 80, 0.05) 100%);
}

.menu-card:hover .icon-wrapper {
  transform: scale(1.1) rotate(5deg);
}

.menu-icon {
  transition: all 0.3s ease;
}

.menu-card--primary .menu-icon {
  color: var(--q-primary);
}

.menu-card--secondary .menu-icon {
  color: var(--q-secondary);
}

.menu-card--positive .menu-icon {
  color: var(--q-positive);
}

.card-content {
  padding: 1rem 1.5rem;
  text-align: center;
  min-height: 120px;
}

.card-footer {
  padding: 0.5rem 1rem 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}

.card-footer .q-btn {
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.menu-card:hover .card-footer .q-btn {
  transform: translateX(4px);
}

/* Responsividade */
@media (max-width: 599px) {
  .page-header {
    padding: 1rem 0;
  }

  .menu-page {
    padding: 1rem 0.5rem;
  }

  .icon-wrapper {
    width: 80px;
    height: 80px;
  }

  .menu-icon {
    font-size: 48px !important;
  }
}
</style>
