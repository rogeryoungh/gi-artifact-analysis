<script setup lang="ts">
import { ref, onMounted } from "vue";
import ImageUploaderButton from "./ImageUploaderButton.vue";
import { OcrService } from "../services/OcrService";
import type { ChartData } from "chart.js";
import { useToast } from "primevue";
import JsonUploadButton from "./JsonUploadButton.vue";
import { AttrEnum, AttrName, AttrNameShort, calcPDF, calculateScore, equipmentToString, equipmentToVector, PositionName, type Equipment } from "../utils/Artifact";
import { convertMonaToEquipment } from "../utils/MonaUtils";
import { pairAttribute as matchAttribute, parseEquipment } from "../utils/ArtifactParse";

const toast = useToast();

const uploadImage = ref<File | null>(null);
const uploadJson = ref<File | null>(null);
const ocrService = new OcrService();

const weight = ref([0, 0, 0, 0, 0, 0, 100, 100, 0, 0]);

const infoRef = ref({
  current: 25,
  target: 45,
  currentProbability: 0,
  targetProbability: 0,
  artifactInfo: "",
});

const filterEquipmentRef = ref({
  set: "",
  mainAttr: { name: "全部" },
  position: { name: "全部" },
  minLevel: 0,
  maxLevel: 19,
});

const inputMethodOptions = [
  '截图',
  'mona.json（实验）'
]

const positionOptions = ["全部"].concat(PositionName).map((e) => {
  return {
    name: e,
  };
});

const mainAttrOptions = ["全部"].concat(AttrName).map((e) => {
  return {
    name: e,
  };
});

const selectInputMethod = ref('截图');

const selectJsonId = ref(1);

const charactors = [
  { name: "攻击力模型", value: 1 },
  { name: "刻晴", value: 2 },
  { name: "那维莱特", value: 3 },
];

const show = ref({
  chart: false,
  chartSkeleton: false,
  prevDisable: true,
  nextDisable: true,
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
      weight.value[AttrEnum.ATK_PERCENT] = 100;
      weight.value[AttrEnum.CRIT_RATE] = 100;
      weight.value[AttrEnum.CRIT_DMG] = 100;
      break;
    case 2:
      weight.value[AttrEnum.ATK_PERCENT] = 75;
      weight.value[AttrEnum.CRIT_RATE] = 100;
      weight.value[AttrEnum.CRIT_DMG] = 100;
      weight.value[AttrEnum.ELEMENTAL_MASTERY] = 75;
      break;
    case 3:
      weight.value[AttrEnum.HP_PERCENT] = 100;
      weight.value[AttrEnum.CRIT_RATE] = 100;
      weight.value[AttrEnum.CRIT_DMG] = 100;
      weight.value[AttrEnum.ENERGY_RECHARGE] = 15;
      break;
  }
}

const entries = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  .map((e) => {
    return {
      key: e,
      label: AttrNameShort[e],
    }
  });

const monaJson = ref<Equipment[]>([]);

const filterMonaJson = (json: Equipment[]) => {
  const minLevel = filterEquipmentRef.value.minLevel;
  const maxLevel = filterEquipmentRef.value.maxLevel;
  const position = PositionName.indexOf(filterEquipmentRef.value.position.name);
  const mainAttr = AttrName.indexOf(filterEquipmentRef.value.mainAttr.name);
  return json.filter((e) => {
    if (mainAttr !== -1 && e.mainAttr !== null && e.mainAttr.key !== mainAttr) {
      return false;
    }
    if (position !== -1 && e.position !== null && e.position !== position) {
      return false;
    }
    if (e.level !== null && e.level < minLevel) {
      return false;
    }
    if (e.level !== null && e.level > maxLevel) {
      return false;
    }
    return true;
  });
}

