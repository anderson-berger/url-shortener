<template>
  <MenuItems @handler="onOpenDialog"></MenuItems>
  <q-dialog v-model="showFormDialog">
    <ShortLinkForm :item="shortLink" @submit="onSubmit"></ShortLinkForm>
  </q-dialog>

  <q-dialog v-model="showListDialog" :maximized="$q.screen.lt.md">
    <ShortLinkList @create="onOpenDialog" @edit="onOpenDialog" @delete="onDelete" />
  </q-dialog>

  <q-separator></q-separator>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MenuItems from 'src/pages/menu-page/MenuItems.vue';
import ShortLinkForm from 'src/pages/menu-page/ShortLinkForm.vue';
import type { NewShortLink, ShortLink } from 'src/schemas/ShortLink.Schemas';
import ShortLinkList from 'src/pages/menu-page/ShortLinkList.vue';
import { useLinks } from 'src/composables/useLinks';

export default defineComponent({
  name: 'MenuItemsPage',

  components: {
    MenuItems,
    ShortLinkForm,
    ShortLinkList,
  },

  setup() {
    const { fetchLinks, createShortLink, updateShortLink, deleteLink } = useLinks();

    return {
      fetchLinks,
      createShortLink,
      updateShortLink,
      deleteLink,
    };
  },

  data() {
    return {
      shortLink: { originalUrl: '' } as NewShortLink | ShortLink,
      showFormDialog: false,
      showListDialog: false,
      showAnalyticsDialog: false,
    };
  },

  methods: {
    onOpenDialog(menu: string, shortLink?: ShortLink) {
      switch (menu) {
        case 'create': {
          this.shortLink = { originalUrl: '' };
          this.showFormDialog = true;
          break;
        }
        case 'edit':
          if (!shortLink) break;
          this.shortLink = shortLink;
          this.showFormDialog = true;
          break;
        case 'list':
          this.showListDialog = true;
          break;
        case 'analytics':
          this.showAnalyticsDialog = true;
          break;
        default:
          console.warn('Ação de menu desconhecida:', menu);
      }
    },

    onCloseDialog(menu: string) {
      switch (menu) {
        case 'create':
        case 'edit':
          this.showFormDialog = false;
          break;
        case 'list':
          this.showListDialog = false;
          break;
        case 'analytics':
          this.showAnalyticsDialog = false;
          break;
        default:
          console.warn('Ação de menu desconhecida:', menu);
      }
    },

    async onSubmit(item: NewShortLink | ShortLink) {
      if ('id' in item) {
        await this.updateShortLink(item);
      } else {
        await this.createShortLink(item);
      }
      this.showFormDialog = false;
    },
    async onDelete(shortLink: ShortLink) {
      await this.deleteLink(shortLink);
    },

    async syncAll() {
      await this.fetchLinks();
    },
  },

  async created() {
    await this.syncAll();
  },
});
</script>

<style scoped>
/* Estilos locais aqui */
</style>
