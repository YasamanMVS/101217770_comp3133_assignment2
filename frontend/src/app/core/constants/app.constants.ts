export const API_URL = 'http://localhost:4000';
export const GRAPHQL_URL = `${API_URL}/graphql`;

export const TOKEN_KEY = 'auth_token';
export const USER_KEY = 'user';

export const DEPARTMENTS = [
  'Human Resources',
  'Finance',
  'Marketing',
  'Sales',
  'Engineering',
  'Operations',
  'Customer Support',
  'Research and Development',
  'Legal',
  'Information Technology'
];

export const POSITIONS = [
  'Manager',
  'Director',
  'Senior Manager',
  'Team Lead',
  'Senior Engineer',
  'Engineer',
  'Analyst',
  'Specialist',
  'Coordinator',
  'Associate'
];

export const FILE_TYPES = {
  IMAGE: ['image/jpeg', 'image/png', 'image/gif'],
  MAX_SIZE: 5 * 1024 * 1024 // 5MB
}; 