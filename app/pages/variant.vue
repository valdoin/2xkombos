<script setup lang="ts">
import { ref, computed } from 'vue'

const route = useRoute();
const router = useRouter();
const { getComboById, addCombo, deleteCombo } = useCombos();
const { getCharImage, getDifficultyInfo } = useGameData();
const { getInputIcon } = useInputData();

const variantId = route.params.variantId as string;
const charId = route.params.charId as string;
const showEdit = ref(false)

const combo = getComboById(variantId); 
const parentCombo = getComboById(route.params.comboId as string);

if (!combo.value) {
  router.back();
}

useHead({
  title: computed(() => {
    if (!combo.value) return 'Chargement...';
    const parentTitle = parentCombo.value?.title || 'Combo';
    return `${parentTitle} - ${combo.value.tagMechanic.toUpperCase()} - 2XKOMBOS`;
  })
})

const mainCharImage = computed(() => getCharImage(combo.value?.characterId));
const tagCharImage = computed(() => getCharImage(combo.value?.tagCharacterId));

const difficultyInfo = computed(() => getDifficultyInfo(combo.value?.difficulty));

const parsedInputs = computed(() => {
  if (!combo.value?.inputs) return []
  return combo.value.inputs.split(' ')
})

function handleEdit(data: any) {
  addCombo({ ...data, id: combo.value?.id, characterId: charId })
  showEdit.value = false
}

async function handleDelete() {
  if (confirm('Voulez-vous vraiment supprimer cette variante ?')) {
    await deleteCombo(combo.value!.id)
    router.back()
  }
}
</script>

<template>
  <v-container fluid style="max-width: 1600px" v-if="combo" class="h-100">
    <div class="mb-4">
      <v-btn variant="text" prepend-icon="mdi-arrow-left" @click="router.back()">
        Retour au combo principal
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
              {{ combo.tagMechanic }}
            </h1>
            <div class="d-flex align-center flex-wrap mb-6 px-8">
              <v-chip size="default" color="primary" variant="flat" class="mr-4">
                {{ combo.damage }} DMG
              </v-chip>
              <div class="text-grey-darken-1 mx-2">|</div>
              <v-chip size="default" :color="difficultyInfo.color" variant="flat" class="text-black font-weight-bold ml-4">
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
                       <v-img 
                         v-if="getInputIcon(input)" 
                         :src="getInputIcon(input) || undefined" 
                         width="38" 
                         height="38"
                         contain
                       ></v-img>
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

    <v-row justify="center" class="mt-8">
       <v-col cols="12" md="6" lg="4">
          <v-card class="border-thin" color="surface">
            <v-card-title class="text-caption text-grey text-center">Duo</v-card-title>
            <div class="d-flex align-center justify-center pa-1">
              <div class="d-flex flex-column align-center">
                 <v-avatar 
                    rounded="0" 
                    size="60" 
                    class="cursor-pointer elevation-4"
                    style="cursor: pointer; transition: transform 0.2s;"
                    @click="router.push(`/${combo.characterId}`)"
                 >
                    <v-img :src="mainCharImage" cover></v-img>
                 </v-avatar>
                 <span class="text-h6 font-weight-bold text-uppercase text-primary">{{ combo.characterId.toUpperCase() }}</span>
              </div>
              
              <v-icon size="large" class="mx-6 text-grey">mdi-plus</v-icon>
              
              <div class="d-flex flex-column align-center">
                 <v-avatar 
                    rounded="0" 
                    size="60"
                    class="cursor-pointer elevation-4"
                    style="cursor: pointer; transition: transform 0.2s;"
                    @click="router.push(`/${combo.tagCharacterId}`)"
                 >
                    <v-img :src="tagCharImage" cover></v-img>
                 </v-avatar>
                 <span class="text-h6 font-weight-bold text-uppercase text-primary">{{ combo.tagCharacterId.toUpperCase()}}</span>
              </div>
            </div>
          </v-card>
       </v-col>
    </v-row>

    <UploadDialog v-model="showEdit" edit-mode :initial-data="combo" @submit="handleEdit" />

  </v-container>
</template>