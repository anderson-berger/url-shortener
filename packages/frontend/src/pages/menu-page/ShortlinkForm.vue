<template>
  <q-card flat>
    <q-form @submit.prevent="handleSubmit">
      <q-card-section>
        <div class="row q-col-gutter-sm">
          <div class="col-12">
            <div>
              <label class="input-label">
                <q-icon name="language" size="16px" class="q-mr-xs" />
                URL de Destino
              </label>
              <q-input
                v-model="shortlink.originalUrl"
                placeholder="https://exemplo.com/sua-url-longa"
                outlined
                dense
                type="url"
                clearable
                lazy-rules
                :rules="urlRules"
                class="url-input"
              >
                <template #prepend>
                  <q-icon name="link" size="sm" color="grey-6" />
                </template>
              </q-input>
            </div>
          </div>

          <!-- TÍTULO E SHORT CODE -->
          <div class="col-12 col-sm-6">
            <div>
              <label class="input-label">
                <q-icon name="title" size="16px" class="q-mr-xs" />
                Título
              </label>
              <q-input
                v-model="shortlink.title"
                placeholder="Ex: Meu Site Pessoal"
                outlined
                dense
                clearable
                :rules="titleRules"
              >
                <template #prepend>
                  <q-icon name="label" size="sm" color="grey-6" />
                </template>
              </q-input>
            </div>
          </div>

          <div class="col-12 col-sm-6">
            <div>
              <label class="input-label">
                <q-icon name="code" size="16px" class="q-mr-xs" />
                Código Curto
              </label>
              <q-input
                v-model="shortlink.shortCode"
                placeholder="abc123"
                outlined
                dense
                maxlength="6"
                counter
                :rules="shortCodeRules"
                @blur="onShortCodeBlur"
                :hint="availabilityHint"
                :hint-color="availabilityHintColor"
              >
                <template #prepend>
                  <q-icon name="tag" size="sm" :color="availabilityIconColor" />
                </template>
                <template #append>
                  <q-spinner-dots v-if="isCheckingCode" size="sm" color="orange-7" />
                  <q-icon
                    v-else-if="
                      shortCodeIsAvailable &&
                      shortlink.shortCode &&
                      lastVerifiedShortCode === shortlink.shortCode
                    "
                    name="check_circle"
                    size="sm"
                    color="positive"
                  />
                  <q-icon
                    v-else-if="
                      !shortCodeIsAvailable &&
                      shortlink.shortCode &&
                      lastVerifiedShortCode === shortlink.shortCode
                    "
                    name="cancel"
                    size="sm"
                    color="negative"
                  />
                  <q-btn
                    flat
                    dense
                    round
                    size="sm"
                    icon="autorenew"
                    color="primary"
                    :disable="$load.isLoading('check-short-code')"
                    @click="generateShortCode"
                  >
                    <q-tooltip>Gerar código aleatório</q-tooltip>
                  </q-btn>
                </template>
              </q-input>
            </div>
          </div>
        </div>

        <!-- PREVIEW DO LINK -->
        <div v-if="shortlink.shortCode" class="link-preview">
          <div class="preview-label">Preview:</div>
          <div class="preview-url">
            <q-icon name="link" size="16px" class="q-mr-xs" />
            <span class="preview-domain">{{ getBaseUrl() }}/</span>
            <span class="preview-code">{{ shortlink.shortCode }}</span>
            <q-btn
              flat
              dense
              round
              size="xs"
              icon="content_copy"
              color="primary"
              class="q-ml-xs"
              @click="copyPreviewUrl"
            >
              <q-tooltip>Copiar preview</q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn v-if="editLink" flat icon="refresh" label="Resetar" @click="resetForm" />
        <q-btn icon="clear" outline label="Limpar" @click="clearForm" />
        <q-btn
          icon="save"
          type="submit"
          color="primary"
          :loading="loading"
          :disable="loading"
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
      lastVerifiedShortCode: '',
      shortCodeIsAvailable: false,
      isCheckingCode: false,
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
    availabilityHint(): string {
      if (this.isCheckingCode) {
        return 'Verificando disponibilidade...';
      }
      if (
        this.shortCodeIsAvailable &&
        this.shortlink.shortCode &&
        this.lastVerifiedShortCode === this.shortlink.shortCode
      ) {
        return 'Código disponível ✓';
      }
      if (
        !this.shortCodeIsAvailable &&
        this.shortlink.shortCode &&
        this.lastVerifiedShortCode === this.shortlink.shortCode
      ) {
        return 'Código já em uso';
      }
      return '';
    },
    availabilityHintColor(): string {
      if (this.isCheckingCode) return 'orange-7';
      if (
        this.shortCodeIsAvailable &&
        this.shortlink.shortCode &&
        this.lastVerifiedShortCode === this.shortlink.shortCode
      ) {
        return 'positive';
      }
      if (
        !this.shortCodeIsAvailable &&
        this.shortlink.shortCode &&
        this.lastVerifiedShortCode === this.shortlink.shortCode
      ) {
        return 'negative';
      }
      return 'grey-7';
    },
    availabilityIconColor(): string {
      if (this.isCheckingCode) return 'orange-7';
      if (
        this.shortCodeIsAvailable &&
        this.shortlink.shortCode &&
        this.lastVerifiedShortCode === this.shortlink.shortCode
      ) {
        return 'positive';
      }
      if (
        !this.shortCodeIsAvailable &&
        this.shortlink.shortCode &&
        this.lastVerifiedShortCode === this.shortlink.shortCode
      ) {
        return 'negative';
      }
      return 'grey-6';
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
    'shortlink.shortCode': {
      handler() {
        // Resetar o estado de verificação quando o usuário digita
        if (this.shortlink.shortCode !== this.lastVerifiedShortCode) {
          this.shortCodeIsAvailable = false;
        }
      },
    },
  },

  methods: {
    async handleSubmit() {
      // Verificar se o código foi verificado
      if (this.shortlink.shortCode !== this.lastVerifiedShortCode) {
        await this.onShortCodeBlur();
      }

      // Se o código não está disponível, mostrar erro
      if (!this.shortCodeIsAvailable) {
        this.$q.notify({
          type: 'negative',
          message: 'O código curto não está disponível ou não foi verificado',
          position: 'top',
          timeout: 2500,
        });
        return;
      }

      const parsed = $newShortlink.safeParse(this.shortlink);

      if (!parsed.success) {
        return;
      }

      this.$emit('submit', parsed.data);
    },

    async onShortCodeBlur() {
      if (!this.shortlink.shortCode) {
        this.shortCodeIsAvailable = false;
        this.isCheckingCode = false;
        return;
      }

      // Se for edição e o código não mudou, considerar disponível
      if (this.editLink && this.shortlink.shortCode === this.editLink.shortCode) {
        this.shortCodeIsAvailable = true;
        this.lastVerifiedShortCode = this.shortlink.shortCode;
        this.isCheckingCode = false;
        return;
      }

      // Se já verificamos este código, não verificar novamente
      if (this.shortlink.shortCode === this.lastVerifiedShortCode) {
        this.isCheckingCode = false;
        return;
      }

      console.log('Verificando disponibilidade do código:', this.shortlink.shortCode);
      this.isCheckingCode = true;
      this.lastVerifiedShortCode = this.shortlink.shortCode;

      try {
        const isAvailable = await this.isShortCodeAvailable(this.shortlink.shortCode);
        this.shortCodeIsAvailable = isAvailable;
        console.log('Código disponível?', isAvailable);
      } catch (error) {
        console.error('Erro ao verificar código:', error);
        this.shortCodeIsAvailable = false;
      } finally {
        this.isCheckingCode = false;
      }
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

    getBaseUrl(): string {
      return window.location.origin;
    },

    async copyPreviewUrl() {
      const url = `${this.getBaseUrl()}/${this.shortlink.shortCode}`;
      await navigator.clipboard.writeText(url);
      this.$q.notify({
        type: 'positive',
        message: 'Preview copiado!',
        position: 'top',
        timeout: 1500,
      });
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

<style scoped lang="scss">
.shortlink-form {
  width: 100%;
  margin-bottom: 12px;
}

.form-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.form-content {
  background: #fafafa;
}

.input-group {
  margin-bottom: 4px;
}

.input-label {
  display: flex;
  align-items: center;
  font-size: 11px;
  font-weight: 600;
  color: #555;
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.url-input {
  :deep(.q-field__control) {
    background: white;
    border-radius: 8px;
  }
}

.link-preview {
  margin-top: 12px;
  padding: 8px 12px;
  background: #e3f2fd;
  border-radius: 6px;
  border: 1px solid #90caf9;

  .preview-label {
    font-size: 10px;
    font-weight: 600;
    color: #666;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .preview-url {
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 500;
    color: #333;
    padding: 4px 8px;
    background: white;
    border-radius: 4px;
    word-break: break-all;

    .preview-domain {
      color: #999;
    }

    .preview-code {
      color: #1976d2;
      font-weight: 700;
    }
  }
}

.form-actions {
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .actions-right {
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .submit-btn {
    font-weight: 600;
    text-transform: none;
  }
}

/* Customização dos inputs */
:deep(.q-field__control) {
  border-radius: 6px;
  background: white;
}

:deep(.q-field--focused .q-field__control) {
  box-shadow: 0 0 0 1px rgba(25, 118, 210, 0.4);
}

/* Responsividade */
@media (max-width: 768px) {
  .link-preview {
    .preview-url {
      font-size: 12px;
      flex-wrap: wrap;
    }
  }

  .form-actions {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;

    .actions-left,
    .actions-right {
      width: 100%;
      justify-content: stretch;

      .q-btn {
        flex: 1;
      }
    }

    .submit-btn {
      order: -1;
    }
  }
}
</style>