const onJsonUpload = async () => {
  const file = uploadJson.value!;
  try {
    const content = await file.text();
    const json = JSON.parse(content);
    const parseArray = (json: any) => {
      return json.map((e: any) => {
        return convertMonaToEquipment(e);
      });
    };
    const arr = [].concat(
      parseArray(json["flower"] ?? []),
      parseArray(json["feather"] ?? []),
      parseArray(json["sand"] ?? []),
      parseArray(json["cup"] ?? []),
      parseArray(json["head"] ?? []),
    );
    monaJson.value = filterMonaJson(arr);
    toast.add({
      severity: "success",
      summary: "提示",
      detail: "JSON 文件解析成功，包含 " + arr.length + " 个圣遗物，过滤得到 " + monaJson.value.length + " 个",
      life: 3000,
    });

    startAnalysis();
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "错误",
      detail: "JSON 文件解析失败，" + error,
      life: 3000,
    });
  } finally {
    selectJsonId.value = 1;
    show.value.prevDisable = monaJson.value.length >= 1
    show.value.nextDisable = monaJson.value.length <= 1;
  }
}

const processEquipment = async () => {
  if (selectInputMethod.value === 'mona.json（实验）') {
    if (monaJson.value.length === 0) {
      throw new Error("请先上传 JSON 文件");
    }
    const current = monaJson.value[selectJsonId.value - 1];
    console.log("当前装备", current);
    return current;
  } else {
    if (!uploadImage.value) {
      throw new Error("请先上传图片或截图");
    }
    const res = await ocrService.detectAndRecognize(uploadImage.value);
    console.log("OCR 结果", res);
    const pairedResult = matchAttribute(res);
    const parsedResult = parseEquipment(pairedResult);
    console.log("配对结果", parsedResult);
    return parsedResult;
  }
}

const startAnalysis = async () => {
  show.value.chart = false;
  show.value.chartSkeleton = true;

  const weights = Array.from(weight.value).map((e) => e / 100);
  const totalWeight = weights.reduce((a, b) => a + b, 0);
  if (totalWeight < 0.1) {
    toast.add({
      severity: "warn",
      summary: "错误",
      detail: "您的权重似乎设置的非常小，建议再检查一下",
      life: 3000,
    });
  }
  console.log("开始分析", weights);

  try {
    const parsedResult = await processEquipment();

    const resultArr = equipmentToVector(parsedResult);
    infoRef.value.artifactInfo = equipmentToString(parsedResult);

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

    toast.add({
      severity: "success",
      summary: "提示",
      detail: "分析完成，图表已更新",
      life: 3000,
    });
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "错误",
      detail: "识别失败，" + error,
      life: 3000,
    });
    show.value.chart = false;
    show.value.chartSkeleton = false;
  }
}

onMounted(() => {
  setTimeout(async () => {
    toast.add({
      severity: "info",
      summary: "提示",
      detail: "正在下载 OCR 引擎和模型，预计 20 MB，首次下载可能需要一些时间，请耐心等待",
      life: 3000,
    });
    await ocrService.init();
    toast.add({
      severity: "success",
      summary: "提示",
      detail: "OCR 引擎初始化完成，请直接粘贴或上传，包含副词条和等级信息圣遗物图片",
      life: 6000,
    });
  }, 300);
});

const prevOnClick = () => {
  if (selectJsonId.value > 1) {
    selectJsonId.value--;
    show.value.prevDisable = selectJsonId.value === 1;
    show.value.nextDisable = false;
    startAnalysis();
  }
}

const nextOnClick = () => {
  if (selectJsonId.value < monaJson.value.length) {
    selectJsonId.value++;
    show.value.nextDisable = selectJsonId.value === monaJson.value.length;
    show.value.prevDisable = false;
    startAnalysis();
  }
}
</script>

