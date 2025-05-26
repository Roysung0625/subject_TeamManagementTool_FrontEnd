<template>
  <div id="app">
    <!-- (필요하다면 여기에 전역 헤더/네비게이션 추가) -->
    <DashBoard />
  </div>
</template>

<script setup>
import DashBoard from '@/views/DashBoard.vue'
</script>

<style>
#app {
  /* 전역 레이아웃 스타일 */
  display: flex;
  justify-content: center;
  background: #fff;
  min-height: 100vh;
}
</style>
