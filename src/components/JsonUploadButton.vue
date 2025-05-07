<template>
	<div class="flex items-center justify-center">
		<input ref="fileInput" type="file" accept="application/json" class="hidden" @change="onFileChange" />

		<Button class="w-full h-full" severity="secondary" @click="triggerUpload">
			{{ file ? file.name : "点击上传" }}
		</Button>
	</div>
</template>

<script setup lang="ts">
import { ref, } from 'vue'

const emit = defineEmits<{
	(e: 'update', file: File): void
}>();

const fileInput = ref<HTMLInputElement | null>(null);
const file = ref<File | null>(null);

function triggerUpload() {
	fileInput.value?.click()
}

function onFileChange(e: Event) {
	const target = e.target as HTMLInputElement
	if (target.files && target.files[0]) {
		const select = target.files[0];
		file.value = select;
		emit('update', select)
	}
}

</script>
