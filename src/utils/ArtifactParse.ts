import type { OcrResult } from "../services/OcrService";
import { AttrEnum, type Equipment, type AttrPair } from "./Artifact";
import type { Box } from "./Box";

type RawEntry = [string] | [string, string];

function checkVerticalOverlapRate(box1: Box, box2: Box) {
	const overlapHeight = Math.min(box1.y2, box2.y2) - Math.max(box1.y1, box2.y1);
	if (overlapHeight <= 0) {
		return -1;
	}
	const box1Height = box1.y2 - box1.y1;
	return overlapHeight / box1Height;
}

export function pairAttribute(data: OcrResult[], threshold: number = 0.8): RawEntry[] {
	const sortedData = data.sort((a, b) => a.box.y1 - b.box.y1);

	const n = sortedData.length;
	const paired: boolean[] = new Array(n).fill(false);
	const results: RawEntry[] = [];

	const startWithNumber = /^\d/;

	for (let i = 0; i < n; i++) {
		if (paired[i]) continue;
		const current = sortedData[i];
		if (current.text.match(startWithNumber)) {
			continue;
		}
		paired[i] = true;
		if (current.text.startsWith('+')) {
			results.push([current.text]);
		} else if (current.text.indexOf('+') > 0) {
			const [k, v] = current.text.split('+', 2);
			results.push([k, v]);
		} else {
			let k = -1;
			for (let j = 0; j < n; j++) {
				if (j === i || paired[j]) continue;
				const next = sortedData[j];
				const overlapRate = checkVerticalOverlapRate(current.box, next.box);
				if (overlapRate > threshold) {
					if (k < 0 || next.box.x1 >= sortedData[k].box.x1) {
						k = j;
					}
				}
			}
			if (k >= 0) {
				paired[k] = true;
				const next = sortedData[k];
				if (current.text !== "" && next.text !== "") {
					results.push([current.text, next.text]);
				}
			}
		}
	}
	return results;
}

function parseSingle([label, val]: [string, string]): AttrPair {
	// 去掉可能的空格
	const v = val.trim();
	const num = parseFloat(v.replace("%", ""));
	const hasPercent = v.endsWith("%");
	const value = hasPercent ? num / 100 : num;

	switch (label) {
		case "攻击力":
			return {
				key: hasPercent ? AttrEnum.ATK_PERCENT : AttrEnum.ATK,
				value
			};
		case "防御力":
			return {
				key: hasPercent ? AttrEnum.DEF_PERCENT : AttrEnum.DEF,
				value
			};
		case "生命值":
			return {
				key: hasPercent ? AttrEnum.HP_PERCENT : AttrEnum.HP,
				value
			};
		case "暴击率":
			return { key: AttrEnum.CRIT_RATE, value };
		case "暴击伤害":
			return { key: AttrEnum.CRIT_DMG, value };
		case "元素充能效率":
			return { key: AttrEnum.ENERGY_RECHARGE, value };
		case "元素精通":
			return { key: AttrEnum.ELEMENTAL_MASTERY, value };
		case "风元素伤害加成":
			return { key: AttrEnum.ANEMO_BONUS, value };
		case "岩元素伤害加成":
			return { key: AttrEnum.GEO_BONUS, value };
		case "雷元素伤害加成":
			return { key: AttrEnum.ELECTRO_BONUS, value };
		case "草元素伤害加成":
			return { key: AttrEnum.DENDRO_BONUS, value };
		case "水元素伤害加成":
			return { key: AttrEnum.HYDRO_BONUS, value };
		case "火元素伤害加成":
			return { key: AttrEnum.PYRO_BONUS, value };
		case "冰元素伤害加成":
			return { key: AttrEnum.CRYO_BONUS, value };
		case "物理伤害加成":
			return { key: AttrEnum.PHYSICAL_BONUS, value };
		case "治疗加成":
			return { key: AttrEnum.HEALING_BONUS, value };
		default:
			throw new Error(`未知属性标签：${label}`);
	}
}

export function parseEquipment(raw: RawEntry[]): Equipment {
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
		const allAttrs = raw
			.slice(lvlIndex + 1)
			.filter(e => e.length === 2) as [string, string][];
		if (allAttrs.length < 5) {
			// 5 个属性，全当作副属性
			subRaws = allAttrs;
		} else {
			// 2~4 个属性，暂假设第一条是主属性，其余是副属性
			mainRaw = allAttrs.shift() ?? null;
			subRaws = allAttrs;
		}
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
	return {
		setName: null,
		position: null,
		level,
		mainAttr: mainRaw ? parseSingle(mainRaw) : null,
		subAttrs: subRaws.map(parseSingle),
	};
}
