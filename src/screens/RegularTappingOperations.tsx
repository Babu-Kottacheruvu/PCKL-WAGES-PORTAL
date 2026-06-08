import { useMemo, useState } from 'react';
import type React from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  Calculator,
  CheckCircle2,
  FileUp,
  Leaf,
  Upload,
  Users,
} from 'lucide-react';
import { tappingOperations } from '../data/tappingOperationsData';
import type { AttendanceStatus, SourceDocumentStatus } from '../data/tappingOperationsData';

const formatKg = (value: number) => `${value.toFixed(1)} kg`;
const formatCurrency = (value: number) => `Rs. ${Math.round(value).toLocaleString('en-US')}`;

const attendanceStyles: Record<AttendanceStatus, string> = {
  Present: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Half Day': 'bg-amber-50 text-amber-700 border-amber-200',
  Absent: 'bg-slate-50 text-slate-700 border-slate-200',
};

const documentStyles: Record<SourceDocumentStatus, string> = {
  Uploaded: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
};

const getOverKilo = (latexKg: number, minimumKg: number) => Math.max(latexKg - minimumKg, 0);
const getOverKiloWage = (latexKg: number, minimumKg: number, rate: number) => getOverKilo(latexKg, minimumKg) * rate;
const getDailyWage = (baseWage: number, latexKg: number, minimumKg: number, rate: number) =>
  baseWage + getOverKiloWage(latexKg, minimumKg, rate);

