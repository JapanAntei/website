<script setup lang="ts">
import NAHeader from '@shared/components/NAHeader.vue'
import NAFooter from '@shared/components/NAFooter.vue';
import Tetris from './scripts/tetris.vue';
</script>

<template>
  <NAHeader/>
  <main>
    <h1>Go Me Tetris</h1>
    <Tetris />
    <p>使用ソースコード: <a href="https://www.gadgety.net/shin/web/games/tetris.html">https://www.gadgety.net/shin/web/games/tetris.html</a></p>
  </main>
  <NAFooter/>

</template>

<style scoped></style>
