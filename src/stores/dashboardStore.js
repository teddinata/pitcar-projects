// src/stores/dashboardStore.js
import { defineStore } from 'pinia'
import apiClient from '@/config/api'
import { format, subDays, subMonths, subQuarters, subYears } from 'date-fns'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    loading: false,
    error: null,
    dashboardData: {
      summary: null,
      projects: [],
      tasks: {},
      bau: {},
      team_performance: [],
      revisions: {},
      time_tracking: {},
      trends: {}
    },
    projects: [],
    teamMembers: [],
    filters: {
      period: 'week',
      projectId: '',
      creatorId: ''
    }
  }),
  
  getters: {
    atRiskProjects: (state) => {
      return (state.dashboardData.projects || [])
        .filter(project => project.risk_assessment?.is_at_risk)
        .slice(0, 5) // Top 5 at-risk projects
    },
    
    teamPerformance: (state) => {
      return (state.dashboardData.team_performance || []).slice(0, 5) // Top 5 performers
    },
    
    upcomingDeadlines: (state) => {
      return (state.dashboardData.tasks?.upcoming_deadlines || []).slice(0, 5) // 5 most urgent deadlines
    },
    
    highRevisionTasks: (state) => {
      return (state.dashboardData.revisions?.high_revision_tasks || []).slice(0, 5) // Top 5 high revision tasks
    },
    
    recentCompletedTasks: (state) => {
      return (state.dashboardData.tasks?.recent_completed || [])
    },
    
    taskDurations: (state) => {
      return (state.dashboardData.tasks?.durations || [])
    },
    
    creatorPerformance: (state) => {
      return (state.dashboardData.bau?.creator_performance || [])
    },
    
    onTimeTasks: (state) => {
      const completedTasks = state.dashboardData.summary?.tasks?.completed || 0
      const onTimeRate = state.dashboardData.summary?.tasks?.on_time_rate || 0
      return Math.round(completedTasks * onTimeRate / 100)
    }
  },
  
  actions: {
    async fetchDashboardData() {
      try {
        this.loading = true
        this.error = null
        
        // Calculate date range
        const dateRange = this.calculateDateRange(this.filters.period)
        
        // Call dashboard endpoint
        const response = await apiClient.post('/web/v2/content/dashboard', {
          jsonrpc: '2.0',
          method: 'call',
          id: new Date().getTime(),
          params: {
            date_from: dateRange.from,
            date_to: dateRange.to,
            project_id: this.filters.projectId || undefined,
            creator_id: this.filters.creatorId || undefined
          }
        })

        if (response.data.result?.status === 'success') {
          this.dashboardData = response.data.result.data
          // Also fetch projects and team members for filters
          this.fetchProjectsAndTeamMembers()
        }
      } catch (error) {
        this.error = error.message || 'Failed to load dashboard data'
        console.error('Error fetching dashboard data:', error)
      } finally {
        this.loading = false
      }
    },
    
    async fetchProjectsAndTeamMembers() {
      try {
        // Fetch projects list
        const projectsResponse = await apiClient.post('/web/v2/content/projects/list', {
          jsonrpc: '2.0',
          method: 'call',
          id: new Date().getTime(),
          params: {}
        })

        if (projectsResponse.data.result?.status === 'success') {
          this.projects = projectsResponse.data.result.data
        }
        
        // For team members, we'll use data from team performance
        // This is a simplification - in a real app you might have a dedicated endpoint
        const uniqueMembers = new Map()
        
        // Add team members from team performance
        if (this.dashboardData.team_performance) {
          this.dashboardData.team_performance.forEach(member => {
            if (!uniqueMembers.has(member.id)) {
              uniqueMembers.set(member.id, {
                id: member.id,
                name: member.name
              })
            }
          })
        }
        
        // Add team members from BAU creator performance
        if (this.dashboardData.bau?.creator_performance) {
          this.dashboardData.bau.creator_performance.forEach(creator => {
            if (!uniqueMembers.has(creator.id)) {
              uniqueMembers.set(creator.id, {
                id: creator.id,
                name: creator.name
              })
            }
          })
        }
        
        this.teamMembers = Array.from(uniqueMembers.values())
        
      } catch (error) {
        console.error('Error fetching filters data:', error)
      }
    },
    
    calculateDateRange(period) {
      const now = new Date()
      let startDate
      
      switch (period) {
        case 'week':
          startDate = subDays(now, 7)
          break
        case 'month':
          startDate = subMonths(now, 1)
          break
        case 'quarter':
          startDate = subQuarters(now, 1)
          break
        case 'year':
          startDate = subYears(now, 1)
          break
        default:
          startDate = subDays(now, 7)
      }
      
      return {
        from: format(startDate, 'yyyy-MM-dd'),
        to: format(now, 'yyyy-MM-dd')
      }
    },
    
    updateFilters(newFilters) {
      this.filters = {
        ...this.filters,
        ...newFilters
      }
    }
  }
})