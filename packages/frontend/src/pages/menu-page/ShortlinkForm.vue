<template>
  <q-form @submit.prevent="handleSubmit">
    <q-card flat>
      <q-card-section class="row q-col-gutter-sm">
        <!-- TÍTULO -->
        <q-input
          v-model="shortlink.title"
          placeholder="Título"
          label="Título"
          outlined
          dense
          clearable
          :rules="titleRules"
          class="col-12 col-sm-6 col-md-3"
        />

        <!-- SHORT CODE -->
        <q-input
          v-model="shortlink.shortCode"
          placeholder="Código curto"
          label="Código curto"
          outlined
          dense
          maxlength="6"
          counter
          :rules="shortCodeRules"
          @blur="onShortCodeBlur"
          class="col-12 col-sm-6 col-md-3"
        >
          <template #append>
            <q-btn
              flat
              dense
              round
              icon="autorenew"
              :loading="$load.isLoading('check-short-code')"
              @click="generateShortCode"
              :title="'Gerar código aleatório'"
            />
          </template>
        </q-input>

        <!-- URL ORIGINAL -->
        <q-input
          v-model="shortlink.originalUrl"
          label="Url"
          outlined
          dense
          type="url"
          clearable
          lazy-rules
          :rules="urlRules"
          class="col-12 col-sm-12 col-md-6"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-if="editLink" flat color="secondary" label="Resetar" @click="resetForm" />

        <q-btn outline label="Limpar" @click="clearForm" />

        <q-btn
          icon="save"
          type="submit"
          color="primary"
          :loading="loading"
          :disable="loading"
          :label="editLink ? 'Salvar alterações' : 'Criar link'"
        />
      </q-card-actions>
    </q-card>
  </q-form>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { $newShortlink, type NewShortlink, type Shortlink } from 'src/schemas/Shortlink.Schemas';

export default defineComponent({
  name: 'ShortlinkForm',

  props: {
    editLink: {
      type: Object as PropType<Shortlink | null>,
      default: null,
    },
    isShortCodeAvailable: {
      type: Function as PropType<(code: string) => Promise<boolean>>,
      required: true,
    },
  },

  emits: ['submit'],

  data() {
    return {
      shortlink: {
        title: '',
        originalUrl: '',
        shortCode: '',
      } as NewShortlink,

      titleRules: [(val: string) => !!val || 'Título é obrigatório'],

      urlRules: [
        (val: string) => !!val || 'URL é obrigatória',
        (val: string) => /^https?:\/\/.+/.test(val) || 'Informe uma URL válida',
      ],
      shortCodeIsAvailable: false,
      shortCodeRules: [
        (val: string) => !!val || 'Código é obrigatório',
        (val: string) => val.length <= 6 || 'Máx. 6 caracteres',
        (val: string) => /^[a-zA-Z0-9_-]+$/.test(val) || 'Somente letras e números',
      ],
    };
  },

  computed: {
    loading() {
      if (this.$load.isLoading('create-shorlink')) return true;
      if (this.$load.isLoading('update-shorlink')) return true;
      return false;
    },
  },

  watch: {
    editLink: {
      immediate: true,
      handler(link: Shortlink | null) {
        if (!link) {
          this.shortlink = this.createNewShortlink();
          return;
        }

        const parsed = $newShortlink.safeParse({
          title: link.title,
          originalUrl: link.originalUrl,
          shortCode: link.shortCode,
        });

        this.shortlink = parsed.success ? parsed.data : this.createNewShortlink();
      },
    },
  },

  methods: {
    handleSubmit() {
      const parsed = $newShortlink.safeParse(this.shortlink);

      if (!parsed.success) {
        return;
      }

      this.$emit('submit', parsed.data);
    },

    async onShortCodeBlur() {
      if (!this.shortlink.shortCode) return;

      const isShortCodeAvailable = await this.isShortCodeAvailable(this.shortlink.shortCode);
      this.shortCodeIsAvailable = isShortCodeAvailable;
    },
    async generateShortCode() {
      this.shortlink.shortCode = this.randomCode(6);
      await this.onShortCodeBlur();
    },

    randomCode(length = 6) {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';

      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      return result;
    },

    clearForm() {
      this.shortlink = this.createNewShortlink();
    },

    resetForm() {
      if (!this.editLink) return;

      this.shortlink = {
        title: this.editLink.title,
        originalUrl: this.editLink.originalUrl,
        shortCode: this.editLink.shortCode,
      };
    },

    createNewShortlink(): NewShortlink {
      return {
        title: '',
        originalUrl: '',
        shortCode: this.randomCode(6),
      };
    },
  },
});
</script>

<style scoped>
/* estilos locais, se necessário */
</style>
