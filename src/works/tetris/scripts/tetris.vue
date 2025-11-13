<script setup lang="ts">
/*
 * tetris v0.6
 * http://www.gadgety.net/shin/
 */
/*
The MIT License (MIT)

Copyright (c) 2009 Shinta, All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

import { gameOver, gamePause, drawNext, genBlock, genStrokedBlock, scoreDisplay, type ScoreStructure } from './canvasController';
import { bigBlockBox, blockNumHeight, blockNumWidth, blockSize, DLEffect, fieldColor, fieldHeight, fieldWidth, holdNum, nextNum, smallBlockBox, startingShapes, dropShapes, getSettingObj, type shape, type shapeData, randomType, rotateSystem, ghost, lockdownSystem, scoreDisplay as scoreDisplaySetting} from './globalData';
import { ref, onMounted,/*, onBeforeUpdate*/ 
watch,
} from 'vue';
import { shapes } from './shapes';

/*
 * 画面サイズなどの初期設定を行う変数の初期化
 */
// 初期化

const keyCode = {
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
}

interface KeyBinds{
  drop: string;
  down:string;
  left:string;
  right:string;
  rotateR: string;
  rotateL: string;
  hold: string[];
  pause: string;
}

interface Props{
  left: boolean;
  keyBinds?: KeyBinds;
  keyboardAlias?: KeyboardAlias;
}

interface KeyboardAlias{
  [k : string]: string;
}

const props = withDefaults(defineProps<Props>(),
  {
    left:false,
    keyBinds: (): KeyBinds => ({
      drop:"_",
      down:"↓",
      left:"→",
      right: "←",
      rotateR:"\\",
      rotateL:"/",
      hold:["v"],
      pause:"F"
    }),
    keyboardAlias: (): KeyboardAlias => ({}),
  }
)

const gamePaused = defineModel<boolean>("pausing")
const gameReset = defineModel<number>("reset")

// ゲーム初期値
let level = ref(1);
let score = ref(0);
let speed = 700 - (level.value * 50);
let linesRemoved = ref(0);
let blocksDropped = ref(0);
let fourLineRmoved = ref(0);

let srsMultiply = 1;



/*
 * 状態を保持する変数の定義
 */
// キー状態
let spacePressed = false;
let lKeyPressed = false;
let rKeyPressed = false;
let dKeyPressed = false;
let lTimeout: NodeJS.Timeout;
let rTimeout: NodeJS.Timeout;
let dTimeout: NodeJS.Timeout;
let sensitivity = 240;
let checkLongPress = 500;
let lockdownCount = 0;
let disableDown = false;

let held: boolean[] = []

// ゲーム状態
let gameEnd = true;
let gameEffecting = false;

let timeoutID: NodeJS.Timeout;
let lockdownTimeoutID: NodeJS.Timeout;
let scoreDisplayTimeoutID: NodeJS.Timeout;
let scoreDisplaying = false;
let scoreStructure: ScoreStructure = { score: 0, srs: 0, line:0, level: 0 }

// ゲームキャンバス初期化
let tfield = ref<HTMLCanvasElement>();   // HTML側の canvas タグ
const holdFields = ref<HTMLCanvasElement[]>([])
const setHoldFieldsRef = (el: any) => {
  if (el) {
    holdFields.value.push(el)
    holdFields.value = holdFields.value.filter((e) => !!e)
    el.width = bigBlockBox;
    el.height = bigBlockBox;
    if(!gameEnd) drawNext(holdFields.value, holdShapes)
  }
}
const nextFields = ref<HTMLCanvasElement[]>([])
const setNextFieldsRef = (el: any) => {
  if (el) {
    nextFields.value.push(el)
    el.width = nextFields.value.length <= 1 ? bigBlockBox : smallBlockBox;
    el.height = nextFields.value.length <= 1 ? bigBlockBox : smallBlockBox;
    if(!gameEnd){
        drawNext(nextFields.value, nextShape, (n) => n == 0 ? 1 : 0.5)
    }
  }
}


/*
onBeforeUpdate(() => {
})
*/
  

onMounted(() => {
  resetGame();
})

