<template lang="pug">
.progress-bar
  .progress-fill(
    :style="{ width: `${props.progress}%`, backgroundColor: progressColor }"
  )
</template>

<script setup>
import { computed, defineProps } from 'vue'

const props = defineProps({
  progress: {
    type: Number,
    required: true,
    validator: (value) => value >= 0 && value <= 100
  }
})

// eslint-disable-next-line no-unused-vars
const progressColor = computed(() => {
  if (props.progress < 30) return '#ff4444'  // 빨간색 (낮은 진행률)
  if (props.progress < 70) return '#ffaa00'  // 노란색 (중간 진행률)
  return '#00cc44'                    // 초록색 (높은 진행률)
})
</script>

<style scoped>
.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #eee;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
}
</style>