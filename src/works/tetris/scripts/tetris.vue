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

import { gameOver, gamePause, drawNext, genBlock, genStrokedBlock } from './canvasController';
import { bigBlockBox, blockNumHeight, blockNumWidth, blockSize, DLEffect, fieldColor, fieldHeight, fieldWidth, holdNum, nextNum, smallBlockBox, type shape, type shapeData} from './globalData';
import { ref, onMounted/*, onBeforeUpdate*/ } from 'vue';
import { shapes } from './shapes';

/*
 * 画面サイズなどの初期設定を行う変数の初期化
 */
// 初期化


// ゲーム初期値
let level = ref(1);
let score = ref(0);
let speed = 700 - (level.value * 50);
let linesRemoved = ref(0);
let blocksDropped = ref(0);
let fourLineRmoved = ref(0);

/*
 * 状態を保持する変数の定義
 */
// キー状態
let spacePressed = false;
let lKeyPressed = false;
let rKeyPressed = false;
let sensitivity = 80;

let held: boolean[] = []

// ゲーム状態
let gameEnd = false;
let gamePaused = false;

let timeoutID: NodeJS.Timeout;

// ゲームキャンバス初期化
let tfield = ref<HTMLCanvasElement>();   // HTML側の canvas タグ
const holdFields = ref<HTMLCanvasElement[]>([])
const setHoldFieldsRef = (el: any) => {
  if (el) {
    holdFields.value.push(el)
  }
}
const nextFields = ref<HTMLCanvasElement[]>([])
const setNextFieldsRef = (el: any) => {
  if (el) {
    console.log(el)
    nextFields.value.push(el)
  }
}
/*
onBeforeUpdate(() => {
  holdFields.value = [];
  nextFields.value = [];
})
  */

onMounted(() => {
  resetGame();
})

function resetGame() {
  clearTimeout(timeoutID)
  nextShape = [activeShapes[Math.floor(Math.random() * activeShapes.length)]]
  holdShapes = new Array(holdNum).fill(-1);
  fields = new Array(blockNumHeight).fill("").map(_ => emptyLine.slice());
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
  let isFirstNext = true;
  for (const elem of nextFields.value) {
    elem.width = isFirstNext ? bigBlockBox : smallBlockBox;
    elem.height = isFirstNext ? bigBlockBox : smallBlockBox;
    isFirstNext = false;
  }
  for (const elem of holdFields.value) {
    elem.width = bigBlockBox;
    elem.height = bigBlockBox;
  }

  //window.setTimeout(() => {score.value = 250}, 2500)

  //gameOver(tfield.value?.getContext("2d")!, fieldWidth, fieldHeight, score.value)
  //gamePause(tfield.value?.getContext("2d")!, fieldWidth, fieldHeight)
  fields[blockNumHeight] = ["black", "black", "black", "black", "black", "black", "black", "black", "black", "black"];
  randomBlocks()
  drawNext(nextFields.value, nextShape, (n) => n == 0 ? 1 : 0.5)
  drawNext(holdFields.value, holdShapes)

  removeLines()
  controlBlock.reset()
  //startupTouch();
  loopGame();
}



/*
 * ゲームスタートのための初期化
 */
// テトリミノ種類
const activeShapes = [2, 3, 5, 6];
const allShapes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13/* ,14, 15, 16,17,18*/];
let nextShape: number[] = []

let holdShapes: number[] = [];

const randomBlocks = function () {
  while (nextShape.length < nextNum) {
    nextShape.push(allShapes[Math.floor(Math.random() * allShapes.length)])
  }
}

