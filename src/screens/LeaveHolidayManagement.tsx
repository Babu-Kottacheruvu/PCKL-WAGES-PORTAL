import { useMemo, useState } from 'react';
import type React from 'react';
import {
  AlertTriangle,
  CalendarDays,
  CalendarIcon,
  CheckCircle2,
  Download,
  FileText,
  FilePlus,
  Flag,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Table,
  Trophy,
  Upload,
  Users,
  X,
  Calculator,
} from 'lucide-react';
import {
  alwRecords,
  encashmentRecords,
  holidayRecords,
  holidayWageRecords,
  leaveBalanceRecords,
  leaveRequestRecords,
  weeklyOffWageRecords,
} from '../data/leaveHolidayData';
import type {
  HolidayRecord,
  HolidayStatus,
  HolidayType,
  LeaveRequestRecord,
} from '../data/leaveHolidayData';

const formatCurrency = (value: number) => `Rs. ${Math.round(value).toLocaleString('en-US')}`;
const formatDate = (value: string) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

const holidayTypes: HolidayType[] = ['National Holiday', 'Festival Holiday', 'Weekly Off'];
const estateOptions = ['North Estate', 'South Estate', 'Central Estate'];
const statusOptions = ['Active', 'Inactive'] as const;
const leaveTypes = ['Annual', 'Sick', 'Casual', 'Maternity'] as const;

type LeaveRequestForm = Omit<LeaveRequestRecord, 'id' | 'status'>;

