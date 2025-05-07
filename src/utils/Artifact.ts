export const PositionName = [
	"生之花", "死之羽", "时之沙", "空之杯", "理之冠"
];

export const AttrName = [
	"攻击力", "攻击力%", "生命值", "生命值%", "防御力", "防御力%",
	"暴击率", "暴击伤害", "元素精通", "元素充能效率",
	"风元素伤害加成", "岩元素伤害加成", "雷元素伤害加成",
	"水元素伤害加成", "草元素伤害加成", "火元素伤害加成",
	"冰元素伤害加成", "物理伤害加成", "治疗加成",
];

export enum AttrEnum {
	ATK = 0,                // 攻击力
	ATK_PERCENT = 1,        // 攻击力% 
	HP = 2,                 // 生命值
	HP_PERCENT = 3,         // 生命值%
	DEF = 4,                // 防御力
	DEF_PERCENT = 5,        // 防御力%
	CRIT_RATE = 6,          // 暴击率
	CRIT_DMG = 7,           // 暴击伤害
	ELEMENTAL_MASTERY = 8,  // 元素精通
	ENERGY_RECHARGE = 9,    // 元素充能效率
	ANEMO_BONUS = 10,       // 风元素伤害加成
	GEO_BONUS = 11,         // 岩元素伤害加成
	ELECTRO_BONUS = 12,     // 雷元素伤害加成
	DENDRO_BONUS = 13,      // 草元素伤害加成
	HYDRO_BONUS = 14,       // 水元素伤害加成
	PYRO_BONUS = 15,        // 火元素伤害加成
	CRYO_BONUS = 16,        // 冰元素伤害加成
	PHYSICAL_BONUS = 17,    // 物理伤害加成
	HEALING_BONUS = 18,     // 治疗加成
}

export const AttrNameShort = [
	"攻击", "攻击%", "生命", "生命%", "防御", "防御%",
	"暴率", "暴伤", "精通", "充能"
];

export const SubAttrBasis = [
	19.45,  // 攻击力
	5.83,	  // 攻击力%
	298.75, // 生命值
	5.83, 	// 生命值%
	23.15, 	// 防御力
	7.29, 	// 防御力%
	3.89, 	// 暴击率
	7.77, 	// 暴击伤害
	23.31, 	// 元素精通
	6.48, 	// 元素充能效率
]

export enum Position {
	Flower = 0,
	Sands = 1,
	Cup = 2,
	Feather = 3,
	Head = 4
}

export interface AttrPairStr {
	key: string;
	value: string;
}

export interface AttrPair {
	key: AttrEnum;
	value: number;
}

export interface EquipmentStr {
	set: string | null;
	position: string | null;
	level: number | null;
	mainAttr: [string, string] | null;
	subAttrs: [string, string][];
}

export interface Equipment {
	set: string | null;           // 套装名称
	position: string | null;      // 位置名称
	level: number | null;         // 装备等级，未识别到则为 null
	mainAttr: AttrPair | null;    // 主属性（有等级时，等级上一条；否则 null）
	subAttrs: AttrPair[];         // 副属性，2~4 条（如果无等级且总数是 5，则全部算作副属性）
}

export function hasPercentValue(key: AttrEnum): boolean {
	return key !== AttrEnum.ATK && key !== AttrEnum.HP && key !== AttrEnum.DEF && key !== AttrEnum.ELEMENTAL_MASTERY;
}

export function attrToString(attr: AttrPair): string {
	const { key, value } = attr;
	const name = AttrName[key];
	const name2 = name.endsWith("%") ? name.slice(0, -1) : name;
	if (hasPercentValue(key)) {
		return `${name2} ${(value * 100).toFixed(1)}%`;
	} else {
		return `${name2} ${value}`;
	}
}

export function equipmentToString(equipment: Equipment): string {
	const ret = [];

	if (equipment.set !== null) {
		ret.push(equipment.set);
	}
	if (equipment.position !== null) {
		ret.push(equipment.position);
	}
	if (equipment.level !== null) {
		ret.push(`等级 ${equipment.level}`);
	} else {
		ret.push("等级未知");
	}
	if (equipment.mainAttr) {
		ret.push(`主属性${attrToString(equipment.mainAttr)}`);
	}
	if (equipment.subAttrs.length > 0) {
		ret.push(...equipment.subAttrs.map(attrToString));
	} else {
		ret.push("无副属性");
	}
	return ret.join("，");
}

export function equipmentToVector(equipment: Equipment): number[] {
	const { subAttrs } = equipment;
	const arr = new Array(10).fill(0);
	for (const { key, value } of subAttrs) {
		const percentRate = hasPercentValue(key) ? 100 : 1;
		const rate = value / SubAttrBasis[key] * percentRate;
		arr[key] = Math.round(rate * 10) / 10;
	}
	return arr;
}

export function calculateScore(lv: number, targetLv: number, arr: number[], weights: number[]): number[] {
	const P_LIST = [0.7, 0.8, 0.9, 1.0];

	const results: number[] = [];

	const nextLv = (curLv: number) => {
		const next = curLv + 4;
		return next - (next % 4);
	}

	const dfs4 = (weight4: number[]) => {
		const _dfs = (curLv: number, curScore: number) => {
			if (curLv >= targetLv) {
				results.push(curScore);
				return;
			}
			for (const w of weight4) {
				for (const p of P_LIST) {
					const nextScore = curScore + p * w;
					_dfs(nextLv(curLv), nextScore);
				}
			}
		}
		return _dfs;
	}

	const getScore = (curArr: number[]) => {
		let sum = 0;
		for (let i = 0; i < curArr.length; i++) {
			if (curArr[i] > 0) {
				sum += curArr[i] * weights[i];
			}
		}
		return sum;
	};

	const dfs = (curLv: number, curArr: number[]) => {
		const activeArr: number[] = [];
		const inactiveArr: number[] = [];
		for (let i = 0; i < curArr.length; i++) {
			if (curArr[i] > 0) {
				activeArr.push(i);
			} else {
				inactiveArr.push(i);
			}
		}
		if (activeArr.length === 4) {
			const weight4 = activeArr.map(i => weights[i]);
			const _dfs = dfs4(weight4);
			_dfs(curLv, getScore(curArr));
		} else if (activeArr.length < 4) {
			for (const i of inactiveArr) {
				for (const p of P_LIST) {
					const nextArr = [...curArr];
					nextArr[i] += p;
					dfs(nextLv(curLv), nextArr);
				}
			}
		} else {
			throw new Error("属性数量超过 4 个，无法计算评分。");
		}
	};

	dfs(lv, arr);
	return results;
}

export function calcPDF(data: number[], binSize: number): { labels: string[], PDF: number[], CCDF: number[] } {
	const max = data.reduce((acc, val) => (val > acc ? val : acc), -Infinity);
	const min = data.reduce((acc, val) => (val < acc ? val : acc), Infinity);
	const xs = new Array(Math.ceil((max - min) / binSize) + 1).fill(0).map((_, i) => min + i * binSize);
	const labels = xs.map((x) => x.toFixed(-Math.log10(binSize)));
	const binCount = Math.ceil((max - min) / binSize) + 1;
	const bins = new Array(binCount).fill(0);
	for (const d of data) {
		const index = Math.floor((d - min) / binSize);
		bins[index]++;
	}
	const acc = [...bins];
	for (let i = acc.length - 1; i > 0; i--) {
		acc[i - 1] += acc[i];
	}
	const n = data.length;

	return { labels, PDF: bins.map((v) => v / n), CCDF: acc.map((v) => v / n) };
}
