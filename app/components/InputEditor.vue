<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps<{ modelValue: string }>()
const emit = defineEmits(['update:modelValue'])

const { directions, attacks, movements, getInputIcon } = useInputData()
const sequence = ref<any[]>([])

function parseModelValue(val: string) {
  if (!val) return []
  return val.split(' ').map(v => ({
    value: v,
    img: getInputIcon(v)
  }))
}

watch(() => props.modelValue, (newVal) => {
  if (sequence.value.map(i => i.value).join(' ') !== newVal) {
    sequence.value = parseModelValue(newVal)
  }
}, { immediate: true })

function addInput(item: any) {
  sequence.value.push(item)
  updateModel()
}

function addSeparator() {
  sequence.value.push({ value: '➜', img: null })
  updateModel()
}

function removeInput(index: number) {
  sequence.value.splice(index, 1)
  updateModel()
}

function clear() {
  sequence.value = []
  updateModel()
}

function updateModel() {
  const stringVal = sequence.value.map(i => i.value).join(' ')
  emit('update:modelValue', stringVal)
}
</script>

<template>
  <v-sheet class="border-thin rounded-lg pa-4 bg-surface-lighten-1">
    
    <div class="d-flex align-center overflow-x-auto py-4 mb-4 bg-black rounded border-primary" style="min-height: 90px; gap: 8px; padding-left: 16px; padding-right: 16px;">
      <div v-if="sequence.length === 0" class="text-grey w-100 text-center font-italic">
        Sélectionnez les inputs ci-dessous pour construire le combo
      </div>
      
      <div v-for="(item, index) in sequence" :key="index" class="d-flex align-center animate__animated animate__fadeInRight">
        <v-hover v-slot="{ isHovering, props }">
          <div v-bind="props" class="position-relative cursor-pointer d-flex align-center justify-center" @click="removeInput(index)" style="min-width: 40px;">
            
            <v-img v-if="item.img" :src="item.img" width="45" height="45" contain class="transition-swing"></v-img>
            
            <span v-else class="text-h4 font-weight-bold text-primary">{{ item.value }}</span>

            <v-overlay :model-value="!!isHovering" contained scrim="red" class="align-center justify-center">
              <v-icon color="white" size="small">mdi-close</v-icon>
            </v-overlay>
          </div>
        </v-hover>
      </div>
    </div>

    <div class="d-flex justify-end mb-6 align-center">
      <v-btn 
        color="primary" 
        variant="tonal" 
        class="font-weight-bold mr-4 flex-grow-1" 
        @click="addSeparator"
        height="45"
      >
        <span class="text-h3 mr-2 pb-1">➜</span> Ajouter une étape
      </v-btn>

      <v-btn size="small" color="error" variant="text" prepend-icon="mdi-delete" @click="clear" :disabled="sequence.length === 0">
        Effacer
      </v-btn>
    </div>

    <v-row dense>
      <v-col cols="12" md="4">
        <div class="text-caption text-uppercase mb-2 text-primary font-weight-bold">Directions</div>
        <div class="d-flex flex-wrap" style="gap: 8px">
          <v-btn v-for="dir in directions" :key="dir.label" icon variant="outlined" color="grey" rounded="lg" @click="addInput(dir)">
            <v-img :src="dir.img" width="30" height="30"></v-img>
          </v-btn>
        </div>
      </v-col>
      
      <v-col cols="12" md="4">
        <div class="text-caption text-uppercase mb-2 text-primary font-weight-bold">Attaques</div>
        <div class="d-flex flex-wrap" style="gap: 8px">
          <v-btn v-for="atk in attacks" :key="atk.label" icon variant="outlined" color="grey" rounded="lg" @click="addInput(atk)">
            <v-img :src="atk.img" width="30" height="30"></v-img>
          </v-btn>
        </div>
      </v-col>

      <v-col cols="12" md="4">
        <div class="text-caption text-uppercase mb-2 text-primary font-weight-bold">Mouvements</div>
        <div class="d-flex flex-wrap" style="gap: 8px">
           <v-btn v-for="mov in movements" :key="mov.label" icon variant="outlined" color="grey" rounded="lg" @click="addInput(mov)">
            <v-img :src="mov.img" width="30" height="30"></v-img>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-sheet>
</template>