// フィールド初期化
const emptyLine: string[] = new Array(blockNumWidth).fill(fieldColor);
let fields: string[][] = []
const controlBlock: {
  shape: shapeData,
  shapeID: number
  color: string,
  X: number,
  Y: number,
  pos: number,
  reset: () => unknown
  rotate: () => unknown
  rotate2: () => unknown
  collision: (x: number, y: number, s?: shape) => boolean,
  position: (x: number, y: number) => number[][]
  new_position: (shape: shape, x: number, y: number) => number[][]
  getShadowPos: () => number[]
  moveDown: () => unknown
  kill: () => unknown
  dropDown: () => unknown
  moveLeft: () => unknown
  moveRight: () => unknown
  hold: (key: number) => unknown
  draw: () => unknown
  drawShadow: () => unknown

} = {
  shape: shapes[0],
  shapeID: 0,
  color: "",
  X: 0,
  Y: -blockSize,
  pos: 0,
  reset: () => {
    controlBlock.shapeID = nextShape[0]
    controlBlock.shape = shapes[controlBlock.shapeID]
    nextShape = nextShape.slice(1)
    controlBlock.X = ((fieldWidth / 2) - ((fieldWidth / 2) % blockSize)) - blockSize;
    controlBlock.Y = -blockSize
    controlBlock.color = controlBlock.shape.color
    controlBlock.pos = 0
    randomBlocks()
    held = held.map(_ => false)
    drawNext(nextFields.value, nextShape, (n) => n == 0 ? 1 : 0.5)
  },
  // テトリミノ回転 (時計回り)
  rotate: () => {
    const new_pos = (controlBlock.pos + 1) & 3;
    const sh = controlBlock.shape[`rot${new_pos}` as "rot1"];
    if (!controlBlock.collision(controlBlock.X, controlBlock.Y, sh)) {
      controlBlock.pos = new_pos;
      drawGameField();
    } else {
      if (!controlBlock.collision(controlBlock.X + blockSize, controlBlock.Y, sh)) {
        controlBlock.X += blockSize;
        controlBlock.pos = new_pos;
        drawGameField();
      } else if (!controlBlock.collision(controlBlock.X - blockSize, controlBlock.Y, sh)) {
        controlBlock.X -= blockSize;
        controlBlock.pos = new_pos;
        drawGameField();
      } else if (!controlBlock.collision(controlBlock.X + (blockSize * 2), controlBlock.Y, sh)) {
        controlBlock.X += blockSize * 2;
        controlBlock.pos = new_pos;
        drawGameField();
      } else if (!controlBlock.collision(controlBlock.X - (blockSize * 2), controlBlock.Y, sh)) {
        controlBlock.X -= blockSize * 2;
        controlBlock.pos = new_pos;
        drawGameField();
      }
    }
  },

  rotate2: () => {

    const new_pos = (controlBlock.pos - 1) & 3;
    const sh = controlBlock.shape[`rot${new_pos}` as "rot1"];
    if (!controlBlock.collision(controlBlock.X, controlBlock.Y, sh)) {
      controlBlock.pos = new_pos;
      drawGameField();
    } else {
      if (!controlBlock.collision(controlBlock.X - blockSize, controlBlock.Y, sh)) {
        controlBlock.X -= blockSize;
        controlBlock.pos = new_pos;
        drawGameField();
      } else if (!controlBlock.collision(controlBlock.X + blockSize, controlBlock.Y, sh)) {
        controlBlock.X += blockSize;
        controlBlock.pos = new_pos;
        drawGameField();
      } else if (!controlBlock.collision(controlBlock.X - (blockSize * 2), controlBlock.Y, sh)) {
        controlBlock.X -= blockSize * 2;
        controlBlock.pos = new_pos;
        drawGameField();
      } else if (!controlBlock.collision(controlBlock.X + (blockSize * 2), controlBlock.Y, sh)) {
        controlBlock.X += blockSize * 2;
        controlBlock.pos = new_pos;
        drawGameField();
      }
    }

  },

  // 位置
  position: (x, y) => {
    const arr = [];
    const rotIndex = `rot${controlBlock.pos}` as "rot1"
    const rotShape = controlBlock.shape[rotIndex]
    for (const zahyo of rotShape) {

      const cx = Math.floor(((x + (zahyo[0] * blockSize)) / blockSize));
      const cy = Math.floor(((y + (zahyo[1] * blockSize)) / blockSize));
      arr.push([cx, cy]);
    }
    return arr;
  },

  // 新しい位置
  new_position: (shape: shape, x: number, y: number) => {
    const arr = [];
    for (var i = 0; i < shape.length; i++) {
      const cx = Math.floor(((x + (shape[i][0] * blockSize)) / blockSize));
      const cy = Math.floor(((y + (shape[i][1] * blockSize)) / blockSize));
      arr.push([cx, cy]);
    }
    return arr;
  },

  // 落ちてくるテトリミノの影
  getShadowPos: () => {
    const pos = controlBlock.position(controlBlock.X, controlBlock.Y);
    let highestBlock = blockNumHeight - 1;
    let lowestBlock = -2;
    for (var i = 0; i < controlBlock.shape[`rot${controlBlock.pos}` as "rot1"].length; i++) {
      for (var y = 0; y < fields.length; y++) {
        if (fields[y][pos[i][0]] != fieldColor && y > pos[i][1]) {
          if (y < highestBlock) {
            highestBlock = y;
          }
        }
      }
      if (controlBlock.shape[`rot${controlBlock.pos}` as "rot1"][i][1] > lowestBlock) {
        lowestBlock = controlBlock.shape[`rot${controlBlock.pos}` as "rot1"][i][1];
      }
    }

    highestBlock -= lowestBlock;
    highestBlock += 1;
    if (
      controlBlock.collision(controlBlock.X, (highestBlock * blockSize)) ||
      controlBlock.collision(controlBlock.X, ((highestBlock - 1) * blockSize))
    ) {
      highestBlock -= 1;
    }
    if (controlBlock.collision(controlBlock.X, (highestBlock * blockSize))) {
      highestBlock -= 1;
    }

    let ghostY = highestBlock * blockSize;

    if (ghostY < controlBlock.Y) {
      ghostY = controlBlock.Y;
    }
    return [controlBlock.X, ghostY];
  },

  // テトリミノダウン処理
  moveDown: () => {
    controlBlock.Y += blockSize;
    for (var i = 0; i < controlBlock.shape[`rot${controlBlock.pos}` as "rot1"].length; i++) {
      const cx = Math.floor(((controlBlock.X + (controlBlock.shape[`rot${controlBlock.pos}` as "rot1"][i][0] * blockSize)) / blockSize));
      const cy = Math.floor(((controlBlock.Y + (controlBlock.shape[`rot${controlBlock.pos}` as "rot1"][i][1] * blockSize)) / blockSize));
      if (cx > -1 && cy > -1) {
        if (fields[cy][cx] != fieldColor || cy == blockNumHeight) {
          controlBlock.kill();
        }
      }
    }
    drawGameField();
  },

  // テトリミノ衝突チェック
  collision: (x: number, y: number, s?: shape) => {
    if (s != undefined) {
      var pos = controlBlock.new_position(s, x, y);
    } else {
      var pos = controlBlock.position(x, y);
    }
    var collided = false;
    for (var i = 0; i < pos.length; i++) {

      if (pos[i][0] < 0 || pos[i][0] >= blockNumWidth) {
        collided = true;
        break;
      } else if (pos[i][1] != undefined && pos[i][1] >= 0 && fields[pos[i][1]][pos[i][0]] != fieldColor) {
        collided = true;
        break;
      }
    }
    return collided;
  },

  // 左移動
  moveLeft: () => {
    if (!controlBlock.collision(controlBlock.X - blockSize, controlBlock.Y)) {
      controlBlock.X = controlBlock.X - blockSize;
      drawGameField();
    }
  },

  // 右移動
  moveRight: () => {
    if (!controlBlock.collision(controlBlock.X + blockSize, controlBlock.Y)) {
      if (controlBlock.X < (fieldWidth - blockSize)) {
        controlBlock.X += blockSize;
        drawGameField();
      }
    }
  },

  // 下まで落下
  dropDown: () => {
    const ghostPos = controlBlock.getShadowPos();
    const pos = controlBlock.position(ghostPos[0], ghostPos[1]);
    for (var i = 0; i < controlBlock.shape[`rot${controlBlock.pos}` as "rot1"].length; i++) {
      if (fields[pos[i][1]] != undefined)
        fields[pos[i][1]][pos[i][0]] = controlBlock.color;
    }
    controlBlock.reset();
    removeLines();
    drawGameField();
  },

  // 終了処理
  kill: () => {
    const curX = controlBlock.X;
    const curY = controlBlock.Y - blockSize;
    const pos = controlBlock.position(curX, curY);
    if (pos[0][1] < 0) {
      gameEnd = true;
    }
    for (let i = 0; i < controlBlock.shape[`rot${controlBlock.pos}` as "rot1"].length; i++) {
      const kx = pos[i][0];
      const ky = pos[i][1];
      if (kx > -1 && ky > -1) {
        fields[ky][kx] = controlBlock.color;
      }
    }
    controlBlock.reset();
  },

  hold: function (key: number) {
    if (!held[key]) {
      const curX = controlBlock.X;
      const curY = controlBlock.Y;
      const pos = controlBlock.position(curX, curY);
      for (let i = 0; i < controlBlock.shape[`rot${controlBlock.pos}` as "rot1"].length; i++) {
        const kx = pos[i][0];
        const ky = pos[i][1];
        if (kx > -1 && ky > -1) {
          fields[ky][kx] = fieldColor;
        }
      }

      if (holdShapes[key] != -1) {
        [holdShapes[key], controlBlock.shapeID] = [controlBlock.shapeID, holdShapes[key]]
        controlBlock.shape = shapes[controlBlock.shapeID]
      } else {
        [holdShapes[key], controlBlock.shapeID] = [controlBlock.shapeID, nextShape[0]]
        controlBlock.shape = shapes[controlBlock.shapeID]
        nextShape = nextShape.slice(1)
        console.log("a",nextShape)
        randomBlocks();
        console.log("a",nextShape)
        drawNext(nextFields.value, nextShape, (n) => n == 0 ? 1 : 0.5);
      }
      drawNext(holdFields.value, holdShapes)

      controlBlock.color = controlBlock.shape.color;
      controlBlock.pos = 0;
      controlBlock.X = ((fieldWidth / 2) - ((fieldWidth / 2) % blockSize)) - blockSize;
      controlBlock.Y = -blockSize;
      held[key] = true
      //document.querySelector(`[keyboard="${key}"]`).classList.add("held")
      drawGameField();
    }
  },


  // テトリミノ描画
  draw: () => {
    for (var i = 0; i < controlBlock.shape[`rot${controlBlock.pos}` as "rot1"].length; i++) {
      genStrokedBlock(tfield.value!, (controlBlock.X + (controlBlock.shape[`rot${controlBlock.pos}` as "rot1"][i][0] * blockSize)), (controlBlock.Y + (controlBlock.shape[`rot${controlBlock.pos}` as "rot1"][i][1] * blockSize)), controlBlock.color, fieldColor);
    }
  },

  // テトリミノ影描画
  drawShadow: () => {
    const ghostPos = controlBlock.getShadowPos();
    for (var i = 0; i < controlBlock.shape[`rot${controlBlock.pos}` as "rot1"].length; i++) {
      genStrokedBlock(
        tfield.value!,
        (ghostPos[0] + (controlBlock.shape[`rot${controlBlock.pos}` as "rot1"][i][0] * blockSize)),
        (ghostPos[1] + (controlBlock.shape[`rot${controlBlock.pos}` as "rot1"][i][1] * blockSize)),
        "rgba(250,250,250,0.1)",
        "rgba(250,250,250,0.2)"
      );
    }
  }
}


