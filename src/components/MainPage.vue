<script setup lang="ts">
import { ref, onMounted } from "vue";
import ImageUploaderButton from "./ImageUploaderButton.vue";
import { OcrService } from "../services/OcrService";
import { pairAttribute } from "../utils/Utils";
import { AttrKey, AttrName, equipmentToArray, parseEquipment } from "../utils/ArtifactUtils";

const uploadImage = ref<File | null>(null);
const ocrService = new OcrService();

const weight = ref(Array(10).fill(0));

const charactors = [
  { name: "攻击力基础模型", value: 1 },
  { name: "刻晴", value: 2 },
  { name: "那维莱特", value: 3 },
]

const onSelectPresetCharactor = (event: { value: any; }) => {
  const value = event.value;
  if (value.value === 1) {
    weight.value.fill(0);
    weight.value[AttrKey.ATK_PERCENT] = 100;
    weight.value[AttrKey.CRIT_RATE] = 100;
    weight.value[AttrKey.CRIT_DMG] = 100;
    console.log(value);
  } else if (event.value === 2) {
    weight.value[AttrKey.ATK_PERCENT] = 100;
    weight.value[AttrKey.CRIT_RATE] = 100;
    weight.value[AttrKey.CRIT_DMG] = 100;
    weight.value[AttrKey.ELEMENTAL_MASTERY] = 100;
  } else if (event.value === 3) {
    weight.value[AttrKey.HP_PERCENT] = 100;
    weight.value[AttrKey.CRIT_RATE] = 100;
    weight.value[AttrKey.CRIT_DMG] = 100;
    weight.value[AttrKey.ENERGY_RECHARGE] = 15;
  }
}

const entries = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  .map((e) => {
    return {
      key: e,
      label: AttrName[e],
    }
  });

const startAnalysis = async () => {
  if (!uploadImage.value) {
    alert("请先上传图片");
    return;
  }
  // Perform analysis with the uploaded image and weights
  console.log("开始分析", weight.value);

  const res = await ocrService.detectAndRecognize(uploadImage.value);
  console.log("OCR 结果", res);

  const pairedResult = pairAttribute(res);
  const parsedResult = parseEquipment(pairedResult);
  const resultArr = equipmentToArray(parsedResult);
  console.log("配对结果", parsedResult);
  console.log("配对结果", resultArr);
}

onMounted(() => {
  setTimeout(() => {
    ocrService.init();
  }, 300);
});

</script>

<template>
  <header class="shadow-md">
    <div class="container mx-auto px-4 py-4 flex items-center justify-between">
      <div class="text-xl font-bold">圣遗物分析仪</div>
    </div>
  </header>
  <div class="container mx-auto px-4 lg:px-20 my-10">

    <div class="flex flex-col lg:flex-row gap-4">
      <Panel header="输入" class="flex-2">
        <div class="flex items-center justify-center h-80">
          <ImageUploaderButton class="w-full h-full" @update="(t) => uploadImage = t"></ImageUploaderButton>
        </div>
      </Panel>
      <Panel header="参数" class="flex-3">
        <div class="mt-4 grid grid-cols-2 gap-x-8 gap-y-4">
          <div v-for="item in entries" :key="item.key" class="flex items-center space-x-4">
            <label for="param1" class="text-gray-700 w-24"> {{ item.label }}</label>
            <Slider class="flex-1" v-model="weight[item.key as keyof typeof weight]" />
            <label>{{ (weight[item.key] / 100).toFixed(2) }}</label>
          </div>
        </div>
        <div class="flex flex-warp gap-4 mt-8">
          <FloatLabel>
            <Select editable :options="charactors" @change="onSelectPresetCharactor" optionLabel="name"
              class="w-full md:w-56" />
            <label for="over_label">预设角色</label>
          </FloatLabel>

          <FloatLabel>
            <InputNumber inputId="over_label" />
            <label for="over_label">当前分数</label>
          </FloatLabel>
          <FloatLabel>
            <InputNumber inputId="over_label" />
            <label for="over_label">毕业分数</label>
          </FloatLabel>
        </div>
        <Button class="w-full mt-6" @click="startAnalysis">开始分析</Button>
      </Panel>

    </div>

    <Panel header="结果" class="mt-4 min-h-30">
      让我们看看是哪个旅行者，又出了极品圣遗物呢 ✨
      <Skeleton class="w-full mt-4" height="30px" />
    </Panel>

  </div>
  <footer class="mt-8">
    <div class="container mx-auto px-4 py-4 text-center text-sm text-gray-500">
      © 2025 rogeryoungh
    </div>
  </footer>
</template>

<style scoped></style>
