import { defineStore } from 'pinia'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [
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
    ],
    filter: {
      status: 'all',
      priority: 'all',
      assignee: null
    },
    loading: false
  }),

  getters: {
    getTasks: (state) => state.tasks,
    getFilter: (state) => state.filter,
    isLoading: (state) => state.loading,
    
    getFilteredTasks: (state) => {
      return state.tasks.filter(task => {
        if (state.filter.status !== 'all' && task.status !== state.filter.status) return false
        if (state.filter.priority !== 'all' && task.priority !== state.filter.priority) return false
        if (state.filter.assignee && task.assignee !== state.filter.assignee) return false
        return true
      })
    }
  },

  actions: {
    setFilter(filter) {
      this.filter = { ...this.filter, ...filter }
    },

    async addTask(task) {
      this.loading = true
      try {
        // TODO: API 호출
        const newTask = { id: Date.now(), ...task }
        this.tasks.push(newTask)
        return newTask
      } finally {
        this.loading = false
      }
    },

    async updateTaskStatus(taskId, newStatus) {
      this.loading = true
      try {
        // TODO: API 호출
        const task = this.tasks.find(t => t.id === taskId)
        if (task) {
          task.status = newStatus
        }
      } finally {
        this.loading = false
      }
    },

    async deleteTask(taskId) {
      this.loading = true
      try {
        // TODO: API 호출
        this.tasks = this.tasks.filter(t => t.id !== taskId)
      } finally {
        this.loading = false
      }
    }
  }
}) 