// build from https://github.com/wormtql/genshin_artifact/blob/main/mona_generate/output/_gen_artifact.js

const template = "https://upload-bbs.mihoyo.com/game_record/genshin/equip/#.png"
const newTemplate = "https://act-webstatic.mihoyo.com/hk4e/e20200928calculate/item_icon_u9b0pg/#.png"
const getIcon = (name: string) => template.replace("#", name)
const getHash = (hash: string) => newTemplate.replace("#", hash)

export default {
    
    "adventurer": {
        eng: "adventurer",
        name2: "Adventurer",
        nameLocale: "冒险家",
        minStar: 1,
        maxStar: 3,
    
    effect2: 1603,
    
    effect4: 761,
    

        flower: {
            text: 317,
            url: getIcon("UI_RelicIcon_10010_4")
            },
        feather: {
            text: 319,
            url: getIcon("UI_RelicIcon_10010_2")
            },
        sand: {
            text: 320,
            url: getIcon("UI_RelicIcon_10010_5")
            },
        cup: {
            text: 321,
            url: getIcon("UI_RelicIcon_10010_1")
            },
        head: {
            text: 318,
            url: getIcon("UI_RelicIcon_10010_3")
            },
        config4: [
            
        ],
        config2: [
            
        ],
    },
    
    "archaicPetra": {
        eng: "archaicPetra",
        name2: "ArchaicPetra",
        nameLocale: "悠古的磐岩",
        minStar: 4,
        maxStar: 5,
    
    effect2: 1861,
    
    effect4: 1876,
    

        flower: {
            text: 1683,
            url: getIcon("UI_RelicIcon_15014_4")
            },
        feather: {
            text: 724,
            url: getIcon("UI_RelicIcon_15014_2")
            },
        sand: {
            text: 1019,
            url: getIcon("UI_RelicIcon_15014_5")
            },
        cup: {
            text: 725,
            url: getIcon("UI_RelicIcon_15014_1")
            },
        head: {
            text: 129,
            url: getIcon("UI_RelicIcon_15014_3")
            },
        config4: [
            
            {"default":"Electro","name":"element","title":238,"type":"element4"},
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate","title":931,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "berserker": {
        eng: "berserker",
        name2: "Berserker",
        nameLocale: "战狂",
        minStar: 3,
        maxStar: 4,
    
    effect2: 1223,
    
    effect4: 1608,
    

        flower: {
            text: 811,
            url: getIcon("UI_RelicIcon_10005_4")
            },
        feather: {
            text: 810,
            url: getIcon("UI_RelicIcon_10005_2")
            },
        sand: {
            text: 809,
            url: getIcon("UI_RelicIcon_10005_5")
            },
        cup: {
            text: 812,
            url: getIcon("UI_RelicIcon_10005_1")
            },
        head: {
            text: 813,
            url: getIcon("UI_RelicIcon_10005_3")
            },
        config4: [
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate","title":931,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "blizzardStrayer": {
        eng: "blizzardStrayer",
        name2: "BlizzardStrayer",
        nameLocale: "冰风迷途的勇士",
        minStar: 4,
        maxStar: 5,
    
    effect2: 1860,
    
    effect4: 908,
    

        flower: {
            text: 427,
            url: getIcon("UI_RelicIcon_14001_4")
            },
        feather: {
            text: 880,
            url: getIcon("UI_RelicIcon_14001_2")
            },
        sand: {
            text: 334,
            url: getIcon("UI_RelicIcon_14001_5")
            },
        cup: {
            text: 2103,
            url: getIcon("UI_RelicIcon_14001_1")
            },
        head: {
            text: 1675,
            url: getIcon("UI_RelicIcon_14001_3")
            },
        config4: [
            
            {"default":0.0,"max":0.4,"min":0.0,"name":"critical_bonus","title":1739,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "bloodstainedChivalry": {
        eng: "bloodstainedChivalry",
        name2: "BloodstainedChivalry",
        nameLocale: "染血的骑士道",
        minStar: 4,
        maxStar: 5,
    
    effect2: 2099,
    
    effect4: 360,
    

        flower: {
            text: 1296,
            url: getIcon("UI_RelicIcon_15008_4")
            },
        feather: {
            text: 1299,
            url: getIcon("UI_RelicIcon_15008_2")
            },
        sand: {
            text: 2332,
            url: getIcon("UI_RelicIcon_15008_5")
            },
        cup: {
            text: 1300,
            url: getIcon("UI_RelicIcon_15008_1")
            },
        head: {
            text: 1297,
            url: getIcon("UI_RelicIcon_15008_3")
            },
        config4: [
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate","title":931,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "braveHeart": {
        eng: "braveHeart",
        name2: "BraveHeart",
        nameLocale: "勇士之心",
        minStar: 3,
        maxStar: 4,
    
    effect2: 896,
    
    effect4: 703,
    

        flower: {
            text: 388,
            url: getIcon("UI_RelicIcon_10002_4")
            },
        feather: {
            text: 391,
            url: getIcon("UI_RelicIcon_10002_2")
            },
        sand: {
            text: 389,
            url: getIcon("UI_RelicIcon_10002_5")
            },
        cup: {
            text: 390,
            url: getIcon("UI_RelicIcon_10002_1")
            },
        head: {
            text: 387,
            url: getIcon("UI_RelicIcon_10002_3")
            },
        config4: [
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate","title":931,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "crimsonWitch": {
        eng: "crimsonWitch",
        name2: "CrimsonWitchOfFlames",
        nameLocale: "炽烈的炎之魔女",
        minStar: 4,
        maxStar: 5,
    
    effect2: 1863,
    
    effect4: 2037,
    

        flower: {
            text: 2340,
            url: getIcon("UI_RelicIcon_15006_4")
            },
        feather: {
            text: 2338,
            url: getIcon("UI_RelicIcon_15006_2")
            },
        sand: {
            text: 2341,
            url: getIcon("UI_RelicIcon_15006_5")
            },
        cup: {
            text: 2339,
            url: getIcon("UI_RelicIcon_15006_1")
            },
        head: {
            text: 1508,
            url: getIcon("UI_RelicIcon_15006_3")
            },
        config4: [
            
            {"default":0.0,"max":3.0,"min":0.0,"name":"level","title":932,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "DeepwoodMemories": {
        eng: "DeepwoodMemories",
        name2: "DeepwoodMemories",
        nameLocale: "深林的记忆",
        minStar: 4,
        maxStar: 5,
    
    effect2: 1864,
    
    effect4: 263,
    

        flower: {
            text: 2085,
            url: getIcon("UI_RelicIcon_15025_4")
            },
        feather: {
            text: 1794,
            url: getIcon("UI_RelicIcon_15025_2")
            },
        sand: {
            text: 2010,
            url: getIcon("UI_RelicIcon_15025_5")
            },
        cup: {
            text: 2086,
            url: getIcon("UI_RelicIcon_15025_1")
            },
        head: {
            text: 1266,
            url: getIcon("UI_RelicIcon_15025_3")
            },
        config4: [
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate","title":931,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "defenderWill": {
        eng: "defenderWill",
        name2: "DefendersWill",
        nameLocale: "守护之心",
        minStar: 3,
        maxStar: 4,
    
    effect2: 2204,
    
    effect4: 2196,
    

        flower: {
            text: 663,
            url: getIcon("UI_RelicIcon_10003_4")
            },
        feather: {
            text: 665,
            url: getIcon("UI_RelicIcon_10003_2")
            },
        sand: {
            text: 664,
            url: getIcon("UI_RelicIcon_10003_5")
            },
        cup: {
            text: 662,
            url: getIcon("UI_RelicIcon_10003_1")
            },
        head: {
            text: 666,
            url: getIcon("UI_RelicIcon_10003_3")
            },
        config4: [
            
        ],
        config2: [
            
        ],
    },
    
    "EchoesOfAnOffering": {
        eng: "EchoesOfAnOffering",
        name2: "EchoesOfAnOffering",
        nameLocale: "来歆余响",
        minStar: 4,
        maxStar: 5,
    
    effect2: 896,
    
    effect4: 1154,
    

        flower: {
            text: 2335,
            url: getIcon("UI_RelicIcon_15024_4")
            },
        feather: {
            text: 539,
            url: getIcon("UI_RelicIcon_15024_2")
            },
        sand: {
            text: 1686,
            url: getIcon("UI_RelicIcon_15024_5")
            },
        cup: {
            text: 1406,
            url: getIcon("UI_RelicIcon_15024_1")
            },
        head: {
            text: 1397,
            url: getIcon("UI_RelicIcon_15024_3")
            },
        config4: [
            
            {"default":0.5053283764473575,"max":1.0,"min":0.0,"name":"rate","title":740,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "emblemOfSeveredFate": {
        eng: "emblemOfSeveredFate",
        name2: "EmblemOfSeveredFate",
        nameLocale: "绝缘之旗印",
        minStar: 4,
        maxStar: 5,
    
    effect2: 242,
    
    effect4: 545,
    

        flower: {
            text: 1005,
            url: getIcon("UI_RelicIcon_15020_4")
            },
        feather: {
            text: 372,
            url: getIcon("UI_RelicIcon_15020_2")
            },
        sand: {
            text: 2233,
            url: getIcon("UI_RelicIcon_15020_5")
            },
        cup: {
            text: 1773,
            url: getIcon("UI_RelicIcon_15020_1")
            },
        head: {
            text: 412,
            url: getIcon("UI_RelicIcon_15020_3")
            },
        config4: [
            
        ],
        config2: [
            
        ],
    },
    
    "FlowerOfParadiseLost": {
        eng: "FlowerOfParadiseLost",
        name2: "FlowerOfParadiseLost",
        nameLocale: "乐园遗落之花",
        minStar: 4,
        maxStar: 5,
    
    effect2: 285,
    
    effect4: 1943,
    

        flower: {
            text: 1265,
            url: getIcon("UI_RelicIcon_15028_4")
            },
        feather: {
            text: 2005,
            url: getIcon("UI_RelicIcon_15028_2")
            },
        sand: {
            text: 353,
            url: getIcon("UI_RelicIcon_15028_5")
            },
        cup: {
            text: 667,
            url: getIcon("UI_RelicIcon_15028_1")
            },
        head: {
            text: 1753,
            url: getIcon("UI_RelicIcon_15028_3")
            },
        config4: [
            
            {"default":4.0,"max":4.0,"min":0.0,"name":"stack","title":932,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "gambler": {
        eng: "gambler",
        name2: "Gambler",
        nameLocale: "赌徒",
        minStar: 3,
        maxStar: 4,
    
    effect2: 269,
    
    effect4: 365,
    

        flower: {
            text: 2022,
            url: getIcon("UI_RelicIcon_10008_4")
            },
        feather: {
            text: 2020,
            url: getIcon("UI_RelicIcon_10008_2")
            },
        sand: {
            text: 2019,
            url: getIcon("UI_RelicIcon_10008_5")
            },
        cup: {
            text: 2023,
            url: getIcon("UI_RelicIcon_10008_1")
            },
        head: {
            text: 2021,
            url: getIcon("UI_RelicIcon_10008_3")
            },
        config4: [
            
        ],
        config2: [
            
        ],
    },
    
    "DesertPavilionChronicle": {
        eng: "DesertPavilionChronicle",
        name2: "DesertPavilionChronicle",
        nameLocale: "沙上楼阁史话",
        minStar: 4,
        maxStar: 5,
    
    effect2: 1866,
    
    effect4: 2134,
    

        flower: {
            text: 215,
            url: getIcon("UI_RelicIcon_15027_4")
            },
        feather: {
            text: 2366,
            url: getIcon("UI_RelicIcon_15027_2")
            },
        sand: {
            text: 634,
            url: getIcon("UI_RelicIcon_15027_5")
            },
        cup: {
            text: 2087,
            url: getIcon("UI_RelicIcon_15027_1")
            },
        head: {
            text: 1382,
            url: getIcon("UI_RelicIcon_15027_3")
            },
        config4: [
            
            {"default":1.0,"max":1.0,"min":0.0,"name":"rate","title":931,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "GildedDreams": {
        eng: "GildedDreams",
        name2: "GildedDreams",
        nameLocale: "饰金之梦",
        minStar: 4,
        maxStar: 5,
    
    effect2: 284,
    
    effect4: 1976,
    

        flower: {
            text: 1311,
            url: getIcon("UI_RelicIcon_15026_4")
            },
        feather: {
            text: 1930,
            url: getIcon("UI_RelicIcon_15026_2")
            },
        sand: {
            text: 1358,
            url: getIcon("UI_RelicIcon_15026_5")
            },
        cup: {
            text: 643,
            url: getIcon("UI_RelicIcon_15026_1")
            },
        head: {
            text: 1362,
            url: getIcon("UI_RelicIcon_15026_3")
            },
        config4: [
            
            {"default":0,"max":3,"min":0,"name":"same_count","title":462,"type":"int"},
            
            {"default":0,"max":3,"min":0,"name":"diff_count","title":131,"type":"int"},
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate","title":931,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "gladiatorFinale": {
        eng: "gladiatorFinale",
        name2: "GladiatorsFinale",
        nameLocale: "角斗士的终幕礼",
        minStar: 4,
        maxStar: 5,
    
    effect2: 896,
    
    effect4: 1946,
    

        flower: {
            text: 1961,
            url: getIcon("UI_RelicIcon_15001_4")
            },
        feather: {
            text: 1960,
            url: getIcon("UI_RelicIcon_15001_2")
            },
        sand: {
            text: 1959,
            url: getIcon("UI_RelicIcon_15001_5")
            },
        cup: {
            text: 1963,
            url: getIcon("UI_RelicIcon_15001_1")
            },
        head: {
            text: 1958,
            url: getIcon("UI_RelicIcon_15001_3")
            },
        config4: [
            
        ],
        config2: [
            
        ],
    },
    
    "GoldenTroupe": {
        eng: "GoldenTroupe",
        name2: "GoldenTroupe",
        nameLocale: "黄金剧团",
        minStar: 4,
        maxStar: 5,
    
    effect2: 269,
    
    effect4: 270,
    

        flower: {
            text: 2362,
            url: getHash("9c3e75b95befcea2afa110828a2b5679")},
        feather: {
            text: 2367,
            url: getHash("ed99c2a85aca30efdcea7ab2242ac3c1")},
        sand: {
            text: 2365,
            url: getHash("be4fa798584c3e6868a228f7e54cbfde")},
        cup: {
            text: 2361,
            url: getHash("ae3867e36dba71d529520d12491c934e")},
        head: {
            text: 2364,
            url: getHash("45d337eaca981b4b3e00d704f6e11c95")},
        config4: [
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate","title":1918,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "heartOfDepth": {
        eng: "heartOfDepth",
        name2: "HeartOfDepth",
        nameLocale: "沉沦之心",
        minStar: 4,
        maxStar: 5,
    
    effect2: 1862,
    
    effect4: 957,
    

        flower: {
            text: 2309,
            url: getIcon("UI_RelicIcon_15016_4")
            },
        feather: {
            text: 2091,
            url: getIcon("UI_RelicIcon_15016_2")
            },
        sand: {
            text: 538,
            url: getIcon("UI_RelicIcon_15016_5")
            },
        cup: {
            text: 1357,
            url: getIcon("UI_RelicIcon_15016_1")
            },
        head: {
            text: 2109,
            url: getIcon("UI_RelicIcon_15016_3")
            },
        config4: [
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate","title":931,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "huskOfOpulentDreams": {
        eng: "huskOfOpulentDreams",
        name2: "HuskOfOpulentDreams",
        nameLocale: "华馆梦醒形骸记",
        minStar: 4,
        maxStar: 5,
    
    effect2: 2204,
    
    effect4: 1932,
    

        flower: {
            text: 1850,
            url: getIcon("UI_RelicIcon_15021_4")
            },
        feather: {
            text: 413,
            url: getIcon("UI_RelicIcon_15021_2")
            },
        sand: {
            text: 216,
            url: getIcon("UI_RelicIcon_15021_5")
            },
        cup: {
            text: 1320,
            url: getIcon("UI_RelicIcon_15021_1")
            },
        head: {
            text: 776,
            url: getIcon("UI_RelicIcon_15021_3")
            },
        config4: [
            
            {"default":0.0,"max":4.0,"min":0.0,"name":"level","title":76,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "instructor": {
        eng: "instructor",
        name2: "Instructor",
        nameLocale: "教官",
        minStar: 3,
        maxStar: 4,
    
    effect2: 283,
    
    effect4: 1977,
    

        flower: {
            text: 943,
            url: getIcon("UI_RelicIcon_10007_4")
            },
        feather: {
            text: 942,
            url: getIcon("UI_RelicIcon_10007_2")
            },
        sand: {
            text: 941,
            url: getIcon("UI_RelicIcon_10007_5")
            },
        cup: {
            text: 944,
            url: getIcon("UI_RelicIcon_10007_1")
            },
        head: {
            text: 940,
            url: getIcon("UI_RelicIcon_10007_3")
            },
        config4: [
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate","title":931,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "lavaWalker": {
        eng: "lavaWalker",
        name2: "Lavawalker",
        nameLocale: "渡过烈火的贤人",
        minStar: 4,
        maxStar: 5,
    
    effect2: 1465,
    
    effect4: 698,
    

        flower: {
            text: 1417,
            url: getIcon("UI_RelicIcon_14003_4")
            },
        feather: {
            text: 1420,
            url: getIcon("UI_RelicIcon_14003_2")
            },
        sand: {
            text: 1419,
            url: getIcon("UI_RelicIcon_14003_5")
            },
        cup: {
            text: 1421,
            url: getIcon("UI_RelicIcon_14003_1")
            },
        head: {
            text: 1418,
            url: getIcon("UI_RelicIcon_14003_3")
            },
        config4: [
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate","title":935,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "luckyDog": {
        eng: "luckyDog",
        name2: "LuckyDog",
        nameLocale: "幸运儿",
        minStar: 1,
        maxStar: 3,
    
    effect2: 2203,
    
    effect4: 860,
    

        flower: {
            text: 750,
            url: getIcon("UI_RelicIcon_10011_4")
            },
        feather: {
            text: 752,
            url: getIcon("UI_RelicIcon_10011_2")
            },
        sand: {
            text: 749,
            url: getIcon("UI_RelicIcon_10011_5")
            },
        cup: {
            text: 748,
            url: getIcon("UI_RelicIcon_10011_1")
            },
        head: {
            text: 751,
            url: getIcon("UI_RelicIcon_10011_3")
            },
        config4: [
            
        ],
        config2: [
            
        ],
    },
    
    "maidenBeloved": {
        eng: "maidenBeloved",
        name2: "MaidenBeloved",
        nameLocale: "被怜爱的少女",
        minStar: 4,
        maxStar: 5,
    
    effect2: 1970,
    
    effect4: 964,
    

        flower: {
            text: 2070,
            url: getIcon("UI_RelicIcon_14004_4")
            },
        feather: {
            text: 710,
            url: getIcon("UI_RelicIcon_14004_2")
            },
        sand: {
            text: 709,
            url: getIcon("UI_RelicIcon_14004_5")
            },
        cup: {
            text: 708,
            url: getIcon("UI_RelicIcon_14004_1")
            },
        head: {
            text: 707,
            url: getIcon("UI_RelicIcon_14004_3")
            },
        config4: [
            
        ],
        config2: [
            
        ],
    },
    
    "MarechausseeHunter": {
        eng: "MarechausseeHunter",
        name2: "MarechausseeHunter",
        nameLocale: "逐影猎人",
        minStar: 4,
        maxStar: 5,
    
    effect2: 1147,
    
    effect4: 774,
    

        flower: {
            text: 1539,
            url: getHash("7e4df1daa13237119fd5d789b137b427")},
        feather: {
            text: 1282,
            url: getHash("951e55a31658078648386a4917af39ca")},
        sand: {
            text: 1927,
            url: getHash("764fda52bb26c4e84510b8a21d4f036b")},
        cup: {
            text: 2104,
            url: getHash("b613fcca1f28ec0a3f9ee39cffe452cf")},
        head: {
            text: 1798,
            url: getHash("45ae02ac98e0a5863ccf35bba707afac")},
        config4: [
            
            {"default":0.0,"max":3.0,"min":0.0,"name":"stack","title":739,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "martialArtist": {
        eng: "martialArtist",
        name2: "MartialArtist",
        nameLocale: "武人",
        minStar: 3,
        maxStar: 4,
    
    effect2: 1148,
    
    effect4: 958,
    

        flower: {
            text: 1330,
            url: getIcon("UI_RelicIcon_10006_4")
            },
        feather: {
            text: 1331,
            url: getIcon("UI_RelicIcon_10006_2")
            },
        sand: {
            text: 1329,
            url: getIcon("UI_RelicIcon_10006_5")
            },
        cup: {
            text: 1332,
            url: getIcon("UI_RelicIcon_10006_1")
            },
        head: {
            text: 1328,
            url: getIcon("UI_RelicIcon_10006_3")
            },
        config4: [
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate","title":931,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "noblesseOblige": {
        eng: "noblesseOblige",
        name2: "NoblesseOblige",
        nameLocale: "昔日宗室之仪",
        minStar: 4,
        maxStar: 5,
    
    effect2: 275,
    
    effect4: 979,
    

        flower: {
            text: 673,
            url: getIcon("UI_RelicIcon_15007_4")
            },
        feather: {
            text: 672,
            url: getIcon("UI_RelicIcon_15007_2")
            },
        sand: {
            text: 675,
            url: getIcon("UI_RelicIcon_15007_5")
            },
        cup: {
            text: 678,
            url: getIcon("UI_RelicIcon_15007_1")
            },
        head: {
            text: 681,
            url: getIcon("UI_RelicIcon_15007_3")
            },
        config4: [
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate","title":931,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "NymphsDream": {
        eng: "NymphsDream",
        name2: "NymphsDream",
        nameLocale: "水仙之梦",
        minStar: 4,
        maxStar: 5,
    
    effect2: 1862,
    
    effect4: 1138,
    

        flower: {
            text: 988,
            url: getIcon("UI_RelicIcon_15029_4")
            },
        feather: {
            text: 536,
            url: getIcon("UI_RelicIcon_15029_2")
            },
        sand: {
            text: 1345,
            url: getIcon("UI_RelicIcon_15029_5")
            },
        cup: {
            text: 392,
            url: getIcon("UI_RelicIcon_15029_1")
            },
        head: {
            text: 796,
            url: getIcon("UI_RelicIcon_15029_3")
            },
        config4: [
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"w1","title":83,"type":"float"},
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"w2","title":170,"type":"float"},
            
            {"default":1.0,"max":1.0,"min":0.0,"name":"w3","title":108,"type":"float"},
            
            {"default":1.0,"max":1.0,"min":0.0,"name":"rate","title":759,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "oceanHuedClam": {
        eng: "oceanHuedClam",
        name2: "OceanHuedClam",
        nameLocale: "海染砗磲",
        minStar: 4,
        maxStar: 5,
    
    effect2: 1366,
    
    effect4: 1933,
    

        flower: {
            text: 1401,
            url: getIcon("UI_RelicIcon_15022_4")
            },
        feather: {
            text: 1416,
            url: getIcon("UI_RelicIcon_15022_2")
            },
        sand: {
            text: 1719,
            url: getIcon("UI_RelicIcon_15022_5")
            },
        cup: {
            text: 1659,
            url: getIcon("UI_RelicIcon_15022_1")
            },
        head: {
            text: 1404,
            url: getIcon("UI_RelicIcon_15022_3")
            },
        config4: [
            
        ],
        config2: [
            
        ],
    },
    
    "paleFlame": {
        eng: "paleFlame",
        name2: "PaleFlame",
        nameLocale: "苍白之火",
        minStar: 4,
        maxStar: 5,
    
    effect2: 2100,
    
    effect4: 258,
    

        flower: {
            text: 995,
            url: getIcon("UI_RelicIcon_15018_4")
            },
        feather: {
            text: 2009,
            url: getIcon("UI_RelicIcon_15018_2")
            },
        sand: {
            text: 237,
            url: getIcon("UI_RelicIcon_15018_5")
            },
        cup: {
            text: 2035,
            url: getIcon("UI_RelicIcon_15018_1")
            },
        head: {
            text: 505,
            url: getIcon("UI_RelicIcon_15018_3")
            },
        config4: [
            
            {"default":0.0,"max":2.0,"min":0.0,"name":"avg_level","title":920,"type":"float"},
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"full_rate","title":1448,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "prayersForDestiny": {
        eng: "prayersForDestiny",
        name2: "PrayersForDestiny",
        nameLocale: "祭水之人",
        minStar: 3,
        maxStar: 4,
    effect1: 443,
    
    
    
    

        
        
        
        
        head: {
            text: 1709,
            url: getIcon("UI_RelicIcon_15010_3")
            },
        config4: [
            
        ],
        config2: [
            
        ],
    },
    
    "prayersForIllumination": {
        eng: "prayersForIllumination",
        name2: "PrayersForIllumination",
        nameLocale: "祭火之人",
        minStar: 3,
        maxStar: 4,
    effect1: 444,
    
    
    
    

        
        
        
        
        head: {
            text: 1711,
            url: getIcon("UI_RelicIcon_15009_3")
            },
        config4: [
            
        ],
        config2: [
            
        ],
    },
    
    "prayersForWisdom": {
        eng: "prayersForWisdom",
        name2: "PrayersForWisdom",
        nameLocale: "祭雷之人",
        minStar: 3,
        maxStar: 4,
    effect1: 445,
    
    
    
    

        
        
        
        
        head: {
            text: 1717,
            url: getIcon("UI_RelicIcon_15011_3")
            },
        config4: [
            
        ],
        config2: [
            
        ],
    },
    
    "prayersToSpringtime": {
        eng: "prayersToSpringtime",
        name2: "PrayersToSpringtime",
        nameLocale: "祭冰之人",
        minStar: 3,
        maxStar: 4,
    effect1: 442,
    
    
    
    

        
        
        
        
        head: {
            text: 1706,
            url: getIcon("UI_RelicIcon_15013_3")
            },
        config4: [
            
        ],
        config2: [
            
        ],
    },
    
    "resolutionOfSojourner": {
        eng: "resolutionOfSojourner",
        name2: "ResolutionOfSojourner",
        nameLocale: "行者之心",
        minStar: 3,
        maxStar: 4,
    
    effect2: 896,
    
    effect4: 2138,
    

        flower: {
            text: 913,
            url: getIcon("UI_RelicIcon_10001_4")
            },
        feather: {
            text: 773,
            url: getIcon("UI_RelicIcon_10001_2")
            },
        sand: {
            text: 2094,
            url: getIcon("UI_RelicIcon_10001_5")
            },
        cup: {
            text: 764,
            url: getIcon("UI_RelicIcon_10001_1")
            },
        head: {
            text: 803,
            url: getIcon("UI_RelicIcon_10001_3")
            },
        config4: [
            
        ],
        config2: [
            
        ],
    },
    
    "retracingBolide": {
        eng: "retracingBolide",
        name2: "RetracingBolide",
        nameLocale: "逆飞的流星",
        minStar: 4,
        maxStar: 5,
    
    effect2: 854,
    
    effect4: 557,
    

        flower: {
            text: 564,
            url: getIcon("UI_RelicIcon_15015_4")
            },
        feather: {
            text: 567,
            url: getIcon("UI_RelicIcon_15015_2")
            },
        sand: {
            text: 563,
            url: getIcon("UI_RelicIcon_15015_5")
            },
        cup: {
            text: 566,
            url: getIcon("UI_RelicIcon_15015_1")
            },
        head: {
            text: 565,
            url: getIcon("UI_RelicIcon_15015_3")
            },
        config4: [
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate","title":856,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "scholar": {
        eng: "scholar",
        name2: "Scholar",
        nameLocale: "学士",
        minStar: 3,
        maxStar: 4,
    
    effect2: 242,
    
    effect4: 1873,
    

        flower: {
            text: 655,
            url: getIcon("UI_RelicIcon_10012_4")
            },
        feather: {
            text: 658,
            url: getIcon("UI_RelicIcon_10012_2")
            },
        sand: {
            text: 657,
            url: getIcon("UI_RelicIcon_10012_5")
            },
        cup: {
            text: 656,
            url: getIcon("UI_RelicIcon_10012_1")
            },
        head: {
            text: 659,
            url: getIcon("UI_RelicIcon_10012_3")
            },
        config4: [
            
        ],
        config2: [
            
        ],
    },
    
    "shimenawaReminiscence": {
        eng: "shimenawaReminiscence",
        name2: "ShimenawasReminiscence",
        nameLocale: "追忆之注连",
        minStar: 4,
        maxStar: 5,
    
    effect2: 896,
    
    effect4: 966,
    

        flower: {
            text: 1785,
            url: getIcon("UI_RelicIcon_15019_4")
            },
        feather: {
            text: 787,
            url: getIcon("UI_RelicIcon_15019_2")
            },
        sand: {
            text: 1270,
            url: getIcon("UI_RelicIcon_15019_5")
            },
        cup: {
            text: 1685,
            url: getIcon("UI_RelicIcon_15019_1")
            },
        head: {
            text: 997,
            url: getIcon("UI_RelicIcon_15019_3")
            },
        config4: [
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate","title":931,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "tenacityOfTheMillelith": {
        eng: "tenacityOfTheMillelith",
        name2: "TenacityOfTheMillelith",
        nameLocale: "千岩牢固",
        minStar: 4,
        maxStar: 5,
    
    effect2: 1612,
    
    effect4: 257,
    

        flower: {
            text: 393,
            url: getIcon("UI_RelicIcon_15017_4")
            },
        feather: {
            text: 1024,
            url: getIcon("UI_RelicIcon_15017_2")
            },
        sand: {
            text: 2146,
            url: getIcon("UI_RelicIcon_15017_5")
            },
        cup: {
            text: 1656,
            url: getIcon("UI_RelicIcon_15017_1")
            },
        head: {
            text: 705,
            url: getIcon("UI_RelicIcon_15017_3")
            },
        config4: [
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate","title":931,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "exile": {
        eng: "exile",
        name2: "TheExile",
        nameLocale: "流放者",
        minStar: 3,
        maxStar: 4,
    
    effect2: 242,
    
    effect4: 978,
    

        flower: {
            text: 1378,
            url: getIcon("UI_RelicIcon_10009_4")
            },
        feather: {
            text: 1377,
            url: getIcon("UI_RelicIcon_10009_2")
            },
        sand: {
            text: 1380,
            url: getIcon("UI_RelicIcon_10009_5")
            },
        cup: {
            text: 1376,
            url: getIcon("UI_RelicIcon_10009_1")
            },
        head: {
            text: 1379,
            url: getIcon("UI_RelicIcon_10009_3")
            },
        config4: [
            
        ],
        config2: [
            
        ],
    },
    
    "thunderingFury": {
        eng: "thunderingFury",
        name2: "ThunderingFury",
        nameLocale: "如雷的盛怒",
        minStar: 4,
        maxStar: 5,
    
    effect2: 1865,
    
    effect4: 2036,
    

        flower: {
            text: 2255,
            url: getIcon("UI_RelicIcon_15005_4")
            },
        feather: {
            text: 2244,
            url: getIcon("UI_RelicIcon_15005_2")
            },
        sand: {
            text: 2253,
            url: getIcon("UI_RelicIcon_15005_5")
            },
        cup: {
            text: 2226,
            url: getIcon("UI_RelicIcon_15005_1")
            },
        head: {
            text: 501,
            url: getIcon("UI_RelicIcon_15005_3")
            },
        config4: [
            
        ],
        config2: [
            
        ],
    },
    
    "thunderSmoother": {
        eng: "thunderSmoother",
        name2: "Thundersoother",
        nameLocale: "平息鸣雷的尊者",
        minStar: 4,
        maxStar: 5,
    
    effect2: 2236,
    
    effect4: 701,
    

        flower: {
            text: 745,
            url: getIcon("UI_RelicIcon_14002_4")
            },
        feather: {
            text: 746,
            url: getIcon("UI_RelicIcon_14002_2")
            },
        sand: {
            text: 743,
            url: getIcon("UI_RelicIcon_14002_5")
            },
        cup: {
            text: 744,
            url: getIcon("UI_RelicIcon_14002_1")
            },
        head: {
            text: 742,
            url: getIcon("UI_RelicIcon_14002_3")
            },
        config4: [
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate","title":937,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "tinyMiracle": {
        eng: "tinyMiracle",
        name2: "TinyMiracle",
        nameLocale: "奇迹",
        minStar: 3,
        maxStar: 4,
    
    effect2: 814,
    
    effect4: 436,
    

        flower: {
            text: 639,
            url: getIcon("UI_RelicIcon_10004_4")
            },
        feather: {
            text: 638,
            url: getIcon("UI_RelicIcon_10004_2")
            },
        sand: {
            text: 637,
            url: getIcon("UI_RelicIcon_10004_5")
            },
        cup: {
            text: 636,
            url: getIcon("UI_RelicIcon_10004_1")
            },
        head: {
            text: 640,
            url: getIcon("UI_RelicIcon_10004_3")
            },
        config4: [
            
        ],
        config2: [
            
        ],
    },
    
    "travelingDoctor": {
        eng: "travelingDoctor",
        name2: "TravelingDoctor",
        nameLocale: "游医",
        minStar: 1,
        maxStar: 3,
    
    effect2: 1964,
    
    effect4: 982,
    

        flower: {
            text: 1434,
            url: getIcon("UI_RelicIcon_10013_4")
            },
        feather: {
            text: 1432,
            url: getIcon("UI_RelicIcon_10013_2")
            },
        sand: {
            text: 1430,
            url: getIcon("UI_RelicIcon_10013_5")
            },
        cup: {
            text: 1433,
            url: getIcon("UI_RelicIcon_10013_1")
            },
        head: {
            text: 1431,
            url: getIcon("UI_RelicIcon_10013_3")
            },
        config4: [
            
        ],
        config2: [
            
        ],
    },
    
    "VermillionHereafter": {
        eng: "VermillionHereafter",
        name2: "VermillionHereafter",
        nameLocale: "辰砂往生录",
        minStar: 4,
        maxStar: 5,
    
    effect2: 896,
    
    effect4: 976,
    

        flower: {
            text: 1625,
            url: getIcon("UI_RelicIcon_15023_4")
            },
        feather: {
            text: 1454,
            url: getIcon("UI_RelicIcon_15023_2")
            },
        sand: {
            text: 2208,
            url: getIcon("UI_RelicIcon_15023_5")
            },
        cup: {
            text: 1767,
            url: getIcon("UI_RelicIcon_15023_1")
            },
        head: {
            text: 1895,
            url: getIcon("UI_RelicIcon_15023_3")
            },
        config4: [
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate_q","title":278,"type":"float"},
            
            {"default":0.0,"max":4.0,"min":0.0,"name":"stack","title":739,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "viridescentVenerer": {
        eng: "viridescentVenerer",
        name2: "ViridescentVenerer",
        nameLocale: "翠绿之影",
        minStar: 4,
        maxStar: 5,
    
    effect2: 1866,
    
    effect4: 826,
    

        flower: {
            text: 2144,
            url: getIcon("UI_RelicIcon_15002_4")
            },
        feather: {
            text: 1540,
            url: getIcon("UI_RelicIcon_15002_2")
            },
        sand: {
            text: 1792,
            url: getIcon("UI_RelicIcon_15002_5")
            },
        cup: {
            text: 1791,
            url: getIcon("UI_RelicIcon_15002_1")
            },
        head: {
            text: 1793,
            url: getIcon("UI_RelicIcon_15002_3")
            },
        config4: [
            
        ],
        config2: [
            
        ],
    },
    
    "VourukashasGlow": {
        eng: "VourukashasGlow",
        name2: "VourukashasGlow",
        nameLocale: "花海甘露之光",
        minStar: 4,
        maxStar: 5,
    
    effect2: 1613,
    
    effect4: 251,
    

        flower: {
            text: 1472,
            url: getIcon("UI_RelicIcon_15030_4")
            },
        feather: {
            text: 1578,
            url: getIcon("UI_RelicIcon_15030_2")
            },
        sand: {
            text: 147,
            url: getIcon("UI_RelicIcon_15030_5")
            },
        cup: {
            text: 1000,
            url: getIcon("UI_RelicIcon_15030_1")
            },
        head: {
            text: 1471,
            url: getIcon("UI_RelicIcon_15030_3")
            },
        config4: [
            
            {"default":4.0,"max":5.0,"min":0.0,"name":"stack","title":738,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "wandererTroupe": {
        eng: "wandererTroupe",
        name2: "WanderersTroupe",
        nameLocale: "流浪大地的乐团",
        minStar: 4,
        maxStar: 5,
    
    effect2: 283,
    
    effect4: 1947,
    

        flower: {
            text: 149,
            url: getIcon("UI_RelicIcon_15003_4")
            },
        feather: {
            text: 1584,
            url: getIcon("UI_RelicIcon_15003_2")
            },
        sand: {
            text: 1763,
            url: getIcon("UI_RelicIcon_15003_5")
            },
        cup: {
            text: 465,
            url: getIcon("UI_RelicIcon_15003_1")
            },
        head: {
            text: 871,
            url: getIcon("UI_RelicIcon_15003_3")
            },
        config4: [
            
        ],
        config2: [
            
        ],
    },
    
    "SongOfDaysPast": {
        eng: "SongOfDaysPast",
        name2: "SongOfDaysPast",
        nameLocale: "昔时之歌",
        minStar: 4,
        maxStar: 5,
    
    effect2: 1366,
    
    effect4: 1938,
    

        flower: {
            text: 1013,
            url: getHash("02b777d53c28acf5c25efe0c079b0e51")},
        feather: {
            text: 1012,
            url: getHash("b85d969818f94125ec020bb04c697bcf")},
        sand: {
            text: 1010,
            url: getHash("92822eee6aef16124898cd1a2d796fc8")},
        cup: {
            text: 1011,
            url: getHash("d905b2caa4ade21a0312a38b0a565a7c")},
        head: {
            text: 1009,
            url: getHash("8956afdebb6dbd994b881d3a3b4527cc")},
        config4: [
            
            {"default":0,"max":15000,"min":0,"name":"regeneration","title":1610,"type":"int"},
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate","title":1920,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "NighttimeWhispersInTheEchoingWoods": {
        eng: "NighttimeWhispersInTheEchoingWoods",
        name2: "NighttimeWhispersInTheEchoingWoods",
        nameLocale: "回声之林夜话",
        minStar: 4,
        maxStar: 5,
    
    effect2: 896,
    
    effect4: 956,
    

        flower: {
            text: 999,
            url: getHash("18b4d9a2f4f3c3c31811879e2e61a11b")},
        feather: {
            text: 1993,
            url: getHash("117cb2fbd79f19aa84ec4798eceea2fb")},
        sand: {
            text: 786,
            url: getHash("97a19394aa477d8812b6ad3b6f29c650")},
        cup: {
            text: 806,
            url: getHash("8697bbf7ae136b67a19797803e3b62ac")},
        head: {
            text: 805,
            url: getHash("ee73f8b13beb3b539593644541dd30ec")},
        config4: [
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate1","title":790,"type":"float"},
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate2","title":855,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "FragmentOfHarmonicWhimsy": {
        eng: "FragmentOfHarmonicWhimsy",
        name2: "FragmentOfHarmonicWhimsy",
        nameLocale: "谐律异想断章",
        minStar: 4,
        maxStar: 5,
    
    effect2: 897,
    
    effect4: 1598,
    

        flower: {
            text: 2001,
            url: getHash("08b16dee4e1e04e13ed33258a34b893a")},
        feather: {
            text: 452,
            url: getHash("dfb10d691bffc51c66ac3ccbfb35cce1")},
        sand: {
            text: 498,
            url: getHash("074052fa955b62bdaf9435b5fde93fd8")},
        cup: {
            text: 1479,
            url: getHash("6df7f8173e5869e349eb43d3dd1f72bd")},
        head: {
            text: 765,
            url: getHash("2a21972e9b89f504c7444fb4a439d9b6")},
        config4: [
            
            {"default":0.0,"max":3.0,"min":0.0,"name":"level","title":1917,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "UnfinishedReverie": {
        eng: "UnfinishedReverie",
        name2: "UnfinishedReverie",
        nameLocale: "未竟的遐思",
        minStar: 4,
        maxStar: 5,
    
    effect2: 897,
    
    effect4: 1809,
    

        flower: {
            text: 1210,
            url: getHash("4feb283bbc23e58e9265e18b371c467a")},
        feather: {
            text: 1949,
            url: getHash("33e4aefc97fdff22388249565e0d996e")},
        sand: {
            text: 144,
            url: getHash("05300f93fe8cddc4973950f6806e1adb")},
        cup: {
            text: 1741,
            url: getHash("9e301f350df51d3360e109e771d44534")},
        head: {
            text: 633,
            url: getHash("6932025ba8b59e2c531441a00c08b572")},
        config4: [
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate","title":1922,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "ScrollOfTheHeroOfCinderCity": {
        eng: "ScrollOfTheHeroOfCinderCity",
        name2: "ScrollOfTheHeroOfCinderCity",
        nameLocale: "烬城勇者绘卷",
        minStar: 4,
        maxStar: 5,
    
    effect2: 2189,
    
    effect4: 1945,
    

        flower: {
            text: 2320,
            url: getHash("07398d19576ee60535eb7552c943e738")},
        feather: {
            text: 726,
            url: getHash("30c45b49df7b7f2fdeeded5514b10fd9")},
        sand: {
            text: 1724,
            url: getHash("dc8f3d29e46ac5c5fca3cc03ea240db1")},
        cup: {
            text: 1435,
            url: getHash("8c3542654bd72a5f27030508d7917a6e")},
        head: {
            text: 2343,
            url: getHash("daf989272d20ab0411b5408f8504a394")},
        config4: [
            
            {"default":[],"name":"elements","title":239,"type":"element8multi"},
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate1","title":917,"type":"float"},
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate2","title":921,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "ObsidianCodex": {
        eng: "ObsidianCodex",
        name2: "ObsidianCodex",
        nameLocale: "黑曜秘典",
        minStar: 4,
        maxStar: 5,
    
    effect2: 1937,
    
    effect4: 1936,
    

        flower: {
            text: 766,
            url: getHash("e9c42c8132bc360bf465d5f45a5a3dc0")},
        feather: {
            text: 1480,
            url: getHash("15dfd957828fdfa880424238059b6574")},
        sand: {
            text: 578,
            url: getHash("74684390899b5f05c1648b9404f6d7a2")},
        cup: {
            text: 1760,
            url: getHash("5f0b9ae4663323fa3a448c406cbbb112")},
        head: {
            text: 1996,
            url: getHash("29b282b1b9bbe082874fb943aab6a405")},
        config4: [
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"set4_rate","title":509,"type":"float"},
            
        ],
        config2: [
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"set2_rate","title":165,"type":"float"},
            
        ],
    },
    
    "LongNightsOath": {
        eng: "LongNightsOath",
        name2: "LongNightsOath",
        nameLocale: "长夜之誓",
        minStar: 4,
        maxStar: 5,
    
    effect2: 125,
    
    effect4: 1939,
    

        flower: {
            text: 823,
            url: getIcon("UI_RelicIcon_15039_4")
            },
        feather: {
            text: 582,
            url: getIcon("UI_RelicIcon_15039_2")
            },
        sand: {
            text: 133,
            url: getIcon("UI_RelicIcon_15039_5")
            },
        cup: {
            text: 1275,
            url: getIcon("UI_RelicIcon_15039_1")
            },
        head: {
            text: 1926,
            url: getIcon("UI_RelicIcon_15039_3")
            },
        config4: [
            
            {"default":0.0,"max":5.0,"min":0.0,"name":"level","title":713,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
    "FinaleOfTheDeepGalleries": {
        eng: "FinaleOfTheDeepGalleries",
        name2: "FinaleOfTheDeepGalleries",
        nameLocale: "深廊终曲",
        minStar: 4,
        maxStar: 5,
    
    effect2: 1860,
    
    effect4: 1940,
    

        flower: {
            text: 1407,
            url: getIcon("UI_RelicIcon_15040_4")
            },
        feather: {
            text: 1409,
            url: getIcon("UI_RelicIcon_15040_2")
            },
        sand: {
            text: 1408,
            url: getIcon("UI_RelicIcon_15040_5")
            },
        cup: {
            text: 1411,
            url: getIcon("UI_RelicIcon_15040_1")
            },
        head: {
            text: 1410,
            url: getIcon("UI_RelicIcon_15040_3")
            },
        config4: [
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate1","title":919,"type":"float"},
            
            {"default":0.0,"max":1.0,"min":0.0,"name":"rate2","title":925,"type":"float"},
            
        ],
        config2: [
            
        ],
    },
    
}
