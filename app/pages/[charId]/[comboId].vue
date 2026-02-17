<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const { getComboById } = useCombos();
const { getCharImage, getDifficultyInfo } = useGameData();

const comboId = route.params.comboId as string;
const charId = route.params.charId as string;

const combo = getComboById(comboId);
if (!combo.value) {
  router.push(`/${charId}`);
}

useHead({ 
  title: computed(() => combo.value?.title + ' - 2XKOMBOS' || 'Chargement...') 
})

const charImage = computed(() =>
  combo.value ? getCharImage(combo.value.characterId) : "",
);
const difficultyInfo = computed(() =>
  getDifficultyInfo(combo.value?.difficulty),
);
</script>

<template>
  <v-container v-if="combo" class="h-100">
    <div class="mb-4">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="router.back()">
        Retour
      </v-btn>
    </div>

    <v-row>
      <v-col cols="12" lg="8">
        <v-card class="border-primary" color="black">
          <div v-if="combo.type === 'youtube'" class="iframe-container" style="padding-top: 56.25%">
            <iframe :src="combo.src" width="100%" height="100%" frameborder="0" allowfullscreen
              class="position-absolute top-0 left-0"></iframe>
          </div>
          <video v-else :src="combo.src" controls autoplay class="w-100 d-block" style="max-height: 70vh"></video>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card color="surface" class="h-100 border-thin d-flex flex-column pa-0">
          <div class="pt-2">
            <h1 class="text-h4 font-weight-black text-uppercase text-primary mb-6 px-8">
              {{ combo.title }}
            </h1>

            <div class="d-flex align-center flex-wrap mb-6 px-8">
              <v-chip size="default" color="grey-lighten-1" variant="outlined" class="mr-4">
                {{ combo.damage }} DMG
              </v-chip>

              <div class="text-grey-darken-1 mx-2">|</div>

              <v-chip size="default" :color="difficultyInfo.color" variant="flat"
                class="text-black font-weight-bold ml-4">
                {{ difficultyInfo.label }}
              </v-chip>
            </div>

            <v-divider class="mb-6 mx-8"></v-divider>

            <div class="text-h6 text-uppercase mb-2 mt-4 text-grey px-8">Inputs</div>
            <div class="px-8 mb-8">
              <v-sheet color="background" rounded="lg" class="pa-4 border-thin">
                <code class="text-h5 font-weight-bold text-white">
            {{ combo.inputs }}
          </code>
              </v-sheet>
            </div>
          </div>

          <v-spacer></v-spacer>

          <v-card v-if="charImage" :to="`/${combo.characterId}`" hover class="rounded-0 border-0 border-t-thin"
            color="surface">
            <div class="d-flex align-center">
              <v-avatar rounded="0" size="80"><v-img :src="charImage" cover></v-img></v-avatar>
              <div class="pa-4">
                <div class="text-caption text-grey">Champion</div>
                <div class="text-h6 font-weight-bold text-uppercase text-primary">
                  {{ combo.characterId }}
                </div>
              </div>
              <v-spacer></v-spacer>
              <v-icon class="mr-4">mdi-chevron-right</v-icon>
            </div>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>