<template>
  <header class="shadow-md">
    <div class="container mx-auto py-2 px-4 lg:px-20 flex items-center justify-between">
      <div class="text-xl font-bold">圣遗物分析仪</div>
      <div class="flex items-center space-x-4">
        <Button variant="text" as="a" label="External" href="https://github.com/rogeryoungh/gi-artifact-analysis"
          target="_blank"> GitHub </Button>
      </div>
    </div>
  </header>
  <main class="container mx-auto px-4 lg:px-20 my-10">
    <Toast />
    <div class="flex flex-col lg:flex-row gap-4">
      <div class="flex-3">
        <Panel header="输入">
          <div class="flex justify-center mb-4">
            <SelectButton v-model="selectInputMethod" :options="inputMethodOptions" :allow-empty="false" />
          </div>
          <div v-if="selectInputMethod === '截图'" class="flex items-center justify-center h-80">
            <ImageUploaderButton class="w-full h-full" @update="(t) => uploadImage = t"></ImageUploaderButton>
          </div>
          <div v-if="selectInputMethod === 'mona.json（实验）'">
            <div class="w-full flex  gap-4 items-center justify-center">
              <JsonUploadButton @update="(t) => { uploadJson = t; onJsonUpload() }" />
              <div>总计 {{ selectJsonId }} / {{ monaJson.length }} </div>
              <Button variant="text" :disabled="show.prevDisable" @click="prevOnClick">上一个</Button>
              <Button variant="text" :disabled="show.nextDisable" @click="nextOnClick">下一个</Button>
            </div>
          </div>
        </Panel>
        <Panel header="过滤" v-if="selectInputMethod === 'mona.json（实验）'" class="mt-4">
          <div class="mt-2 flex flex-row gap-4 items-center">
            <FloatLabel class="flex-3">
              <Select optionLabel="name" class="w-full" disabled />
              <label for="over_label">套装 TODO</label>
            </FloatLabel>
            <FloatLabel class="flex-2">
              <Select optionLabel="name" class="w-full" :options="mainAttrOptions"
                v-model="filterEquipmentRef.mainAttr" />
              <label for="over_label">主词条</label>
            </FloatLabel>
          </div>
          <div class="flex flex-row gap-4 mt-8 items-center">
            <FloatLabel class="flex-1">
              <Select optionLabel="name" class="w-full" :options="positionOptions"
                v-model="filterEquipmentRef.position" />
              <label for="over_label">部位</label>
            </FloatLabel>
            <FloatLabel class="flex-1">
              <InputNumber inputId="over_label" input-class="w-full" v-model="filterEquipmentRef.minLevel" />
              <label for="over_label">最低等级</label>
            </FloatLabel>
            <FloatLabel class="flex-1">
              <InputNumber inputId="over_label" input-class="w-full" v-model="filterEquipmentRef.maxLevel" />
              <label for="over_label">最高等级</label>
            </FloatLabel>
            <Button class="flex-[0.8]" @click="onJsonUpload">
              过滤
            </Button>
          </div>
        </Panel>
      </div>
      <Panel header="参数" class="flex-3">
        <div class="mt-4 grid grid-cols-2 gap-x-8 gap-y-4">
          <div v-for="item in entries" :key="item.key" class="flex items-center space-x-4">
            <label for="param1" class="text-gray-700 w-12"> {{ item.label }}</label>
            <Slider class="flex-1" v-model="weight[item.key]" />
            <label>{{ (weight[item.key] / 100).toFixed(2) }}</label>
          </div>
        </div>
        <div class="flex flex-row gap-4 mt-8">
          <FloatLabel class="flex-1">
            <Select editable :options="charactors" @change="onSelectPresetCharactor" optionLabel="name" cass="w-full" />
            <label for="over_label">预设角色</label>
          </FloatLabel>

          <FloatLabel class="flex-1">
            <InputNumber inputId="over_label" v-model="infoRef.current" input-class="w-full" />
            <label for="over_label">当前分数</label>
          </FloatLabel>
          <FloatLabel class="flex-1">
            <InputNumber inputId="over_label" v-model="infoRef.target" input-class="w-full" />
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
        <p class="py-2">超过当前分数的概率：{{ (infoRef.currentProbability * 100).toFixed(2) }}%，达到毕业分数的概率：{{
          (infoRef.targetProbability * 100).toFixed(2) }}%。</p>
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
