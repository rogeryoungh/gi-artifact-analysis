import { ref } from 'vue';
import type { Ref } from 'vue';
import { OcrService, type OcrResult } from '../services/OcrService';
import indexToWord from '../assets/indexToWord.json';

export function useOcr() {
  const results: Ref<OcrResult[]> = ref([]);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);

  const service = new OcrService(Object.values(indexToWord));

  async function processImage(file: File) {
    loading.value = true;
    error.value = null;
    try {
      results.value = await service.detectAndRecognize(file);
    } catch (err: any) {
      error.value = err.message;
      console.error(err);
    } finally {
      loading.value = false;
    }
  }

  return { results, loading, error, processImage };
}
