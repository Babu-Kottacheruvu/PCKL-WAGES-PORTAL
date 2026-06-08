import { useState, useMemo } from 'react';
import {
  Search, Filter, Calendar, CheckCircle, Clock,
  AlertTriangle, FileText, CheckSquare, Edit3
} from 'lucide-react';
import {
  mockAttendanceRecords,
  mockCorrectionRequests,
  mockMonthlySummaries,
  type AttendanceStatus,
  type AttendanceRecord
} from '../data/attendanceData';

type Tab = 'daily' | 'corrections' | 'monthly' | 'patterns';

export const AttendanceManagement = () => {
  const [activeTab, setActiveTab] = useState<Tab>('daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedDivision, setSelectedDivision] = useState('All');

  // Daily Entry State
  const [records, setRecords] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());

  // Block future dates
  const today = new Date().toISOString().split('T')[0];

  const handleBulkAction = (status: AttendanceStatus) => {
    setRecords(prev => prev.map(record =>
      selectedRecords.has(record.id) ? { ...record, status } : record
    ));
    setSelectedRecords(new Set()); // Clear selection after action
  };

  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedRecords);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedRecords(newSelection);
  };

  const selectAll = () => {
    if (selectedRecords.size === filteredDailyRecords.length) {
      setSelectedRecords(new Set());
    } else {
      setSelectedRecords(new Set(filteredDailyRecords.map(r => r.id)));
    }
  };

  const filteredDailyRecords = useMemo(() => {
    return records.filter(r => {
      const matchDate = r.date === selectedDate;
      const matchDivision = selectedDivision === 'All' || r.division === selectedDivision;
      return matchDate && matchDivision;
    });
  }, [records, selectedDate, selectedDivision]);

  // Pattern detection (e.g., 3+ consecutive absences)
  const patternAlerts = useMemo(() => {
    const alerts: { workerName: string, workerId: string, daysAbsent: number }[] = [];
    const absencesByWorker = mockAttendanceRecords
      .filter(r => r.status === 'Absent')
      .reduce((acc, r) => {
        if (!acc[r.workerId]) acc[r.workerId] = { count: 0, name: r.workerName };
        acc[r.workerId].count += 1;
        return acc;
      }, {} as Record<string, { count: number, name: string }>);

    Object.entries(absencesByWorker).forEach(([id, data]) => {
      if (data.count >= 2) { // 2 or more absences in mock data context
        alerts.push({ workerId: id, workerName: data.name, daysAbsent: data.count });
      }
    });
    return alerts;
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-sm text-gray-500">Track and manage worker attendance, leaves, and approvals.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-xl w-fit">
        {[
          { id: 'daily', label: 'Daily Entry', icon: <CheckSquare className="w-4 h-4" /> },
          { id: 'corrections', label: 'Corrections', icon: <Edit3 className="w-4 h-4" /> },
          { id: 'monthly', label: 'Monthly Summary', icon: <FileText className="w-4 h-4" /> },
          { id: 'patterns', label: 'Patterns & Flags', icon: <AlertTriangle className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                ? 'bg-white text-[#137f79] shadow-sm ring-1 ring-black/5'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Daily Entry Tab */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={selectedDate}
                  max={today}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-10 w-full border-gray-300 rounded-lg focus:ring-[#137f79] focus:border-[#137f79]"
                />
              </div>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedDivision}
                  onChange={(e) => setSelectedDivision(e.target.value)}
                  className="pl-10 w-full border-gray-300 rounded-lg focus:ring-[#137f79] focus:border-[#137f79]"
                >
                  <option value="All">All Divisions</option>
                  <option value="Division A">Division A</option>
                  <option value="Division B">Division B</option>
                  <option value="Division C">Division C</option>
                  <option value="Division D">Division D</option>
                </select>
              </div>
            </div>
            <div className="flex-1 min-w-[300px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Worker</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by ID or Name..."
                  className="pl-10 w-full border-gray-300 rounded-lg focus:ring-[#137f79] focus:border-[#137f79]"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Bulk Actions */}
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedRecords.size > 0 && selectedRecords.size === filteredDailyRecords.length}
                  onChange={selectAll}
                  className="rounded border-gray-300 text-[#137f79] focus:ring-[#137f79]"
                />
                <span className="text-sm text-gray-600 font-medium">{selectedRecords.size} selected</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Bulk Mark:</span>
                <button
                  onClick={() => handleBulkAction('Present')}
                  disabled={selectedRecords.size === 0}
                  className="px-3 py-1.5 text-xs font-medium bg-green-100 text-green-700 rounded-lg hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Present
                </button>
                <button
                  onClick={() => handleBulkAction('Absent')}
                  disabled={selectedRecords.size === 0}
                  className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 rounded-lg hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Absent
                </button>
                <button
                  onClick={() => handleBulkAction('Half-Day')}
                  disabled={selectedRecords.size === 0}
                  className="px-3 py-1.5 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Half-Day
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                      <span className="sr-only">Select</span>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Worker Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Division/Field</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Linked Operation</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDailyRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedRecords.has(record.id)}
                          onChange={() => toggleSelection(record.id)}
                          className="rounded border-gray-300 text-[#137f79] focus:ring-[#137f79]"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900">{record.workerName}</span>
                          <span className="text-xs text-gray-500">{record.workerId} &middot; {record.role}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900">{record.division}</span>
                          <span className="text-xs text-gray-500">{record.field}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={record.status}
                          onChange={(e) => {
                            const newStatus = e.target.value as AttendanceStatus;
                            setRecords(prev => prev.map(r => r.id === record.id ? { ...r, status: newStatus } : r));
                          }}
                          className={`text-sm rounded-full px-3 py-1 font-medium border-0 focus:ring-2 ${record.status === 'Present' ? 'bg-green-100 text-green-800' :
                              record.status === 'Absent' ? 'bg-red-100 text-red-800' :
                                record.status === 'Half-Day' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                            }`}
                        >
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Half-Day">Half-Day</option>
                          <option value="Holiday">Holiday</option>
                          <option value="Weekly Off">Weekly Off</option>
                          <option value="Sick Leave">Sick Leave</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.linkedTappingRecordId ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#E6F7F6] text-[#137f79] text-xs font-medium cursor-pointer hover:bg-[#cbf1ef]">
                            <FileText className="w-3.5 h-3.5" />
                            {record.linkedTappingRecordId}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No linked record</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredDailyRecords.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                        No records found for the selected date and division.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Corrections Tab */}
      {activeTab === 'corrections' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900">Pending Corrections</h3>
            <p className="text-sm text-gray-500 mt-1">Review supervisor requests to modify historical attendance records. Edits are audited.</p>
          </div>
          <div className="divide-y divide-gray-200">
            {mockCorrectionRequests.map((req) => (
              <div key={req.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {req.id}
                      </span>
                      <span className="text-sm text-gray-500">Requested by: <span className="font-medium text-gray-900">{req.requestedBy}</span></span>
                    </div>
                    <p className="text-sm text-gray-800">
                      Change status for record <span className="font-mono text-xs">{req.recordId}</span> from <strong className="text-red-600">{req.originalStatus}</strong> to <strong className="text-green-600">{req.proposedStatus}</strong>
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Reason:</span> {req.reason}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 focus:ring-2 focus:ring-red-200 transition-colors">
                      Reject
                    </button>
                    <button className="px-4 py-2 bg-[#137f79] text-white rounded-lg text-sm font-medium hover:bg-[#0e5c58] focus:ring-2 focus:ring-[#137f79]/20 transition-colors">
                      Approve & Update
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Tab */}
      {activeTab === 'monthly' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900">Payroll Attendance Summaries</h3>
            <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 focus:ring-2 focus:ring-[#137f79]/20 transition-colors">
              Export Payroll CSV
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockMonthlySummaries.map((summary) => (
              <div key={summary.workerId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{summary.workerName}</h4>
                    <p className="text-xs text-gray-500">{summary.workerId} &middot; {summary.monthYear}</p>
                  </div>
                  <span className="text-2xl font-bold text-[#137f79]">{summary.presentDays}/{summary.totalDays}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-2 rounded">
                    <span className="text-gray-500">Present</span>
                    <p className="font-medium text-gray-900">{summary.presentDays}</p>
                  </div>
                  <div className="bg-red-50 p-2 rounded">
                    <span className="text-red-700">Absent</span>
                    <p className="font-medium text-red-900">{summary.absentDays}</p>
                  </div>
                  <div className="bg-yellow-50 p-2 rounded">
                    <span className="text-yellow-700">Half Days</span>
                    <p className="font-medium text-yellow-900">{summary.halfDays}</p>
                  </div>
                  <div className="bg-blue-50 p-2 rounded">
                    <span className="text-blue-700">Leaves</span>
                    <p className="font-medium text-blue-900">{summary.leaveDays}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Patterns Tab */}
      {activeTab === 'patterns' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-200 bg-red-50/50">
            <h3 className="text-lg font-bold text-red-800 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Unusual Attendance Patterns
            </h3>
            <p className="text-sm text-red-600 mt-1">Workers automatically flagged for supervisor review due to consecutive absences or abnormal leave patterns.</p>
          </div>
          <div className="p-6">
            {patternAlerts.length > 0 ? (
              <div className="grid gap-4">
                {patternAlerts.map((alert, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 border border-red-100 bg-white rounded-lg shadow-sm">
                    <div className="p-2 bg-red-100 rounded-full text-red-600">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{alert.workerName} ({alert.workerId})</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Flagged for <strong className="text-red-600">{alert.daysAbsent} consecutive absences</strong>.
                        Please review their status or contact the worker to determine if Sick Leave should be applied.
                      </p>
                      <button className="mt-3 text-sm font-medium text-[#137f79] hover:underline">
                        Review Worker Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900">No flags detected</h3>
                <p className="text-gray-500">All attendance patterns look normal.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
