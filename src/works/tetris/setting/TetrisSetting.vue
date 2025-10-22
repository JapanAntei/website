<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { defaultSettings, getSettingObj } from '../scripts/globalData';


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

const saveSettings = () => {
    localStorage.setItem(props.setttingId ?? "GoMeTetrisSettings", JSON.stringify({
        blockSize: Number(blockSize.value?.value),
        blockNumHeight: Number(blockNumHeight.value?.value),
        blockNumWidth: Number(blockNumWidth.value?.value),
        nextNum: Number(nextNum.value?.value),
        holdNum: Number(holdNum.value?.value),
        randomType: randomType.value?.checked
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

        </ul>
            <button @click="saveSettings">設定を保存する</button>
            <button @click="resetSettings">設定をリセットする</button>
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
</style>