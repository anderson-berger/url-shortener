<template>
  <div class="row q-col-gutter-md q-pa-md">
    <div v-for="menu in menus" :key="menu.action" class="col-12 col-sm-6 col-md-4">
      <q-card
        class="menu-card cursor-pointer"
        :class="`menu-card--${menu.color}`"
        @click="handlerMenu(menu.action)"
        flat
        bordered
      >
        <q-card-section class="card-icon-section">
          <div class="icon-wrapper">
            <q-icon :name="menu.icon" size="48px" class="menu-icon" />
          </div>
        </q-card-section>

        <q-card-section class="card-content">
          <div class="text-h6 text-weight-bold q-mb-xs">
            {{ menu.title }}
          </div>
          <div class="text-body2 text-grey-7">
            {{ menu.description }}
          </div>
        </q-card-section>

        <q-card-section class="card-footer">
          <q-icon name="arrow_forward" size="20px" />
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

type MenuAction = 'create' | 'list' | 'analytics';

export default defineComponent({
  name: 'MenuItems',

  emits: ['handler'],

  data() {
    return {
      menus: [
        {
          title: 'Criar Link',
          description: 'Criar um novo link curto personalizado',
          icon: 'add_link',
          color: 'primary',
          action: 'create' as MenuAction,
        },
        {
          title: 'Meus Links',
          description: 'Gerenciar todos os seus links',
          icon: 'list',
          color: 'secondary',
          action: 'list' as MenuAction,
        },
        {
          title: 'Analytics',
          description: 'Acompanhar estatísticas e desempenho',
          icon: 'analytics',
          color: 'positive',
          action: 'analytics' as MenuAction,
        },
      ],
    };
  },

  methods: {
    handlerMenu(action: MenuAction) {
      this.$emit('handler', action);
    },
  },
});
</script>

<style scoped lang="scss">
.menu-card {
  height: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.15);

    .icon-wrapper {
      transform: scale(1.1) rotate(5deg);
    }

    .card-footer {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &:active {
    transform: translateY(-4px);
  }
}

.card-icon-section {
  padding: 32px 24px 16px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-card--primary .icon-wrapper {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.menu-card--secondary .icon-wrapper {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.menu-card--positive .icon-wrapper {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.menu-icon {
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.card-content {
  padding: 16px 24px;
  flex: 1;
}

.card-footer {
  padding: 0 24px 24px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  opacity: 0;
  transform: translateX(-8px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--q-primary);
}

/* Responsive adjustments */
@media (max-width: 599px) {
  .card-icon-section {
    padding: 24px 16px 12px;
  }

  .icon-wrapper {
    width: 64px;
    height: 64px;
  }

  .menu-icon {
    font-size: 36px !important;
  }

  .card-content {
    padding: 12px 16px;
  }

  .card-footer {
    padding: 0 16px 16px;
  }
}

/* Dark mode support */
.body--dark {
  .menu-card {
    &:hover {
      box-shadow: 0 12px 24px -10px rgba(255, 255, 255, 0.1);
    }
  }
}
</style>
