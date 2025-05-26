// API 기본 설정
const API_CONFIG = {
  // process.env.VUE_APP_API_BASE_URL해보고 false일 시 뒤의 식 평가
  BASE_URL: process.env.VUE_APP_API_BASE_URL || 
    (process.env.NODE_ENV === 'production' 
      ? 'https://your-production-api.com' 
      : 'http://localhost:3000'),
  
  
  // 타임아웃 설정 (밀리초)
  TIMEOUT: parseInt(process.env.VUE_APP_API_TIMEOUT) || 10000,
  
  // Limit 기본값
  DEFAULT_LIMIT: 30
}

// API 엔드포인트 정의
export const API_ENDPOINTS = {
  // 인증 관련 API
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout'
  },
  
  // 팀 관리 API
  TEAMS: {
    CREATE: '/api/teams',
    UPDATE: (id) => `/api/teams/${id}`,
    DELETE: (id) => `/api/teams/${id}`,
    MEMBERS: (teamId) => `/api/teams/team/${teamId}`,
    MANAGEMENT: (teamId) => `/api/teams/management/${teamId}`,
    BY_EMPLOYEE: (employeeId) => `/api/teams/employee/${employeeId}`
  },
  
  // 태스크 관리 API
  TASKS: {
    CREATE: '/api/tasks',
    UPDATE: (id) => `/api/tasks/${id}`,
    DELETE: (id) => `/api/tasks/${id}`,
    DETAIL: (id) => `/api/tasks/${id}`,
    BY_EMPLOYEE_TODAY: (employeeId) => `/api/tasks/employee/${employeeId}/today`,
    BY_EMPLOYEE: (employeeId) => `/api/tasks/employee/${employeeId}`,
    BY_TEAM: (teamId) => `/api/tasks/team/${teamId}`,
    BY_TEAM_TODAY: (teamId) => `/api/tasks/team/${teamId}/today`
  }
}

// 쿼리 파라미터 빌더
export const buildQueryParams = (params = {}) => {
  //URLSearchParams는 내장 객체
  const searchParams = new URLSearchParams()
  
  for (const key in params) {
    const value = params[key]
    //비었거나 의도하지 않은 값이 들어있을 경우 무시
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value)
    }
  }
  
  const queryString = searchParams.toString()
  //삼항연산자
  return queryString ? `?${queryString}` : ''
}

// 완전한 URL 생성 함수
export function getApiUrl(endpoint, queryParams = {}) {
  const baseUrl = `${API_CONFIG.BASE_URL}${endpoint}`
  const queryString = buildQueryParams(queryParams)
  return `${baseUrl}${queryString}`
}

// HTTP 요청 기본 옵션
export const DEFAULT_REQUEST_OPTIONS = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: API_CONFIG.TIMEOUT
}

// 인증 토큰이 필요한 요청을 위한 헤더 생성
export function getAuthHeaders(token = null) {
  const headers = { ...DEFAULT_REQUEST_OPTIONS.headers }
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

// HTTP 상태 코드 상수
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
}

export default API_CONFIG 