// src/services/dashboardService.js
import apiClient from '@/config/api';

// Base request function
const makeRequest = async (endpoint, params = {}) => {
  try {
    const response = await apiClient.post(endpoint, {
      jsonrpc: '2.0',
      method: 'call',
      params: params
    });

    if (response.data.result?.status === 'success') {
      return {
        success: true,
        data: response.data.result.data || {}
      };
    } else {
      return {
        success: false,
        error: response.data.result?.message || 'Unknown error'
      };
    }
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error);
    return {
      success: false,
      error: error.message || 'Network error'
    };
  }
};

// Dashboard API endpoints
export default {
  // Summary data
  getDashboardSummary(params = {}) {
    return makeRequest('/web/v2/team/dashboard/summary', params);
  },
  
  // Team workload
  getTeamWorkload(params = {}) {
    return makeRequest('/web/v2/team/dashboard/workload', params);
  },
  
  // Recent activity
  getRecentActivity(params = {}) {
    return makeRequest('/web/v2/team/dashboard/activity', params);
  },
  
  // Project performance
  getProjectPerformance(params = {}) {
    return makeRequest('/web/v2/team/dashboard/performance', params);
  },
  
  // Task distribution
  getTaskDistribution(params = {}) {
    return makeRequest('/web/v2/team/dashboard/task-distribution', params);
  },
  
  // Resource allocation
  getResourceAllocation(params = {}) {
    return makeRequest('/web/v2/team/dashboard/resource-allocation', params);
  },
  
  // Department statistics
  getDepartmentStats(params = {}) {
    return makeRequest('/web/v2/team/dashboard/department-stats', params);
  },
  
  // Project milestones
  getProjectMilestones(params = {}) {
    return makeRequest('/web/v2/team/dashboard/project-milestones', params);
  },
  
  // Team performance
  getTeamPerformance(params = {}) {
    return makeRequest('/web/v2/team/dashboard/team-performance', params);
  },
  
  // Timeline data
  getDashboardTimeline(params = {}) {
    return makeRequest('/web/v2/team/dashboard/timeline', params);
  },
  
  // Get departments
  getDepartments() {
    return makeRequest('/web/v2/team/tasks/departments', {});
  }
};