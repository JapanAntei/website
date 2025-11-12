<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { bigBlockBox, defaultSettings, getSettingObj } from '../scripts/globalData';
import { drawNext } from '../scripts/canvasController';
import { shapes } from '../scripts/shapes';


const props = defineProps({
    setttingId: String,
})


const settings = getSettingObj(props.setttingId)

const blockSize = useTemplateRef("blockSize")
const blockNumHeight = useTemplateRef("blockNumHeight")
const blockNumWidth = useTemplateRef("blockNumWidth")
const nextNum = useTemplateRef("nextNum")
const holdNum = useTemplateRef("holdNum")
const randomType = useTemplateRef("randomType")
const rotateSystem = useTemplateRef("rotateSystem")
const DLEffect = useTemplateRef("DLEffect")
const ghost = useTemplateRef("ghost")
const lockdownSystem = useTemplateRef("lockdownSystem")
const scoreDisplay = useTemplateRef("scoreDisplay")
const scoreDetails = useTemplateRef("scoreDetails")
const shapeCount = [...Array(shapes.length)].map((_, i) => i)
const shapeField = ref<HTMLCanvasElement[]>([])
const setShapeFieldRef = (el: any) => {
  if (el) {
    shapeField.value.push(el)
    el.width = bigBlockBox
    el.height = bigBlockBox
        drawNext(shapeField.value, shapeCount, () => 1)
  }
}


const saveSettings = () => {
    localStorage.setItem(props.setttingId ?? "GoMeTetrisSettings", JSON.stringify({
        blockSize: Number(blockSize.value?.value),
        blockNumHeight: Number(blockNumHeight.value?.value),
        blockNumWidth: Number(blockNumWidth.value?.value),
        nextNum: Number(nextNum.value?.value),
        holdNum: Number(holdNum.value?.value),
        randomType: randomType.value?.checked,
        startingShapes: Array.from(document.querySelectorAll<HTMLInputElement>(".startingShape")).filter(elem => elem.checked).map((elem) => Number(elem.dataset.shapeNumber)).toSorted(),
        dropShapes: Array.from(document.querySelectorAll<HTMLInputElement>(".randomShape")).filter(elem => elem.checked).map((elem) => Number(elem.dataset.shapeNumber)).toSorted(),
        rotateSystem: rotateSystem.value?.checked,
        DLEffect: DLEffect.value?.checked,
        ghost: ghost.value?.checked,
        lockdownSystem: lockdownSystem.value?.checked,
        scoreDetails: scoreDetails.value?.checked,
        scoreDisplay: scoreDisplay.value?.checked,
    }))
}

const resetSettings = () => {
    localStorage.setItem(props.setttingId ?? "GoMeTetrisSettings", `{}`)
    if(blockSize.value) blockSize.value.value = defaultSettings.blockSize.toString()
    if(blockNumHeight.value) blockNumHeight.value.value = defaultSettings.blockNumHeight.toString()
    if(blockNumWidth.value) blockNumWidth.value.value = defaultSettings.blockNumWidth.toString()
    if(nextNum.value) nextNum.value.value = defaultSettings.nextNum.toString()
    if(holdNum.value) holdNum.value.value = defaultSettings.holdNum.toString()
    if(randomType.value) randomType.value.checked = defaultSettings.randomType;
    if(rotateSystem.value) rotateSystem.value.checked = defaultSettings.rotateSystem;
    if(DLEffect.value) DLEffect.value.checked = defaultSettings.DLEffect;
    if(ghost.value) ghost.value.checked = defaultSettings.ghost;
    if(lockdownSystem.value) lockdownSystem.value.checked = defaultSettings.lockdownSystem;
    if(scoreDetails.value) scoreDetails.value.checked = defaultSettings.scoreDetails;
    if(scoreDisplay.value) scoreDisplay.value.checked = defaultSettings.scoreDisplay;
    for(const elem of document.querySelectorAll<HTMLInputElement>(".startingShape")){
        elem.checked = defaultSettings.startingShapes.includes(Number(elem.dataset.shapeNumber))
    }
    for(const elem of document.querySelectorAll<HTMLInputElement>(".randomShape")){
        elem.checked = defaultSettings.dropShapes.includes(Number(elem.dataset.shapeNumber))
    }
}

const moreGoMeTetrisSettings = () => {
    const modifiedSettings = structuredClone(defaultSettings)
    modifiedSettings.randomType = true;
    modifiedSettings.startingShapes = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]
    modifiedSettings.dropShapes = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21]
    localStorage.setItem(props.setttingId ?? "GoMeTetrisSettings", JSON.stringify(modifiedSettings))
    if(randomType.value) randomType.value.checked = modifiedSettings.randomType;
    for(const elem of document.querySelectorAll<HTMLInputElement>(".startingShape")){
        elem.checked = modifiedSettings.startingShapes.includes(Number(elem.dataset.shapeNumber))
    }
    for(const elem of document.querySelectorAll<HTMLInputElement>(".randomShape")){
        elem.checked = modifiedSettings.dropShapes.includes(Number(elem.dataset.shapeNumber))
    }
}
const normalGoMeTetrisSettings = () => {
    const modifiedSettings = structuredClone(defaultSettings)
    modifiedSettings.nextNum = 5
    modifiedSettings.holdNum = 1
    modifiedSettings.randomType = false;
    modifiedSettings.rotateSystem = true
    modifiedSettings.DLEffect = true;
    modifiedSettings.ghost = true;
    modifiedSettings.lockdownSystem = true;
    modifiedSettings.startingShapes = [2,3,5,6]
    modifiedSettings.dropShapes = [0,1,2,3,4,5,6]
    localStorage.setItem(props.setttingId ?? "GoMeTetrisSettings", JSON.stringify(modifiedSettings))
    if(nextNum.value) nextNum.value.value = modifiedSettings.nextNum.toString()
    if(holdNum.value) holdNum.value.value = modifiedSettings.holdNum.toString()
    if(randomType.value) randomType.value.checked = modifiedSettings.randomType;
    if(rotateSystem.value) rotateSystem.value.checked = modifiedSettings.rotateSystem;
    if(DLEffect.value) DLEffect.value.checked = modifiedSettings.DLEffect;
    if(ghost.value) ghost.value.checked = modifiedSettings.ghost;
    if(lockdownSystem.value) lockdownSystem.value.checked = modifiedSettings.lockdownSystem;
    for(const elem of document.querySelectorAll<HTMLInputElement>(".startingShape")){
        elem.checked = modifiedSettings.startingShapes.includes(Number(elem.dataset.shapeNumber))
    }
    for(const elem of document.querySelectorAll<HTMLInputElement>(".randomShape")){
        elem.checked = modifiedSettings.dropShapes.includes(Number(elem.dataset.shapeNumber))
    }
}

