<template lang="pug">
.panel.task-list
  .panel-header
    span Task List
    .filter-controls
      select(v-model="localFilter.status")
        option(value="all") All Status
        option(value="todo") Todo
        option(value="in-progress") In Progress
        option(value="done") Done
      select(v-model="localFilter.priority")
        option(value="all") All Priority
        option(value="high") High
        option(value="medium") Medium
        option(value="low") Low
  .loading(v-if="loading") Loading...
  ul.panel-body(v-else)
    TaskItem(
      v-for="task in filteredTasks"
      :key="task.id"
      :task="task"
      @status-change="(status) => $emit('statusChange', task.id, status)"
      @delete="() => $emit('delete', task.id)"
    )
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue'
// eslint-disable-next-line no-unused-vars
import TaskItem from './TaskItem.vue'

const props = defineProps({
  tasks: {
    type: Array,
    required: true,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  filter: {
    type: Object,
    default: () => ({
      status: 'all',
      priority: 'all',
      assignee: null
    })
  }
})

defineEmits(['statusChange', 'delete'])

// Local filter state to avoid prop mutation
const localFilter = ref({
  status: props.filter.status,
  priority: props.filter.priority,
  assignee: props.filter.assignee
})

// Watch for prop changes
watch(() => props.filter, (newFilter) => {
  localFilter.value = { ...newFilter }
}, { deep: true })

// eslint-disable-next-line no-unused-vars
const filteredTasks = computed(() => {
  return props.tasks.filter(task => {
    if (localFilter.value.status !== 'all' && task.status !== localFilter.value.status) return false
    if (localFilter.value.priority !== 'all' && task.priority !== localFilter.value.priority) return false
    if (localFilter.value.assignee && task.assignee !== localFilter.value.assignee) return false
    return true
  })
})
</script>

<style scoped>
.panel-body { 
  list-style: none; 
  margin: 0; 
  padding: 8px; 
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
}

.filter-controls {
  display: flex;
  gap: 8px;
}

.filter-controls select {
  padding: 4px;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>