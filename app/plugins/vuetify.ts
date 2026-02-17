import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    theme: {
      defaultTheme: 'dark',
      themes: {
        dark: {
          colors: {
            primary: '#BBF73E',
            secondary: '#2E2E2E',
            background: '#0F0F0F',
            surface: '#1A1A1A',
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})