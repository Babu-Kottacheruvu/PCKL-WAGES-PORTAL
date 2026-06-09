import axios from 'axios';
import { saveAs } from 'file-saver';
import { utils, write } from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  initialEarningsHeads,
  initialWorkers,
  initialAdvances,
  initialWelfare,
  initialElectricity,
  initialDeductions,
} from '../data/earningsRecoveriesData';

const payrollDashboardMetrics: any[] = [];
const earningsDistribution: any[] = [];
const deductionDistribution: any[] = [];
const payrollTrend: any[] = [];
const recoveryTrend: any[] = [];

const client = axios.create({ baseURL: '/api/payroll' });

const delay = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms));

const exportToExcel = (rows: any[], worksheetName: string, fileName: string) => {
  const worksheet = utils.json_to_sheet(rows);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, worksheetName);
  const data = write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([data], { type: 'application/octet-stream' });
  saveAs(blob, `${fileName}.xlsx`);
};

const exportToPdf = (columns: string[], rows: any[], fileName: string) => {
  const doc = new jsPDF({ orientation: 'landscape' });
  autoTable(doc, {
    head: [columns],
    body: rows.map((row) => columns.map((column) => String(row[column] ?? ''))),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [25, 118, 210], textColor: 255 },
  });
  doc.save(`${fileName}.pdf`);
};

export const payrollApi = {
  getEarningsHeads: async () => {
    await delay();
    return initialEarningsHeads;
  },
  getWorkerEarnings: async () => {
    await delay();
    return initialWorkers;
  },
  getAdvanceRecoveries: async () => {
    await delay();
    return initialAdvances;
  },
  getWelfareFundRecords: async () => {
    await delay();
    return initialWelfare;
  },
  getElectricityChargeRecords: async () => {
    await delay();
    return initialElectricity;
  },
  getAdHocDeductions: async () => {
    await delay();
    return initialDeductions;
  },
  getDashboardMetrics: async () => {
    await delay();
    return payrollDashboardMetrics;
  },
  getEarningsDistribution: async () => {
    await delay();
    return earningsDistribution;
  },
  getDeductionDistribution: async () => {
    await delay();
    return deductionDistribution;
  },
  getPayrollTrend: async () => {
    await delay();
    return payrollTrend;
  },
  getRecoveryTrend: async () => {
    await delay();
    return recoveryTrend;
  },
  exportWorkerEarning: async (record: unknown) => {
    exportToExcel([record], 'Worker Earnings', 'worker-earning');
  },
  exportAdvanceRecoveries: async (records: unknown[]) => {
    exportToExcel(records, 'Advance Recoveries', 'advance-recoveries');
  },
  exportWelfareFund: async (records: unknown[]) => {
    exportToExcel(records, 'Welfare Fund', 'welfare-fund');
  },
  exportElectricityCharges: async (records: unknown[]) => {
    exportToExcel(records, 'Electricity Charges', 'electricity-charges');
  },
  exportDeductions: async (records: unknown[]) => {
    exportToExcel(records, 'Ad-Hoc Deductions', 'adhoc-deductions');
  },
  exportPayrollSummary: async (records: unknown[]) => {
    exportToExcel(records, 'Payroll Summary', 'payroll-summary');
  },
  exportDashboardSnapshot: async () => {
    exportToExcel(payrollDashboardMetrics, 'Dashboard Summary', 'dashboard-snapshot');
  },
  downloadPayrollPdf: async (record: unknown) => {
    const columns = ['workerId', 'workerName', 'grossEarnings', 'totalDeductions', 'netWagePayable'];
    exportToPdf(columns, [record], 'payslip');
  },
  getClient: () => client,
};
