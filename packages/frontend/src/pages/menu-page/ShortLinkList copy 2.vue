<template>
  <q-table
    title="Meus Links"
    :rows="links"
    :columns="columns"
    row-key="id"
    flat
    bordered
    :loading="isLoading"
  >
    <template v-slot:body-cell-actions="props">
      <q-td :props="props">
        <q-btn
          flat
          dense
          round
          icon="edit"
          size="sm"
          color="primary"
          @click="handleEdit(props.row)"
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
          @click="handleRemove(props.row)"
        >
          <q-tooltip>Excluir</q-tooltip>
        </q-btn>
      </q-td>
    </template>

    <!-- Slot para quando não houver dados -->
    <template v-slot:no-data>
      <div class="full-width row flex-center q-gutter-sm text-grey-7">
        <q-icon size="2em" name="link_off" />
        <span>Nenhum link encontrado</span>
      </div>
    </template>
  </q-table>
  <q-separator></q-separator>

  <q-separator></q-separator>
</template>

<script lang="ts">
import type { ShortLink } from 'src/schemas/ShortLink.Schemas';
import { defineComponent } from 'vue';
import type { QTableColumn } from 'quasar';
import { useLinks } from 'src/composables/useLinks';
import { loadingManager } from 'src/plugins/loading';

export default defineComponent({
  name: 'ShortLinkList',

  setup() {
    const { links } = useLinks();

    return {
      links,
    };
  },

  emits: ['edit', 'delete'],

  computed: {
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
          style: 'max-width: 300px',
          classes: 'ellipsis',
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

    isLoading(): boolean {
      return loadingManager.isLoading('fetch-links');
    },
  },

  methods: {
    handleEdit(shortLink: ShortLink) {
      this.$emit('edit', 'edit', shortLink);
    },

    handleRemove(shortLink: ShortLink) {
      this.$emit('delete', shortLink);
    },
  },
});
</script>

<style scoped></style>
