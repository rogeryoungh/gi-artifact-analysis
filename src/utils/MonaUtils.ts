import type { AttrEnum, AttrPair, Equipment, PositionEnum } from "./Artifact";


export interface MonaEquipment {
	setName: string;                  // 套装名称
	position: string;                 // 位置名称
	mainTag: MonaEquipmentAttrs;      // 主属性标签
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
	"windBonus",
	"rockBonus",
	"thunderBonus",
	"dendroBonus",
	"waterBonus",
	"fireBonus",
	"iceBonus",
	"physicalBonus",
	"cureEffect",
];

const MonaPositionName = [
	"flower",
	"feather",
	"sand",
	"cup",
	"head",
]

function convertTagToAttr(tag: MonaEquipmentAttrs): AttrPair {
	const key = MonaAttrName.indexOf(tag.name) as AttrEnum;
	const value = tag.value;
	return { key, value };
}

function convertPositionToEnum(position: string): PositionEnum {
	const index = MonaPositionName.indexOf(position);
	return index as PositionEnum;
}


export function convertMonaToEquipment(mona: any): Equipment {
	const { position, mainTag, normalTags, level } = mona;
	return {
		set: null,
		position: convertPositionToEnum(position),
		level,
		mainAttr: convertTagToAttr(mainTag),
		subAttrs: normalTags.map(convertTagToAttr),
	};
}
