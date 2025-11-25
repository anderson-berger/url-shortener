<template>
  <q-table :rows="rows" :columns="columns" row-key="id" flat bordered :loading="loading">
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn flat dense round icon="edit" size="sm" @click="handleEdit(props.row)" />
        <q-btn
          flat
          dense
          round
          icon="delete"
          size="sm"
          color="negative"
          @click="handleRemove(props.row)"
        />
      </q-td>
    </template>
  </q-table>
</template>

<script lang="ts">
import type { ShortLink } from 'src/schemas/ShortLink.Schemas';
import { defineComponent, PropType } from 'vue';
import type { QTableColumn } from 'quasar';

export default defineComponent({
  name: 'ShortLinkList',

  props: {
    items: {
      type: Array as PropType<ShortLink[]>, //
      required: true,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['edit', 'delete'],

  computed: {
    rows(): ShortLink[] {
      return this.items;
    },

    columns(): QTableColumn[] {
      return [
        {
          name: 'shortCode',
          label: 'Código',
          field: 'shortCode',
          align: 'left',
          sortable: true,
        },
        {
          name: 'originalUrl',
          label: 'URL Original',
          field: 'originalUrl',
          align: 'left',
          sortable: true,
        },
        {
          name: 'createdAt',
          label: 'Criado em',
          field: 'createdAt',
          align: 'left',
          sortable: true,
          format: (val: string) => new Date(val).toLocaleDateString('pt-BR'),
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

  methods: {
    handleEdit(shortLink: ShortLink) {
      this.$emit('edit', shortLink);
    },

    handleRemove(shortLink: ShortLink) {
      this.$emit('delete', shortLink);
    },
  },
});
</script>

<style scoped>
/* Estilos locais aqui */
</style>
