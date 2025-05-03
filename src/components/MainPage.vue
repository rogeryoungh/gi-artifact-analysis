<script setup lang="ts">
import { ref, onMounted } from "vue";
import ImageUploaderButton from "./ImageUploaderButton.vue";
import { OcrService } from "../services/OcrService";
import { pairAttribute } from "../utils/Utils";
import { AttrKey, AttrName, calcPDF, calculateScore, equipmentToArray, parseEquipment } from "../utils/ArtifactUtils";
import type { ChartData } from "chart.js";
import { useToast } from "primevue";

const toast = useToast();

const uploadImage = ref<File | null>(null);
const ocrService = new OcrService();

const weight = ref([0, 0, 0, 0, 0, 0, 100, 100, 0, 0]);

const infoRef = ref({
  current: 25,
  target: 45,
  currentProbability: 0,
  targetProbability: 0,
  artifactInfo: ""
});

const charactors = [
  { name: "攻击力模型", value: 1 },
  { name: "刻晴", value: 2 },
  { name: "那维莱特", value: 3 },
];

const show = ref({
  chart: false,
  chartSkeleton: false,
});

const chartData = ref<ChartData>({
  labels: [],
  datasets: [
    {
      label: "概率密度",
      data: [],
      yAxisID: 'y',
      borderColor: "#4CAF50",
      backgroundColor: "#4CAF50",
      fill: false,
      tension: 0.4
    },
    {
      label: "累计概率",
      data: [],
      yAxisID: 'y1',
      borderColor: "#FF9800",
      backgroundColor: "#FF9800",
      fill: false,
      tension: 0.4
    },
  ],
});

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: true,
      position: "top",
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: "词条分",
      },
    },
    y: {
      position: 'right',
      title: {
        display: true,
        text: "概率密度",
      },
      grid: {
        drawOnChartArea: false,
      },
    },
    y1: {
      position: 'left',
      title: {
        display: true,
        text: "累计概率",
      },
    },
  },
};

const onSelectPresetCharactor = (event: { value: any; }) => {
  console.log(event.value);
  weight.value.fill(0);
  switch (event.value.value) {
    case 1:
      weight.value[AttrKey.ATK_PERCENT] = 100;
      weight.value[AttrKey.CRIT_RATE] = 100;
      weight.value[AttrKey.CRIT_DMG] = 100;
      break;
    case 2:
      weight.value[AttrKey.ATK_PERCENT] = 100;
      weight.value[AttrKey.CRIT_RATE] = 100;
      weight.value[AttrKey.CRIT_DMG] = 100;
      weight.value[AttrKey.ELEMENTAL_MASTERY] = 100;
      break;
    case 3:
      weight.value[AttrKey.HP_PERCENT] = 100;
      weight.value[AttrKey.CRIT_RATE] = 100;
      weight.value[AttrKey.CRIT_DMG] = 100;
      weight.value[AttrKey.ENERGY_RECHARGE] = 15;
      break;
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
    toast.add({
      severity: "error",
      summary: "错误",
      detail: "请先上传图片",
      life: 3000,
    });
    return;
  }
  show.value.chart = false;
  show.value.chartSkeleton = true;

  const weights = Array.from(weight.value).map((e) => e / 100);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  console.log("权重", totalWeight);
  if (totalWeight < 0.1) {
    toast.add({
      severity: "warn",
      summary: "错误",
      detail: "您的权重似乎设置的非常小，建议再检查一下",
      life: 3000,
    });
  }
  console.log("开始分析", weights);

  const res = await ocrService.detectAndRecognize(uploadImage.value);
  console.log("OCR 结果", res);

  const pairedResult = pairAttribute(res);
  const parsedResult = parseEquipment(pairedResult);
  const resultArr = equipmentToArray(parsedResult);
  console.log("配对结果", parsedResult);
  console.log("配对结果", resultArr);
  infoRef.value.artifactInfo = parsedResult.info;

  const scores = calculateScore(parsedResult.level ?? 0, 20, resultArr, weights).map(x => x * 7.8);
  const currentScore = infoRef.value.current;
  const targetScore = infoRef.value.target;

  infoRef.value.currentProbability = scores.filter(x => x >= currentScore).length / scores.length;
  infoRef.value.targetProbability = scores.filter(x => x >= targetScore).length / scores.length;

  const { labels, PDF, CCDF } = calcPDF(scores, 1);
  chartData.value.labels = labels;
  chartData.value.datasets[0].data = PDF;
  chartData.value.datasets[1].data = CCDF;

  show.value.chart = true;
  show.value.chartSkeleton = false;
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
  <main class="container mx-auto px-4 lg:px-20 my-10">
    <Toast />
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
            <Slider class="flex-1" v-model="weight[item.key]" />
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
            <InputNumber inputId="over_label" v-model="infoRef.current" />
            <label for="over_label">当前分数</label>
          </FloatLabel>
          <FloatLabel>
            <InputNumber inputId="over_label" v-model="infoRef.target" />
            <label for="over_label">毕业分数</label>
          </FloatLabel>
        </div>
        <Button class="w-full mt-6" @click="startAnalysis">开始分析</Button>
      </Panel>

    </div>

    <Panel header="结果" class="mt-4 min-h-30">
      <p class="py-2">让我们看看是哪个旅行者，又出了极品圣遗物呢 ✨</p>
      <div v-if="show.chart">
        <p class="py-2">识别结果：{{ infoRef.artifactInfo }}。</p>
        <p class="py-2">超过当前分数的概率：{{ (infoRef.currentProbability * 100).toFixed(2) }}%，达到毕业分数的概率：{{ (infoRef.targetProbability * 100).toFixed(2) }}%。</p>
      </div>
      <Chart v-if="show.chart" type="line" :data="chartData" :options="chartOptions" />
      <Skeleton v-if="show.chartSkeleton" class="h-80" />
    </Panel>

  </main>
  <footer class="mt-8">
    <div class="container mx-auto px-4 py-4 text-center text-sm text-gray-500">
      © 2025 rogeryoungh
    </div>
  </footer>
</template>

<style scoped></style>
