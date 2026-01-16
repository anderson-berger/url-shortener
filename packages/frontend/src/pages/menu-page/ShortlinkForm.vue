<template>
  <q-card flat>
    <q-form @submit.prevent="handleSubmit">
      <q-card-section class="row q-col-gutter-sm">
        <q-input
          class="col-12"
          v-model="newShortlink.originalUrl"
          placeholder="https://exemplo.com/sua-url-longa"
          outlined
          label="URL"
          dense
          type="url"
          clearable
          lazy-rules
          :rules="[
            (val: string) => !!val || 'URL é obrigatória',
            (val: string) => /^https?:\/\/.+/.test(val) || 'Informe uma URL válida',
          ]"
        >
          <template #prepend>
            <q-icon name="link" size="sm" color="grey-6" />
          </template>
        </q-input>
        <q-input
          class="col-12 col-sm-6"
          v-model="newShortlink.title"
          placeholder="Ex: Meu Site Pessoal"
          label="Titulo"
          outlined
          dense
          clearable
          :rules="[(val: string) => !!val || 'Título é obrigatório']"
        >
          <template #prepend>
            <q-icon name="label" size="sm" color="grey-6" />
          </template>
        </q-input>
        <q-input
          class="col-12 col-sm-6"
          v-model="newShortlink.shortCode"
          placeholder="abc123"
          outlined
          dense
          maxlength="6"
          counter
          @blur="onShortCodeBlur"
          :rules="[
            (val: string) => !!val || 'Código é obrigatório',
            (val: string) => val.length <= 6 || 'Máx. 6 caracteres',
            (val: string) => /^[a-zA-Z0-9_-]+$/.test(val) || 'Somente letras, números, _ e -',
          ]"
        >
          <template v-slot:append>
            <q-btn
              round
              dense
              flat
              icon="autorenew"
              :loading="$load.isLoading('validate-shortcode')"
              @click="generateShortCode"
            />
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn v-if="editLink" flat icon="refresh" label="Resetar" @click="resetForm" />

        <q-btn outline icon="clear" label="Limpar" @click="clearForm" />

        <q-btn
          icon="save"
          type="submit"
          color="primary"
          :loading="$load.isLoading('create-shortlink') || $load.isLoading('update-shortlink')"
          :disable="isSubmitDisabled"
          :label="editLink ? 'Salvar' : 'Criar'"
        />
      </q-card-actions>
    </q-form>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import { $newShortlink, type NewShortlink, type Shortlink } from 'src/schemas/Shortlink.Schemas';

export default defineComponent({
  name: 'ShortlinkForm',

  components: {},

  props: {
    editLink: {
      type: Object as PropType<Shortlink | null>,
      default: null,
    },
    shortCodeIsValid: {
      type: Boolean,
      default: false,
    },
  },

  emits: ['submit', 'validateShortcode'],

  data() {
    return {
      newShortlink: {
        title: '',
        originalUrl: '',
        shortCode: '',
      } as NewShortlink,
    };
  },
  watch: {
    editLink: {
      immediate: true,
      handler(link: Shortlink | null) {
        if (!link) {
          this.newShortlink = this.createNewShortlink();
          return;
        }

        const parsed = $newShortlink.safeParse({
          title: link.title,
          originalUrl: link.originalUrl,
          shortCode: link.shortCode,
        });

        this.newShortlink = parsed.success ? parsed.data : this.createNewShortlink();
      },
    },
  },
  computed: {
    isSubmitDisabled() {
      return !this.shortCodeIsValid;
    },
  },

  methods: {
    onShortCodeBlur() {
      const shortCode = this.newShortlink.shortCode;

      this.$emit('validateShortcode', shortCode);
    },

    resetForm() {
      if (!this.editLink) return;

      this.newShortlink = {
        title: this.editLink.title,
        originalUrl: this.editLink.originalUrl,
        shortCode: this.editLink.shortCode,
      };
    },
    clearForm() {
      this.newShortlink = this.createNewShortlink();
    },
    handleSubmit() {
      this.$emit('submit', this.newShortlink);
    },
    createNewShortlink(): NewShortlink {
      return {
        title: '',
        originalUrl: '',
        shortCode: this.randomCode(6),
      };
    },
    generateShortCode() {
      this.newShortlink.shortCode = this.randomCode(6);
      this.onShortCodeBlur();
    },
    randomCode(length = 6) {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';

      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      return result;
    },
  },

  created() {
    // Valida o shortCode gerado automaticamente
    this.onShortCodeBlur();
  },

  mounted() {},
});
</script>

<style scoped>
/* Estilos locais aqui */
</style>