function resetGame() {
  gameEnd = false;
  if(gamePaused.value){
    gamePaused.value = false;
  }
  clearTimeout(timeoutID)
  getSettingObj()
    holdFields.value = holdFields.value.filter((e) => e.parentElement?.parentElement)
    nextFields.value = nextFields.value.filter((e) => e.parentElement?.parentElement)
  let isFirst = true;
  for(const el of nextFields.value){
    el.width = isFirst ? bigBlockBox : smallBlockBox;
    el.height = isFirst ? bigBlockBox : smallBlockBox;
    isFirst = false;
  }
  for(const el of holdFields.value){
    el.width = bigBlockBox
    el.height = bigBlockBox
  }
  nextShape = [startingShapes[Math.floor(Math.random() * startingShapes.length)]]
  holdShapes = new Array(Number(holdNum)).fill(-1);
  emptyLine = new Array(Number(blockNumWidth)).fill(fieldColor);
  fields = new Array(Number(blockNumHeight)).fill("").map(_ => emptyLine.slice());
  level.value = 1
  score.value = 0;
  speed = 700 - (level.value * 50);
  linesRemoved.value = 0;
  blocksDropped.value = 0;
  fourLineRmoved.value = 0;
  if (tfield.value) {
    tfield.value.width = fieldWidth;
    tfield.value.height = fieldHeight;
  }
  fields[blockNumHeight] = new Array(Number(blockNumWidth)).fill("black");
  randomBlocks()
  drawNext(nextFields.value, nextShape, (n) => n == 0 ? 1 : 0.5)
  drawNext(holdFields.value, holdShapes)

  removeLines()
  controlBlock.reset()
  //startupTouch();
  gameEnd = false;
  scoreDisplaying = false;
  scoreStructure = { score: 0, srs: 0, line:0, level: 0 }
  loopGame();
}



/*
 * ゲームスタートのための初期化
 */
// テトリミノ種類

let nextShape: number[] = []

let holdShapes: number[] = [];
let randomtempShapes: number[] = [];

const randomBlocks = function () {
  while (nextShape.length <= nextNum) {
    if(randomType){
        nextShape.push(dropShapes[Math.floor(Math.random() * dropShapes.length)])
    }else{
      if(randomtempShapes.length == 0){
        randomtempShapes = structuredClone(dropShapes)
      }
      const randomIndex = Math.floor(Math.random() * randomtempShapes.length)
      nextShape.push(randomtempShapes[randomIndex])
      randomtempShapes.splice(randomIndex, 1)
    }
  }
}

