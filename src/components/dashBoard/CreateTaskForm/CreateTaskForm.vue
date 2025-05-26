<template>
    <div class="panel create-task">
      <div class="panel-header"><span>작업 생성</span></div>
      <div class="panel-body">
        <input v-model="form.title" placeholder="작업 제목" />
        <input type="date" v-model="form.due" />
        <textarea v-model="form.desc" placeholder="설명"></textarea>
        <button class="btn" @click="emitCreate">생성</button>
      </div>
    </div>
</template>
  
<script setup>
  import { reactive } from 'vue'
  import { defineEmits } from 'vue'
  const emit = defineEmits(['create'])
  const form = reactive({ title: '', due: '', desc: '' })
  function emitCreate() {
    emit('create', { ...form })
    form.title = ''
    form.due = ''
    form.desc = ''
  }
</script>
  
<style scoped>
  .create-task input, .create-task textarea { width: 100%; margin-bottom: 8px; padding: 6px; box-sizing: border-box; border: 1px solid #000; }
  .create-task textarea { resize: vertical; min-height: 80px; }
  .btn { background: #3b82f6; color: #fff; border: 1px solid #000; padding: 8px 12px; cursor: pointer; border-radius: 4px; }
</style>