import { hasPercentValue, type AttrKey, type EquipmentAttrs } from "./ArtifactUtils";


export interface MonaEquipment {
	setName: string; // 套装名称
	position: string; // 位置名称
	mainTag: MonaEquipmentAttrs; // 主属性标签
	normalTags: MonaEquipmentAttrs[]; // 副属性标签
	omit: boolean;
	level: number; // 等级
	equip: string;
}

interface MonaEquipmentAttrs {
	name: string; // 词条
	value: number; // 套装数值
}

const MonaAttrName = [
	"lifeStatic",
	"lifePercentage",
	"attackStatic",
	"attackPercentage",
	"defendStatic",
	"defendPercentage",
	"critical",
	"criticalDamage",
	"elementalMastery",
	"recharge",
];

export function convertMonaToEquipment(mona: any): EquipmentAttrs {
	const { normalTags, level } = mona;
	const subAttrs = normalTags.map((tag: any) => {
		const key = MonaAttrName.indexOf(tag.name) as AttrKey;
		const value = tag.value;
		if (hasPercentValue(key)) {
			return { key, value: value * 100 };
		} else {
			return { key, value };
		}
	});
	return {
		set: null,
		position: null,
		level,
		mainAttr: null,
		subAttrs,
		info: `TODO`,
	};
}