// ライン消去処理
const removeLinesEffect = function (removeLines: number[]) {
  let tempFields = fields.slice()
  if (DLEffect) {
    gamePaused = true
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
      gamePaused = false;
      drawGameField();
      timeoutID = setTimeout(loopGame, speed);
    })()
  } else {
    fields = tempFields.filter((_, index) => {
      return !removeLines.includes(index)
    })
    while (fields.length < fieldHeight) {
      fields.push(emptyLine.slice())
    }
  }
}
const removeLines = function () {
  // 一度に消せるのは最大４行
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

    // 点数評価
    const multiplier = 25 * (deleteLines.length ** 2);
    score.value += (multiplier * (level.value + 1));
    removeLinesEffect(deleteLines)
  }
}


// ゲームフォールド描画
const drawGameField = function () {
  for (var y = 0; y < blockNumHeight; y++) {
    for (var x = 0; x < blockNumWidth; x++) {
      genBlock(tfield.value!, x, y, fields[y][x]);
    }
  }
  controlBlock.drawShadow();
  controlBlock.draw();
}

// 押しっぱなし左移動
const moveLeft = function () {
  if (lKeyPressed) {
    controlBlock.moveLeft();
    setTimeout(moveLeft, sensitivity);
  }
}

// 押しっぱなし右移動
const moveRight = function () {
  if (rKeyPressed) {
    controlBlock.moveRight();
    setTimeout(moveRight, sensitivity);
  }
}
// キー取得
var getKeyCode = function(e : KeyboardEvent) {
  var code;
  if (window.event) {  // IE
    code = e.keyCode;
  } else if(e.which) { // Netscape/Firefox/Opera
    code = e.which;
  }
  return code;
}

