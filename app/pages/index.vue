<script setup lang="ts">
import { ref, computed } from 'vue'
useHead({ title: '2XKOMBOS' })
const search = ref('')

const characters = [
  { id: 'ahri', name: 'Ahri', image: '/characters/1024px-Ahri_cs.png', role: 'Rushdown' },
  { id: 'blitzcrank', name: 'Blitzcrank', image: '/characters/1024px-Blitzcrank_cs.png', role: 'Grappler' },
  { id: 'braum', name: 'Braum', image: '/characters/1024px-Braum_cs.png', role: 'Bruiser' },
  { id: 'caitlyn', name: 'Caitlyn', image: '/characters/1024px-Caitlyn_cs.png', role: 'Zoner' },
  { id: 'darius', name: 'Darius', image: '/characters/1024px-Darius_cs.png', role: 'All Rounder' },
  { id: 'ekko', name: 'Ekko', image: '/characters/800px-Ekko_cs.png', role: 'Mixup' },
  { id: 'illaoi', name: 'Illaoi', image: '/characters/800px-Illaoi_cs.png', role: 'Bruiser' },
  { id: 'jinx', name: 'Jinx', image: '/characters/800px-Jinx_cs.png', role: 'Zoner' },
  { id: 'teemo', name: 'Teemo', image: '/characters/1024px-Teemo_cs.png', role: 'Trap' },
  { id: 'vi', name: 'Vi', image: '/characters/800px-Vi_cs.png', role: 'Rushdown' },
  { id: 'warwick', name: 'Warwick', image: '/characters/1024px-Warwick_cs.png', role: 'Rushdown' },
  { id: 'yasuo', name: 'Yasuo', image: '/characters/800px-Yasuo_cs.png', role: 'All Rounder' },
]

const filteredCharacters = computed(() => {
  return characters.filter(char => 
    char.name.toLowerCase().includes(search.value.toLowerCase()) ||
    char.role.toLowerCase().includes(search.value.toLowerCase())
  )
})
</script>

<template>
  <v-container class="py-10">
    <v-row align="center" class="mb-8">
      <v-col cols="12" md="7">
        <h1 class="text-h3 font-weight-black text-uppercase">Sélectionnez un champion</h1>
      </v-col>
      <v-col cols="12" md="5">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          label="Rechercher un champion ou un rôle"
          variant="outlined"
          color="primary"
          hide-details
          class="bg-surface"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="char in filteredCharacters"
        :key="char.id"
        cols="12" sm="6" md="4" lg="3"
      >
        <v-card
          :to="`/${char.id}`"
          hover
          color="surface"
          class="border-thin fill-height"
        >
          <v-img
            :src="char.image"
            height="300"
            cover
            gradient="to bottom, rgba(0,0,0,0) 60%, rgba(0,0,0,0.95)"
          >
            <div class="d-flex flex-column fill-height justify-end pa-4">
              <div class="text-h4 font-weight-black text-uppercase font-italic">{{ char.name }}</div>
              <div class="text-subtitle-1 text-primary font-weight-bold">{{ char.role }}</div>
            </div>
          </v-img>
        </v-card>
      </v-col>
      
      <v-col cols="12" v-if="filteredCharacters.length === 0" class="text-center py-10">
        <v-icon size="64" color="grey">mdi-account-search-outline</v-icon>
        <div class="text-h5 text-grey mt-4">Aucun champion ne correspond à votre recherche</div>
      </v-col>
    </v-row>
  </v-container>
</template>