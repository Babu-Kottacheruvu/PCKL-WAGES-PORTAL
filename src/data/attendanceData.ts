export type AttendanceStatus = 'Present' | 'Absent' | 'Half-Day' | 'On Leave' | 'Holiday' | 'Weekly Off' | 'Sick Leave';
export type LeaveType = 'Annual Leave' | 'Sick Leave' | 'Maternity/Paternity Leave' | 'Unpaid Leave' | null;

export interface AttendanceRecord {
  id: string;
  date: string;
  workerId: string;
  workerName: string;
  role: string;
  division: string;
  field: string;
  status: AttendanceStatus;
  leaveType?: LeaveType;
  linkedTappingRecordId?: string; // Links to a TappingOperation ID if applicable
}

export interface AttendanceCorrectionRequest {
  id: string;
  recordId: string;
  requestedBy: string;
  requestedDate: string;
  originalStatus: AttendanceStatus;
  proposedStatus: AttendanceStatus;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  auditNote?: string;
}

export interface MonthlySummary {
  workerId: string;
  workerName: string;
  monthYear: string; // e.g., '2026-06'
  totalDays: number;
  presentDays: number;
  absentDays: number;
  halfDays: number;
  leaveDays: number;
  holidays: number;
  weeklyOffs: number;
}

export const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: 'ATT-20260608-001',
    date: '2026-06-08',
    workerId: 'W-001',
    workerName: 'K. Mohan',
    role: 'Tapper',
    division: 'Division A',
    field: 'Field A1',
    status: 'Present',
    linkedTappingRecordId: 'TOP-20260608-001',
  },
  {
    id: 'ATT-20260608-002',
    date: '2026-06-08',
    workerId: 'W-002',
    workerName: 'R. Suresh',
    role: 'Tapper',
    division: 'Division C',
    field: 'Field C3',
    status: 'Present',
    linkedTappingRecordId: 'TOP-20260608-002',
  },
  {
    id: 'ATT-20260608-003',
    date: '2026-06-08',
    workerId: 'W-003',
    workerName: 'M. Ravi',
    role: 'Tapper',
    division: 'Division B',
    field: 'Field B1',
    status: 'Half-Day',
    linkedTappingRecordId: 'TOP-20260608-003',
  },
  {
    id: 'ATT-20260608-004',
    date: '2026-06-08',
    workerId: 'W-004',
    workerName: 'A. Kumar',
    role: 'Tapper',
    division: 'Division A',
    field: 'Field A2',
    status: 'Present',
    linkedTappingRecordId: 'TOP-20260608-004',
  },
  {
    id: 'ATT-20260608-005',
    date: '2026-06-08',
    workerId: 'W-005',
    workerName: 'P. Nimal',
    role: 'Tapper',
    division: 'Division D',
    field: 'Field D2',
    status: 'Absent',
    linkedTappingRecordId: 'TOP-20260608-005',
  },
  // Example of unusual pattern (consecutive absences) for P. Nimal
  {
    id: 'ATT-20260607-005',
    date: '2026-06-07',
    workerId: 'W-005',
    workerName: 'P. Nimal',
    role: 'Tapper',
    division: 'Division D',
    field: 'Field D2',
    status: 'Absent',
  },
  {
    id: 'ATT-20260606-005',
    date: '2026-06-06',
    workerId: 'W-005',
    workerName: 'P. Nimal',
    role: 'Tapper',
    division: 'Division D',
    field: 'Field D2',
    status: 'Absent',
  },
  {
    id: 'ATT-20260608-006',
    date: '2026-06-08',
    workerId: 'W-006',
    workerName: 'S. Rajan',
    role: 'Field Worker',
    division: 'Division B',
    field: 'Field B2',
    status: 'Sick Leave',
    leaveType: 'Sick Leave',
  },
];

export const mockCorrectionRequests: AttendanceCorrectionRequest[] = [
  {
    id: 'COR-001',
    recordId: 'ATT-20260608-005',
    requestedBy: 'F-SUP-01 (M. Pillai)',
    requestedDate: '2026-06-08T10:30:00Z',
    originalStatus: 'Absent',
    proposedStatus: 'Half-Day',
    reason: 'Worker arrived late due to bus breakdown.',
    status: 'Pending',
  },
];

export const mockMonthlySummaries: MonthlySummary[] = [
  {
    workerId: 'W-001',
    workerName: 'K. Mohan',
    monthYear: '2026-05',
    totalDays: 31,
    presentDays: 24,
    absentDays: 1,
    halfDays: 0,
    leaveDays: 2,
    holidays: 0,
    weeklyOffs: 4,
  },
  {
    workerId: 'W-005',
    workerName: 'P. Nimal',
    monthYear: '2026-05',
    totalDays: 31,
    presentDays: 18,
    absentDays: 7,
    halfDays: 2,
    leaveDays: 0,
    holidays: 0,
    weeklyOffs: 4,
  },
];
