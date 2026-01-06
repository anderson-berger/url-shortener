<template>
  <q-table title="Meus Links Encurtados" :rows="rows" :columns="columns" row-key="id"> </q-table>
</template>

<script lang="ts">
import dayjs from 'dayjs';
import type { QTableColumn } from 'quasar';
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
    rows() {
      return this.items;
    },
    columns(): QTableColumn[] {
      return [
        {
          name: 'originalUrl',
          label: 'URL Original',
          field: 'originalUrl',
          align: 'left',
          sortable: true,
          style: 'max-width: 400px',
        },
        {
          name: 'shortCode',
          label: 'Código Curto',
          field: 'shortCode',
          align: 'center',
          sortable: true,
        },
        {
          name: 'createdAt',
          label: 'Criado em',
          field: 'createdAt',
          align: 'center',
          sortable: true,
          sort: (a: string, b: string) => {
            return dayjs(a).unix() - dayjs(b).unix();
          },
        },
        {
          name: 'actions',
          label: 'Ações',
          field: 'actions',
          align: 'center',
        },
      ];
    },
  },

  methods: {},

  created() {},

  mounted() {},
});
</script>

<style scoped>
/* Estilos locais aqui */
</style>
