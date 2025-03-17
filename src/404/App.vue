<script setup lang="ts">
import NAHeader from '@shared/components/NAHeader.vue'
import NAFooter from '@shared/components/NAFooter.vue';
</script>

<template>
  <NAHeader />
  <main>
    <h1>指定されたページが見つかりませんでした</h1>
    <p>URLを確認してください</p>
  </main>
  <NAFooter />
</template>

<style scoped>
#topContent{
  display: flex;
}
#sloganBox{
  width: 100%;
  height: 100%;
  position:absolute;
  display: flex;
}
#slogan{
  font-size: 70px;
}

#sloganBox > div{
  flex: 1;
  justify-content:center;
  align-items:center;
  display: flex;
}

#mainPicture {
  height: 100vh;
  width: 100vw;
  object-fit: cover;
}

.noto-sans-jp {
  font-family: "Noto Sans JP", sans-serif;
  font-optical-sizing: auto;
  font-weight: 700;
  font-style: normal;
}
.noto-serif-jp {
  font-family: "Noto Serif JP", serif;
  font-optical-sizing: auto;
  font-weight: 100;
  font-style: normal;
}

main{
  margin-bottom: 30px;
  margin-bottom: 30px;
}
</style>
