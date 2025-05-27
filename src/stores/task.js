import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * タスク関連状態管理ストア
 * Composition APIスタイルで実装
 */
export const useTaskStore = defineStore('task', () => {
  // 状態
  const tasks = ref([])

  const filter = ref({
    status: 'all',
    priority: 'all',
    assignee: null
  })

  const loading = ref(false)
  const error = ref(null)

  // 計算されたプロパティ
  const isLoading = computed(() => loading.value)
  const taskCount = computed(() => tasks.value.length)

  const getFilteredTasks = computed(() => {
    return tasks.value.filter(task => {
      if (filter.value.status !== 'all' && task.status !== filter.value.status) return false
      if (filter.value.priority !== 'all' && task.priority !== filter.value.priority) return false
      if (filter.value.assignee && task.assignee !== filter.value.assignee) return false
      return true
    })
  })

  const getTasksByStatus = computed(() => {
    return {
      todo: tasks.value.filter(task => task.status === 'todo'),
      'in-progress': tasks.value.filter(task => task.status === 'in-progress'),
      completed: tasks.value.filter(task => task.status === 'completed')
    }
  })

  // アクション
  /**
   * エラー設定
   * @param {string} errorMessage - エラーメッセージ
   */
  function setError(errorMessage) {
    error.value = errorMessage
  }

  /**
   * エラー初期化
   */
  function clearError() {
    error.value = null
  }

  /**
   * フィルター初期化
   */
  function resetFilter() {
    filter.value = {
      status: 'all',
      priority: 'all',
      assignee: null
    }
  }

  // ストア返却
  return {
    // 状態
    tasks,
    filter,
    loading,
    error,
    
    // 計算されたプロパティ
    isLoading,
    taskCount,
    getFilteredTasks,
    getTasksByStatus,
    
    // アクション
    setError,
    clearError,
    resetFilter
  }
}) 