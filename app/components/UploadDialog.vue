<script setup lang="ts">
import { ref, computed, watch } from 'vue'
const { difficultyConfig } = useGameData()

const props = defineProps<{ 
  modelValue: boolean,
  editMode?: boolean,
  initialData?: any 
}>()

const emit = defineEmits(['update:modelValue', 'submit'])

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const formRef = ref()
const tab = ref('youtube')
const difficultyIndex = ref(0) 
const difficulties = Object.keys(difficultyConfig).map(key => ({ key, ...difficultyConfig[key] }))

const currentDifficulty = computed(() => {
  const diff = difficulties[difficultyIndex.value]
  return diff || { key: 'easy', label: 'Facile', color: 'success' }
})

const form = ref({
  id: null as number | null,
  title: '',
  damage: 0,
  inputs: '',
  youtubeUrl: '',
  file: null as File | null
})

const rules = {
  required: (v: any) => !!v || 'Ce champ est requis',
  youtube: (v: string) => (tab.value === 'youtube' ? (!!v || 'Lien YouTube requis') : true),
  file: (v: any) => (tab.value === 'file' ? (!!v || 'Fichier requis') : true)
}

watch(() => props.modelValue, (val) => {
  if (val && props.editMode && props.initialData) {
    form.value.id = props.initialData.id
    form.value.title = props.initialData.title
    form.value.damage = props.initialData.damage
    form.value.inputs = props.initialData.inputs
    form.value.youtubeUrl = props.initialData.type === 'youtube' ? props.initialData.src : ''
    tab.value = props.initialData.type === 'youtube' ? 'youtube' : 'file'
    const idx = difficulties.findIndex(d => d.key === props.initialData.difficulty)
    difficultyIndex.value = idx !== -1 ? idx : 0
  } else if (val && !props.editMode) {
    resetForm()
  }
})

function resetForm() {
  form.value = { id: null, title: '', damage: 0, inputs: '', youtubeUrl: '', file: null }
  difficultyIndex.value = 0
  tab.value = 'youtube'
}

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  emit('submit', { 
    ...form.value, 
    type: tab.value, 
    youtubeUrl: tab.value === 'youtube' ? form.value.youtubeUrl : '',
    file: tab.value === 'file' ? form.value.file : null,
    difficulty: currentDifficulty.value.key 
  })
  dialog.value = false
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="900" persistent>
    <v-card color="surface" class="border-primary">
      <v-card-title class="d-flex justify-space-between align-center pa-4 border-b-thin">
        <span class="text-uppercase font-weight-black">{{ editMode ? 'Modifier le combo' : 'Nouveau combo' }}</span>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false"></v-btn>
      </v-card-title>
      
      <v-form ref="formRef" @submit.prevent="handleSubmit">
        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12" md="5">
              <v-text-field 
                v-model="form.title" 
                label="Nom du combo" 
                variant="outlined" 
                color="primary" 
                class="mb-2"
                :rules="[rules.required]"
              ></v-text-field>

              <v-text-field 
                v-model="form.damage" 
                label="Dégâts" 
                type="number" 
                variant="outlined" 
                color="primary" 
                class="mb-4"
                :rules="[rules.required]"
              ></v-text-field>
              
              <div class="mb-6">
                <div class="text-caption text-uppercase mb-2 text-grey">Difficulté</div>
                <v-slider
                  v-model="difficultyIndex"
                  :max="difficulties.length - 1"
                  step="1"
                  :color="currentDifficulty.color"
                  track-color="grey-darken-3"
                  show-ticks="always"
                >
                   <template v-slot:append>
                      <v-chip :color="currentDifficulty.color" size="small" variant="flat" class="font-weight-bold ml-2" style="width: 80px; justify-content: center;">
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
                  <v-text-field 
                    v-model="form.youtubeUrl" 
                    placeholder="https://youtube.com..." 
                    prepend-inner-icon="mdi-youtube" 
                    variant="outlined" 
                    color="primary"
                    :rules="[rules.youtube]"
                  ></v-text-field>
                </v-window-item>
                <v-window-item value="file">
                  <v-file-input 
                    v-model="form.file" 
                    prepend-icon="mdi-video" 
                    label="Vidéo (.mp4)" 
                    variant="outlined" 
                    color="primary"
                    :rules="[rules.file]"
                  ></v-file-input>
                </v-window-item>
              </v-window>
            </v-col>

            <v-col cols="12" md="7">
              <div class="text-h6 mb-2">Séquence (Optionnel)</div>
              <InputEditor v-model="form.inputs" />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0 border-t-thin bg-surface-lighten-1">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="dialog = false">Annuler</v-btn>
          <v-btn color="primary" variant="flat" size="large" class="px-8 font-weight-bold text-black" type="submit">
            {{ editMode ? 'Enregistrer' : 'Créer' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>