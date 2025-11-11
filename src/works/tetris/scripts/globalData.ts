export type shape = [number, number][];
export type shapeData = {
    shapes: [shape, shape, shape, shape];
    color: string;
    rotateType?: number;
};
export type shapesData = shapeData[];

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
    rotateSystem: false,
    ghost: true,
    lockdownSystem: true,
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
    lockdownSystem = Boolean(getSetting("lockdownSystem", storageName))

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
