// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import BAUDashboard from '@/views/BAU/Dashboard.vue'
import BAUTeamView from '@/views/BAU/TeamView.vue'
import BAUCalendarView from '@/views/BAU/CalendarView.vue'
import TeamBAU from '@/views/team/BAUDashboard.vue'
import TeamBAUActivities from '@/views/team/BAUActivities.vue'

// Impor komponen Task Management
import TaskTimesheetsPage from '@/views/team/TaskTimesheetsPage.vue'
import TaskTimeReportsPage from '@/views/team/TaskTimeReportsPage.vue'
import TeamTaskManager from '@/views/team/TeamTaskManager.vue'

// Import Project Dashboard component
import TeamProjectDashboard from '@/views/team/TeamDashboard.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/marketing/dashboard',
    name: 'DashboardMarketing',
    component: () => import('../views/ContentDashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '',
    redirect: '/marketing/projects',
    meta: { requiresAuth: true }
  },
  // Marketing Routes
  {
    path: '/marketing/projects',
    name: 'DashboardOverview',
    component: () => import('../views/dashboard/Projects.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/marketing/project/:id',
    name: 'ProjectDetail',
    component: () => import('../views/dashboard/ProjectDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/marketing/project/tasks',
    name: 'ProjectTasks',
    component: () => import('../views/dashboard/Tasks.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/marketing/bau/activities',
    name: 'BAU',
    component: () => import('../views/BAU/Activity.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/marketing/bau/dashboard',
    name: 'BAUDashboard',
    component: BAUDashboard,
    meta: { title: 'BAU Dashboard' }
  },
  {
    path: '/marketing/bau/team',
    name: 'BAUTeamView',
    component: BAUTeamView,
    meta: { title: 'Team BAU Overview' }
  },
  {
    path: '/marketing/bau/calendar',
    name: 'BAUCalendarView',
    component: BAUCalendarView,
    meta: { title: 'BAU Calendar' }
  },
    // {
    //   path: '/marketing/analytics',
    //   name: 'MarketingAnalytics',
    //   component: () => import('../views/dashboard/Analytics.vue'),
    //   meta: { requiresAuth: true }
    // },

  // Team Routes
  {
    path: '/team/projects',
    name: 'TeamProject',
    component: () => import('../views/team/Projects.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team/project/:id',
    name: 'TeamProjectDetail',
    component: () => import('../views/team/ProjectDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team/project/tasks',
    name: 'TeamProjectTask',
    component: () => import('../views/team/Tasks.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team/bau/dashboard',
    name: 'TeamBAU',
    component: TeamBAU,
    meta: { title: 'Team BAU Overview' }
  },
  {
    path: '/team/bau/activities',
    name: 'TeamBAUActivities',
    component: TeamBAUActivities,
    meta: {
      requiresAuth: true,
      title: 'BAU Activities'
    }
  },
  {
    path: '/team/bau/calendar',
    name: 'TeamBAUCalendar',
    component: () => import('@/views/team/BAUCalendar.vue'),
    meta: {
      requiresAuth: true,
      title: 'Team BAU Calendar'
    }
  },
  {
    path: '/team/bau/members',
    name: 'TeamBAUTeamView',
    component: () => import('@/views/team/BAUTeam.vue'),
    meta: {
      requiresAuth: true,
      title: 'Team BAU Members'
    }
  },
  // {
  //   path: '/team/analytics',
  //   name: 'TeamAnalytics',
  //   component: () => import('@/views/team/Analytics.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     title: 'Team Analytics'
  //   }
  // },
  {
    path: '/team/members',
    name: 'TeamMembers',
    component: () => import('@/views/team/BAUTeam.vue'),
    meta: {
      requiresAuth: true,
      title: 'Team Members'
    }
  },
  // {
  //   path: '/team/dashboard',
  //   name: 'TeamDashboard',
  //   component: () => import('@/views/team/Dashboard.vue'),
  //   meta: {
  //     requiresAuth: true,
  //     title: 'Team Dashboard'
  //   }
  // },

  // Task Management Routes
  {
    path: '/team/tasks',
    name: 'tasks',
    component: TeamTaskManager,
    meta: {
      requiresAuth: true,
      title: 'All Tasks'
    }
  },
  {
    path: '/tasks/my-tasks',
    name: 'myTasks',
    component: TeamTaskManager,
    props: {
      filterByCurrentUser: true
    },
    meta: {
      requiresAuth: true,
      title: 'My Tasks'
    }
  },
  {
    path: '/team/timesheets',
    name: 'timesheets',
    component: TaskTimesheetsPage,
    meta: {
      requiresAuth: true,
      title: 'Task Timesheets'
    }
  },
  {
    path: '/team/time-reports',
    name: 'timeReports',
    component: TaskTimeReportsPage,
    meta: {
      requiresAuth: true,
      title: 'Time Reports'
    }
  },
  {
    path: '/tasks/:id',
    name: 'taskDetail',
    component: TaskTimesheetsPage,
    props: route => ({ selectedTaskId: parseInt(route.params.id) }),
    meta: {
      requiresAuth: true,
      title: 'Task Detail'
    }
  },
  
  // Duplicate routes with team path prefix for consistency
  {
    path: '/team/tasks',
    name: 'teamTasks',
    component: TeamTaskManager,
    meta: {
      requiresAuth: true,
      title: 'All Tasks'
    }
  },
  {
    path: '/team/tasks/my-tasks',
    name: 'teamMyTasks',
    component: TeamTaskManager,
    props: {
      filterByCurrentUser: true
    },
    meta: {
      requiresAuth: true,
      title: 'My Tasks'
    }
  },
  {
    path: '/team/tasks/timesheets',
    name: 'teamTimesheets',
    component: TaskTimesheetsPage,
    meta: {
      requiresAuth: true,
      title: 'Task Timesheets'
    }
  },
  {
    path: '/team/tasks/time-reports',
    name: 'teamTimeReports',
    component: TaskTimeReportsPage,
    meta: {
      requiresAuth: true,
      title: 'Time Reports'
    }
  },
  {
    path: '/team/tasks/:id',
    name: 'teamTaskDetail',
    component: TaskTimesheetsPage,
    props: route => ({ selectedTaskId: parseInt(route.params.id) }),
    meta: {
      requiresAuth: true,
      title: 'Task Detail'
    }
  },
  {
    path: '/team/dashboard', // Route baru untuk Project Dashboard
    name: 'TeamDashboard',
    component: TeamProjectDashboard,
    meta: {
      requiresAuth: true,
      title: 'Team Dashboard'
    }
  },
  {
    path: '/team/notifications',
    name: 'notifications',
    component: () => import('@/views/team/Notifications.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/team/mentions',
    name: 'Mentions',
    component: () => import('@/views/team/Mentions.vue'),
    meta: { requiresAuth: true }
  },

  // Other Routes
  {
    path: '/dashboard/ai-assistant',
    name: 'ai-assistant',
    component: () => import('../views/AIAssistant.vue')
  },
  // {
  //   path: '/profile',
  //   name: 'profile',
  //   component: () => import('../views/Profile.vue'),
  //   meta: { requiresAuth: true }
  // },
  // {
  //   path: '/:pathMatch(.*)*',
  //   name: 'NotFound',
  //   component: () => import('../views/NotFound.vue')
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    authStore.checkAuth()
    if (!authStore.isAuthenticated) {
      next('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router