// フィールド初期化
let emptyLine: string[] = new Array(Number(blockNumWidth)).fill(fieldColor);
let fields: string[][] = []
const controlBlock: {
  shape: shapeData,
  shapeID: number
  color: string,
  X: number,
  Y: number,
  lowestBlock: number,
  rot: number,
  rotateType: number,
  reset: () => unknown
  rotate: (rotateDirection: -1 | 1) => unknown
  collision: (x: number, y: number, s?: shape) => boolean,
  getShadowPos: () => number[]
  moveDown: () => unknown
  kill: () => unknown
  dropDown: () => unknown
  moveLeft: () => unknown
  moveRight: () => unknown
  hold: (key: number) => unknown
  draw: () => unknown
  drawShadow: () => unknown
  checkLockdown: (countdown?: boolean) => unknown

} = {
  shape: shapes[0],
  shapeID: 0,
  color: "",
  X: 0,
  Y: -1,
  rot: 0,
  rotateType: 0,
  lowestBlock: -Infinity,
  reset: () => {
    if(dKeyPressed){
      disableDown = true;
      dKeyPressed = false;
    }
    controlBlock.shapeID = nextShape[0]
    controlBlock.shape = shapes[controlBlock.shapeID]
    nextShape = nextShape.slice(1)
    controlBlock.X = Math.floor(blockNumWidth / 2) - 1
    controlBlock.Y = -1
    controlBlock.color = controlBlock.shape.color
    controlBlock.rot = 0
    controlBlock.rotateType = controlBlock.shape.rotateType ?? 0;
    controlBlock.lowestBlock = -Infinity;
    blocksDropped.value += 1;
    srsMultiply = 1;
    randomBlocks()
    held = held.map(_ => false)
    lockdownCount = 0;
    drawNext(nextFields.value, nextShape, (n) => n == 0 ? 1 : 0.5)
    if(lockdownTimeoutID){
      clearTimeout(lockdownTimeoutID)
      lockdownTimeoutID = 0 as unknown as NodeJS.Timeout;
      loopGame()
    }
  },
  // テトリミノ回転 (時計回り)
  rotate: (rotateDirection: -1 | 1) => {
    const new_rot = (controlBlock.rot + rotateDirection) & 3;
    const sh = controlBlock.shape.shapes[new_rot];
    const rotating = (X: number, Y: number, Fn: (() => void) = (() => undefined)): boolean => {
      if(controlBlock.collision(X,Y,sh)){
        return false;
      } else {
        controlBlock.rot = new_rot;
        controlBlock.X += X;
        controlBlock.Y += Y;
        Fn();
        controlBlock.checkLockdown();
        drawGameField();
        return true
      }
    }
    if (rotating(0, 0)) {
    } else {
      if(rotateSystem){
        if(controlBlock.rotateType === 0){
          if(new_rot === 0){
            if(rotating(controlBlock.rot === 1 ? 1 : -1, 0, () => srsMultiply++)) {}
            else if (rotating(controlBlock.rot === 1 ? 1 : -1, 1, () => srsMultiply++)) {}
            else if (rotating(0, -2, () => srsMultiply++)) {}
            else if (rotating(controlBlock.rot === 1 ? 1 : -1, -2, () => srsMultiply++)) {}
          } else if(new_rot === 1){
            if(rotating(-1, 0, () => srsMultiply++)) {}
            else if (rotating(-1, -1, () => srsMultiply++)) {}
            else if (rotating(0, 2, () => srsMultiply++)) {}
            else if (rotating(-1, 2, () => srsMultiply++)) {}
          } else if(new_rot === 2){
            if(rotating(controlBlock.rot === 1 ? 1 : -1, 0, () => srsMultiply++)) {}
            else if (rotating(controlBlock.rot === 1 ? 1 : -1, -1, () => srsMultiply++)) {}
            else if (rotating(0, -2, () => srsMultiply++)) {}
            else if (rotating(controlBlock.rot === 1 ? 1 : -1, -2, () => srsMultiply++)) {}
          } else if(new_rot === 3){
            if(rotating(1, 0, () => srsMultiply++)) {}
            else if (rotating(1, -1, () => srsMultiply++)) {}
            else if (rotating(0, 2, () => srsMultiply++)) {}
            else if (rotating(1, 2, () => srsMultiply++)) {}
          }
        } else if(controlBlock.rotateType === 1){
          if(new_rot === 0){
            if(rotating(-2 * rotateDirection,0, () => srsMultiply++)){}
            else if(rotating(rotateDirection,0, () => srsMultiply++)){}
            else if(controlBlock.rot == 1 && rotating(2,-1, () => srsMultiply++)){}
            else if(controlBlock.rot == 3 && rotating(1,2, () => srsMultiply++)){}
            else if(controlBlock.rot == 1 && rotating(-1,2, () => srsMultiply++)){}
            else if(controlBlock.rot == 3 && rotating(-2,-1, () => srsMultiply++)){}
          } else if(new_rot === 1){
            if(controlBlock.rot == 0 && rotating(-2,0, () => srsMultiply++)){}
            else if(controlBlock.rot == 2 && rotating(1,0, () => srsMultiply++)){}
            else if(controlBlock.rot == 0 && rotating(1,0, () => srsMultiply++)){}
            else if(controlBlock.rot == 2 && rotating(-2,0, () => srsMultiply++)){}
            else if(controlBlock.rot == 0 && rotating(-2,1, () => srsMultiply++)){}
            else if(controlBlock.rot == 2 && rotating(1,2, () => srsMultiply++)){}
            else if(controlBlock.rot == 0 && rotating(1,-2, () => srsMultiply++)){}
            else if(controlBlock.rot == 2 && rotating(-2,-1, () => srsMultiply++)){}
          } else if(new_rot === 2){
            if(rotating(-rotateDirection,0, () => srsMultiply++)){}
            else if(rotating(2 * rotateDirection,0, () => srsMultiply++)){}
            else if(controlBlock.rot == 1 && rotating(-1,-2, () => srsMultiply++)){}
            else if(controlBlock.rot == 3 && rotating(-2,1, () => srsMultiply++)){}
            else if(controlBlock.rot == 1 && rotating(2,1, () => srsMultiply++)){}
            else if(controlBlock.rot == 3 && rotating(1,-2, () => srsMultiply++)){}
          } else if(new_rot === 3){
            if(controlBlock.rot == 0 && rotating(-1,0, () => srsMultiply++)){}
            else if(controlBlock.rot == 2 && rotating(2,0, () => srsMultiply++)){}
            else if(controlBlock.rot == 0 && rotating(2,0, () => srsMultiply++)){}
            else if(controlBlock.rot == 2 && rotating(-1,0, () => srsMultiply++)){}
            else if(controlBlock.rot == 0 && rotating(-1,-2, () => srsMultiply++)){}
            else if(controlBlock.rot == 2 && rotating(2,-1, () => srsMultiply++)){}
            else if(controlBlock.rot == 0 && rotating(2,1, () => srsMultiply++)){}
            else if(controlBlock.rot == 2 && rotating(-1,2, () => srsMultiply++)){}
          }
        }
      } else {
        if (rotating(rotateDirection, 0)) {}
        else if (rotating(-rotateDirection, 0)) {}
        else if (rotating(2 * rotateDirection, 0)) {}
        else if (rotating(-2 * rotateDirection, 0)) {}
      }
    }
  },


  // 落ちてくるテトリミノの影
  getShadowPos: () => {
    let lowestHeight = 0;
    while(!controlBlock.collision(0,lowestHeight + 1)){
      lowestHeight++;
    }
    return [controlBlock.X, lowestHeight + controlBlock.Y];
  },

  // テトリミノダウン処理
  moveDown: () => {
    if (controlBlock.collision(0, 1)) {
      if(lockdownSystem && lockdownCount < 15){
        srsMultiply = 1;
        lockdownTimeoutID = setTimeout(controlBlock.checkLockdown, 500, false)
      }else{
        controlBlock.kill();
      }
      drawGameField();
      return
    }
    controlBlock.Y++;
    controlBlock.checkLockdown(false)
    srsMultiply = 1;
    drawGameField();
  },

  // テトリミノ衝突チェック
  collision: (dx: number, dy: number, s?: shape) => {
    for(const block of s ?? controlBlock.shape.shapes[controlBlock.rot]){
      const cx = controlBlock.X + dx + block[0]
      const cy = controlBlock.Y + dy + block[1]
      if(cx < 0 || blockNumWidth <= cx){
        return true
      }else if(cy >=blockNumHeight){
        return true
      } else if (cy >= 0 && fields[cy][cx] !== fieldColor){
        return true;
      }
    }
    return false;
  },

  // 左移動
  moveLeft: () => {
    if (!controlBlock.collision(-1, 0)) {
      controlBlock.X--;
      controlBlock.checkLockdown();
      drawGameField();
    }
  },

  // 右移動
  moveRight: () => {
    if (!controlBlock.collision( 1, 0)) {
      controlBlock.X++;
      controlBlock.checkLockdown();
      drawGameField();
    }
  },

  // 下まで落下
  dropDown: () => {
    const ghostPos = controlBlock.getShadowPos();
    for(const block of controlBlock.shape.shapes[controlBlock.rot]){
      if (fields[ghostPos[1] + block[1]] != undefined)
        fields[ghostPos[1] + block[1]][ghostPos[0] + block[0]] = controlBlock.color;
      if(ghostPos[1]+block[1] < 0) gameEnd = true;
    }
    controlBlock.reset();
    removeLines();
    drawGameField();
  },

  // 終了処理
  kill: () => {
    if (controlBlock.Y < 1) {
      gameEnd = true;
    }
    for (const block of controlBlock.shape.shapes[controlBlock.rot]){
      const kx = controlBlock.X + block[0];
      const ky = controlBlock.Y + block[1];
      if(kx > -1 && ky > -1) fields[ky][kx] = controlBlock.color;
    }
    controlBlock.reset();
  },

  hold: function (key: number) {
    if (!held[key]) {

      if (holdShapes[key] != -1) {
        [holdShapes[key], controlBlock.shapeID] = [controlBlock.shapeID, holdShapes[key]]
        controlBlock.shape = shapes[controlBlock.shapeID]
      } else {
        [holdShapes[key], controlBlock.shapeID] = [controlBlock.shapeID, nextShape[0]]
        controlBlock.shape = shapes[controlBlock.shapeID]
        nextShape = nextShape.slice(1)
        randomBlocks();
        drawNext(nextFields.value, nextShape, (n) => n == 0 ? 1 : 0.5);
      }
      drawNext(holdFields.value, holdShapes)

      controlBlock.color = controlBlock.shape.color;
      controlBlock.rot = 0;
      controlBlock.X = Math.floor(blockNumWidth / 2) - 1
      controlBlock.Y = -1
      controlBlock.lowestBlock = -Infinity
      lockdownCount = 0;
      if(lockdownTimeoutID){
        clearTimeout(lockdownTimeoutID)
        lockdownTimeoutID = 0 as unknown as NodeJS.Timeout;
        loopGame()
      }
      srsMultiply = 1;
      held[key] = true
      drawGameField();
    }
  },


  // テトリミノ描画
  draw: () => {
    for(const block of controlBlock.shape.shapes[controlBlock.rot]){
      genStrokedBlock(
        tfield.value!,
        (controlBlock.X + block[0]) * blockSize,
        (controlBlock.Y + block[1]) * blockSize,
        controlBlock.color,
        fieldColor
      );
    }
  },

  // テトリミノ影描画
  drawShadow: () => {
    const ghostPos = controlBlock.getShadowPos();
    if(ghost){
      for(const block of controlBlock.shape.shapes[controlBlock.rot]){
        genStrokedBlock(
          tfield.value!,
          (ghostPos[0] + block[0]) * blockSize,
          (ghostPos[1] + block[1]) * blockSize,
          "rgba(250,250,250,0.1)",
          "rgba(250,250,250,0.2)"
        );
      }
    }
  },

  checkLockdown: (countdown = true) => {
    let lowest = false;
    for(const block of controlBlock.shape.shapes[controlBlock.rot]){
      if(block[1] + controlBlock.Y > controlBlock.lowestBlock){
         lockdownCount = 0;
         controlBlock.lowestBlock = block[1] + controlBlock.Y
         lowest = true;
      }
    }
    if(!lowest && countdown && gamePaused.value){
      lockdownCount++;
    }
    if(lockdownTimeoutID || controlBlock.collision(0, 1)){
      if(lockdownCount > 15){
        if (controlBlock.collision(0,1)){
          controlBlock.kill();
        } else {
          clearTimeout(lockdownTimeoutID)
          lockdownTimeoutID = 0 as unknown as NodeJS.Timeout;
          loopGame()
        }
      } else {
        clearTimeout(lockdownTimeoutID)
        lockdownTimeoutID = setTimeout(() => {
          if (controlBlock.collision(0,1)){
            controlBlock.kill()
          } else {
            clearTimeout(lockdownTimeoutID)
            lockdownTimeoutID = 0 as unknown as NodeJS.Timeout;
            loopGame()
          }
        }, 500)
      }
    }
  }
}