</script>

<template>
    <details>
        <summary>Go Me Tetrisの設定</summary>
        <h3>ミノについて</h3>
        <ul>
            <li>
                <label for="blockSize">ブロックの1辺の長さ (px)</label>
                <input ref="blockSize" type="number" id="blockSize" min="1" :value="settings.blockSize" />
            </li>
            <li>
                <label for="blockNumHeight">フィールドの縦のブロック数</label>
                <input ref="blockNumHeight" type="number" id="blockNumHeight" min="1" :value="settings.blockNumHeight" />
            </li>
            <li>
                <label for="blockNumWidth">フィールドの横のブロック数</label>
                <input ref="blockNumWidth" type="number" id="blockNumWidth" min="1" :value="settings.blockNumWidth" />
            </li>
            <li style="vertical-align: top">
                <input ref="randomType" type="checkbox" id="randomType" :checked="settings.randomType">
                <label for="randomType" style="display: inline-block;">ミノ抽選を完全ランダムにする</label>
            </li>
            <li style="vertical-align: top">
                <input ref="rotateSystem" type="checkbox" id="rotateSystem" :checked="settings.rotateSystem">
                <label for="rotateSystem" style="display: inline-block;">SRS回転を有効にする</label>
            </li>
            <li style="vertical-align: top">
                <input ref="lockdownSystem" type="checkbox" id="lockdownSystem" :checked="settings.lockdownSystem">
                <label for="lockdownSystem" style="display: inline-block;">ロックダウンを有効にする</label>
            </li>
            

        </ul>
        <h3>画面表示について</h3>
        <ul>
            <li>
                <label for="nextNum">次のブロックの数</label>
                <input ref="nextNum" type="number" id="nextNum" min="1" :value="settings.nextNum" />
            </li>
            <li>
                <label for="holdNum">ホールドの数</label>
                <input ref="holdNum" type="number" id="holdNum" min="1" :value="settings.holdNum" />
            </li>
            <li style="vertical-align: top">
                <input ref="DLEffect" type="checkbox" id="DLEffect" :checked="settings.DLEffect">
                <label for="DLEffect" style="display: inline-block;">ライン消去時にアニメーションをする</label>
            </li>
            <li style="vertical-align: top">
                <input ref="ghost" type="checkbox" id="ghost" :checked="settings.ghost">
                <label for="ghost" style="display: inline-block;">ゴーストブロックを表示する</label>
            </li>
            <li style="vertical-align: top">
                <input ref="scoreDisplay" type="checkbox" id="scoreDisplay" :checked="settings.scoreDisplay">
                <label for="scoreDisplay" style="display: inline-block;">ライン消去時に加算されるスコアを表示する</label>
            </li>
            <li style="vertical-align: top">
                <input ref="scoreDetails" type="checkbox" id="scoreDetails" :checked="settings.scoreDetails">
                <label for="scoreDetails" style="display: inline-block;">スコアの詳細も表示する</label>
            </li>

        </ul>
        <h3>ミノの種類</h3>
        <div id="nextField">
          <div v-for="i in shapes.length" :key="`next${i-1}`" class="shapesSettingBox">
            <canvas class="holdCanvas" :ref="setShapeFieldRef"></canvas>
            <div style="text-align: left; margin-left: 10px;">
            <div style="vertical-align: top">
                <input type="checkbox" class="startingShape" :id="`startingShape${i-1}`" :data-shape-number="i-1" :checked="settings.startingShapes.includes(i-1)">
                <label :for="`startingShape${i-1}`" style="display: inline-block;">最初のミノ抽選の候補に入れる</label>
            </div>
            <div style="vertical-align: top">
                <input type="checkbox" class="randomShape" :id="`randomShape${i-1}`" :data-shape-number="i-1" :checked="settings.dropShapes.includes(i-1)">
                <label :for="`randomShape${i-1}`" style="display: inline-block;">ミノ抽選候補に入れる</label>
            </div>
            </div>
          </div>
        </div>
        <button @click="saveSettings">設定を保存する</button>
        <button @click="resetSettings">設定をリセットする</button>
        <br />
        <button @click="moreGoMeTetrisSettings">もっと！ Go Me Tetris</button>
        <button @click="normalGoMeTetrisSettings">通常のテトリス</button>
    </details>
</template>

<style lang="css" scoped>
details{
    border: blue solid 2px;
    border-radius: 5px;
    width: 80vw;
}
input[type="number"]{
    margin-left: 5px;
}
li{
    list-style-position: inside
}

.shapesSettingBox{
    display: flex;
    place-items: center;
    justify-content: center;
    margin-bottom: 10px;
}
</style>