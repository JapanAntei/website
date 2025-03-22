<script setup lang="ts">
import NAHeader from '@shared/components/NAHeader.vue'
import NAFooter from '@shared/components/NAFooter.vue';
</script>

<template>
  <NAHeader />
  <div id="topContent">
    <img src="/img/test.png" id="mainPicture">
    <div id="sloganBox">
      <div>
        <h2 id="slogan" class="noto-sans-jp">石の上にも三年<br>技術の手で三分</h2>
      </div>

      <div></div>
    </div>


  </div>
  <main>
    <h1>日本を安定陸塊にする会とは？</h1>
    <p>日本を安定陸塊にする会とは、日本を安定陸塊にしたいと思う滋賀県の生徒たちが集う会です。</p>
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

#slogan{
  font-size: 3rem;
}
@media (min-width: 1000px){
  #slogan{
  font-size: 4.5rem;
}
}

</style>
