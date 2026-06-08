export type FieldOperationType = 'Manuring' | 'Weeding' | 'Factory Work' | 'Pest Control' | 'Irrigation';

export interface FieldOperationRecord {
  id: string;
  date: string;
  worker: string;
  division: string;
  workType: FieldOperationType;
  hours: number;
  baseRate: number;
  differentialRate: number;
  status: 'Completed' | 'Pending' | 'Verified';
}

export const fieldOperations: FieldOperationRecord[] = [
  {
    id: 'FO-001',
    date: '2026-06-05',
    worker: 'Rajesh Kumar',
    division: 'North Estate',
    workType: 'Manuring',
    hours: 7.5,
    baseRate: 210,
    differentialRate: 35,
    status: 'Completed',
  },
  {
    id: 'FO-002',
    date: '2026-06-05',
    worker: 'Asha Nair',
    division: 'South Estate',
    workType: 'Weeding',
    hours: 6,
    baseRate: 190,
    differentialRate: 25,
    status: 'Verified',
  },
  {
    id: 'FO-003',
    date: '2026-06-06',
    worker: 'Thomas Varghese',
    division: 'Central Field',
    workType: 'Factory Work',
    hours: 8,
    baseRate: 225,
    differentialRate: 40,
    status: 'Pending',
  },
  {
    id: 'FO-004',
    date: '2026-06-06',
    worker: 'Maya Jacob',
    division: 'North Estate',
    workType: 'Pest Control',
    hours: 4.5,
    baseRate: 200,
    differentialRate: 30,
    status: 'Completed',
  },
  {
    id: 'FO-005',
    date: '2026-06-07',
    worker: 'Suresh',
    division: 'South Estate',
    workType: 'Irrigation',
    hours: 5.5,
    baseRate: 195,
    differentialRate: 20,
    status: 'Verified',
  },
];
