<template>
  <v-app>
    <v-app-bar color="background" density="compact" flat border="b">
      <template v-slot:prepend>
        <v-icon color="primary" size="large">mdi-gamepad-circle-right</v-icon>
      </template>
      
      <v-app-bar-title 
        class="font-weight-bold text-uppercase logo-title"
        @click="$router.push('/')"
      >
        <span class="text-primary">2XKOMBOS</span> 
      </v-app-bar-title>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <v-container fluid class="fill-height align-start pa-0">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.v-app-bar-title {
  letter-spacing: 1.5px;
}

.logo-title {
  cursor: pointer;
  user-select: none;
  transition: opacity 0.2s;
}

.logo-title:hover {
  opacity: 0.8;
}
</style>