/*
 * キーイベント（キー入力）の制御
 */
// キーアップイベント初期化(押しっ放し対応)
document.onkeyup = function(e) {
  var keycode = getKeyCode(e);
  if (keycode == 32) {          // space
    spacePressed = false;
  } else if (keycode == 37) {   // ←
    lKeyPressed = false;
  } else if (keycode == 39) {   // →
    rKeyPressed = false;
  }
}
// キーダウンイベント初期化
document.onkeydown = function(e) {
  var keycode = getKeyCode(e);
  if (!gameEnd && !gamePaused) {
    if (keycode == 38) {        // ↑
      e.preventDefault();
      controlBlock.rotate();
    } else if (keycode == 37) { // ←
      e.preventDefault();
      lKeyPressed = true;
      controlBlock.moveLeft();
    } else if (keycode == 39) { // →
      e.preventDefault();
      rKeyPressed = true;
      controlBlock.moveRight();
    } else if (keycode == 40) { // ↓
      e.preventDefault();
      controlBlock.moveDown();
    } else if (keycode == 32 && !spacePressed) { // space 押しっぱなしチェック
      spacePressed = true;
      e.preventDefault();
      controlBlock.dropDown();
    }
     else if (keycode == 86) { // ↓
      e.preventDefault();
      controlBlock.hold(0);

    }
     else if (keycode == 191) { // ↓
      e.preventDefault();
      controlBlock.rotate2;
      
    }
  }
  
  if (keycode == 80 && !gameEnd) {
    if (gamePaused) {
      gamePaused = false;
                  drawGameField();
            timeoutID = setTimeout(loopGame, speed);
    } else {
      gamePaused = true;
      gamePause(tfield.value?.getContext("2d")!);
    }
  }
}

