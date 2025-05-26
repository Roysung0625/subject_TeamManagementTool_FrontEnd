<template>
    <div class="panel overview">
      <div class="panel-header"><span>팀 전체 상세보기</span></div>
      <div class="panel-body overview-body">
        <button class="btn full" @click="$emit('team-details')">팀 작업 상세보기</button>
        <button class="btn full" @click="$emit('workspace-details')">워크스페이스 상세보기</button>
      </div>
    </div>
</template>

<script setup>
  // emits 'team-details', 'workspace-details'
</script>
  
<style scoped>
  .overview-body { display: flex; flex-direction: column; gap: 8px; }
  .btn.full { width: 100%; text-align: center; }
</style>