export const RegularTappingOperations = () => {
  const [attendanceFilter, setAttendanceFilter] = useState<'All' | AttendanceStatus>('All');

  const filteredRecords = useMemo(
    () => tappingOperations.filter((record) => attendanceFilter === 'All' || record.attendance === attendanceFilter),
    [attendanceFilter],
  );

  const totals = useMemo(
    () =>
      filteredRecords.reduce(
        (summary, record) => {
          const overKilo = getOverKilo(record.latexKg, record.minimumKg);
          const overKiloWage = getOverKiloWage(record.latexKg, record.minimumKg, record.overKiloRate);
          const dailyWage = getDailyWage(record.baseWage, record.latexKg, record.minimumKg, record.overKiloRate);

          return {
            present: summary.present + (record.attendance === 'Present' ? 1 : 0),
            latex: summary.latex + record.latexKg,
            scrap: summary.scrap + record.scrapKg,
            overKilo: summary.overKilo + overKilo,
            overKiloWages: summary.overKiloWages + overKiloWage,
            dailyWages: summary.dailyWages + dailyWage,
            pendingDocuments: summary.pendingDocuments + (record.sourceDocument !== 'Uploaded' ? 1 : 0),
          };
        },
        {
          present: 0,
          latex: 0,
          scrap: 0,
          overKilo: 0,
          overKiloWages: 0,
          dailyWages: 0,
          pendingDocuments: 0,
        },
      ),
    [filteredRecords],
  );

  return (
    <div className="space-y-6">
      <section className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E6F7F6] px-3 py-1 text-sm font-medium text-[#137f79]">
              <Leaf className="h-4 w-4" />
              Daily tapping workflow
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Regular Tapping Operations</h1>
            <p className="mt-2 max-w-3xl text-gray-600">
              Record tapper-wise attendance, latex, scrap, field number, Field DRC and Factory DRC, then calculate daily wages
              and over-kilo wages with signed source documents attached for audit.
            </p>
          </div>

          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
            {(['All', 'Present', 'Half Day', 'Absent'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setAttendanceFilter(status)}
                className={[
                  'rounded-md px-3 py-2 text-sm font-semibold transition-colors',
                  attendanceFilter === status ? 'bg-white text-[#137f79] shadow-sm' : 'text-gray-600 hover:text-gray-900',
                ].join(' ')}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric title="Present Tappers" value={String(totals.present)} icon={<Users />} />
        <Metric title="Latex Recorded" value={formatKg(totals.latex)} icon={<Leaf />} />
        <Metric title="Over-Kilo Wages" value={formatCurrency(totals.overKiloWages)} icon={<Calculator />} />
        <Metric title="Pending Audit Docs" value={String(totals.pendingDocuments)} icon={<FileUp />} />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_0.75fr]">
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
          <div className="flex flex-col gap-1 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Daily Tapping Register</h2>
              <p className="text-sm text-gray-500">Attendance, field DRC, factory DRC and wage calculations by tapper.</p>
            </div>
            <button
              type="button"
              className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#20B2AA] px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1a9d96]"
            >
              <Upload className="h-4 w-4" />
              Upload Source Doc
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-\[1220px\] w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Tapper</th>
                  <th className="px-4 py-3 font-semibold">Attendance</th>
                  <th className="px-4 py-3 font-semibold">Field</th>
                  <th className="px-4 py-3 font-semibold text-right">Latex</th>
                  <th className="px-4 py-3 font-semibold text-right">Scrap</th>
                  <th className="px-4 py-3 font-semibold text-right">Field DRC</th>
                  <th className="px-4 py-3 font-semibold text-right">Factory DRC</th>
                  <th className="px-4 py-3 font-semibold text-right">Over Kilo</th>
                  <th className="px-4 py-3 font-semibold text-right">Base Wage</th>
                  <th className="px-4 py-3 font-semibold text-right">Over-Kilo Wage</th>
                  <th className="px-4 py-3 font-semibold text-right">Daily Wage</th>
                  <th className="px-4 py-3 font-semibold">Source Doc</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredRecords.map((record) => {
                  const overKilo = getOverKilo(record.latexKg, record.minimumKg);
                  const overKiloWage = getOverKiloWage(record.latexKg, record.minimumKg, record.overKiloRate);
                  const dailyWage = getDailyWage(record.baseWage, record.latexKg, record.minimumKg, record.overKiloRate);

                  return (
                    <tr key={record.id} className="hover:bg-[#F3FBFA]">
                      <td className="px-4 py-4">
                        <span className="block font-medium text-gray-900">{record.tapper}</span>
                        <span className="text-xs text-gray-500">{record.date}</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={['rounded-full border px-2.5 py-1 text-xs font-semibold', attendanceStyles[record.attendance]].join(' ')}>
                          {record.attendance}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-gray-700">{record.fieldNumber}</td>
                      <td className="px-4 py-4 text-right font-semibold text-gray-900">{formatKg(record.latexKg)}</td>
                      <td className="px-4 py-4 text-right text-gray-700">{formatKg(record.scrapKg)}</td>
                      <td className="px-4 py-4 text-right text-gray-700">{record.fieldDrc ? `${record.fieldDrc}%` : '-'}</td>
                      <td className="px-4 py-4 text-right text-gray-700">{record.factoryDrc ? `${record.factoryDrc}%` : '-'}</td>
                      <td className="px-4 py-4 text-right text-gray-700">{formatKg(overKilo)}</td>
                      <td className="px-4 py-4 text-right text-gray-700">{formatCurrency(record.baseWage)}</td>
                      <td className="px-4 py-4 text-right text-gray-700">{formatCurrency(overKiloWage)}</td>
                      <td className="px-4 py-4 text-right font-bold text-gray-900">{formatCurrency(dailyWage)}</td>
                      <td className="px-4 py-4">
                        <span className={['rounded-full border px-2.5 py-1 text-xs font-semibold', documentStyles[record.sourceDocument]].join(' ')}>
                          {record.sourceDocument}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#E6F7F6] p-3 text-[#20B2AA]">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Wage Formula</h2>
                <p className="text-sm text-gray-500">Daily wage plus over-kilo incentive.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <FormulaItem label="Over kilo" value="Max(latex kg - minimum kg, 0)" />
              <FormulaItem label="Over-kilo wage" value="Over kilo x slab rate" />
              <FormulaItem label="Daily wage" value="Base wage + over-kilo wage" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
            <h2 className="text-lg font-semibold text-gray-900">Audit Source Documents</h2>
            <div className="mt-4 space-y-3">
              {filteredRecords.map((record) => (
                <div key={record.id} className="rounded-lg border border-gray-200 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{record.documentName}</p>
                      <p className="mt-1 text-xs leading-5 text-gray-500">{record.auditNote}</p>
                    </div>
                    {record.sourceDocument === 'Uploaded' ? (
                      <BadgeCheck className="h-5 w-5 text-[#20B2AA]" />
                    ) : record.sourceDocument === 'Pending' ? (
                      <AlertTriangle className="h-5 w-5 text-amber-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Control title="Attendance lock" detail="Absent tappers receive zero production wage unless an approved exception is attached." />
        <Control title="DRC tolerance" detail="Field DRC and Factory DRC variance can be reviewed before payroll posting." />
        <Control title="Audit upload" detail="Signed source documents remain linked to each daily tapping entry." />
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
      <div className="rounded-lg bg-[#E6F7F6] p-3 text-[#20B2AA]">{icon}</div>
    </div>
  </div>
);

const FormulaItem = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-lg bg-gray-50 p-3">
    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
    <p className="mt-1 text-sm font-semibold text-gray-900">{value}</p>
  </div>
);

const Control = ({ title, detail }: { title: string; detail: string }) => (
  <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
    <div className="flex items-start gap-3">
      <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#20B2AA]" />
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-gray-600">{detail}</p>
      </div>
    </div>
  </div>
);
