<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { getSettingObj } from '../scripts/globalData';


const props = defineProps({
    setttingId: String,
})


const settings = getSettingObj(props.setttingId)

const blockSize = useTemplateRef("blockSize")
const blockNumHeight = useTemplateRef("blockNumHeight")
const blockNumWidth = useTemplateRef("blockNumWidth")
const nextNum = useTemplateRef("nextNum")
const holdNum = useTemplateRef("holdNum")

const saveSettings = () => {
    localStorage.setItem(props.setttingId ?? "GoMeTetrisSettings", JSON.stringify({
        blockSize: blockSize.value?.value,
        blockNumHeight: blockNumHeight.value?.value,
        blockNumWidth: blockNumWidth.value?.value,
        nextNum: nextNum.value?.value,
        holdNum: holdNum.value?.value
    }))
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