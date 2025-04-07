export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  profilePic?: string;
}

export interface EmployeeInput {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  profilePic?: string;
} 