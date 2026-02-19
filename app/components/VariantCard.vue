<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  variant: any,
  parentRoute: string 
}>()

const router = useRouter()
const { getCharImage } = useGameData()

const tagPartnerImage = computed(() => getCharImage(props.variant.tagCharacterId))

function goToVariant() {
  router.push(`${props.parentRoute}/${props.variant.id}`)
}
</script>

<template>
  <v-card 
    @click="goToVariant"
    hover
    ripple
    color="surface" 
    class="border-thin h-100 d-flex flex-column pa-0 overflow-hidden cursor-pointer"
  >
    <div class="position-relative">
      <div v-if="variant.type === 'youtube'" class="iframe-container">
        <div style="aspect-ratio: 16/9; background: grey;"></div>
      </div>
      <video
        v-else
        :src="variant.src"
        muted
        class="w-100 d-block"
        style="aspect-ratio: 16/9; object-fit: cover;"
      ></video>
      
      <v-overlay 
        :model-value="true" 
        contained 
        class="align-center justify-center" 
        scrim="black" 
        style="opacity: 0.1; pointer-events: none;"
      >
      </v-overlay>
    </div>

    <v-card-text class="pa-3 bg-surface-lighten-1 flex-grow-1">
      <div class="d-flex align-center">
        <v-avatar size="40" class="border-thin mr-3">
          <v-img :src="tagPartnerImage" cover></v-img>
        </v-avatar>
        
        <div class="d-flex flex-column" style="min-width: 0;">
          <div class="text-caption text-grey text-uppercase font-weight-bold truncate">
            {{ variant.tagCharacterId }}
          </div>
          <div class="text-subtitle-2 font-weight-black text-white text-uppercase truncate">
            {{ variant.tagMechanic }}
          </div>
        </div>
        
        <v-spacer></v-spacer>
        
        <v-chip size="x-small" color="primary" variant="flat" class="font-weight-bold text-black ml-2">
          {{ variant.damage }} DMG
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.iframe-container {
  position: relative;
  padding-top: 56.25%;
  height: 0;
}
.truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>