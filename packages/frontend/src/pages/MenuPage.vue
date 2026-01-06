<template>
  <ShortlinkForm
    :item="shortlink"
    :isShortCodeAvailable="isShortCodeAvailable"
    @submit="handlerSubmit"
  ></ShortlinkForm>
  <ShortlinksTable :items="shortlinks"></ShortlinksTable>
  {{ shortlinks }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ShortlinkForm from 'src/pages/menu-page/ShortlinkForm.vue';

import ShortlinksTable from 'src/pages/menu-page/ShortlinksTable.vue';
import type { NewShortlink, Shortlink } from 'src/schemas/Shortlink.Schemas';
import ShortlinkService from 'src/services/Shortlink.Service';

export default defineComponent({
  name: 'MenuItemsPage',

  components: { ShortlinksTable, ShortlinkForm },

  data() {
    return {
      shortlink: null as Shortlink | null,
      shortlinks: [] as Shortlink[],
    };
  },
  computed: {},

  methods: {
    async handlerSubmit(newShortlink: NewShortlink) {
      if (this.shortlink) {
        const shortlink = {
          ...this.shortlink,
          ...newShortlink,
          shortCode: newShortlink.shortCode ?? this.shortlink.shortCode,
        };
        await this.updateShortlink(shortlink);
      } else {
        await this.createShortlink(newShortlink);
      }
    },
    async isShortCodeAvailable(shortCode: Shortlink['shortCode']): Promise<boolean> {
      return this.$load.execute('check-short-code', async () => {
        const shortlink = await ShortlinkService.isShortCodeAvailable(shortCode);
        return shortlink;
      });
    },
    async createShortlink(newShortlink: NewShortlink) {
      return this.$load.execute('create-shorlink', async () => {
        const link = await ShortlinkService.create(newShortlink);
        this.shortlinks.push(link);
      });
    },
    async updateShortlink(shortLink: Shortlink) {
      return this.$load.execute(`update-shorlink`, async () => {
        const index = this.shortlinks.findIndex((sl) => sl.id === shortLink.id);
        if (index === -1) return;

        const updated = await ShortlinkService.update(shortLink);
        this.shortlinks[index] = updated;
      });
    },
    async deleteLink(shortLink: Shortlink) {
      return this.$load.execute(`delete-shorlink-${shortLink.id}`, async () => {
        const index = this.shortlinks.findIndex((sl) => sl.id === shortLink.id);

        if (index === -1) return;

        await ShortlinkService.delete(shortLink);
        this.shortlinks.splice(index, 1);
      });
    },
    clearLinks() {
      this.shortlinks = [];
    },
    async fetchLinks() {
      return this.$load.execute('fetch-shorlinks', async () => {
        const fetchedLinks = await ShortlinkService.getAll();
        this.shortlinks = fetchedLinks;
      });
    },
  },

  async created() {
    await this.fetchLinks();
  },
});
</script>

<style scoped>
/* Estilos locais aqui */
</style>
