export type HolidayType = 'National Holiday' | 'Festival Holiday' | 'Weekly Off';
export type HolidayStatus = 'Active' | 'Inactive';

export interface HolidayRecord {
  id: string;
  name: string;
  type: HolidayType;
  date: string;
  estate: string;
  status: HolidayStatus;
}

export interface HolidayWageRecord {
  id: string;
  workerId: string;
  workerName: string;
  holidayDate: string;
  holidayType: HolidayType;
  eligibility: 'Eligible' | 'Not Eligible';
  wageRate: number;
  calculatedWage: number;
}

export interface ALWRecord {
  id: string;
  workerId: string;
  workerName: string;
  daysWorkedPreviousYear: number;
  leaveEntitled: number;
  leaveAvailed: number;
  balanceLeave: number;
}

export interface LeaveBalanceRecord {
  id: string;
  employeeName: string;
  employeeId: string;
  totalEntitled: number;
  availed: number;
  remainingBalance: number;
  carryForward: number;
}

export interface LeaveRequestRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'Annual' | 'Sick' | 'Casual' | 'Maternity';
  fromDate: string;
  toDate: string;
  reason: string;
  attachment: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface EncashmentRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveBalance: number;
  encashableLeave: number;
  wageRate: number;
  encashmentAmount: number;
  status: 'Pending' | 'Approved';
}

export interface WeeklyOffWageRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  weeklyOffDate: string;
  eligibility: 'Eligible' | 'Not Eligible';
  wageRate: number;
  computedWage: number;
}

export const holidayRecords: HolidayRecord[] = [
  { id: 'H-001', name: 'Republic Day', type: 'National Holiday', date: '2026-01-26', estate: 'North Estate', status: 'Active' },
  { id: 'H-002', name: 'Onam Festival', type: 'Festival Holiday', date: '2026-08-15', estate: 'South Estate', status: 'Active' },
  { id: 'H-003', name: 'Sunday Weekly Off', type: 'Weekly Off', date: '2026-06-08', estate: 'Central Estate', status: 'Active' },
  { id: 'H-004', name: 'Christmas', type: 'Festival Holiday', date: '2026-12-25', estate: 'North Estate', status: 'Inactive' },
];

export const holidayWageRecords: HolidayWageRecord[] = [
  { id: 'HW-001', workerId: 'W-1001', workerName: 'Rajesh Kumar', holidayDate: '2026-01-26', holidayType: 'National Holiday', eligibility: 'Eligible', wageRate: 600, calculatedWage: 600 },
  { id: 'HW-002', workerId: 'W-1002', workerName: 'Asha Nair', holidayDate: '2026-08-15', holidayType: 'Festival Holiday', eligibility: 'Eligible', wageRate: 550, calculatedWage: 550 },
  { id: 'HW-003', workerId: 'W-1003', workerName: 'Thomas Varghese', holidayDate: '2026-06-08', holidayType: 'Weekly Off', eligibility: 'Not Eligible', wageRate: 0, calculatedWage: 0 },
];

export const alwRecords: ALWRecord[] = [
  { id: 'ALW-001', workerId: 'W-1001', workerName: 'Rajesh Kumar', daysWorkedPreviousYear: 420, leaveEntitled: 21, leaveAvailed: 16, balanceLeave: 5 },
  { id: 'ALW-002', workerId: 'W-1002', workerName: 'Asha Nair', daysWorkedPreviousYear: 380, leaveEntitled: 19, leaveAvailed: 18, balanceLeave: 1 },
  { id: 'ALW-003', workerId: 'W-1003', workerName: 'Thomas Varghese', daysWorkedPreviousYear: 450, leaveEntitled: 22, leaveAvailed: 20, balanceLeave: 2 },
];

export const leaveBalanceRecords: LeaveBalanceRecord[] = [
  { id: 'LB-001', employeeName: 'Rajesh Kumar', employeeId: 'W-1001', totalEntitled: 24, availed: 18, remainingBalance: 6, carryForward: 2 },
  { id: 'LB-002', employeeName: 'Asha Nair', employeeId: 'W-1002', totalEntitled: 22, availed: 20, remainingBalance: 2, carryForward: 1 },
  { id: 'LB-003', employeeName: 'Thomas Varghese', employeeId: 'W-1003', totalEntitled: 26, availed: 21, remainingBalance: 5, carryForward: 3 },
];

export const leaveRequestRecords: LeaveRequestRecord[] = [
  { id: 'LR-001', employeeId: 'W-1001', employeeName: 'Rajesh Kumar', leaveType: 'Annual', fromDate: '2026-06-25', toDate: '2026-06-28', reason: 'Family event', attachment: 'none.pdf', status: 'Pending' },
  { id: 'LR-002', employeeId: 'W-1002', employeeName: 'Asha Nair', leaveType: 'Sick', fromDate: '2026-07-02', toDate: '2026-07-03', reason: 'Health recovery', attachment: 'medical.pdf', status: 'Approved' },
  { id: 'LR-003', employeeId: 'W-1003', employeeName: 'Thomas Varghese', leaveType: 'Casual', fromDate: '2026-06-18', toDate: '2026-06-18', reason: 'Personal work', attachment: 'none.pdf', status: 'Rejected' },
];

export const encashmentRecords: EncashmentRecord[] = [
  { id: 'EC-001', employeeId: 'W-1001', employeeName: 'Rajesh Kumar', leaveBalance: 6, encashableLeave: 4, wageRate: 650, encashmentAmount: 2600, status: 'Pending' },
  { id: 'EC-002', employeeId: 'W-1002', employeeName: 'Asha Nair', leaveBalance: 2, encashableLeave: 2, wageRate: 620, encashmentAmount: 1240, status: 'Approved' },
];

export const weeklyOffWageRecords: WeeklyOffWageRecord[] = [
  { id: 'WO-001', employeeId: 'W-1001', employeeName: 'Rajesh Kumar', weeklyOffDate: '2026-06-07', eligibility: 'Eligible', wageRate: 580, computedWage: 580 },
  { id: 'WO-002', employeeId: 'W-1002', employeeName: 'Asha Nair', weeklyOffDate: '2026-06-07', eligibility: 'Eligible', wageRate: 560, computedWage: 560 },
  { id: 'WO-003', employeeId: 'W-1003', employeeName: 'Thomas Varghese', weeklyOffDate: '2026-06-07', eligibility: 'Not Eligible', wageRate: 0, computedWage: 0 },
];
