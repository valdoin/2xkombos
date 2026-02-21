<script setup lang="ts">
import { ref, computed } from 'vue'

const route = useRoute();
const router = useRouter();
const { getComboById, addCombo, deleteCombo, getTagVariations } = useCombos();
const { getCharImage, getDifficultyInfo } = useGameData();
const { getInputIcon } = useInputData();

const comboId = route.params.comboId as string;
const charId = route.params.charId as string;
const showEdit = ref(false)
const showTagDialog = ref(false)
const variantSearch = ref('')

const combo = getComboById(comboId);
const tagVariations = getTagVariations(Number(comboId))

const filteredVariants = computed(() => {
  if (!variantSearch.value) return tagVariations.value
  return tagVariations.value.filter(v => 
    v.tagCharacterId.toLowerCase().includes(variantSearch.value.toLowerCase())
  )
})

useHead({
  title: computed(() => combo.value?.title ? `${combo.value.title} - 2XKOMBOS` : 'Chargement...')
})

const charImage = computed(() =>
  combo.value ? getCharImage(combo.value.characterId) : "",
);
const difficultyInfo = computed(() =>
  getDifficultyInfo(combo.value?.difficulty),
);

const parsedInputs = computed(() => {
  if (!combo.value?.inputs) return []
  return combo.value.inputs.split(' ')
})

async function handleDelete() {
  if (confirm('Voulez-vous vraiment supprimer ce combo ?')) {
    await deleteCombo(combo.value!.id)
    router.push(`/${charId}`)
  }
}
</script>

<template>
  <v-container fluid style="max-width: 1600px" v-if="combo" class="h-100">
    <div class="mb-4">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="router.push(`/${charId}`)">
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
          <video v-else :src="combo.src" controls autoplay class="w-100 d-block" style="max-height: 85vh"></video>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card color="surface" class="h-100 border-thin d-flex flex-column pa-0">
          <div class="pt-2">
            <h1 class="text-h4 font-weight-black text-uppercase text-primary mb-6 px-8">
              {{ combo.title }}
            </h1>

            <div class="d-flex align-center flex-wrap mb-6 px-8">
              <v-chip size="default" color="primary" variant="flat" class="mr-4">
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

            <div class="px-8 mb-2">
              <v-sheet color="background" rounded="lg" class="pa-6 border-thin">
                <div class="d-flex flex-wrap align-center" style="gap: 8px;">
                  <template v-for="(input, index) in parsedInputs" :key="index">
                    <div class="d-flex align-center justify-center">
                      <v-img v-if="getInputIcon(input)" :src="getInputIcon(input) || undefined" width="38" height="38"
                        contain></v-img>
                      <span v-else class="text-h4 font-weight-bold text-primary mx-1">{{ input }}</span>
                    </div>
                  </template>
                </div>
              </v-sheet>
            </div>

            <v-divider></v-divider>

            <div class="pa-4 d-flex justify-space-between">
              <v-btn variant="text" prepend-icon="mdi-pencil" color="white" @click="showEdit = true">Modifier</v-btn>
              <v-btn variant="text" prepend-icon="mdi-delete" color="error" @click="handleDelete">Supprimer</v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-8" v-if="charImage">
      <v-col cols="12" md="6" lg="4">
        <v-card :to="`/${combo.characterId}`" hover class="border-thin" color="surface">
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
      </v-col>
    </v-row>

    <div class="mt-0">
      <div class="d-flex align-center justify-space-between mb-6 border-b-thin pb-4">
        <div>
          <h2 class="text-h5 font-weight-black text-uppercase text-white">Variantes Tag</h2>
          <div class="text-caption text-grey">Extensions possibles depuis ce combo</div>
        </div>
        <v-btn color="primary" variant="outlined" prepend-icon="mdi-account-multiple-plus"
          @click="showTagDialog = true">
          Proposer une variante
        </v-btn>
      </div>

      <div v-if="tagVariations.length === 0"
        class="text-center py-8 text-grey-darken-2 border-thin rounded border-dashed">
        Aucune variante enregistrée pour ce combo.
      </div>

      <template v-else>
        <v-text-field
          v-model="variantSearch"
          label="Filtrer par personnage"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          class="mb-4"
        ></v-text-field>

        <div v-if="filteredVariants.length === 0" class="text-center py-8 text-grey-darken-2">
          Aucune variante trouvée pour ce filtre.
        </div>

        <v-list v-else class="bg-transparent">
          <v-list-item 
            v-for="tagCombo in filteredVariants" 
            :key="tagCombo.id" 
            class="border-thin rounded pa-4 bg-surface cursor-pointer"
            @click="router.push(`${route.path}/${tagCombo.id}`)"
          >
            <template v-slot:prepend>
              <v-avatar rounded="0" size="50">
                <v-img :src="getCharImage(tagCombo.tagCharacterId)" cover></v-img>
              </v-avatar>
            </template>
            
            <div class="w-100">
              <v-list-item-title class="text-uppercase font-weight-black text-primary mb-2">
                {{ tagCombo.tagMechanic.toUpperCase() }} - {{ tagCombo.tagCharacterId.toUpperCase() }}
              </v-list-item-title>
              <div class="d-flex align-center flex-wrap" style="gap: 8px;">
                <v-chip size="small" color="primary" variant="flat" class="font-weight-bold">
                  {{ tagCombo.damage }} DMG
                </v-chip>
                <v-chip 
                  size="small" 
                  :color="getDifficultyInfo(tagCombo.difficulty)?.color || 'grey'" 
                  variant="flat" 
                  class="text-black font-weight-bold"
                >
                  {{ getDifficultyInfo(tagCombo.difficulty)?.label || 'Inconnu' }}
                </v-chip>
              </div>
            </div>

            <template v-slot:append>
              <v-icon class="text-primary">mdi-chevron-right</v-icon>
            </template>
          </v-list-item>
        </v-list>
      </template>
    </div>

    <UploadDialog v-model="showEdit" edit-mode :initial-data="combo" />

    <UploadDialog v-model="showTagDialog" :parent-id="combo.id" :initial-data="{ inputs: combo.inputs }" />

  </v-container>
</template>