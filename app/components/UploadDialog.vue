<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const route = useRoute()
const { difficultyConfig, characters } = useGameData()
const { combos } = useCombos()

const props = defineProps<{
  modelValue: boolean,
  editMode?: boolean,
  parentId?: number | null,
  initialData?: any
}>()

const emit = defineEmits(['update:modelValue', 'upload-success'])

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const formRef = ref()
const tab = ref('youtube')
const difficultyIndex = ref(0)
const difficulties = Object.keys(difficultyConfig).map(key => ({ key, ...difficultyConfig[key] }))
const mechanics = ['Double Down', '2X Assist', 'Freestyle']

const isUploading = ref(false)
const uploadProgress = ref(0)

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
  file: null as File | null,
  tagCharacterId: null,
  tagMechanic: null
})

const rules = {
  required: (v: any) => !!v || 'Ce champ est requis',
  youtube: (v: string) => (tab.value === 'youtube' ? (!!v || 'Lien YouTube requis') : true),
  file: (v: any) => {
    if (tab.value !== 'file') return true
    if (props.editMode && props.initialData?.type === 'file' && !v) return true
    if (!v) return 'Fichier requis'
    const file = Array.isArray(v) ? v[0] : v
    if (file && file.size > 50 * 1024 * 1024) return 'La vidéo ne doit pas dépasser 50 Mo'
    return true
  }
}

watch(() => form.value.file, (newFile) => {
  if (newFile) {
    const fileObj = Array.isArray(newFile) ? newFile[0] : newFile
    if (fileObj && fileObj.size > 50 * 1024 * 1024) {
      alert("La vidéo est trop lourde ! Elle ne doit pas dépasser 50 Mo")
      form.value.file = null
    }
  }
})

watch(() => props.modelValue, (val) => {
  if (val) {
    isUploading.value = false
    uploadProgress.value = 0
    if (props.editMode && props.initialData) {
      form.value.id = props.initialData.id
      form.value.title = props.initialData.title
      form.value.damage = props.initialData.damage
      form.value.inputs = props.initialData.inputs
      form.value.youtubeUrl = props.initialData.type === 'youtube' ? props.initialData.src : ''
      form.value.tagCharacterId = props.initialData.tagCharacterId
      form.value.tagMechanic = props.initialData.tagMechanic
      tab.value = props.initialData.type === 'youtube' ? 'youtube' : 'file'
      const idx = difficulties.findIndex(d => d.key === props.initialData.difficulty)
      difficultyIndex.value = idx !== -1 ? idx : 0
    } else {
      resetForm()
      if (props.parentId && props.initialData?.inputs) {
        form.value.inputs = props.initialData.inputs
      }
    }
  }
})

function resetForm() {
  form.value = {
    id: null, title: '', damage: 0, inputs: '', youtubeUrl: '', file: null,
    tagCharacterId: null, tagMechanic: null
  }
  difficultyIndex.value = 0
  tab.value = 'youtube'
}

const getEmbedUrl = (url: string) => {
  if (!url) return ''
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  const id = (match && match[2] && match[2].length === 11) ? match[2] : null
  return id ? `https://www.youtube.com/embed/${id}` : ''
}

async function handleSubmit() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  let finalTitle = form.value.title
  if (props.parentId && !props.editMode) {
    finalTitle = `${form.value.tagMechanic} - ${form.value.tagCharacterId}`
  }

  const charId = route.params.charId as string || props.initialData?.characterId

  const fd = new FormData()
  if (form.value.id) fd.append('id', form.value.id.toString())
  if (charId) fd.append('characterId', charId)
  fd.append('title', finalTitle)
  fd.append('damage', form.value.damage.toString())
  fd.append('inputs', form.value.inputs)
  fd.append('type', tab.value)
  fd.append('difficulty', currentDifficulty.value.key)
  
  if (props.parentId) fd.append('parentId', props.parentId.toString())
  if (form.value.tagCharacterId) fd.append('tagCharacterId', form.value.tagCharacterId)
  if (form.value.tagMechanic) fd.append('tagMechanic', form.value.tagMechanic)

  if (tab.value === 'youtube') {
    fd.append('youtubeUrl', getEmbedUrl(form.value.youtubeUrl))
  } else if (tab.value === 'file' && form.value.file) {
    fd.append('file', form.value.file)
  }

  isUploading.value = true
  uploadProgress.value = 0

  const method = props.editMode ? 'PUT' : 'POST'
  const xhr = new XMLHttpRequest()
  xhr.open(method, '/api/combos', true)

  xhr.upload.onprogress = (event) => {
    if (event.lengthComputable) {
      uploadProgress.value = Math.round((event.loaded / event.total) * 100)
    }
  }

  xhr.onload = () => {
    isUploading.value = false
    if (xhr.status >= 200 && xhr.status < 300) {
      const response = JSON.parse(xhr.responseText)
      
      if (method === 'POST') {
        combos.value.push(response)
      } else {
        const index = combos.value.findIndex(c => c.id === response.id)
        if (index !== -1) combos.value[index] = response
      }

      emit('upload-success')
      dialog.value = false
    } else {
      alert("Une erreur est survenue lors de l'enregistrement")
    }
  }

  xhr.onerror = () => {
    isUploading.value = false
    alert("Erreur de connexion au serveur")
  }

  xhr.send(fd)
}

