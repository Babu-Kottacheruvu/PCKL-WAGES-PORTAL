export type AttendanceStatus = 'Present' | 'Absent' | 'Half Day';
export type SourceDocumentStatus = 'Uploaded' | 'Pending' | 'Rejected';

export interface TappingOperation {
  id: string;
  date: string;
  tapper: string;
  attendance: AttendanceStatus;
  fieldNumber: string;
  latexKg: number;
  scrapKg: number;
  fieldDrc: number;
  factoryDrc: number;
  minimumKg: number;
  baseWage: number;
  overKiloRate: number;
  sourceDocument: SourceDocumentStatus;
  documentName: string;
  auditNote: string;
}

export const tappingOperations: TappingOperation[] = [
  {
    id: 'TOP-20260608-001',
    date: '08 Jun 2026',
    tapper: 'K. Mohan',
    attendance: 'Present',
    fieldNumber: 'Field A1',
    latexKg: 24.6,
    scrapKg: 3.4,
    fieldDrc: 31.8,
    factoryDrc: 30.9,
    minimumKg: 18,
    baseWage: 950,
    overKiloRate: 42,
    sourceDocument: 'Uploaded',
    documentName: 'A1_Mohan_signed.pdf',
    auditNote: 'Supervisor and tapper signatures matched',
  },
  {
    id: 'TOP-20260608-002',
    date: '08 Jun 2026',
    tapper: 'R. Suresh',
    attendance: 'Present',
    fieldNumber: 'Field C3',
    latexKg: 28.9,
    scrapKg: 2.1,
    fieldDrc: 32.4,
    factoryDrc: 31.7,
    minimumKg: 19,
    baseWage: 980,
    overKiloRate: 44,
    sourceDocument: 'Uploaded',
    documentName: 'C3_Suresh_signed.pdf',
    auditNote: 'DRC variance within tolerance',
  },
  {
    id: 'TOP-20260608-003',
    date: '08 Jun 2026',
    tapper: 'M. Ravi',
    attendance: 'Half Day',
    fieldNumber: 'Field B1',
    latexKg: 11.8,
    scrapKg: 1.9,
    fieldDrc: 29.6,
    factoryDrc: 28.8,
    minimumKg: 14,
    baseWage: 475,
    overKiloRate: 34,
    sourceDocument: 'Pending',
    documentName: 'Awaiting upload',
    auditNote: 'Signed field sheet pending from supervisor',
  },
  {
    id: 'TOP-20260608-004',
    date: '08 Jun 2026',
    tapper: 'A. Kumar',
    attendance: 'Present',
    fieldNumber: 'Field A2',
    latexKg: 20.7,
    scrapKg: 2.8,
    fieldDrc: 33.1,
    factoryDrc: 30.2,
    minimumKg: 20,
    baseWage: 970,
    overKiloRate: 46,
    sourceDocument: 'Rejected',
    documentName: 'A2_Kumar_scan.jpg',
    auditNote: 'Signature image unclear; re-upload required',
  },
  {
    id: 'TOP-20260608-005',
    date: '08 Jun 2026',
    tapper: 'P. Nimal',
    attendance: 'Absent',
    fieldNumber: 'Field D2',
    latexKg: 0,
    scrapKg: 0,
    fieldDrc: 0,
    factoryDrc: 0,
    minimumKg: 20,
    baseWage: 0,
    overKiloRate: 46,
    sourceDocument: 'Uploaded',
    documentName: 'D2_absence_register.pdf',
    auditNote: 'Approved absence recorded',
  },
];