// ライン消去処理
const removeLinesEffect = function (removeLines: number[]) {
  let tempFields = fields.slice()
  if (DLEffect) {
    gameEffecting = true;
    lKeyPressed = false;
    rKeyPressed = false;
    dKeyPressed = false;
    window.clearTimeout(timeoutID);
    (async () => {
      for (let i = 0; i < blockNumWidth; i++) {
        for (const elem of removeLines) {
          fields[elem][i] = fieldColor
        }
        drawGameField()
        await new Promise((resolve) => {
          window.setTimeout(resolve, 20)
        })
      }
      fields = tempFields.filter((_, index) => {
        return !removeLines.includes(index)
      })
      while (fields.length <= blockNumHeight) {
        fields.unshift(emptyLine.slice())
      }
      drawGameField();
      gameEffecting = false;
      window.clearTimeout(timeoutID);
      timeoutID = setTimeout(loopGame, speed);
    })()
  } else {
    fields = tempFields.filter((_, index) => {
      return !removeLines.includes(index)
    })
    while (fields.length <= blockNumHeight) {
      fields.unshift(emptyLine.slice())
    }
  }
}
const removeLines = function () {
  const deleteLines: number[] = []
  checkLine: for (let i = 0; i < fields.length; i++) {
    for (const block of fields[i]) {
      if (block == fieldColor || block == "black") continue checkLine;
    }
    deleteLines.push(i)
    linesRemoved.value++;
  }
  if (deleteLines.length >= 1) {
    level.value = Math.floor((linesRemoved.value / 10)) + 1;
    speed = 700 - (level.value * 50);
    if(deleteLines.length >= 4){
      fourLineRmoved.value += deleteLines.length / 4;
    }

    // 点数評価
    const multiplier = 25 * (deleteLines.length ** 2) * srsMultiply;
    score.value += (multiplier * (level.value + 1));
    if(scoreDisplaySetting){
      clearTimeout(scoreDisplayTimeoutID!)
      scoreDisplaying = true;
      scoreStructure.score = multiplier * (level.value + 1)
      scoreStructure.srs = srsMultiply
      scoreStructure.level = level.value
      scoreStructure.line = deleteLines.length
      scoreDisplay(tfield.value?.getContext("2d")!, scoreStructure)
      setTimeout(() => scoreDisplaying = false, 1000);
    }
    removeLinesEffect(deleteLines)
  }
}


