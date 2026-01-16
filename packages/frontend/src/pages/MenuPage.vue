<template>
  <ShortlinkForm
    :editLink="shortlink"
    :shortCodeIsValid="shortCodeIsValid"
    @validateShortcode="validateShortcode"
    @submit="handlerSubmit"
  ></ShortlinkForm>
  <ShortlinksList :items="shortlinks"></ShortlinksList>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ShortlinkForm from 'src/pages/menu-page/ShortlinkForm.vue';

import ShortlinksList from 'src/pages/menu-page/ShortlinksList.vue';
import type { NewShortlink, Shortlink } from 'src/schemas/Shortlink.Schemas';
import ShortlinkService from 'src/services/Shortlink.Service';

export default defineComponent({
  name: 'MenuItemsPage',

  components: { ShortlinksList, ShortlinkForm },

  data() {
    return {
      shortlink: null as Shortlink | null,
      shortlinks: [] as Shortlink[],
      shortCodeIsValid: false,
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
    async validateShortcode(shortCode: Shortlink['shortCode']): Promise<void> {
      await this.$load.execute('validate-shortcode', async () => {
        const shortlink = await ShortlinkService.getByShortcode(shortCode);
        this.shortCodeIsValid = !shortlink;
      });
    },
    async createShortlink(newShortlink: NewShortlink) {
      return this.$load.execute('create-shortlink', async () => {
        const link = await ShortlinkService.create(newShortlink);
        this.shortlinks.push(link);
      });
    },
    async updateShortlink(shortLink: Shortlink) {
      return this.$load.execute('update-shortlink', async () => {
        const index = this.shortlinks.findIndex((sl) => sl.id === shortLink.id);
        if (index === -1) return;

        const updated = await ShortlinkService.update(shortLink);
        this.shortlinks[index] = updated;
      });
    },
    async deleteLink(shortLink: Shortlink) {
      return this.$load.execute(`delete-shortlink-${shortLink.id}`, async () => {
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
      return this.$load.execute('fetch-shortlinks', async () => {
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