const confirmResetGame = () => {
  if(confirm("本当にリセットしますか？")){
    resetGame()
  }
}

/*
 * タッチイベントの制御
 */
// タッチイベント
/*
var touchStart = function(e) {
  if (!gameEnd && !gamePaused) {
    if (e.target.id == "roleButton") {        // ↑
      e.preventDefault();
      block.rotate();
    } else if (e.target.id == "leftButton") { // ←
      e.preventDefault();
      lKeyPressed = true;
      block.chkMoveLeft();
    } else if (e.target.id == "rightButton") { // →
      e.preventDefault();
      rKeyPressed = true;
      block.chkMoveRight();
    } else if (e.target.id == "downButton") { // ↓
      e.preventDefault();
      block.moveDown(20);
    } else if (e.target.id == "spaceButton" && !spacePressed) { // space 押しっぱなしチェック
      spacePressed = true;
      e.preventDefault();
      block.dropDown();
    }
  }
  
  if (e.target.id == "pauseButton" && !gameEnd) {
    if (gamePaused) {
      gamePaused = false;
    } else {
      gamePaused = true;
      gamePause();
    }
  }
}
var touchEnd = function(e) {
  if (e.target.id == "spaceButton") {          // space
    spacePressed = false;
  } else if (e.target.id == "leftButton") {   // ←
    lKeyPressed = false;
  } else if (e.target.id == "rightButton") {   // →
    rKeyPressed = false;
  }
}
var startupTouch = function() {
  var elLeft = document.getElementById("leftButton");
  elLeft.addEventListener("touchstart", touchStart, false);
  elLeft.addEventListener("touchend", touchEnd, false);
  //elLeft.addEventListener("touchcancel", handleCancel, false);
  //elLeft.addEventListener("touchmove", handleMove, false);

  var elRight = document.getElementById("rightButton");
  elRight.addEventListener("touchstart", touchStart, false);
  elRight.addEventListener("touchend", touchEnd, false);
  //elRight.addEventListener("touchcancel", handleCancel, false);
  //elRight.addEventListener("touchmove", handleMove, false);

  var elRole = document.getElementById("roleButton");
  elRole.addEventListener("touchstart", touchStart, false);
  elRole.addEventListener("touchend", touchEnd, false);
  //elRole.addEventListener("touchcancel", handleCancel, false);
  //elRole.addEventListener("touchmove", handleMove, false);

  var elDown = document.getElementById("downButton");
  elDown.addEventListener("touchstart", touchStart, false);
  elDown.addEventListener("touchend", touchEnd, false);
  //elDown.addEventListener("touchcancel", handleCancel, false);
  //elDown.addEventListener("touchmove", handleMove, false);

  var elSpace = document.getElementById("spaceButton");
  elSpace.addEventListener("touchstart", touchStart, false);
  elSpace.addEventListener("touchend", touchEnd, false);
  //elSpace.addEventListener("touchcancel", handleCancel, false);
  //elSpace.addEventListener("touchmove", handleMove, false);

  var elPause = document.getElementById("pauseButton");
  elPause.addEventListener("touchstart", touchStart, false);
  elPause.addEventListener("touchend", touchEnd, false);
  //elPause.addEventListener("touchcancel", handleCancel, false);
  //elPause.addEventListener("touchmove", handleMove, false);
}
*/

/*
 * メインループ
 */
// ゲームループ
const loopGame = function () {
  if (!gameEnd) {
    if (!gamePaused) {
      controlBlock.moveDown();
      timeoutID = setTimeout(loopGame, speed);
      removeLines();
      drawGameField();
    }
  } else {
    gameOver(tfield.value?.getContext("2d")!, score.value);
  }
}


</script>

<template>
  <div id="gameArea">

    <div id="holdField">
      <div v-for="i in holdNum" :key="`hold${i}`">
        <div class="title">ホールド {{ i }}</div>
        <canvas class="holdCanvas" :ref="setHoldFieldsRef"></canvas>
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
  <div id="scoreBoard">
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
  <div id="buttonArea">
    <button @click="confirmResetGame()" class="longButton" id="resetButton">ゲームをリセットする</button>
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

#resetButton{
  background-color: #f64;
  background: -moz-linear-gradient(top, #f64, #f23 );
  color: white;
  transition-property: opacity;
  transition-duration: 0.25s;
}

#resetButton:hover{
  opacity: 0.6;
}

li {
  list-style: none;
}

#scoreBoard {
  position: absolute;
  right: 50px;
  top: 180px;
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
