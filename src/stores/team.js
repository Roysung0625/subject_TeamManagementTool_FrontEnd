import { defineStore } from 'pinia'

export const useTeamStore = defineStore('team', {
  state: () => ({
    teams: [
      { 
        id: 1, 
        name: '프론트엔드 팀',
        description: '웹 프론트엔드 개발팀',
        memberCount: 5
      },
      { 
        id: 2, 
        name: '백엔드 팀',
        description: 'API 개발팀',
        memberCount: 4
      }
    ],
    selectedTeam: null,
    loading: false
  }),

  getters: {
    getTeams: (state) => state.teams,
    getSelectedTeam: (state) => state.selectedTeam,
    isLoading: (state) => state.loading
  },

  actions: {
    setSelectedTeam(team) {
      this.selectedTeam = team
    },

    async addTeam(team) {
      this.loading = true
      try {
        // TODO: API 호출
        const newTeam = { id: Date.now(), ...team }
        this.teams.push(newTeam)
        return newTeam
      } finally {
        this.loading = false
      }
    },

    async updateTeam(teamId, updates) {
      this.loading = true
      try {
        // TODO: API 호출
        const team = this.teams.find(t => t.id === teamId)
        if (team) {
          Object.assign(team, updates)
        }
      } finally {
        this.loading = false
      }
    },

    async deleteTeam(teamId) {
      this.loading = true
      try {
        // TODO: API 호출
        this.teams = this.teams.filter(t => t.id !== teamId)
        if (this.selectedTeam?.id === teamId) {
          this.selectedTeam = null
        }
      } finally {
        this.loading = false
      }
    }
  }
}) 