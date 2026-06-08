import React, { useMemo, useState } from 'react';
import { Box, Button, Card, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SavingsIcon from '@mui/icons-material/Savings';
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Minimal self-contained payroll screen implementing requested features.

type EarningsHead = {
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

type WorkerEarning = {
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

type AdvanceRecovery = {
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

type Welfare = {
  id: string;
  workerId: string;
  workerName: string;
  scheme: string;
  contributionType: 'Percentage' | 'Fixed';
  contributionRate: number; // percent or fixed value
  monthlyDeduction: number;
};

type ElectricityCharge = {
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

type AdhocDeduction = {
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

const currency = (v: number) => `₹ ${v.toLocaleString('en-IN')}`;

const initialEarningsHeads: EarningsHead[] = [
  { id: 'EH-001', name: 'Basic Wages', description: 'Base wage', status: 'Active', epfApplicable: true, esiApplicable: true, bonusEligible: false, taxable: true, lastUpdated: '2026-06-01' },
  { id: 'EH-002', name: 'Special Allowance', description: 'Special allowance', status: 'Active', epfApplicable: false, esiApplicable: false, bonusEligible: false, taxable: true, lastUpdated: '2026-06-01' },
  { id: 'EH-003', name: 'Over-Kilo Wages', description: 'Over kilo payment', status: 'Active', epfApplicable: false, esiApplicable: false, bonusEligible: false, taxable: true, lastUpdated: '2026-06-01' },
  { id: 'EH-004', name: 'Production Incentive', description: 'Incentive', status: 'Active', epfApplicable: false, esiApplicable: false, bonusEligible: true, taxable: true, lastUpdated: '2026-06-01' },
  { id: 'EH-005', name: 'Holiday Wages', description: 'Holiday pay', status: 'Active', epfApplicable: true, esiApplicable: true, bonusEligible: false, taxable: true, lastUpdated: '2026-06-01' },
  { id: 'EH-006', name: 'Annual Leave Wages', description: 'Leave pay', status: 'Active', epfApplicable: true, esiApplicable: true, bonusEligible: false, taxable: true, lastUpdated: '2026-06-01' },
  { id: 'EH-007', name: 'Bonus', description: 'Bonus', status: 'Active', epfApplicable: false, esiApplicable: false, bonusEligible: true, taxable: true, lastUpdated: '2026-06-01' },
  { id: 'EH-008', name: 'Other Allowances', description: 'Misc allowances', status: 'Active', epfApplicable: false, esiApplicable: false, bonusEligible: false, taxable: true, lastUpdated: '2026-06-01' },
];

const initialWorkers: WorkerEarning[] = [
  { id: '1', workerId: 'W-101', workerName: 'Ramesh', estate: 'North', wageMonth: '2026-05', basicWages: 8000, specialAllowance: 500, overKiloWages: 200, productionIncentive: 300, holidayWages: 0, annualLeaveWages: 0, bonus: 0, otherAllowances: 100 },
  { id: '2', workerId: 'W-102', workerName: 'Suresh', estate: 'South', wageMonth: '2026-05', basicWages: 7500, specialAllowance: 400, overKiloWages: 150, productionIncentive: 200, holidayWages: 0, annualLeaveWages: 0, bonus: 0, otherAllowances: 120 },
  { id: '3', workerId: 'W-103', workerName: 'Kumar', estate: 'East', wageMonth: '2026-05', basicWages: 8200, specialAllowance: 600, overKiloWages: 250, productionIncentive: 350, holidayWages: 0, annualLeaveWages: 0, bonus: 0, otherAllowances: 90 },
];

const initialAdvances: AdvanceRecovery[] = [
  { id: 'A-001', workerId: 'W-101', workerName: 'Ramesh', advanceAmount: 2000, recoveryStartDate: '2026-03-01', recoveryEndDate: '2026-08-01', monthlyRecoveryAmount: 400, outstandingBalance: 800, status: 'Active' },
  { id: 'A-002', workerId: 'W-102', workerName: 'Suresh', advanceAmount: 1500, recoveryStartDate: '2026-04-01', recoveryEndDate: '2026-09-01', monthlyRecoveryAmount: 300, outstandingBalance: 900, status: 'Paused' },
];

const initialWelfare: Welfare[] = [
  { id: 'WF-001', workerId: 'W-101', workerName: 'Ramesh', scheme: 'Common Welfare', contributionType: 'Percentage', contributionRate: 1, monthlyDeduction: 90 },
];

const initialElectricity: ElectricityCharge[] = [
  { id: 'E-001', workerId: 'W-101', workerName: 'Ramesh', estateQuarters: 'Q-12', meterReading: 12450, consumptionUnits: 120, ratePerUnit: 5, chargeAmount: 600, status: 'Pending' },
];

const initialDeductions: AdhocDeduction[] = [
  { id: 'D-001', workerId: 'W-103', workerName: 'Kumar', deductionType: 'Loan Repayment', deductionAmount: 200, reason: 'Equipment', requestedBy: 'Supervisor', approvalStatus: 'Pending' },
];

const TAB_LABELS = [
  'Earnings Heads',
  'Worker Earnings',
  'Advance Recoveries',
  'Welfare Fund',
  'Electricity Charges',
  'Ad-Hoc Deductions',
  'Payroll Summary',
  'Dashboard',
];

export const EarningsRecoveries: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const [earningsHeads, setEarningsHeads] = useState<EarningsHead[]>(initialEarningsHeads);
  const [earningsSearch, setEarningsSearch] = useState('');
  const [earningsFilterStatus, setEarningsFilterStatus] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [headDialogOpen, setHeadDialogOpen] = useState(false);
  const [selectedHead, setSelectedHead] = useState<EarningsHead | null>(null);
  const [dialogValues, setDialogValues] = useState<Partial<EarningsHead>>({});

  const [workers, _setWorkers] = useState<WorkerEarning[]>(initialWorkers);
  const [advances, setAdvances] = useState<AdvanceRecovery[]>(initialAdvances);
  const [welfare, _setWelfare] = useState<Welfare[]>(initialWelfare);
  const [electricity, _setElectricity] = useState<ElectricityCharge[]>(initialElectricity);
  const [deductions, setDeductions] = useState<AdhocDeduction[]>(initialDeductions);

  const onTabChange = (_: React.SyntheticEvent, newValue: number) => setActiveTab(newValue);

  const openAddHead = () => {
    setSelectedHead(null);
    setDialogValues({ status: 'Active', epfApplicable: true, esiApplicable: true, bonusEligible: false, taxable: true });
    setHeadDialogOpen(true);
  };

  const openEditHead = (head?: EarningsHead) => {
    if (!head) return openAddHead();
    setSelectedHead(head);
    setDialogValues(head);
    setHeadDialogOpen(true);
  };

  const saveHead = () => {
    const values = {
      id: selectedHead ? selectedHead.id : `EH-${Math.floor(Math.random() * 9000 + 1000)}`,
      name: String(dialogValues.name || '').trim(),
      description: String(dialogValues.description || ''),
      status: (dialogValues.status as 'Active' | 'Inactive') || 'Active',
      epfApplicable: Boolean(dialogValues.epfApplicable),
      esiApplicable: Boolean(dialogValues.esiApplicable),
      bonusEligible: Boolean(dialogValues.bonusEligible),
      taxable: Boolean(dialogValues.taxable),
      lastUpdated: new Date().toISOString().slice(0, 10),
    } as EarningsHead;
    if (!values.name) return;
    setEarningsHeads((prev) => (selectedHead ? prev.map((p) => (p.id === selectedHead.id ? values : p)) : [values, ...prev]));
    setHeadDialogOpen(false);
  };

  const filteredEarningHeads = useMemo(() => {
    return earningsHeads.filter((h) => {
      if (earningsFilterStatus !== 'All' && h.status !== earningsFilterStatus) return false;
      if (!earningsSearch) return true;
      const q = earningsSearch.toLowerCase();
      return h.name.toLowerCase().includes(q) || (h.description || '').toLowerCase().includes(q) || h.id.toLowerCase().includes(q);
    });
  }, [earningsHeads, earningsSearch, earningsFilterStatus]);

  // payroll summary per worker
  const payrollSummary = useMemo(() => {
    return workers.map((w) => {
      const gross = w.basicWages + w.specialAllowance + w.overKiloWages + w.productionIncentive + w.holidayWages + w.annualLeaveWages + w.bonus + w.otherAllowances;
      const advanceTotal = advances.filter((a) => a.workerId === w.workerId).reduce((s, a) => s + a.monthlyRecoveryAmount, 0);
      const welfareTotal = welfare.filter((r) => r.workerId === w.workerId).reduce((s, r) => s + r.monthlyDeduction, 0);
      const elecTotal = electricity.filter((e) => e.workerId === w.workerId).reduce((s, e) => s + e.chargeAmount, 0);
      const adhocTotal = deductions.filter((d) => d.workerId === w.workerId && d.approvalStatus === 'Approved').reduce((s, d) => s + d.deductionAmount, 0);
      const totalDeductions = advanceTotal + welfareTotal + elecTotal + adhocTotal;
      return { id: w.id, workerId: w.workerId, workerName: w.workerName, grossEarnings: gross, totalDeductions, netWagePayable: gross - totalDeductions };
    });
  }, [workers, advances, welfare, electricity, deductions]);

  // simple charts
  const earningsChart = useMemo(() => workers.map((w) => ({ label: w.workerName, value: w.basicWages + w.specialAllowance + w.otherAllowances })), [workers]);
  const deductionChart = useMemo(() => payrollSummary.map((p) => ({ label: p.workerName, value: p.totalDeductions })), [payrollSummary]);
  const payrollTrend = useMemo(() => [{ label: 'Mar', value: 50000 }, { label: 'Apr', value: 52000 }, { label: 'May', value: 54000 }], []);
  const recoveryTrend = useMemo(() => [{ label: 'Mar', value: 4000 }, { label: 'Apr', value: 3800 }, { label: 'May', value: 3600 }], []);

  const earningsHeadColumns: any = [
    { field: 'id', headerName: 'Earnings Head ID', width: 130 },
    { field: 'name', headerName: 'Name', flex: 1, minWidth: 180 },
    { field: 'epfApplicable', headerName: 'EPF', width: 90, renderCell: (params: any) => (params.value ? <Chip label="Yes" color="success" size="small" /> : <Chip label="No" size="small" />) },
    { field: 'esiApplicable', headerName: 'ESI', width: 90, renderCell: (params: any) => (params.value ? <Chip label="Yes" color="success" size="small" /> : <Chip label="No" size="small" />) },
    { field: 'bonusEligible', headerName: 'Bonus', width: 100, renderCell: (params: any) => (params.value ? <Chip label="Yes" color="success" size="small" /> : <Chip label="No" size="small" />) },
    { field: 'taxable', headerName: 'Taxable', width: 100, renderCell: (params: any) => (params.value ? <Chip label="Yes" color="success" size="small" /> : <Chip label="No" size="small" />) },
    { field: 'status', headerName: 'Status', width: 110, renderCell: (params: any) => <Chip label={params.value} color={params.value === 'Active' ? 'success' : 'warning'} size="small" /> },
    { field: 'lastUpdated', headerName: 'Last Updated', width: 120 },
    {
      field: 'actions', headerName: 'Actions', type: 'actions', width: 170, getActions: (params: any) => {
        const row = params.row as EarningsHead;
        return [
          <GridActionsCellItem icon={<VisibilityIcon />} label="View" onClick={() => setDialogValues(row)} showInMenu={false} />,
          <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => openEditHead(row)} showInMenu={false} />,
          <GridActionsCellItem icon={<ArchiveIcon />} label={row.status === 'Active' ? 'Deactivate' : 'Activate'} onClick={() => setEarningsHeads((prev) => prev.map((h) => (h.id === row.id ? { ...h, status: h.status === 'Active' ? 'Inactive' : 'Active' } : h)))} showInMenu={false} />,
          <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => setEarningsHeads((prev) => prev.filter((h) => h.id !== row.id))} showInMenu={false} />,
        ];
      }
    }
  ];

  const workerCols: any = [
    { field: 'workerId', headerName: 'Worker ID', width: 120 },
    { field: 'workerName', headerName: 'Worker Name', width: 200, flex: 1 },
    { field: 'estate', headerName: 'Estate', width: 120 },
    { field: 'wageMonth', headerName: 'Wage Month', width: 120 },
    { field: 'basicWages', headerName: 'Basic Wages', width: 140, type: 'number', valueFormatter: (p: any) => currency(Number(p.value)) },
    { field: 'specialAllowance', headerName: 'Special Allowance', width: 160, type: 'number', valueFormatter: (p: any) => currency(Number(p.value)) },
    { field: 'overKiloWages', headerName: 'Over-Kilo Wages', width: 150, type: 'number', valueFormatter: (p: any) => currency(Number(p.value)) },
    { field: 'productionIncentive', headerName: 'Production Incentive', width: 170, type: 'number', valueFormatter: (p: any) => currency(Number(p.value)) },
    { field: 'holidayWages', headerName: 'Holiday Wages', width: 150, type: 'number', valueFormatter: (p: any) => currency(Number(p.value)) },
    { field: 'annualLeaveWages', headerName: 'Annual Leave Wages', width: 170, type: 'number', valueFormatter: (p: any) => currency(Number(p.value)) },
    { field: 'bonus', headerName: 'Bonus', width: 120, type: 'number', valueFormatter: (p: any) => currency(Number(p.value)) },
    { field: 'otherAllowances', headerName: 'Other Allowances', width: 150, type: 'number', valueFormatter: (p: any) => currency(Number(p.value)) },
    { field: 'grossEarnings', headerName: 'Gross Earnings', width: 160, type: 'number', valueGetter: (params: any) => {
      const r = (params as any).row as WorkerEarning; return r.basicWages + r.specialAllowance + r.overKiloWages + r.productionIncentive + r.holidayWages + r.annualLeaveWages + r.bonus + r.otherAllowances;
    }, valueFormatter: (p: any) => currency(Number(p.value)) },
    { field: 'actions', headerName: 'Actions', type: 'actions', width: 160, getActions: (params: any) => [
      <GridActionsCellItem icon={<VisibilityIcon />} label="View" onClick={() => alert(JSON.stringify(params.row, null, 2))} showInMenu={false} />,
      <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => alert('Edit earnings (not implemented)')} showInMenu={false} />,
      <GridActionsCellItem icon={<DownloadIcon />} label="Export" onClick={() => alert('Exporting...')} showInMenu={false} />,
    ] }
  ];

  const advanceCols: any = [
    { field: 'id', headerName: 'Advance ID', width: 120 },
    { field: 'workerId', headerName: 'Worker ID', width: 120 },
    { field: 'workerName', headerName: 'Worker Name', width: 160 },
    { field: 'advanceAmount', headerName: 'Advance Amount', width: 150, valueFormatter: (p: any) => currency(Number(p.value)) },
    { field: 'recoveryStartDate', headerName: 'Start Date', width: 120 },
    { field: 'recoveryEndDate', headerName: 'End Date', width: 120 },
    { field: 'monthlyRecoveryAmount', headerName: 'Monthly Recovery', width: 160, valueFormatter: (p: any) => currency(Number(p.value)) },
    { field: 'outstandingBalance', headerName: 'Outstanding', width: 140, valueFormatter: (p: any) => currency(Number(p.value)) },
    { field: 'status', headerName: 'Status', width: 120, renderCell: (p: any) => <Chip label={p.value} size="small" color={p.value === 'Active' ? 'success' : p.value === 'Paused' ? 'warning' : 'default'} /> },
    { field: 'actions', headerName: 'Actions', type: 'actions', width: 200, getActions: (params: any) => [
      <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => alert('Edit advance')} showInMenu={false} />,
      <GridActionsCellItem icon={<ArchiveIcon />} label="Pause" onClick={() => setAdvances((prev) => prev.map((a) => a.id === params.id ? { ...a, status: 'Paused' } : a))} showInMenu={false} />,
      <GridActionsCellItem icon={<DeleteIcon />} label="Close" onClick={() => setAdvances((prev) => prev.map((a) => a.id === params.id ? { ...a, status: 'Completed' } : a))} showInMenu={false} />,
    ] },
  ];

  const welfareCols: any = [
    { field: 'id', headerName: 'Rule ID', width: 120 },
    { field: 'workerId', headerName: 'Worker ID', width: 120 },
    { field: 'workerName', headerName: 'Worker Name', width: 160 },
    { field: 'scheme', headerName: 'Welfare Scheme', width: 180 },
    { field: 'contributionType', headerName: 'Type', width: 120 },
    { field: 'contributionRate', headerName: 'Rate', width: 120 },
    { field: 'monthlyDeduction', headerName: 'Monthly Deduction', width: 170, valueFormatter: (p: any) => currency(Number(p.value)) },
    { field: 'actions', headerName: 'Actions', type: 'actions', width: 140, getActions: () => [<GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => alert('Edit rule')} showInMenu={false} />] },
  ];

  const electricityCols: any = [
    { field: 'id', headerName: 'Reading ID', width: 120 },
    { field: 'workerId', headerName: 'Worker ID', width: 120 },
    { field: 'workerName', headerName: 'Worker Name', width: 160 },
    { field: 'estateQuarters', headerName: 'Quarters', width: 120 },
    { field: 'meterReading', headerName: 'Meter', width: 110 },
    { field: 'consumptionUnits', headerName: 'Units', width: 100 },
    { field: 'ratePerUnit', headerName: 'Rate/Unit', width: 110, valueFormatter: (p: any) => currency(Number(p.value)) },
    { field: 'chargeAmount', headerName: 'Charges', width: 120, valueFormatter: (p: any) => currency(Number(p.value)) },
    { field: 'status', headerName: 'Status', width: 120 },
  ];

  const deductionCols: any = [
    { field: 'id', headerName: 'Deduction ID', width: 130 },
    { field: 'workerId', headerName: 'Worker ID', width: 120 },
    { field: 'workerName', headerName: 'Worker Name', width: 160 },
    { field: 'deductionType', headerName: 'Type', width: 150 },
    { field: 'deductionAmount', headerName: 'Amount', width: 140, valueFormatter: (p: any) => currency(Number(p.value)) },
    { field: 'reason', headerName: 'Reason', width: 180 },
    { field: 'requestedBy', headerName: 'Requested By', width: 140 },
    { field: 'approvalStatus', headerName: 'Status', width: 120 },
    { field: 'approvalDate', headerName: 'Approval Date', width: 130 },
    { field: 'actions', headerName: 'Actions', type: 'actions', width: 180, getActions: (params: any) => [
      <GridActionsCellItem icon={<EditIcon />} label="Approve" onClick={() => setDeductions((prev) => prev.map((d) => d.id === params.id ? { ...d, approvalStatus: 'Approved', approvalDate: new Date().toISOString().slice(0,10) } : d))} showInMenu={false} />,
      <GridActionsCellItem icon={<DeleteIcon />} label="Reject" onClick={() => setDeductions((prev) => prev.map((d) => d.id === params.id ? { ...d, approvalStatus: 'Rejected' } : d))} showInMenu={false} />,
    ] },
  ];

  const summaryCols: any = [
    { field: 'workerId', headerName: 'Worker ID', width: 120 },
    { field: 'workerName', headerName: 'Worker Name', width: 200, flex: 1 },
    { field: 'grossEarnings', headerName: 'Gross Earnings', width: 170, valueFormatter: (p: any) => currency(Number(p.value)) },
    { field: 'totalDeductions', headerName: 'Total Deductions', width: 170, valueFormatter: (p: any) => currency(Number(p.value)) },
    { field: 'netWagePayable', headerName: 'Net Wage Payable', width: 170, valueFormatter: (p: any) => currency(Number(p.value)) },
    { field: 'actions', headerName: 'Actions', type: 'actions', width: 160, getActions: () => [<GridActionsCellItem icon={<FileDownloadIcon />} label="Payslip" onClick={() => alert('Download payslip')} showInMenu={false} />] },
  ];

  return (
    <Box component="main" sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Box>
          <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 700 }}>Payroll Management</Typography>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>Earnings & Recoveries</Typography>
        </Box>

        <Card>
          <CardContent>
            <Tabs 
              value={activeTab} 
              onChange={onTabChange} 
              variant="scrollable" 
              scrollButtons="auto"
              sx={{
                '& .MuiTabs-indicator': { backgroundColor: '#20B2AA' },
                '& .MuiTab-root.Mui-selected': { color: '#20B2AA' }
              }}
            >
              {TAB_LABELS.map((t) => <Tab key={t} label={t} />)}
            </Tabs>
          </CardContent>
        </Card>

        {/* Earnings Heads Tab */}
        <div hidden={activeTab !== 0}>
          <Stack direction={{ xs: 'column', md: 'row' }} sx={{ justifyContent: 'space-between', alignItems: 'center', mb: 2 }} spacing={2}>
            <Typography variant="h6">Earnings Head Configuration</Typography>
            <Button variant="contained" sx={{ backgroundColor: '#20B2AA', '&:hover': { backgroundColor: '#1a9a91' } }} startIcon={<AddIcon />} onClick={openAddHead}>Add Earnings Head</Button>
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
            <TextField label="Search" value={earningsSearch} onChange={(e) => setEarningsSearch(e.target.value)} />
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Status</InputLabel>
              <Select label="Status" value={earningsFilterStatus} onChange={(e) => setEarningsFilterStatus(e.target.value as any)}>
                <MenuItem value="All">All</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
            <Button variant="outlined" sx={{ color: '#20B2AA', borderColor: '#20B2AA', '&:hover': { borderColor: '#1a9a91', backgroundColor: '#f0fffe' } }} onClick={() => { setEarningsSearch(''); setEarningsFilterStatus('All'); }}>Reset</Button>
          </Stack>

          <Box sx={{ height: 480, width: '100%' }}>
            <DataGrid rows={filteredEarningHeads} columns={earningsHeadColumns} pageSizeOptions={[5, 10]} getRowId={(r) => r.id} />
          </Box>
        </div>

        {/* Worker Earnings Tab */}
        <div hidden={activeTab !== 1}>
          <Stack direction={{ xs: 'column', md: 'row' }} sx={{ justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Worker Earnings Management</Typography>
            <Stack direction="row" spacing={2}>
              <TextField label="Search worker" onChange={() => {}} />
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>Wage Month</InputLabel>
                <Select label="Wage Month" value="2026-05" onChange={() => {}}>
                  <MenuItem value="2026-05">2026-05</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Stack>
          <Box sx={{ height: 520, width: '100%' }}>
            <DataGrid rows={workers} columns={workerCols} pageSizeOptions={[5, 10]} getRowId={(r) => r.id} />
          </Box>
        </div>

        {/* Advance Recoveries */}
        <div hidden={activeTab !== 2}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Advance Recovery Management</Typography>
            <Button variant="contained" sx={{ backgroundColor: '#20B2AA', '&:hover': { backgroundColor: '#1a9a91' } }} startIcon={<SavingsIcon />} onClick={() => alert('Exporting advances')}>Export Statement</Button>
          </Stack>
          <Box sx={{ height: 520, width: '100%' }}>
            <DataGrid rows={advances} columns={advanceCols} pageSizeOptions={[5, 10]} getRowId={(r) => r.id} />
          </Box>
        </div>

        {/* Welfare Fund */}
        <div hidden={activeTab !== 3}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Welfare Fund Deduction Management</Typography>
            <Button variant="contained" sx={{ backgroundColor: '#20B2AA', '&:hover': { backgroundColor: '#1a9a91' } }} onClick={() => alert('Generate welfare report')}>Generate Report</Button>
          </Stack>
          <Box sx={{ height: 520, width: '100%' }}>
            <DataGrid rows={welfare} columns={welfareCols} pageSizeOptions={[5, 10]} getRowId={(r) => r.id} />
          </Box>
        </div>

        {/* Electricity Charges */}
        <div hidden={activeTab !== 4}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Electricity Charge Recovery</Typography>
            <Button variant="contained" sx={{ backgroundColor: '#20B2AA', '&:hover': { backgroundColor: '#1a9a91' } }} onClick={() => alert('Export electricity')}>Export Reading</Button>
          </Stack>
          <Box sx={{ height: 520, width: '100%' }}>
            <DataGrid rows={electricity} columns={electricityCols} pageSizeOptions={[5, 10]} getRowId={(r) => r.id} />
          </Box>
        </div>

        {/* Ad-Hoc Deductions */}
        <div hidden={activeTab !== 5}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Ad-Hoc Deduction Management</Typography>
            <Button variant="contained" sx={{ backgroundColor: '#20B2AA', '&:hover': { backgroundColor: '#1a9a91' } }} onClick={() => alert('Export deductions')}>Export Deductions</Button>
          </Stack>
          <Box sx={{ height: 520, width: '100%' }}>
            <DataGrid rows={deductions} columns={deductionCols} pageSizeOptions={[5, 10]} getRowId={(r) => r.id} />
          </Box>
        </div>

        {/* Payroll Summary */}
        <div hidden={activeTab !== 6}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Earnings and Deductions Summary</Typography>
            <Button variant="contained" sx={{ backgroundColor: '#20B2AA', '&:hover': { backgroundColor: '#1a9a91' } }} startIcon={<FileDownloadIcon />} onClick={() => alert('Export payroll')}>Download Payroll</Button>
          </Stack>
          <Box sx={{ height: 520, width: '100%' }}>
            <DataGrid rows={payrollSummary} columns={summaryCols} pageSizeOptions={[5, 10]} getRowId={(r) => r.workerId} />
          </Box>
        </div>

        {/* Dashboard */}
        <div hidden={activeTab !== 7}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6">Payroll Dashboard</Typography>
            <Button variant="contained" sx={{ backgroundColor: '#20B2AA', '&:hover': { backgroundColor: '#1a9a91' } }} onClick={() => alert('Export Dashboard')}>Export Dashboard</Button>
          </Stack>
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: 'repeat(4,1fr)' }, mb: 2 }}>
            <Card><CardContent><Typography variant="caption">Total Workers</Typography><Typography variant="h6">{workers.length}</Typography></CardContent></Card>
            <Card><CardContent><Typography variant="caption">Total Gross Earnings</Typography><Typography variant="h6">{currency(payrollSummary.reduce((s, p) => s + Number(p.grossEarnings), 0))}</Typography></CardContent></Card>
            <Card><CardContent><Typography variant="caption">Total Recoveries</Typography><Typography variant="h6">{currency(advances.reduce((s,a) => s + a.outstandingBalance,0))}</Typography></CardContent></Card>
            <Card><CardContent><Typography variant="caption">Total Deductions</Typography><Typography variant="h6">{currency(payrollSummary.reduce((s, p) => s + Number(p.totalDeductions), 0))}</Typography></CardContent></Card>
          </Box>

          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
            <Card sx={{ height: 360 }}><CardContent><Typography variant="h6">Earnings Distribution</Typography><ResponsiveContainer width="100%" height={260}><BarChart data={earningsChart}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis /><Tooltip /><Legend /><Bar dataKey="value" fill="#20B2AA" /></BarChart></ResponsiveContainer></CardContent></Card>
            <Card sx={{ height: 360 }}><CardContent><Typography variant="h6">Deduction Distribution</Typography><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={deductionChart} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={90} fill="#20B2AA" label /><Tooltip /></PieChart></ResponsiveContainer></CardContent></Card>
          </Box>

          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, mt: 2 }}>
            <Card sx={{ height: 320 }}><CardContent><Typography variant="h6">Monthly Payroll Trend</Typography><ResponsiveContainer width="100%" height={220}><LineChart data={payrollTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="value" stroke="#20B2AA" /></LineChart></ResponsiveContainer></CardContent></Card>
            <Card sx={{ height: 320 }}><CardContent><Typography variant="h6">Recovery Trend</Typography><ResponsiveContainer width="100%" height={220}><LineChart data={recoveryTrend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="label" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="value" stroke="#20B2AA" /></LineChart></ResponsiveContainer></CardContent></Card>
          </Box>
        </div>

      </Stack>

      <Dialog open={headDialogOpen} onClose={() => setHeadDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{selectedHead ? 'Edit Earnings Head' : 'Add Earnings Head'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" value={dialogValues.name || ''} onChange={(e) => setDialogValues((p) => ({ ...p, name: e.target.value }))} fullWidth />
            <TextField label="Description" value={dialogValues.description || ''} onChange={(e) => setDialogValues((p) => ({ ...p, description: e.target.value }))} fullWidth multiline minRows={2} />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select label="Status" value={dialogValues.status || 'Active'} onChange={(e) => setDialogValues((p) => ({ ...p, status: e.target.value as any }))}>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHeadDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" sx={{ backgroundColor: '#20B2AA', '&:hover': { backgroundColor: '#1a9a91' } }} onClick={saveHead}>{selectedHead ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EarningsRecoveries;