// ゲームフォールド描画
const drawGameField = function () {
  for (let y = 0; y < blockNumHeight; y++) {
    for (let x = 0; x < blockNumWidth; x++) {
      genBlock(tfield.value!, x, y, fields[y][x]);
    }
  }
  controlBlock.drawShadow();
  controlBlock.draw();
  if(scoreDisplaySetting && scoreDisplaying) scoreDisplay(tfield.value?.getContext("2d")!, scoreStructure);
}

// 押しっぱなし左移動
const moveLeft = function (isFirst = true) {
  if (lKeyPressed) {
    controlBlock.moveLeft();
        lTimeout = setTimeout(() => moveLeft(false), isFirst ? checkLongPress : sensitivity);
  }
}

// 押しっぱなし右移動
const moveRight = function (isFirst = true) {
  if (rKeyPressed) {
    controlBlock.moveRight();
    rTimeout = setTimeout(() => moveRight(false), isFirst ? checkLongPress : sensitivity);
  }
}
const moveDown = function (isFirst = true) {
  if (dKeyPressed) {
    controlBlock.moveDown();
    dTimeout = setTimeout(() => moveDown(false), isFirst ? checkLongPress : sensitivity);
  }
}
// キー取得
var getKeyCode = function(e : KeyboardEvent): number {
  var code;
  if (window.event) {  // IE
    code = e.keyCode;
  } else if(e.which) { // Netscape/Firefox/Opera
    code = e.which;
  }else {
    code = -1
  }
  return code;
}

