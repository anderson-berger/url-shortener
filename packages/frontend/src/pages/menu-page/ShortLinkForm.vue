<template>
  <q-card style="min-width: 500px">
    <q-form @submit.prevent="handleSubmit">
      <q-card-section class="row items-center">
        <div class="text-h6">{{ isEdit ? 'Editar Link' : 'Criar Link' }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="handleClose" />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <q-input
          v-model="data.originalUrl"
          label="URL Original"
          outlined
          dense
          autofocus
          :rules="[(val) => !!val || 'URL é obrigatória']"
        >
          <template v-slot:prepend>
            <q-icon name="link" />
          </template>
        </q-input>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="grey" v-close-popup @click="handleClose" />
        <q-btn
          type="submit"
          :label="isEdit ? 'Atualizar' : 'Criar'"
          color="primary"
          :disable="!hasBeenModified"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script lang="ts">
import type { NewShortLink, ShortLink } from 'src/schemas/ShortLink.Schemas';
import { defineComponent, type PropType } from 'vue';

export default defineComponent({
  name: 'ShortLinkForm',

  props: {
    item: {
      type: Object as PropType<NewShortLink | ShortLink>,
      required: true,
    },
  },

  emits: ['create', 'update', 'close'],

  data() {
    return {
      data: { ...this.item } as NewShortLink | ShortLink,
    };
  },

  computed: {
    isEdit(): boolean {
      return 'id' in this.data;
    },

    hasBeenModified(): boolean {
      return JSON.stringify(this.item) !== JSON.stringify(this.data);
    },
  },

  watch: {
    item: {
      handler(newItem) {
        this.data = { ...newItem };
      },
      deep: true,
    },
  },

  methods: {
    handleSubmit() {
      if (!this.hasBeenModified) return;

      if (this.isEdit) {
        this.$emit('update', this.data as ShortLink);
      } else {
        this.$emit('create', this.data as NewShortLink);
      }
    },

    handleClose() {
      this.$emit('close');
    },
  },
});
</script>
