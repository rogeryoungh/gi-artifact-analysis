import type { AttrEnum, AttrPair, Equipment, PositionEnum } from "./Artifact";
import MonaData from "./MonaData";

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

function convertSetNameToChs(setName: string): string {
	const map = Object.entries(MonaData);
	const res = map.find(([key, _]) => key === setName);
	if (res) {
		return res[1].nameLocale;
	} else {
		return setName;
	}
}

export function getSetNameChsDisplay(): { name: string, img: string }[] {
	const map = Object.entries(MonaData);
	const res = map.map(([_, value]) => {
		return {name: value.nameLocale, img: value.head.url };
	});
	return res;
}


export function convertMonaToEquipment(mona: any): Equipment {
	const { setName, position, mainTag, normalTags, level } = mona;
	return {
		setName: convertSetNameToChs(setName),
		position: convertPositionToEnum(position),
		level,
		mainAttr: convertTagToAttr(mainTag),
		subAttrs: normalTags.map(convertTagToAttr),
	};
}