const getKeyAlias = function(baseKey: string): string{
  if(props.keyboardAlias[baseKey]) return getKeyAlias(props.keyboardAlias[baseKey])
  else return baseKey;
}

const equalKeyCode = function(bindedKey: string, enteredKeyCode:number){
  return bindedKey === getKeyAlias(keyCode[enteredKeyCode as 32])
}

/*
 * キーイベント（キー入力）の制御
 */
// キーアップイベント初期化(押しっ放し対応)
document.addEventListener("keyup", (e) => {

  var keycode = getKeyCode(e);
  if (equalKeyCode(props.keyBinds.drop, keycode)) {          // space
    spacePressed = false;
  } else if (equalKeyCode(props.keyBinds.left, keycode)) {   // ←
    lKeyPressed = false;
    clearTimeout(lTimeout)
  } else if (equalKeyCode(props.keyBinds.right, keycode)) {   // →
    rKeyPressed = false;
    clearTimeout(rTimeout)
  } else if (equalKeyCode(props.keyBinds.down, keycode)) {   // ↓
    dKeyPressed = false;
    disableDown = false;
    clearTimeout(dTimeout)
  }
})
// キーダウンイベント初期化
document.addEventListener("keydown",(e) => {

  var keycode = getKeyCode(e);
  if (!gameEnd && !gamePaused.value && !gameEffecting) {
    if (equalKeyCode(props.keyBinds.rotateR, keycode)) {        // ↑
      e.preventDefault();
      controlBlock.rotate(1);
    } else if (equalKeyCode(props.keyBinds.left, keycode)) { // ←
      e.preventDefault();
      lKeyPressed = true;
      moveLeft();
    } else if (equalKeyCode(props.keyBinds.right, keycode)) { // →
      e.preventDefault();
      rKeyPressed = true;
      moveRight();
    } else if (equalKeyCode(props.keyBinds.down, keycode)) { // ↓
      e.preventDefault();
      if(!disableDown){
        dKeyPressed = true;
        moveDown();
      }
    } else if (equalKeyCode(props.keyBinds.drop, keycode) && !spacePressed) { // space 押しっぱなしチェック
      spacePressed = true;
      e.preventDefault();
      controlBlock.dropDown();
    }
     else if (props.keyBinds.hold.includes( getKeyAlias(keyCode[keycode as 32]))) { // ↓
      e.preventDefault();
      controlBlock.hold(props.keyBinds.hold.indexOf( getKeyAlias(keyCode[keycode as 32])));

    }
     else if (equalKeyCode(props.keyBinds.rotateL, keycode)) { // ↓
      e.preventDefault();
      controlBlock.rotate(-1);
      
    }
  }
  if(gameEffecting){
    e.preventDefault();
  }
  if (equalKeyCode(props.keyBinds.pause, keycode) && !gameEnd) {
    pauseControl();
  }
})

const pauseControl = (e?: TouchEvent | MouseEvent) => {
  e?.preventDefault()
  if(!gameEnd) gamePaused.value = !gamePaused.value;
}


