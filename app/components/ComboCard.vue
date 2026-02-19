<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  combo: {
    id: number
    characterId: string
    title: string
    damage: number
    inputs: string
    type: string
    src: string
    difficulty?: string
  }
}>()

const emit = defineEmits(['edit', 'delete'])
const router = useRouter()
const { getDifficultyInfo } = useGameData()

const difficultyInfo = computed(() => {
  return getDifficultyInfo(props.combo.difficulty) || { label: 'Inconnu', color: 'grey' }
})

function goToDetail() {
  if (props.combo.characterId && props.combo.id) {
    router.push(`/${props.combo.characterId}/${props.combo.id}`)
  }
}
</script>

<template>
  <v-card 
    @click="goToDetail"
    hover
    ripple
    color="surface" 
    class="border-thin h-100 d-flex flex-column pa-0 overflow-hidden cursor-pointer"
    :style="`border-bottom: 3px solid ${difficultyInfo.color} !important`"
  >
    <div class="position-relative" @click.stop>
      
      <div v-if="combo.type === 'youtube'" class="iframe-container">
        <iframe
          :src="combo.src"
          width="100%"
          height="100%"
          frameborder="0"
          allowfullscreen
          class="position-absolute top-0 left-0"
        ></iframe>
      </div>

      <video
        v-else
        :src="combo.src"
        controls 
        class="w-100 d-block bg-black"
        style="aspect-ratio: 16/9; object-fit: contain;"
      ></video>
    </div>

    <v-card-text class="pa-4 flex-grow-1 d-flex flex-column">
      
      <div class="d-flex justify-space-between align-start mb-2">
        <div class="d-flex align-center flex-wrap" style="gap: 8px">
            <v-chip size="small" variant="flat" color="primary">
              {{ combo.damage }} DMG
            </v-chip>
            <v-chip 
              size="small" 
              :color="difficultyInfo.color" 
              variant="flat" 
              class="text-black font-weight-bold"
            >
              {{ difficultyInfo.label }}
            </v-chip>
        </div>

        <div @click.stop>
            <v-menu location="bottom end">
              <template v-slot:activator="{ props }">
                <v-btn 
                    icon="mdi-dots-vertical" 
                    variant="text" 
                    color="grey" 
                    size="small" 
                    density="comfortable"
                    v-bind="props"
                ></v-btn>
              </template>
              <v-list density="compact" class="border-thin">
                <v-list-item prepend-icon="mdi-pencil" title="Modifier" @click="emit('edit', combo)"></v-list-item>
                <v-list-item prepend-icon="mdi-delete" title="Supprimer" color="error" @click="emit('delete', combo.id)"></v-list-item>
              </v-list>
            </v-menu>
        </div>
      </div>

      <div class="text-h6 text-uppercase text-primary font-weight-black truncate-title mt-1">
        {{ combo.title }}
      </div>
      
    </v-card-text>
  </v-card>
</template>

<style scoped>
.truncate-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.iframe-container {
  position: relative;
  padding-top: 56.25%;
  height: 0;
}
.cursor-pointer {
  cursor: pointer;
}
</style>