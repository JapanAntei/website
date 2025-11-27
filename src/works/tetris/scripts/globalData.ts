export type shape = [number, number][];
export type shapeData = {
    shapes: [shape, shape, shape, shape];
    color: string;
    rotateType?: number;
    shapeName?: string;
};
export type shapesData = shapeData[];

export const keyCode = {
  32: "_",
  37: "←",
  38: "↑",
  39: "→",
  40: "↓",
  48: "0",
  49: "1",
  50: "2",
  51: "3",
  52: "4",
  53: "5",
  54: "6",
  55: "7",
  56: "8",
  57: "9",
  59: ";",
  65: "A",
  66: "B",
  67: "C",
  68: "D",
  69: "E",
  70: "F",
  71: "G",
  72: "H",
  73: "I",
  74: "J",
  75: "K",
  76: "L",
  77: "M",
  78: "N",
  79: "O",
  80: "P",
  81: "Q",
  82: "R",
  83: "S",
  84: "T",
  85: "U",
  86: "V",
  87: "W",
  88: "X",
  89: "Y",
  90: "Z",
  188: ",",
  189: ".",
  191: "/",
  220: "\\"
} as const

export type keys = (typeof keyCode)[keyof typeof keyCode];

export interface KeyBinds{
  drop: keys;
  down:keys;
  left:keys;
  right:keys;
  rotateR: keys;
  rotateL: keys;
  hold: keys[];
  pause: keys;
}

export type keyboardAlias = Partial<Record<keys, keys>>

let localStorageSettings: TetrisSettings | null = null;
interface TetrisSettings {
    blockSize: number;
    blockNumWidth: number;
    blockNumHeight: number;
    nextNum: number;
    holdNum: number;
    DLEffect: boolean;
    startingShapes: number[];
    dropShapes: number[];
    randomType: boolean;
    rotateSystem: boolean;
    ghost: boolean;
    lockdownSystem: boolean;
    scoreDisplay: boolean;
    scoreDetails: boolean;
}
export const defaultSettings: TetrisSettings = {
    blockSize: 20,
    blockNumWidth: 10,
    blockNumHeight: 21,
    nextNum: 5,
    holdNum: 1,
    DLEffect: true,
    startingShapes: [2, 3, 5, 6],
    dropShapes: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13/* ,14, 15, 16,17,18*/],
    randomType:true,
    rotateSystem: true ,
    ghost: true,
    lockdownSystem: true,
    scoreDetails: false,
    scoreDisplay: false,
};

export let fieldColor = "#202020"; // フィールド背景色

export let blockSize = defaultSettings["blockSize"]; // １ブロックサイズ

export let blockNumWidth = defaultSettings["blockNumWidth"]; // 横ブロック数
export let blockNumHeight = defaultSettings["blockNumHeight"]; // 高さブロック数（正式版は20）

export let fieldWidth = blockNumWidth * blockSize; // フィールド幅
export let fieldHeight = blockNumHeight * blockSize; // フィールド高さ
export let bigBlockBox = blockSize * 5;
export let smallBlockBox = blockSize * 2.5;

export let nextNum = defaultSettings["nextNum"];
export let holdNum = defaultSettings["holdNum"];

export let DLEffect = defaultSettings["DLEffect"];

export let startingShapes = defaultSettings["startingShapes"]
export let dropShapes = defaultSettings["dropShapes"]
export let randomType = defaultSettings["randomType"]; // 横ブロック数

export let rotateSystem = defaultSettings["rotateSystem"]

export let ghost = defaultSettings["ghost"]

export let lockdownSystem = defaultSettings["lockdownSystem"]
export let scoreDetails = defaultSettings["scoreDetails"]
export let scoreDisplay = defaultSettings["scoreDisplay"]

export function getSettingObj(storageName?: string): TetrisSettings{
    localStorageSettings = null
    blockSize = Number(getSetting("blockSize", storageName))
    blockNumHeight = Number(getSetting("blockNumHeight", storageName))
    blockNumWidth = Number(getSetting("blockNumWidth", storageName))
    nextNum = Number(getSetting("nextNum", storageName))
    holdNum = Number(getSetting("holdNum", storageName))
    DLEffect = Boolean(getSetting("DLEffect", storageName))
    startingShapes = getSetting("startingShapes", storageName)
    dropShapes = getSetting("dropShapes", storageName)
    randomType = getSetting("randomType", storageName)
    rotateSystem = Boolean(getSetting("rotateSystem", storageName))
    ghost = Boolean(getSetting("ghost", storageName))
    scoreDetails = Boolean(getSetting("scoreDetails", storageName))
    scoreDisplay = Boolean(getSetting("scoreDisplay", storageName))

    fieldWidth = blockNumWidth * blockSize; // フィールド幅
    fieldHeight = blockNumHeight * blockSize; // フィールド高さ
    bigBlockBox = blockSize * 5;
    smallBlockBox = blockSize * 2.5;
    return {
        blockSize,
        blockNumHeight,
        blockNumWidth,
        nextNum,
        holdNum,
        DLEffect,
        startingShapes,
        dropShapes,
        randomType,
        rotateSystem,
        ghost,
        lockdownSystem,
        scoreDetails,
        scoreDisplay
    }
}

function getSetting<T extends keyof TetrisSettings>(settingId: T, storageName = "GoMeTetrisSettings"): TetrisSettings[T] {
    try{
        if (!localStorageSettings) localStorageSettings = JSON.parse(localStorage.getItem(storageName) ?? "{}") ?? {};
        return localStorageSettings?.[settingId] ?? defaultSettings[settingId];
    } catch(e){
        return defaultSettings[settingId]
    }
}
