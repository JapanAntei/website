<script setup lang="ts">

</script>

<template>
  <header>
    <a class="header-logo" href="/">
      <img src="/img/logo.png" alt="ロゴ">
    </a>
    <div class="header-site-menu">
      <nav class="site-menu">
        <ul>
          <li><a href="/about/">about</a></li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<style scoped>
header {
  height: 60px;
  width: 100%;
  box-sizing: border-box;
  padding-left: 40px;
  padding-right: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.6);
  position: fixed;
  top: 0;
  border-bottom: 2px solid gray;
  z-index: 50;
}

.header-logo {
  display: block;
  background-position: center;
}

.header-logo>img {
  max-width: 170px;
  max-height: 60px;
}

.header-site-menu{
  height:70%;
  top:0px;
}

.site-menu{
  border-right: 1px solid rgb(200,200,200);
  height: 100%;
}

.site-menu ul {
  display: flex;
  list-style: none;
  border-left: 1px solid rgb(200,200,200);
  padding : 0;
  padding-right : 10px;
  padding-left : 10px;
  margin: 0px !important;
  height: 100%;
}

.site-menu ul li {
  margin-left: 20px;
  margin-right: 20px;
  color: inherit;
  text-decoration: none;
  height: 100%;
  display: flex;
  align-items: center;
  height: 100%;

}
</style>