watch(() => gamePaused.value, (val)=>{
  if(!val){
    drawGameField();
    timeoutID = setTimeout(loopGame, speed);
  }else if(!gameEffecting){
    lKeyPressed = false;
    rKeyPressed = false;
    dKeyPressed = false;
    gamePause(tfield.value?.getContext("2d")!);
  }
})

watch(() => gameReset.value, (val)=>{
  if(val && val >= 1)
    resetGame()
})

const confirmResetGame = (e: TouchEvent | MouseEvent) => {
  e.preventDefault()
  if(confirm("本当にリセットしますか？")){
    gameReset.value!++;
  }
}




const touchEnd = (buttonID: "drop" | "left" | "right" | "down") =>  {
  if (buttonID == "drop") {          // space
    spacePressed = false;
  } else if (buttonID == "left") {   // ←
    lKeyPressed = false;
    clearTimeout(lTimeout)
  } else if (buttonID == "right") {   // →
    rKeyPressed = false;
    clearTimeout(rTimeout)
  }else if(buttonID == "down"){
  dKeyPressed = false;
    clearTimeout(dTimeout)
  }
}

const touchStart = (e: TouchEvent, buttonID: "drop" | "left" | "right" | "down") => {
  if (!gameEnd && !gamePaused.value && !gameEffecting) {
    switch(buttonID){
      case "drop":{
        spacePressed = true;
        e.preventDefault();
        controlBlock.dropDown();
        break;
      }
      case 'left':{
        e.preventDefault();
        lKeyPressed = true;
        moveLeft()
        break;
      }
      case 'right':{
        e.preventDefault()
        rKeyPressed = true;
        moveRight()
        break;
      }case 'down':{
        e.preventDefault()
        dKeyPressed = true;
        moveDown()
        break;
      }
    }
  }
}

const clickButtons = (buttonID: "drop" | "down" | "left" | "right" | "rotateR" | "rotateL") => {
  if (!gameEnd && !gamePaused.value && !gameEffecting) {
    switch(buttonID){
      case "drop":{
        controlBlock.dropDown();
        break;
      }
      case "down":{
        controlBlock.moveDown();
        break;
      }
      case "left":{
        controlBlock.moveLeft()
        break;
      }
      case "right":{
        controlBlock. moveRight()
        break;
      }
      case "rotateL":{
        controlBlock.rotate(-1)
        break;
      }
      case 'rotateR':{
        controlBlock.rotate(1)
        break;
      }
    }
  }
}

const holdButtonClick = (holdID:number) => {
  if(!held[holdID]) controlBlock.hold(holdID)
}

/*
 * メインループ
 */
// ゲームループ
const loopGame = function () {
  if(gamePaused.value){
    gamePause(tfield.value?.getContext("2d")!);
  }else{
    if (!gameEnd) {
      controlBlock.moveDown();
      if(!lockdownTimeoutID){
        timeoutID = setTimeout(loopGame, speed);
        removeLines();
        drawGameField();
      }
    } else {
      gameOver(tfield.value?.getContext("2d")!, score.value);
    }
  }
}


</script>

