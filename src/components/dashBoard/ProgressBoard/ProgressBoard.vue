<template>
    <div class="panel progress">
      <div class="panel-header"><span>금일 소속팀 각 팀원 진척도</span></div>
      <div class="panel-body">
        <table>
          <tbody>
            <MemberRow v-for="m in members" :key="m.id" :member="m" />
          </tbody>
        </table>
      </div>
    </div>
</template>
  
<script setup>
  import { defineProps } from 'vue'
  import MemberRow from './MemberRow.vue'
  const props = defineProps({ members: Array })
</script>
  
<style scoped>
  /* .panel-header { reuse styling from TeamList } */
  .panel-body table { width: 100%; border-collapse: collapse; }
  .panel-body tr { border-bottom: 1px solid #ddd; }
</style>