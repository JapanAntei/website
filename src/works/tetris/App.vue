<script setup lang="ts">
import NAHeader from '@shared/components/NAHeader.vue'
import NAFooter from '@shared/components/NAFooter.vue';
import Tetris from './scripts/tetris.vue';
import TetrisSetting from './setting/TetrisSetting.vue';
import { ref } from 'vue';


const pausing = ref(false)

function pause(){
  console.log("aaaaa")
  pausing.value = !pausing.value
}
function resetPause(){
  pausing.value = false;
}

const firstKeyBinds = {'down': 'S', 'left': 'A', 'right': 'D', 'drop': 'W', 'hold': ['X'], 'rotateR': 'E', 'rotateL': 'Q', pause:'F'}
const firstKeyboardAlias = {'→': 'D', '←' : 'A', '↓': 'S', '↑': 'E', '_': 'W', 'V': 'X', '/': 'Q', '\\' : 'E', 'P': 'F'}
// const secondKeyBinds = {'down': 'L', 'left': 'K', 'right': ';', 'drop': 'O', 'hold': [','], 'rotateR': 'P', 'rotateL': 'I', pause:'J'}


</script>

<template>
  <NAHeader/>
  <main>
    <h1>Go Me Tetris</h1>
    <div style="display: flex;justify-content: center;">

      <Tetris :left="true" 
        :key-binds="firstKeyBinds"
        :keyboard-alias="firstKeyboardAlias"
        @pause-button="pause" @reset-pause="resetPause" :pausing="pausing" />
      <!-- <Tetris :left="false" 
        :key-binds="secondKeyBinds"
        @pause-button="pause" @reset-pause="resetPause" :pausing="pausing" /> <!-- -->
    </div>
    <div style="display: flex;justify-content: center;">
      <TetrisSetting settting-id="GoMeTetrisSettings"></TetrisSetting>
    </div>
    <p>使用ソースコード: <a href="https://www.gadgety.net/shin/web/games/tetris.html">https://www.gadgety.net/shin/web/games/tetris.html</a></p>
  </main>
  <NAFooter/>

</template>

<style scoped></style>
