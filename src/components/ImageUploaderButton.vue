<!-- ImageUploader.vue -->
<template>
  <div>
    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileChange" />

    <div v-if="imageUrl" class="flex items-center justify-center w-full h-full bg-stone-200 hover:bg-stone-300"
      @click="triggerUpload">
      <img  :src="imageUrl" class="max-w-full max-h-full object-contain" @click="resetImage"></img>

    </div>

    <Button v-else class="w-full h-full" severity="secondary" @click="triggerUpload">
      粘贴或点击上传
    </Button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Emit events to parent
const emit = defineEmits<{
  (e: 'update', file: File): void
  (e: 'reset'): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const file = ref<File | null>(null)
const imageUrl = ref<string | null>(null)

// Trigger file picker
function triggerUpload() {
  fileInput.value?.click()
}

// On file input change
function onFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    setImage(target.files[0])
  }
}

// Set image and notify parent
function setImage(selected: File) {
  file.value = selected
  if (imageUrl.value) URL.revokeObjectURL(imageUrl.value)
  imageUrl.value = URL.createObjectURL(selected)
  emit('update', selected)
}

// Reset image and notify parent
function resetImage() {
  if (imageUrl.value) URL.revokeObjectURL(imageUrl.value)
  file.value = null
  imageUrl.value = null
  emit('reset')
}

// Paste handler: look for image in clipboard
function onPaste(event: ClipboardEvent) {
  const items = event.clipboardData?.items
  if (!items) return
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item.type.startsWith('image/')) {
      const blob = item.getAsFile()
      if (blob) setImage(blob)
      break
    }
  }
}

// Attach global paste listener to window
onMounted(() => {
  window.addEventListener('paste', onPaste)
})

// Cleanup listeners and object URL
onUnmounted(() => {
  window.removeEventListener('paste', onPaste)
  if (imageUrl.value) URL.revokeObjectURL(imageUrl.value)
})
</script>

<style scoped>
/* Tailwind CSS utility classes handle styling */
</style>
