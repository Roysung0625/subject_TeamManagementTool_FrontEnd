import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 태스크 관련 상태 관리 스토어
 * Composition API 스타일로 구현
 */
export const useTaskStore = defineStore('task', () => {
  // 상태
  const tasks = ref([
    { 
      id: 1, 
      title: '로그인 페이지 개발', 
      due: '2024-03-20',
      status: 'in-progress',
      assignee: '김철수',
      priority: 'high'
    },
    { 
      id: 2, 
      title: '회원가입 API 개발', 
      due: '2024-03-21',
      status: 'todo',
      assignee: '이영희',
      priority: 'medium'
    }
  ])

  const filter = ref({
    status: 'all',
    priority: 'all',
    assignee: null
  })

  const loading = ref(false)
  const error = ref(null)

  // 계산된 속성
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

  // 액션
  /**
   * 에러 설정
   * @param {string} errorMessage - 에러 메시지
   */
  function setError(errorMessage) {
    error.value = errorMessage
  }

  /**
   * 에러 초기화
   */
  function clearError() {
    error.value = null
  }

  /**
   * 필터 초기화
   */
  function resetFilter() {
    filter.value = {
      status: 'all',
      priority: 'all',
      assignee: null
    }
  }

  // 스토어 반환
  return {
    // 상태
    tasks,
    filter,
    loading,
    error,
    
    // 계산된 속성
    isLoading,
    taskCount,
    getFilteredTasks,
    getTasksByStatus,
    
    // 액션
    setError,
    clearError,
    resetFilter
  }
}) 