export const LeaveHolidayManagement = () => {
  const [calendarView, setCalendarView] = useState<'Calendar' | 'Table'>('Calendar');
  const [selectedEstate, setSelectedEstate] = useState<'All' | string>('All');
  const [holidayMode, setHolidayMode] = useState<'Add' | 'Edit'>('Add');
  const [holidayForm, setHolidayForm] = useState<HolidayRecord>({
    id: '',
    name: '',
    type: 'National Holiday',
    date: '',
    estate: 'North Estate',
    status: 'Active',
  });
  const [holidays, setHolidays] = useState<HolidayRecord[]>(holidayRecords);
  const [holidayFilter, setHolidayFilter] = useState<'All' | HolidayType>('All');
  const [wageSearch, setWageSearch] = useState('');
  const [wageTypeFilter, setWageTypeFilter] = useState<'All' | HolidayType>('All');
  const [alwRatio, setAlwRatio] = useState(20);
  const [leaveStatusFilter, setLeaveStatusFilter] = useState<'All' | string>('All');
  const [leavePage, setLeavePage] = useState(1);
  const [leaveRequestForm, setLeaveRequestForm] = useState<LeaveRequestForm>({
    employeeId: '',
    employeeName: '',
    leaveType: 'Annual',
    fromDate: '',
    toDate: '',
    reason: '',
    attachment: '',
  });
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestRecord[]>(leaveRequestRecords);
  const [leaveBalanceSearch, setLeaveBalanceSearch] = useState('');

  const filteredHolidays = useMemo(
    () =>
      holidays.filter(
        (holiday) =>
          (selectedEstate === 'All' || holiday.estate === selectedEstate) &&
          (holidayFilter === 'All' || holiday.type === holidayFilter),
      ),
    [holidays, selectedEstate, holidayFilter],
  );

  const filteredHolidayWages = useMemo(
    () =>
      holidayWageRecords.filter(
        (record) =>
          (wageTypeFilter === 'All' || record.holidayType === wageTypeFilter) &&
          record.workerName.toLowerCase().includes(wageSearch.trim().toLowerCase()),
      ),
    [wageSearch, wageTypeFilter],
  );

  const filteredLeaveBalances = useMemo(
    () =>
      leaveBalanceRecords.filter(
        (record) =>
          record.employeeName.toLowerCase().includes(leaveBalanceSearch.trim().toLowerCase()) ||
          record.employeeId.toLowerCase().includes(leaveBalanceSearch.trim().toLowerCase()),
      ),
    [leaveBalanceSearch],
  );

  const leavesPerPage = 2;
  const leaveRequestPages = Math.ceil(leaveRequests.length / leavesPerPage);
  const paginatedLeaveRequests = leaveRequests.slice((leavePage - 1) * leavesPerPage, leavePage * leavesPerPage);

  const holidaySummary = useMemo(
    () => ({
      total: filteredHolidays.length,
      national: filteredHolidays.filter((item) => item.type === 'National Holiday').length,
      festival: filteredHolidays.filter((item) => item.type === 'Festival Holiday').length,
      weeklyOff: filteredHolidays.filter((item) => item.type === 'Weekly Off').length,
    }),
    [filteredHolidays],
  );

  const handleHolidaySubmit = () => {
    if (holidayMode === 'Add') {
      setHolidays((prev) => [...prev, { ...holidayForm, id: `H-${Date.now()}` }]);
    } else {
      setHolidays((prev) => prev.map((item) => (item.id === holidayForm.id ? holidayForm : item)));
    }
    setHolidayForm({ id: '', name: '', type: 'National Holiday', date: '', estate: 'North Estate', status: 'Active' });
    setHolidayMode('Add');
  };

  const handleHolidayEdit = (holiday: HolidayRecord) => {
    setHolidayForm(holiday);
    setHolidayMode('Edit');
  };

  const handleHolidayDelete = (holidayId: string) => {
    setHolidays((prev) => prev.filter((item) => item.id !== holidayId));
  };

  const handleLeaveRequestSubmit = () => {
    const id = `LR-${Date.now()}`;
    setLeaveRequests((prev) => [
      ...prev,
      {
        id,
        employeeId: leaveRequestForm.employeeId,
        employeeName: leaveRequestForm.employeeName,
        leaveType: leaveRequestForm.leaveType,
        fromDate: leaveRequestForm.fromDate,
        toDate: leaveRequestForm.toDate,
        reason: leaveRequestForm.reason,
        attachment: leaveRequestForm.attachment || 'none.pdf',
        status: 'Pending',
      },
    ]);
    setLeaveRequestForm({ employeeId: '', employeeName: '', leaveType: 'Annual', fromDate: '', toDate: '', reason: '', attachment: '' });
  };

  const updateRequestStatus = (requestId: string, status: 'Approved' | 'Rejected') => {
    setLeaveRequests((prev) => prev.map((request) => (request.id === requestId ? { ...request, status } : request)));
  };

  const totalWorkers = alwRecords.length;
  const eligibleWorkers = alwRecords.filter((record) => record.leaveEntitled > 0).length;
  const totalLeaveGranted = alwRecords.reduce((sum, record) => sum + record.leaveEntitled, 0);
  const pendingLeaveRequests = leaveRequests.filter((request) => request.status === 'Pending').length;

  const updateHolidayForm = (field: keyof HolidayRecord, value: string) => {
    setHolidayForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-8">
      <section className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#137f79]">Leave & Holiday Management</p>
            <h1 className="mt-3 text-3xl font-bold text-gray-900">Holiday, Leave, and Wage Panels</h1>
            <p className="mt-2 text-gray-600 max-w-3xl">
              Manage holiday calendars, leave workflows, wage calculations, encashment and weekly off pay from one admin panel.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full bg-[#E6F7F6] px-4 py-3 text-sm font-semibold text-[#137f79]">
            <CalendarIcon className="h-5 w-5" />
            Admin section
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Holiday Calendar Management</h2>
              <p className="text-sm text-gray-500">View holidays by calendar or table, assign estates, and manage holiday records.</p>
            </div>
            <div className="inline-flex overflow-hidden rounded-full border border-gray-200 bg-gray-50">
              {(['Calendar', 'Table'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setCalendarView(mode)}
                  className={`px-4 py-2 text-sm font-semibold transition ${
                    calendarView === mode ? 'bg-white text-[#137f79]' : 'text-gray-600 hover:bg-white'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[0.75fr_0.25fr]">
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4">
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#F3FBFA] px-3 py-2 text-sm font-medium text-[#137f79]">
                  <CalendarDays className="h-4 w-4" />
                  {holidaySummary.total} holidays
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <select
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                    value={selectedEstate}
                    onChange={(event) => setSelectedEstate(event.target.value)}
                  >
                    <option value="All">All Estates</option>
                    {estateOptions.map((estate) => (
                      <option key={estate} value={estate}>{estate}</option>
                    ))}
                  </select>
                  <select
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                    value={holidayFilter}
                    onChange={(event) => setHolidayFilter(event.target.value as 'All' | HolidayType)}
                  >
                    <option value="All">All Types</option>
                    {holidayTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {calendarView === 'Calendar' ? (
                <div className="grid grid-cols-3 gap-3">
                  {filteredHolidays.map((holiday) => (
                    <div key={holiday.id} className="rounded-2xl border border-gray-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-xs uppercase tracking-[0.2em] text-gray-500">{holiday.type}</span>
                        <span className="rounded-full bg-white px-2 py-1 text-xs font-semibold text-[#137f79]">{holiday.status}</span>
                      </div>
                      <div className="mt-3">
                        <p className="text-lg font-semibold text-gray-900">{holiday.name}</p>
                        <p className="mt-1 text-sm text-gray-600">{formatDate(holiday.date)}</p>
                        <p className="mt-2 text-sm text-gray-500">{holiday.estate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
                  <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                    <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Holiday Name</th>
                        <th className="px-4 py-3 font-semibold">Holiday Type</th>
                        <th className="px-4 py-3 font-semibold">Date</th>
                        <th className="px-4 py-3 font-semibold">Estate</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                      {filteredHolidays.map((holiday) => (
                        <tr key={holiday.id} className="hover:bg-[#F3FBFA]">
                          <td className="px-4 py-3 text-gray-700">{holiday.name}</td>
                          <td className="px-4 py-3 text-gray-700">{holiday.type}</td>
                          <td className="px-4 py-3 text-gray-700">{holiday.date}</td>
                          <td className="px-4 py-3 text-gray-700">{holiday.estate}</td>
                          <td className="px-4 py-3 text-gray-700">{holiday.status}</td>
                          <td className="px-4 py-3 text-gray-700">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => handleHolidayEdit(holiday)}
                                className="rounded-lg border border-[#137f79] bg-white px-3 py-1 text-xs font-semibold text-[#137f79]"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleHolidayDelete(holiday.id)}
                                className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-600"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Holiday Form</h3>
                  <p className="text-sm text-gray-500">Add or edit a holiday</p>
                </div>
                <span className="rounded-full bg-[#E6F7F6] px-3 py-1 text-xs font-semibold text-[#137f79]">{holidayMode}</span>
              </div>

              <div className="space-y-3">
                <input
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                  placeholder="Holiday Name"
                  value={holidayForm.name}
                  onChange={(event) => updateHolidayForm('name', event.target.value)}
                />
                <select
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                  value={holidayForm.type}
                  onChange={(event) => updateHolidayForm('type', event.target.value as HolidayType)}
                >
                  {holidayTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <input
                  type="date"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                  value={holidayForm.date}
                  onChange={(event) => updateHolidayForm('date', event.target.value)}
                />
                <select
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                  value={holidayForm.estate}
                  onChange={(event) => updateHolidayForm('estate', event.target.value)}
                >
                  {estateOptions.map((estate) => (
                    <option key={estate} value={estate}>{estate}</option>
                  ))}
                </select>
                <select
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                  value={holidayForm.status}
                  onChange={(event) => updateHolidayForm('status', event.target.value as HolidayStatus)}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleHolidaySubmit}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#137f79] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0f6d64]"
                >
                  <Plus className="h-4 w-4" />
                  {holidayMode === 'Add' ? 'Add Holiday' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">Holiday Summary</h3>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <SummaryCard label="Total" value={String(holidaySummary.total)} icon={<Table />} />
              <SummaryCard label="National" value={String(holidaySummary.national)} icon={<Flag />} />
              <SummaryCard label="Festival" value={String(holidaySummary.festival)} icon={<Sparkles />} />
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3">
              <SummaryCard label="Weekly Off" value={String(holidaySummary.weeklyOff)} icon={<Trophy />} />
            </div>
          </div>
        </aside>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Holiday Wage Calculation</h2>
            <p className="text-sm text-gray-500">Search, filter, calculate holiday wages and export reports.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                className="rounded-lg border border-gray-200 bg-white pl-10 pr-3 py-2 text-sm text-gray-700"
                placeholder="Search worker"
                value={wageSearch}
                onChange={(event) => setWageSearch(event.target.value)}
              />
            </div>
            <select
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
              value={wageTypeFilter}
              onChange={(event) => setWageTypeFilter(event.target.value as 'All' | HolidayType)}
            >
              <option value="All">All Holiday Types</option>
              {holidayTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-[#137f79] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0f6d64]"
            >
              <Calculator className="h-4 w-4" />
              Calculate
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="min-w-full w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Worker ID</th>
                <th className="px-4 py-3 font-semibold">Worker Name</th>
                <th className="px-4 py-3 font-semibold">Holiday Date</th>
                <th className="px-4 py-3 font-semibold">Holiday Type</th>
                <th className="px-4 py-3 font-semibold">Eligibility Status</th>
                <th className="px-4 py-3 font-semibold text-right">Wage Rate</th>
                <th className="px-4 py-3 font-semibold text-right">Calculated Wage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredHolidayWages.map((record) => (
                <tr key={record.id} className="hover:bg-[#F3FBFA]">
                  <td className="px-4 py-3 text-gray-700">{record.workerId}</td>
                  <td className="px-4 py-3 text-gray-700">{record.workerName}</td>
                  <td className="px-4 py-3 text-gray-700">{record.holidayDate}</td>
                  <td className="px-4 py-3 text-gray-700">{record.holidayType}</td>
                  <td className="px-4 py-3 text-gray-700">{record.eligibility}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(record.wageRate)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(record.calculatedWage)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.75fr_1fr]">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StatCard title="Total Workers" value={String(totalWorkers)} icon={<Users />} />
              <StatCard title="Eligible Workers" value={String(eligibleWorkers)} icon={<ShieldCheck />} />
              <StatCard title="Total Leave Granted" value={`${totalLeaveGranted} days`} icon={<Trophy />} />
              <StatCard title="Pending Leave Requests" value={String(pendingLeaveRequests)} icon={<AlertTriangle />} />
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">ALW Entitlement</h2>
                  <p className="text-sm text-gray-500">Formula: 1 leave day for every {alwRatio} days worked.</p>
                </div>
                <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-4 py-2">
                  <span className="text-sm text-gray-500">Ratio</span>
                  <input
                    type="number"
                    min={1}
                    value={alwRatio}
                    onChange={(event) => setAlwRatio(Number(event.target.value) || 20)}
                    className="w-20 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            <div className="border-b border-gray-200 px-5 py-4">
              <h3 className="text-lg font-semibold text-gray-900">ALW Calculation Table</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Worker ID</th>
                    <th className="px-4 py-3 font-semibold">Worker Name</th>
                    <th className="px-4 py-3 font-semibold text-right">Days Worked</th>
                    <th className="px-4 py-3 font-semibold">ALW Formula</th>
                    <th className="px-4 py-3 font-semibold text-right">Leave Entitled</th>
                    <th className="px-4 py-3 font-semibold text-right">Leave Availed</th>
                    <th className="px-4 py-3 font-semibold text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {alwRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-[#F3FBFA]">
                      <td className="px-4 py-3 text-gray-700">{record.workerId}</td>
                      <td className="px-4 py-3 text-gray-700">{record.workerName}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{record.daysWorkedPreviousYear}</td>
                      <td className="px-4 py-3 text-gray-700">1 Leave Day for Every {alwRatio} Days Worked</td>
                      <td className="px-4 py-3 text-right text-gray-700">{Math.floor(record.daysWorkedPreviousYear / alwRatio)}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{record.leaveAvailed}</td>
                      <td className="px-4 py-3 text-right font-semibold text-gray-900">{record.balanceLeave}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Leave Balance Tracking</h2>
            <p className="text-sm text-gray-500">Track leave balance, carry forward and remaining entitlement.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                className="rounded-lg border border-gray-200 bg-white pl-10 pr-3 py-2 text-sm text-gray-700"
                placeholder="Search employee"
                value={leaveBalanceSearch}
                onChange={(event) => setLeaveBalanceSearch(event.target.value)}
              />
            </div>
            <select
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
              value={leaveStatusFilter}
              onChange={(event) => setLeaveStatusFilter(event.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Employee Name</th>
                <th className="px-4 py-3 font-semibold">Employee ID</th>
                <th className="px-4 py-3 font-semibold text-right">Total Entitled</th>
                <th className="px-4 py-3 font-semibold text-right">Availed</th>
                <th className="px-4 py-3 font-semibold text-right">Remaining</th>
                <th className="px-4 py-3 font-semibold text-right">Carry Forward</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredLeaveBalances.map((record) => (
                <tr key={record.id} className="hover:bg-[#F3FBFA]">
                  <td className="px-4 py-3 text-gray-700">{record.employeeName}</td>
                  <td className="px-4 py-3 text-gray-700">{record.employeeId}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{record.totalEntitled}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{record.availed}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{record.remainingBalance}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{record.carryForward}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">Page {leavePage} of {Math.max(1, leaveRequestPages)}</p>
          <div className="flex items-center gap-2">
            <button
              disabled={leavePage === 1}
              type="button"
              onClick={() => setLeavePage((current) => Math.max(1, current - 1))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={leavePage >= leaveRequestPages}
              type="button"
              onClick={() => setLeavePage((current) => Math.min(leaveRequestPages, current + 1))}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[0.75fr_1fr]">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Leave Application Workflow</h2>
              <p className="text-sm text-gray-500">Submit forms and review approval stages.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#F3FBFA] px-4 py-2 text-sm font-semibold text-[#137f79]">
              <FileText className="h-4 w-4" />
              Approval pipeline
            </div>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <form className="space-y-3 rounded-2xl border border-gray-200 bg-gray-50 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={leaveRequestForm.employeeId}
                  onChange={(event) => setLeaveRequestForm((prev) => ({ ...prev, employeeId: event.target.value }))}
                  placeholder="Employee ID"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                />
                <input
                  value={leaveRequestForm.employeeName}
                  onChange={(event) => setLeaveRequestForm((prev) => ({ ...prev, employeeName: event.target.value }))}
                  placeholder="Employee Name"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <select
                  value={leaveRequestForm.leaveType}
                  onChange={(event) => setLeaveRequestForm((prev) => ({ ...prev, leaveType: event.target.value as typeof leaveRequestForm.leaveType }))}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                >
                  {leaveTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <input
                  type="date"
                  value={leaveRequestForm.fromDate}
                  onChange={(event) => setLeaveRequestForm((prev) => ({ ...prev, fromDate: event.target.value }))}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  type="date"
                  value={leaveRequestForm.toDate}
                  onChange={(event) => setLeaveRequestForm((prev) => ({ ...prev, toDate: event.target.value }))}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                />
                <input
                  value={leaveRequestForm.attachment}
                  onChange={(event) => setLeaveRequestForm((prev) => ({ ...prev, attachment: event.target.value }))}
                  placeholder="Attachment filename"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                />
              </div>
              <textarea
                value={leaveRequestForm.reason}
                onChange={(event) => setLeaveRequestForm((prev) => ({ ...prev, reason: event.target.value }))}
                placeholder="Reason"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700"
                rows={4}
              />
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleLeaveRequestSubmit}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#137f79] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0f6d64]"
                >
                  <Upload className="h-4 w-4" />
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setLeaveRequestForm({ employeeId: '', employeeName: '', leaveType: 'Annual', fromDate: '', toDate: '', reason: '', attachment: '' })}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  <X className="h-4 w-4" />
                  Reset
                </button>
              </div>
            </form>

            <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Approval Workflow</h3>
                  <p className="text-sm text-gray-500">Track review stages for each leave request.</p>
                </div>
                <span className="rounded-full bg-[#F3FBFA] px-3 py-1 text-xs font-semibold text-[#137f79]">Flow</span>
              </div>
              <div className="space-y-6">
                <ApprovalStage label="Employee" active />
                <ApprovalStage label="Supervisor Approval" />
                <ApprovalStage label="Manager Approval" />
                <ApprovalStage label="Approved / Rejected" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Employee ID</th>
                  <th className="px-4 py-3 font-semibold">Employee Name</th>
                  <th className="px-4 py-3 font-semibold">Leave Type</th>
                  <th className="px-4 py-3 font-semibold">From</th>
                  <th className="px-4 py-3 font-semibold">To</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {paginatedLeaveRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-[#F3FBFA]">
                    <td className="px-4 py-3 text-gray-700">{request.employeeId}</td>
                    <td className="px-4 py-3 text-gray-700">{request.employeeName}</td>
                    <td className="px-4 py-3 text-gray-700">{request.leaveType}</td>
                    <td className="px-4 py-3 text-gray-700">{request.fromDate}</td>
                    <td className="px-4 py-3 text-gray-700">{request.toDate}</td>
                    <td className="px-4 py-3 text-gray-700">{request.status}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => updateRequestStatus(request.id, 'Approved')}
                          className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => updateRequestStatus(request.id, 'Rejected')}
                          className="rounded-lg bg-red-50 px-3 py-1 text-xs font-semibold text-red-700"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          className="rounded-lg bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700"
                        >
                          View Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Leave Encashment Management</h2>
            <p className="text-sm text-gray-500">Calculate encashment, approve payouts and generate statements.</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-[#137f79] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0f6d64]"
          >
            <FilePlus className="h-4 w-4" />
            Generate Statement
          </button>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Employee ID</th>
                <th className="px-4 py-3 font-semibold">Employee Name</th>
                <th className="px-4 py-3 font-semibold text-right">Leave Balance</th>
                <th className="px-4 py-3 font-semibold text-right">Encashable Leave</th>
                <th className="px-4 py-3 font-semibold text-right">Wage Rate</th>
                <th className="px-4 py-3 font-semibold text-right">Encashment Amount</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {encashmentRecords.map((record) => (
                <tr key={record.id} className="hover:bg-[#F3FBFA]">
                  <td className="px-4 py-3 text-gray-700">{record.employeeId}</td>
                  <td className="px-4 py-3 text-gray-700">{record.employeeName}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{record.leaveBalance}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{record.encashableLeave}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(record.wageRate)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(record.encashmentAmount)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button className="rounded-lg bg-[#E6F7F6] px-3 py-1 text-xs font-semibold text-[#137f79]">Calculate</button>
                      <button className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Approve</button>
                      <button className="rounded-lg bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">Statement</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Weekly Off Wage Calculation</h2>
            <p className="text-sm text-gray-500">Review weekly off eligibility and calculate wage payouts.</p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl bg-[#137f79] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#0f6d64]"
          >
            <Calculator className="h-4 w-4" />
            Calculate
          </button>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Employee ID</th>
                <th className="px-4 py-3 font-semibold">Employee Name</th>
                <th className="px-4 py-3 font-semibold">Weekly Off Date</th>
                <th className="px-4 py-3 font-semibold">Eligibility</th>
                <th className="px-4 py-3 font-semibold text-right">Wage Rate</th>
                <th className="px-4 py-3 font-semibold text-right">Computed Wage</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {weeklyOffWageRecords.map((record) => (
                <tr key={record.id} className="hover:bg-[#F3FBFA]">
                  <td className="px-4 py-3 text-gray-700">{record.employeeId}</td>
                  <td className="px-4 py-3 text-gray-700">{record.employeeName}</td>
                  <td className="px-4 py-3 text-gray-700">{record.weeklyOffDate}</td>
                  <td className="px-4 py-3 text-gray-700">{record.eligibility}</td>
                  <td className="px-4 py-3 text-right text-gray-700">{formatCurrency(record.wageRate)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatCurrency(record.computedWage)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button className="rounded-lg bg-[#E6F7F6] px-3 py-1 text-xs font-semibold text-[#137f79]">Calculate</button>
                      <button className="rounded-lg bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">View Details</button>
                      <button className="rounded-lg bg-white border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">Export</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const SummaryCard = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-gray-900">{value}</p>
      </div>
      <div className="rounded-2xl bg-[#E6F7F6] p-3 text-[#137f79]">{icon}</div>
    </div>
  </div>
);

const StatCard = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="rounded-2xl bg-[#F3FBFA] p-3 text-[#137f79]">{icon}</div>
    </div>
  </div>
);

const ApprovalStage = ({ label, active }: { label: string; active?: boolean }) => (
  <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
    <div className={`rounded-full p-2 ${active ? 'bg-[#137f79] text-white' : 'bg-gray-100 text-gray-500'}`}>
      <CheckCircle2 className="h-4 w-4" />
    </div>
    <div>
      <p className="font-medium text-gray-900">{label}</p>
      <p className="text-sm text-gray-500">{active ? 'Current stage' : 'Pending'}</p>
    </div>
  </div>
);
