export type EarningsHead = {
  id: string;
  name: string;
  description?: string;
  status: 'Active' | 'Inactive';
  epfApplicable: boolean;
  esiApplicable: boolean;
  bonusEligible: boolean;
  taxable: boolean;
  lastUpdated?: string;
};

export type WorkerEarning = {
  id: string;
  workerId: string;
  workerName: string;
  estate?: string;
  wageMonth: string;
  basicWages: number;
  specialAllowance: number;
  overKiloWages: number;
  productionIncentive: number;
  holidayWages: number;
  annualLeaveWages: number;
  bonus: number;
  otherAllowances: number;
};

export type AdvanceRecovery = {
  id: string;
  workerId: string;
  workerName: string;
  advanceAmount: number;
  recoveryStartDate: string;
  recoveryEndDate: string;
  monthlyRecoveryAmount: number;
  outstandingBalance: number;
  status: 'Active' | 'Paused' | 'Completed';
};

export type Welfare = {
  id: string;
  workerId: string;
  workerName: string;
  scheme: string;
  contributionType: 'Percentage' | 'Fixed';
  contributionRate: number; // percent or fixed value
  monthlyDeduction: number;
};

export type ElectricityCharge = {
  id: string;
  workerId: string;
  workerName: string;
  estateQuarters?: string;
  meterReading: number;
  consumptionUnits: number;
  ratePerUnit: number;
  chargeAmount: number;
  status: 'Pending' | 'Recovered';
};

export type AdhocDeduction = {
  id: string;
  workerId: string;
  workerName: string;
  deductionType: string;
  deductionAmount: number;
  reason?: string;
  requestedBy?: string;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  approvalDate?: string;
};

export const initialEarningsHeads: EarningsHead[] = [
  { id: 'EH-001', name: 'Basic Wages', description: 'Base wage', status: 'Active', epfApplicable: true, esiApplicable: true, bonusEligible: false, taxable: true, lastUpdated: '2026-06-01' },
  { id: 'EH-002', name: 'Special Allowance', description: 'Special allowance', status: 'Active', epfApplicable: false, esiApplicable: false, bonusEligible: false, taxable: true, lastUpdated: '2026-06-01' },
  { id: 'EH-003', name: 'Over-Kilo Wages', description: 'Over kilo payment', status: 'Active', epfApplicable: false, esiApplicable: false, bonusEligible: false, taxable: true, lastUpdated: '2026-06-01' },
  { id: 'EH-004', name: 'Production Incentive', description: 'Incentive', status: 'Active', epfApplicable: false, esiApplicable: false, bonusEligible: true, taxable: true, lastUpdated: '2026-06-01' },
  { id: 'EH-005', name: 'Holiday Wages', description: 'Holiday pay', status: 'Active', epfApplicable: true, esiApplicable: true, bonusEligible: false, taxable: true, lastUpdated: '2026-06-01' },
  { id: 'EH-006', name: 'Annual Leave Wages', description: 'Leave pay', status: 'Active', epfApplicable: true, esiApplicable: true, bonusEligible: false, taxable: true, lastUpdated: '2026-06-01' },
  { id: 'EH-007', name: 'Bonus', description: 'Bonus', status: 'Active', epfApplicable: false, esiApplicable: false, bonusEligible: true, taxable: true, lastUpdated: '2026-06-01' },
  { id: 'EH-008', name: 'Other Allowances', description: 'Misc allowances', status: 'Active', epfApplicable: false, esiApplicable: false, bonusEligible: false, taxable: true, lastUpdated: '2026-06-01' },
];

export const initialWorkers: WorkerEarning[] = [
  { id: '1', workerId: 'W-101', workerName: 'Ramesh', estate: 'North', wageMonth: '2026-05', basicWages: 8000, specialAllowance: 500, overKiloWages: 200, productionIncentive: 300, holidayWages: 0, annualLeaveWages: 0, bonus: 0, otherAllowances: 100 },
  { id: '2', workerId: 'W-102', workerName: 'Suresh', estate: 'South', wageMonth: '2026-05', basicWages: 7500, specialAllowance: 400, overKiloWages: 150, productionIncentive: 200, holidayWages: 0, annualLeaveWages: 0, bonus: 0, otherAllowances: 120 },
  { id: '3', workerId: 'W-103', workerName: 'Kumar', estate: 'East', wageMonth: '2026-05', basicWages: 8200, specialAllowance: 600, overKiloWages: 250, productionIncentive: 350, holidayWages: 0, annualLeaveWages: 0, bonus: 0, otherAllowances: 90 },
];

export const initialAdvances: AdvanceRecovery[] = [
  { id: 'A-001', workerId: 'W-101', workerName: 'Ramesh', advanceAmount: 2000, recoveryStartDate: '2026-03-01', recoveryEndDate: '2026-08-01', monthlyRecoveryAmount: 400, outstandingBalance: 800, status: 'Active' },
  { id: 'A-002', workerId: 'W-102', workerName: 'Suresh', advanceAmount: 1500, recoveryStartDate: '2026-04-01', recoveryEndDate: '2026-09-01', monthlyRecoveryAmount: 300, outstandingBalance: 900, status: 'Paused' },
];

export const initialWelfare: Welfare[] = [
  { id: 'WF-001', workerId: 'W-101', workerName: 'Ramesh', scheme: 'Common Welfare', contributionType: 'Percentage', contributionRate: 1, monthlyDeduction: 90 },
];

export const initialElectricity: ElectricityCharge[] = [
  { id: 'E-001', workerId: 'W-101', workerName: 'Ramesh', estateQuarters: 'Q-12', meterReading: 12450, consumptionUnits: 120, ratePerUnit: 5, chargeAmount: 600, status: 'Pending' },
];

export const initialDeductions: AdhocDeduction[] = [
  { id: 'D-001', workerId: 'W-103', workerName: 'Kumar', deductionType: 'Loan Repayment', deductionAmount: 200, reason: 'Equipment', requestedBy: 'Supervisor', approvalStatus: 'Pending' },
];
