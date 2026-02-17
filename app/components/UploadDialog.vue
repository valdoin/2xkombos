<script setup lang="ts">
import { ref, computed } from 'vue'
const { difficultyConfig } = useGameData()

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'submit'])

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const tab = ref('youtube')
const difficultyIndex = ref(0) 
const difficulties = Object.keys(difficultyConfig).map(key => ({
  key,
  ...difficultyConfig[key]
}))

const currentDifficulty = computed(() => {
  const diff = difficulties[difficultyIndex.value]
  return diff || { key: 'easy', label: 'Facile', color: 'success' }
})

const form = ref({
  title: '',
  damage: 0,
  inputs: '',
  youtubeUrl: '',
  file: null as File | null
})

function handleSubmit() {
  emit('submit', { 
    ...form.value, 
    type: tab.value, 
    difficulty: currentDifficulty.value.key 
  })
  
  dialog.value = false
  form.value.title = ''
  form.value.damage = 0
  form.value.inputs = ''
  form.value.youtubeUrl = ''
  form.value.file = null
  difficultyIndex.value = 0
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card color="surface" class="border-primary">
      <v-card-title class="text-uppercase font-weight-black pa-4">
        Nouveau combo
      </v-card-title>
      
      <v-card-text>
        <v-text-field v-model="form.title" label="Nom du combo" variant="outlined" color="primary" class="hover-primary"></v-text-field>
        
        <v-row>
          <v-col cols="6">
            <v-text-field v-model="form.damage" label="Dégâts" type="number" variant="outlined" color="primary" class="hover-primary"></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="form.inputs" label="Notation" variant="outlined" color="primary" class="hover-primary"></v-text-field>
          </v-col>
        </v-row>

        <div class="mb-4">
          <div class="text-caption text-uppercase mb-2 text-grey">Difficulté</div>
          <v-slider
            v-model="difficultyIndex"
            :max="difficulties.length - 1"
            step="1"
            :color="currentDifficulty.color"
            track-color="grey-darken-3"
            show-ticks="always"
            tick-size="4"
          >
            <template v-slot:append>
              <v-chip 
                :color="currentDifficulty.color" 
                size="small" 
                variant="flat" 
                class="font-weight-bold"
              >
                {{ currentDifficulty.label }}
              </v-chip>
            </template>
          </v-slider>
        </div>

        <v-tabs v-model="tab" grow class="mb-4 border-b-thin">
           <v-tab value="youtube" color="primary">YouTube</v-tab>
           <v-tab value="file" color="primary">Fichier</v-tab>
        </v-tabs>
        
        <v-window v-model="tab">
          <v-window-item value="youtube">
            <v-text-field v-model="form.youtubeUrl" placeholder="Lien Youtube" prepend-inner-icon="mdi-youtube" variant="outlined" color="primary" class="hover-primary"></v-text-field>
          </v-window-item>
          <v-window-item value="file">
            <v-file-input v-model="form.file" prepend-icon="mdi-video" variant="outlined" color="primary" class="hover-primary"></v-file-input>
          </v-window-item>
        </v-window>
      </v-card-text>

      <v-card-actions class="pa-4 pt-0">
        <v-spacer></v-spacer>
        <v-btn color="grey" variant="text" @click="dialog = false">Annuler</v-btn>
        <v-btn color="primary" variant="flat" @click="handleSubmit">Ajouter</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.hover-primary:hover :deep(.v-field__outline) {
  --v-field-border-opacity: 1;
  color: rgb(var(--v-theme-primary)) !important;
}
.hover-primary:hover :deep(.v-label) {
  color: rgb(var(--v-theme-primary)) !important;
}
</style>