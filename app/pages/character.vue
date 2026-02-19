<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const route = useRoute()
const charId = route.params.charId as string 
useHead({ title: charId.toUpperCase() + ' - 2XKOMBOS' })
const { getCombosByChar, addCombo, deleteCombo } = useCombos() 
const { getCharData } = useGameData()

const charCombos = getCombosByChar(charId) 
const charData = computed(() => getCharData(charId))

const showUpload = ref(false)
const editingCombo = ref<any>(null)

function openCreateDialog() {
  editingCombo.value = null
  showUpload.value = true
}

function handleEdit(combo: any) {
  editingCombo.value = combo 
  showUpload.value = true
}

async function handleDelete(comboId: number) {
  if (confirm("Es-tu sûr de vouloir supprimer ce combo ?")) {
    await deleteCombo(comboId)
  }
}

async function handleSubmit(data: any) {
  await addCombo({ ...data, characterId: charId })
  showUpload.value = false
  editingCombo.value = null
}

watch(showUpload, (val) => {
  if (!val) {
    setTimeout(() => { editingCombo.value = null }, 300)
  }
})
</script>

<template>
  <div v-if="charData">
    <v-img
      :src="charData.url"
      height="350"
      cover
      :position="charData.pos"
      gradient="to right, rgba(15,15,15,0.9) 0%, rgba(15,15,15,0.3) 50%, rgba(15,15,15,0) 100%"
    >
      <div class="d-flex flex-column fill-height">
        <div class="pa-4">
          <v-btn variant="text" color="white" prepend-icon="mdi-arrow-left" @click="$router.push('/')">
            Liste des champions
          </v-btn>
        </div>
        <v-spacer></v-spacer>
        <div class="px-4 pb-6">
          <v-container>
            <h1 class="text-h2 font-weight-black text-uppercase text-white mb-4">{{ charId }}</h1>
            <v-btn 
                variant="flat" 
                prepend-icon="mdi-plus" 
                @click="openCreateDialog" 
                class="bg-primary text-black font-weight-bold"
            >
                Ajouter un Combo
            </v-btn>
          </v-container>
        </div>
      </div>
    </v-img>

    <v-container class="py-8">
      <div v-if="charCombos.length === 0" class="text-center text-grey py-10">
        <v-icon size="64">mdi-controller-off</v-icon>
        <div class="text-h5">Aucun combo pour le moment</div>
      </div>

      <v-row v-else>
        <v-col v-for="combo in charCombos" :key="combo.id" cols="12" md="4">
          
          <ComboCard 
            :combo="combo" 
            @edit="handleEdit" 
            @delete="handleDelete" 
          />
          
        </v-col>
      </v-row>
    </v-container>

    <UploadDialog 
      v-model="showUpload" 
      :edit-mode="!!editingCombo"
      :initial-data="editingCombo"
      @submit="handleSubmit" 
    />
  </div>
</template>