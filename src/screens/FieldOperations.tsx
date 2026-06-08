import { useMemo, useState } from 'react';
import type React from 'react';
import { BadgeCheck, Calculator, Factory, Leaf, Users } from 'lucide-react';
import { fieldOperations } from '../data/fieldOperationsData';
import type { FieldOperationRecord, FieldOperationType } from '../data/fieldOperationsData';

const formatCurrency = (value: number) => `Rs. ${Math.round(value).toLocaleString('en-US')}`;

const statusStyles: Record<FieldOperationRecord['status'], string> = {
  Completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Verified: 'bg-sky-50 text-sky-700 border-sky-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
};

const workTypeStyles: Record<FieldOperationType, string> = {
  Manuring: 'bg-slate-50 text-slate-700 border-slate-200',
  Weeding: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Factory Work': 'bg-blue-50 text-blue-700 border-blue-200',
  'Pest Control': 'bg-amber-50 text-amber-700 border-amber-200',
  Irrigation: 'bg-cyan-50 text-cyan-700 border-cyan-200',
};

const calculateFieldWage = (hours: number, baseRate: number) => hours * baseRate;
const calculateDifferentialWage = (hours: number, differentialRate: number) => hours * differentialRate;
const calculateTotalWage = (hours: number, baseRate: number, differentialRate: number) =>
  calculateFieldWage(hours, baseRate) + calculateDifferentialWage(hours, differentialRate);

export const FieldOperations = () => {
  const [filterType, setFilterType] = useState<'All' | FieldOperationType>('All');

  const filteredOperations = useMemo(
    () => fieldOperations.filter((record) => filterType === 'All' || record.workType === filterType),
    [filterType],
  );

  const totals = useMemo(
    () =>
      filteredOperations.reduce(
        (summary, record) => {
          const fieldWage = calculateFieldWage(record.hours, record.baseRate);
          const differentialWage = calculateDifferentialWage(record.hours, record.differentialRate);
          return {
            totalHours: summary.totalHours + record.hours,
            fieldWages: summary.fieldWages + fieldWage,
            differentialWages: summary.differentialWages + differentialWage,
            totalWages: summary.totalWages + fieldWage + differentialWage,
            entries: summary.entries + 1,
          };
        },
        { totalHours: 0, fieldWages: 0, differentialWages: 0, totalWages: 0, entries: 0 },
      ),
    [filteredOperations],
  );

  return (
    <div className="space-y-6">
      <section className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E6F7F6] px-3 py-1 text-sm font-medium text-[#137f79]">
              <Factory className="h-4 w-4" />
              Field operations & wage calculation
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Field Operations</h1>
            <p className="mt-2 max-w-3xl text-gray-600">
              Daily entry of manuring, weeding, factory work and other field work with automatic field and differential wage calculation.
            </p>
          </div>

          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
            {(['All', 'Manuring', 'Weeding', 'Factory Work', 'Pest Control', 'Irrigation'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilterType(type)}
                className={
                  `rounded-md px-3 py-2 text-sm font-semibold transition-colors ${
                    filterType === type ? 'bg-white text-[#137f79] shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`
                }
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric title="Entries" value={String(totals.entries)} icon={<Users />} />
        <Metric title="Total Hours" value={`${totals.totalHours.toFixed(1)} hrs`} icon={<Leaf />} />
        <Metric title="Field Wages" value={formatCurrency(totals.fieldWages)} icon={<Calculator />} />
        <Metric title="Differential Wages" value={formatCurrency(totals.differentialWages)} icon={<BadgeCheck />} />
      </section>

      <section className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-gray-900">Daily Field Work Register</h2>
          <p className="text-sm text-gray-500">Track each field entry and see field plus differential wage totals automatically.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-\[1120px\] w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 font-semibold">Worker</th>
                <th className="px-4 py-3 font-semibold">Division</th>
                <th className="px-4 py-3 font-semibold">Work Type</th>
                <th className="px-4 py-3 font-semibold text-right">Hours</th>
                <th className="px-4 py-3 font-semibold text-right">Field Wage</th>
                <th className="px-4 py-3 font-semibold text-right">Diff Wage</th>
                <th className="px-4 py-3 font-semibold text-right">Total Wage</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredOperations.map((record) => {
                const fieldWage = calculateFieldWage(record.hours, record.baseRate);
                const differentialWage = calculateDifferentialWage(record.hours, record.differentialRate);
                const totalWage = calculateTotalWage(record.hours, record.baseRate, record.differentialRate);

                return (
                  <tr key={record.id} className="hover:bg-[#F3FBFA]">
                    <td className="px-4 py-4 text-gray-700">{record.date}</td>
                    <td className="px-4 py-4 text-gray-700">{record.worker}</td>
                    <td className="px-4 py-4 text-gray-700">{record.division}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${workTypeStyles[record.workType]}`}>
                        {record.workType}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-gray-700">{record.hours.toFixed(1)}</td>
                    <td className="px-4 py-4 text-right text-gray-700">{formatCurrency(fieldWage)}</td>
                    <td className="px-4 py-4 text-right text-gray-700">{formatCurrency(differentialWage)}</td>
                    <td className="px-4 py-4 text-right font-bold text-gray-900">{formatCurrency(totalWage)}</td>
                    <td className="px-4 py-4">
                      <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyles[record.status]}`}>
                        {record.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const Metric = ({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) => (
  <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="rounded-lg bg-[#E6F7F6] p-3 text-[#137f79]">{icon}</div>
    </div>
  </div>
);