<template>
  <div>
    <div id="gameArea" :class="{'fieldReverse': !props.left}">

      <div id="holdField">
        <div v-for="i in holdNum" :key="`hold${i}`">
          <div class="title">ホールド {{ i }}</div>
          <canvas class="holdCanvas" :ref="setHoldFieldsRef"></canvas><br>
          <button @click="holdButtonClick(i - 1)" class="holdButton">ホールド</button>
        </div>
      </div>
      <div id="gameField">
        <canvas id="gameCanvas" ref="tfield"></canvas>
      </div>
      <div id="nextField">
        <div v-for="i in nextNum" :key="`next${i}`">
          <div class="title" v-if="i == 1">次のブロック</div>
          <canvas class="holdCanvas" :ref="setNextFieldsRef"></canvas>
        </div>
      </div>

    </div>
    
    <div id="buttonArea">

      <button @click="clickButtons('rotateL')" class="controlButton rotateButton">↪</button>
      <button @click="clickButtons('drop')" @touchstart="(e) => touchStart(e, 'drop')" @touchend="touchEnd('drop')" class="controlButton moveButton">⇓</button>
      <button @click="clickButtons('rotateR')" class="controlButton rotateButton">↩</button>
      <br>
      <button @click="clickButtons('left')" @touchstart="(e) => touchStart(e, 'left')" @touchend="() => touchEnd('left')" class="controlButton moveButton">←</button>
      <button @click="clickButtons('down')" @touchstart="(e) => touchStart(e, 'down')" @touchend="touchEnd('down')" class="controlButton moveButton">↓</button>
      <button @click="clickButtons('right')" @touchstart="(e) => touchStart(e, 'right')" @touchend="() => touchEnd('right')" class="controlButton moveButton">→</button><br><br>

      <button @click="pauseControl" @touchstart="pauseControl" class="longButton" id="pauseButton">ポーズする</button><br>
      <button @click="confirmResetGame" @touchstart="confirmResetGame" class="longButton" id="resetButton">ゲームをリセットする</button><br>
    </div>
    <div id="scoreBoard" :class="{'leftBoard':props.left}">
      <ul>
        <li>レベル <div>{{ level }}</div>
        </li>
        <li>累計ブロック数 <div>{{ blocksDropped }}</div>
        </li>
        <li>ライン <div>{{ linesRemoved }}</div>
        </li>
        <li>4ライン消し <div>{{ fourLineRmoved }}</div>
        </li>
        <li>点数 <div>{{ score }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.longButton{
  padding-top: 5px;
  padding-bottom: 5px;
  padding-left: 15px;
  padding-right: 15px;
  border-radius: 5px;
  border-color: transparent;
  box-shadow: 1px 2px rgba(0, 0, 0 0.2);
  outline: none;
  font-size: 14px;
  text-shadow: 0 1px 1px rgba(0,0,0,.3);
  margin: 5px;
}

.controlButton{
  padding : 5px;
  border-radius: 5px;
  height: 25px;
  width: 25px;
  border-color: transparent;
  box-shadow: 1px, 2px rgba(0,0,0,0.2);
  outline: none;
  font-size: 18px;
  text-shadow: 0 1px 1px rgba(0,0,0,0.3);
  margin: 5px;
  transition-property: opacity;
  transition-duration: 0.25s;
  box-sizing: content-box;
}

.moveButton{
    background-color: #88f;
  background: -moz-linear-gradient(top, #88f, #22f );
  color: white;
}

.rotateButton{
      background-color: #8f8;
  background: -moz-linear-gradient(top, #8f8, #2f2);
  color: black;
}

.controlButton:hover{
  opacity: 0.6;
}

.holdButton{
  padding : 5px;
  border-radius: 5px;
  height: 25px;
  width: 5em;
  border-color: transparent;
  box-shadow: 1px, 2px rgba(0,0,0,0.2);
  outline: none;
  font-size: 18px;
  text-shadow: 0 1px 1px rgba(0,0,0,0.3);
  margin: 5px;
  transition-property: opacity;
  transition-duration: 0.25s;
  box-sizing: content-box;
      background-color: #888;
      color:white;
  background: -moz-linear-gradient(top, #888, #882);
}

.holdButton:hover{
  opacity: 0.6;
}

#resetButton{
  background-color: #f64;
  background: -moz-linear-gradient(top, #f64, #f23 );
  color: white;
  transition-property: opacity;
  transition-duration: 0.25s;
  width: 11em;
  box-sizing: content-box;
}

#resetButton:hover{
  opacity: 0.6;
}

#pauseButton{
  background-color: #46f;
  background: -moz-linear-gradient(top, #46f, #32f );
  color: white;
  transition-property: opacity;
  transition-duration: 0.25s;
  width: 11em;
  box-sizing: content-box;
}

#pauseButton:hover{
  opacity: 0.6;
}

li {
  list-style: none;
}

@media screen and (width > 640px) {
  
  #scoreBoard {
    position: absolute;
    top: 400px;
    background-color: antiquewhite;
    border-radius: 15px;
    z-index: 3;
  }

  #scoreBoard.leftBoard{
    left:50px;
  }
  #scoreBoard:not(.leftBoard){
    right: 50px;
  }
}

#scoreBoard {
  background-color: antiquewhite;
  border-radius: 15px;
  z-index: 3;
}
#scoreBoard>ul {
  padding-left: 20px;
  padding-right: 20px;
}

canvas {
  box-sizing: border-box;
}

#gameArea {
  display: flex;
  margin: 0 auto;
  justify-content: center;
}

.fieldReverse{
  flex-flow: row-reverse;
}

#gameCanvas {
  border: 10px gray solid;
}

.holdCanvas {
  border: 5px gray solid;
}

.gameCanvas {
  border: 5px gray solid;
}

#holdField {
  float: right;
}

#gameField {
  float: center;
  min-height: 250px;
  margin-right: 25px;
  margin-left: 25px;
}

#nextField {
  float: left;
}
</style>
