<script setup lang="ts">
import NAHeader from '@shared/components/NAHeader.vue'
import NAFooter from '@shared/components/NAFooter.vue';
import Tetris from '../scripts/tetris.vue';
import TetrisSetting from '../setting/TetrisSetting.vue';
import { ref } from 'vue';
import type { KeyBinds, keyboardAlias } from '../scripts/globalData';
import KeybindSetting from '../setting/KeybindSetting.vue';

const SettingID = "GoMeTetrisDouble"

const pausing = ref<boolean>(true)
const reset = ref<number>(0)

const defaultKeybindFirst: KeyBinds = {'down': 'S', 'left': 'A', 'right': 'D', 'drop': 'W', 'hold': ['X'], 'rotateR': 'E', 'rotateL': 'Q', pause:'F'}
const defaultKeybindSecond: KeyBinds = {'down': 'L', 'left': 'K', 'right': ';', 'drop': 'O', 'hold': [','], 'rotateR': 'P', 'rotateL': 'I', pause:'J'}
const defaultKeyboardAlias: keyboardAlias = {}

const firstKeyBinds = ref<KeyBinds>(structuredClone(defaultKeybindFirst))
const secondKeyBinds = ref<KeyBinds>(structuredClone(defaultKeybindSecond))
const firstKeyboardAlias = ref<keyboardAlias>(structuredClone(defaultKeyboardAlias))


</script>

<template>
  <NAHeader/>
  <main>
    <h1>ふたりで！ Go Me Tetris</h1>
    <div style="display: flex;justify-content: center;">

      <Tetris :left="true" 
        :key-binds="firstKeyBinds"
        :keyboard-alias="firstKeyboardAlias"
        v-model:pausing="pausing"
        v-model:reset="reset"
        :settting-id="SettingID"
        />
      <Tetris :left="false" 
        :key-binds="secondKeyBinds"
        :keyboard-alias="firstKeyboardAlias"
        v-model:pausing="pausing"
        v-model:reset="reset"
        :settting-id="SettingID"
        /> <!-- -->
    </div>
    <div style="display: flex;justify-content: center;">
      <TetrisSetting :settting-id="SettingID"></TetrisSetting>
    </div>
    <div style="display: flex;justify-content: center;">
      <KeybindSetting
        :second-player="true"
        v-model:keybind-first="firstKeyBinds"
        v-model:keybind-second="secondKeyBinds"
        :reset="reset"
        v-model:keyboard-alias="firstKeyboardAlias"
        :setting-id="SettingID"
        :default-keybind-first="defaultKeybindFirst"
        :default-keybind-second="defaultKeybindSecond"
        :default-keyboard-alias="defaultKeyboardAlias"
      ></KeybindSetting>
    </div>
    <div style="display: flex;justify-content: center;">
      <details id="TetrisDetails">
        <summary>仕様解説</summary>
        <h3>スコアの計算式</h3>
        <p style="font-weight: 700;">基本スコア = 25 * (レベル + 1) * 消去ライン数^2</p>
        <p>X-Spin時、消去ライン数を2倍</p>
        <p>X-Spin Mini時、基本スコアを2倍</p>
        <p>基本スコアを、ライン消去直前の特殊回転の回数+1倍</p>
        <p>All Clear時、基本スコアを10倍</p>
        <h3>落下速度</h3>
        <p style="font-weight: 700;">落下間隔[ms] = 700 - レベル * 50</p>
        <p>レベル14以上では、理論上落下間隔が0msになります。</p>
        <h3>T-Spin判定</h3>
        <p>T字ミノでのライン消去時、四隅のうち3箇所が埋まっていたら、</p>
        <p>空いているのが凸側なら、T-Spin Mini</p>
        <p>空いているのが平ら側なら、T-Spin</p>
        <h3>Dot-Spin判定</h3>
        <p>1マスミノでのライン消去時、</p>
        <p>上下左右が埋まっていたら、Dot-Spin Mini</p>
        <p>斜めも含め周り全マスが埋まっていたら、Dot-Spin</p>
      </details>
    </div>
    <p>使用ソースコード: <a href="https://www.gadgety.net/shin/web/games/tetris.html">https://www.gadgety.net/shin/web/games/tetris.html</a></p>
  </main>
  <NAFooter/>

</template>

<style scoped>
#TetrisDetails{
    border: red solid 2px;
    border-radius: 5px;
    width: 80vw;
}
details{
    margin-top:20px;
}
</style>
