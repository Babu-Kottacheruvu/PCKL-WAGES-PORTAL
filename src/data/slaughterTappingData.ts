export type SlaughterStatus = 'Draft' | 'Supervisor Verified' | 'Ready for Wage Posting';

export interface SlaughterTappingRecord {
  id: string;
  date: string;
  division: string;
  fieldNumber: string;
  replantingBlock: string;
  tapper: string;
  treeCount: number;
  latexKg: number;
  scrapKg: number;
  tappingDays: number;
  ratePerTree: number;
  ratePerKg: number;
  status: SlaughterStatus;
  approvalNote: string;
}

export const slaughterTappingRecords: SlaughterTappingRecord[] = [
  {
    id: 'STP-20260608-001',
    date: '08 Jun 2026',
    division: 'North Division',
    fieldNumber: 'Field A1',
    replantingBlock: 'RP-2026-A',
    tapper: 'K. Mohan',
    treeCount: 420,
    latexKg: 156.4,
    scrapKg: 28.6,
    tappingDays: 3,
    ratePerTree: 3.5,
    ratePerKg: 18,
    status: 'Supervisor Verified',
    approvalNote: 'Marked for pre-replanting extraction after block inspection',
  },
  {
    id: 'STP-20260608-002',
    date: '08 Jun 2026',
    division: 'River Division',
    fieldNumber: 'Field B1',
    replantingBlock: 'RP-2026-B',
    tapper: 'M. Ravi',
    treeCount: 310,
    latexKg: 92.8,
    scrapKg: 34.2,
    tappingDays: 2,
    ratePerTree: 3.5,
    ratePerKg: 18,
    status: 'Draft',
    approvalNote: 'Awaiting estate manager confirmation',
  },
  {
    id: 'STP-20260608-003',
    date: '08 Jun 2026',
    division: 'Hill Division',
    fieldNumber: 'Field C3',
    replantingBlock: 'RP-2026-C',
    tapper: 'R. Suresh',
    treeCount: 515,
    latexKg: 201.6,
    scrapKg: 46.9,
    tappingDays: 4,
    ratePerTree: 3.75,
    ratePerKg: 20,
    status: 'Ready for Wage Posting',
    approvalNote: 'Final slaughter tapping completed before uprooting schedule',
  },
  {
    id: 'STP-20260608-004',
    date: '08 Jun 2026',
    division: 'Factory Division',
    fieldNumber: 'Field D2',
    replantingBlock: 'RP-2026-D',
    tapper: 'A. Kumar',
    treeCount: 275,
    latexKg: 76.2,
    scrapKg: 19.8,
    tappingDays: 2,
    ratePerTree: 3.5,
    ratePerKg: 18,
    status: 'Supervisor Verified',
    approvalNote: 'Tree count cross-checked with replanting register',
  },
];
