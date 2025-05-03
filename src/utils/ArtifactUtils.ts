export type RawEntry = [string] | [string, string];

export const AttrName = [
	"攻击力", "攻击力%", "生命值", "生命值%", "防御力", "防御力%",
	"暴击率", "暴击伤害", "元素精通", "元素充能效率"
];

const AttrBasis = [
	19.45, // 攻击力
	5.83,	// 攻击力%
	298.75, // 生命值
	5.83, 	// 生命值%
	23.15, 	// 防御力
	7.29, 	// 防御力%
	3.89, 	// 暴击率
	7.77, 	// 暴击伤害
	23.31, 	// 元素精通
	6.48, 	// 元素充能效率
]

export enum AttrKey {
	ATK = 0,                // 攻击力
	ATK_PERCENT = 1,        // 攻击力% 
	HP = 2,                 // 生命值
	HP_PERCENT = 3,         // 生命值%
	DEF = 4,                // 防御力
	DEF_PERCENT = 5,        // 防御力%
	CRIT_RATE = 6,          // 暴击率
	CRIT_DMG = 7,           // 暴击伤害
	ELEMENTAL_MASTERY = 8,  // 元素精通
	ENERGY_RECHARGE = 9     // 元素充能效率
}

interface ParsedAttr {
	key: AttrKey;
	value: number;      // 数值，百分比已转换为小数（如 5.8% → 5.8）
}

interface EquipmentAttrs {
	level: number | null;       // 装备等级，未识别到则为 null
	mainAttr: ParsedAttr | null;// 主属性（有等级时，等级上一条；否则 null）
	subAttrs: ParsedAttr[];     // 副属性，2~4 条（如果无等级且总数是 5，则全部算作副属性）
	info: string;               // 识别到的属性信息
}

function parseSingle([label, val]: [string, string]): ParsedAttr {
	// 去掉可能的空格
	const v = val.trim();
	const num = parseFloat(v.replace("%", ""));

	switch (label) {
		case "攻击力":
			return {
				key: v.endsWith("%") ? AttrKey.ATK_PERCENT : AttrKey.ATK,
				value: num
			};
		case "防御力":
			return {
				key: v.endsWith("%") ? AttrKey.DEF_PERCENT : AttrKey.DEF,
				value: num
			};
		case "生命值":
			return {
				key: v.endsWith("%") ? AttrKey.HP_PERCENT : AttrKey.HP,
				value: num
			};
		case "暴击率":
			return { key: AttrKey.CRIT_RATE, value: num };
		case "暴击伤害":
			return { key: AttrKey.CRIT_DMG, value: num };
		case "元素充能效率":
			return { key: AttrKey.ENERGY_RECHARGE, value: num };
		case "元素精通":
			return { key: AttrKey.ELEMENTAL_MASTERY, value: num };
		default:
			throw new Error(`未知属性标签：${label}`);
	}
}

export function parseEquipment(raw: RawEntry[]): EquipmentAttrs {
	const lvlIndex = raw.findIndex(([text]) => text.startsWith("+"));

	const level = lvlIndex >= 0 ? parseInt(raw[lvlIndex][0].slice(1)) : null;

	let mainRaw: [string, string] | null = null;
	let subRaws: [string, string][] = [];

	if (level !== null) {
		// 有等级：等级上一条一定是主属性
		if (lvlIndex > 0 && raw[lvlIndex - 1].length === 2) {
			mainRaw = raw[lvlIndex - 1] as [string, string];
		}
		// 等级之后的所有双元素都是副属性
		subRaws = raw
			.slice(lvlIndex + 1)
			.filter(e => e.length === 2) as [string, string][];
	} else {
		// 无等级
		const allAttrs = raw.filter(e => e.length === 2) as [string, string][];
		if (allAttrs.length < 5) {
			// 5 个属性，全当作副属性
			subRaws = allAttrs;
		} else {
			// 2~4 个属性，暂假设第一条是主属性，其余是副属性
			mainRaw = allAttrs.shift() ?? null;
			subRaws = allAttrs;
		}
	}
	const info = [];
	info.push(level ? `等级 ${level}` : "等级未知");
	if (mainRaw) {
		info.push(`主属性 ${mainRaw[0]} ${mainRaw[1]}`);
	}
	if (subRaws.length > 0) {
		subRaws.forEach(([label, val]) => {
			info.push(`${label} ${val}`);
		});
	} else {
		info.push("无副属性");
	}
	return {
		level,
		mainAttr: mainRaw ? parseSingle(mainRaw) : null,
		subAttrs: subRaws.map(parseSingle),
		info: info.join("，")
	};
}

export function equipmentToArray(equipment: EquipmentAttrs): number[] {
	const { subAttrs } = equipment;
	const arr = new Array(10).fill(0);
	for (const { key, value } of subAttrs) {
		const rate = value / AttrBasis[key];
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
