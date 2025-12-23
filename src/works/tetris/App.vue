<script setup lang="ts">
import NAHeader from '@shared/components/NAHeader.vue'
import NAFooter from '@shared/components/NAFooter.vue';
import Tetris from './scripts/tetris.vue';
import TetrisSetting from './setting/TetrisSetting.vue';
import { ref } from 'vue';
import type { KeyBinds, keyboardAlias } from './scripts/globalData';
import KeybindSetting from './setting/KeybindSetting.vue';
import TetrisDetails from './TetrisDetails.vue';

const SettingID = "GoMeTetris"

const pausing = ref<boolean>(false)
const reset = ref<number>(0)

const defaultKeybindFirst: KeyBinds = {'down': 'S', 'left': 'A', 'right': 'D', 'drop': 'W', 'hold': ['X'], 'rotateR': 'E', 'rotateL': 'Q', pause:'F'}
const defaultKeybindSecond: KeyBinds = {'down': 'L', 'left': 'K', 'right': ';', 'drop': 'O', 'hold': [','], 'rotateR': 'P', 'rotateL': 'I', pause:'J'}
const defaultKeyboardAlias: keyboardAlias = {'→': 'D', '←' : 'A', '↓': 'S', '↑': 'E', '_': 'W', 'V': 'X', '/': 'Q', '\\' : 'E', 'P': 'F'}

const firstKeyBinds = ref<KeyBinds>(structuredClone(defaultKeybindFirst))
const secondKeyBinds = ref<KeyBinds>(structuredClone(defaultKeybindSecond))
const firstKeyboardAlias = ref<keyboardAlias>(structuredClone(defaultKeyboardAlias))

//window.setTimeout(() => firstKeyBinds.value.down = "F", 5000)

</script>

<template>
  <NAHeader/>
  <main>
    <h1>Go Me Tetris</h1>
    <div style="display: flex;justify-content: center;">

      <Tetris :left="true" 
        :key-binds="firstKeyBinds"
        :keyboard-alias="firstKeyboardAlias"
        v-model:pausing="pausing"
        v-model:reset="reset"
        :settting-id="SettingID"
        />
      <!-- <Tetris :left="false" 
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
        :second-player="false"
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
        <TetrisDetails />
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
