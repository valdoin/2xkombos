import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig> {
  routes: (_routes) => [
    {
      name: 'home',
      path: '/',
      component: () => import('~/pages/index.vue')
    },
    {
      name: 'character',
      path: '/:charId',
      component: () => import('~/pages/character.vue')
    },
    {
      name: 'combo',
      path: '/:charId/:comboId',
      component: () => import('~/pages/combo.vue')
    },
    {
      name: 'variant',
      path: '/:charId/:comboId/:variantId',
      component: () => import('~/pages/variant.vue')
    }
  ]
}