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
  margin-left: auto;
  margin-right: auto;
  padding-left: 40px;
  padding-right: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
}

.header-logo {
  display: block;
  width: 170px;
}

.header-logo>img {
  max-width: 170px;
  max-height: 85px;
}

.site-menu ul {
  display: flex;
  list-style: none;
}

.site-menu ul li {
  margin-left: 20px;
  margin-right: 20px;
  color: inherit;
  text-decoration: none;
}
</style>
