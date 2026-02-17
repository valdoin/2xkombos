<script setup lang="ts">
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

const { getDifficultyInfo } = useGameData()
const difficultyInfo = computed(() => getDifficultyInfo(props.combo.difficulty))
</script>

<template>
  <v-card 
    :to="`/${combo.characterId}/${combo.id}`"
    hover
    ripple
    color="surface" 
    class="border-thin h-100 d-flex flex-column pa-0 overflow-hidden"
    :style="`border-bottom: 3px solid ${difficultyInfo.color} !important`"
  >
    <div class="position-relative" style="z-index: 2" @click.stop>
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
        muted
        class="w-100 d-block"
        style="aspect-ratio: 16/9; object-fit: cover;"
      ></video>
    </div>

    <v-card-text class="pa-4 flex-grow-1">
      <div class="d-flex align-center justify-space-between mb-4">
        <v-chip size="x-small" variant="outlined" color="grey-lighten-1">
          {{ combo.damage }} DMG
        </v-chip>
        <v-chip 
          size="x-small" 
          :color="difficultyInfo.color" 
          variant="flat" 
          class="text-black font-weight-bold"
        >
          {{ difficultyInfo.label }}
        </v-chip>
      </div>
      <div class="text-h6 text-uppercase text-primary font-weight-black truncate-title">
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
</style>