export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  department: string;
  position: string;
  salary: number;
  hireDate: Date;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  department: string;
  position: string;
  salary: number;
  hireDate: Date;
  photoUrl?: string;
} 