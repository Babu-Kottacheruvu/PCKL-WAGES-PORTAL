import type { User, Role } from '../types/auth';

const roles: Role[] = [
  'System Admin',
  'Head Office Admin',
  'Estate Manager',
  'Estate Clerk',
  'Field Supervisor',
  'Weighment Operator',
  'Wage Processing Officer',
  'HR Officer',
  'Accounts Officer',
  'Auditor Level 1',
  'Auditor Level 2',
  'Production Officer',
  'Management Viewer'
];

export const dummyUsers: User[] = roles.map((role, index) => ({
  id: `USR-${1000 + index}`,
  name: `${role.split(' ')[0]} User`,
  email: `${role.toLowerCase().replace(/ /g, '.')}@example.com`,
  role,
  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(role)}&background=random`,
}));
