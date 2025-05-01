
export type shape = [number, number][];
export type shapeData = {

    rot0: shape,
    rot1: shape,
    rot2: shape,
    rot3: shape,
    color: string
}
export type shapesData = shapeData[]

export let fieldColor = "#202020";   // フィールド背景色
export let blockSize = 20;           // １ブロックサイズ

export let blockNumWidth  = 10;      // 横ブロック数
export let blockNumHeight = 21;      // 高さブロック数（正式版は20）
export let fieldWidth = blockNumWidth * blockSize;   // フィールド幅
export let fieldHeight = blockNumHeight * blockSize; // フィールド高さ
export let bigBlockBox = blockSize * 5
export let smallBlockBox = blockSize * 2.5

export let nextNum = 5;
export let holdNum = 1;

export let DLEffect = true;