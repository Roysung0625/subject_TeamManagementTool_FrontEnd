<template lang="pug">
#app
  //- (필요하다면 여기에 전역 헤더/네비게이션 추가)
  router-view
</template>

<script setup>
// 라우터를 사용하므로 직접 컴포넌트 import 불필요
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