const isTagMode = computed(() => !!props.parentId || (props.editMode && !!props.initialData?.parentId))
</script>

<template>
  <v-dialog v-model="dialog" max-width="900" :scrim="true" transition="dialog-bottom-transition" :retain-focus="false" :persistent="isUploading">
    <v-card color="surface" class="border-primary position-relative">
      
      <v-overlay
        :model-value="isUploading"
        contained
        class="align-center justify-center"
        opacity="0.95"
        style="z-index: 10"
      >
        <div class="d-flex flex-column align-center">
          <v-progress-circular
            :model-value="uploadProgress"
            :size="120"
            :width="12"
            color="primary"
          >
            <span class="text-h5 font-weight-black">{{ uploadProgress }}%</span>
          </v-progress-circular>
          <div class="mt-6 text-h6 font-weight-bold text-white text-uppercase tracking-widest">
             Upload...
          </div>
        </div>
      </v-overlay>

      <v-card-title class="d-flex align-center pa-4 border-b-thin">
        <span class="text-uppercase font-weight-black">
          {{ editMode ? 'Modifier' : (isTagMode ? 'Nouvelle variante' : 'Nouveau combo') }}
        </span>
        <v-btn icon="mdi-close" variant="text" @click="dialog = false" :disabled="isUploading"></v-btn>
      </v-card-title>

      <v-form ref="formRef" @submit.prevent.stop="handleSubmit">
        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12" md="5">

              <div v-if="isTagMode" class="mb-4 pa-3 bg-surface-lighten-1 rounded border-thin">
                <div class="text-caption text-uppercase text-primary font-weight-bold mb-2">Mécanique Tag</div>
                <v-select v-model="form.tagMechanic" :items="mechanics" label="Fuse" variant="outlined"
                  density="compact" :rules="[rules.required]" class="mb-2" :disabled="isUploading"></v-select>
                <v-autocomplete v-model="form.tagCharacterId" :items="characters" item-title="name" item-value="id"
                  label="Partenaire (Tag)" variant="outlined" density="compact" prepend-inner-icon="mdi-account-group"
                  :rules="[rules.required]" :disabled="isUploading"></v-autocomplete>
              </div>

              <v-text-field v-if="!isTagMode" v-model="form.title" label="Nom du combo" variant="outlined"
                color="primary" class="mb-2" :rules="[rules.required]" :disabled="isUploading"></v-text-field>

              <v-text-field v-model="form.damage" label="Dégâts" type="number" variant="outlined" color="primary"
                class="mb-4" :rules="[rules.required]" :disabled="isUploading"></v-text-field>

              <div class="mb-6">
                <div class="text-caption text-uppercase mb-2 text-grey">Difficulté</div>
                <v-slider v-model="difficultyIndex" :max="difficulties.length - 1" step="1"
                  :color="currentDifficulty.color" track-color="grey-darken-3" show-ticks="always" :disabled="isUploading">
                  <template v-slot:append>
                    <v-chip :color="currentDifficulty.color" size="small" variant="flat" class="font-weight-bold ml-2"
                      style="width: 80px; justify-content: center;">
                      {{ currentDifficulty.label }}
                    </v-chip>
                  </template>
                </v-slider>
              </div>

              <v-tabs v-model="tab" grow class="mb-4 border-b-thin" :disabled="isUploading">
                <v-tab value="youtube" color="primary">YouTube</v-tab>
                <v-tab value="file" color="primary">Fichier</v-tab>
              </v-tabs>

              <v-window v-model="tab">
                <v-window-item value="youtube">
                  <v-text-field v-model="form.youtubeUrl" placeholder="https://youtube.com..."
                    prepend-inner-icon="mdi-youtube" variant="outlined" color="primary"
                    :rules="[rules.youtube]" :disabled="isUploading"></v-text-field>
                </v-window-item>
                <v-window-item value="file">
                  <v-file-input 
                    v-model="form.file" 
                    prepend-icon="mdi-video" 
                    :label="editMode && initialData?.type === 'file' ? 'Vidéo (.mp4, 50Mo MAX) - Optionnel' : 'Vidéo (.mp4, 50Mo MAX)'"                    persistent-hint
                    variant="outlined" 
                    color="primary" 
                    :rules="[rules.file]" 
                    :disabled="isUploading"
                  ></v-file-input>
                </v-window-item>
              </v-window>
            </v-col>

            <v-col cols="12" md="7">
              <div class="text-h6 mb-2">Inputs (optionnel)</div>
              <InputEditor v-model="form.inputs" />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-4 pt-0 border-t-thin bg-surface-lighten-1">
          <v-spacer></v-spacer>
          <v-btn color="grey" variant="text" @click="dialog = false" :disabled="isUploading">Annuler</v-btn>
          <v-btn color="primary" variant="flat" size="large" class="px-8 font-weight-bold text-black" type="submit" :loading="isUploading">
            {{ editMode ? 'Enregistrer' : 'Créer' }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>