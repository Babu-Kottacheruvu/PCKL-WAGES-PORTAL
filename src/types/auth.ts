export type Role = 
  | 'System Admin'
  | 'Head Office Admin'
  | 'Estate Manager'
  | 'Estate Clerk'
  | 'Field Supervisor'
  | 'Weighment Operator'
  | 'Wage Processing Officer'
  | 'HR Officer'
  | 'Accounts Officer'
  | 'Auditor Level 1'
  | 'Auditor Level 2'
  | 'Production Officer'
  | 'Management Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}
