import { useMemo, useState } from 'react';
import type React from 'react';
import { AlertTriangle, BadgeCheck, Ban, Calculator, CheckCircle2, Sprout, Trees } from 'lucide-react';
import { slaughterTappingRecords } from '../data/slaughterTappingData';
import type { SlaughterStatus } from '../data/slaughterTappingData';

const formatKg = (value: number) => `${value.toFixed(1)} kg`;
const formatCurrency = (value: number) => `Rs. ${Math.round(value).toLocaleString('en-US')}`;

const statusStyles: Record<SlaughterStatus, string> = {
  Draft: 'bg-slate-50 text-slate-700 border-slate-200',
  'Supervisor Verified': 'bg-amber-50 text-amber-700 border-amber-200',
  'Ready for Wage Posting': 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const calculateTreeWage = (treeCount: number, ratePerTree: number) => treeCount * ratePerTree;
const calculateOutputWage = (latexKg: number, scrapKg: number, ratePerKg: number) => (latexKg + scrapKg) * ratePerKg;
const calculateTotalWage = (treeCount: number, ratePerTree: number, latexKg: number, scrapKg: number, ratePerKg: number) =>
  calculateTreeWage(treeCount, ratePerTree) + calculateOutputWage(latexKg, scrapKg, ratePerKg);

export const SlaughterTapping = () => {
  const [statusFilter, setStatusFilter] = useState<'All' | SlaughterStatus>('All');

  const filteredRecords = useMemo(
    () => slaughterTappingRecords.filter((record) => statusFilter === 'All' || record.status === statusFilter),
    [statusFilter],
  );

  const totals = useMemo(
    () =>
      filteredRecords.reduce(
        (summary, record) => ({
          trees: summary.trees + record.treeCount,
          latex: summary.latex + record.latexKg,
          scrap: summary.scrap + record.scrapKg,
          wages:
            summary.wages +
            calculateTotalWage(record.treeCount, record.ratePerTree, record.latexKg, record.scrapKg, record.ratePerKg),
          ready: summary.ready + (record.status === 'Ready for Wage Posting' ? 1 : 0),
        }),
        { trees: 0, latex: 0, scrap: 0, wages: 0, ready: 0 },
      ),
    [filteredRecords],
  );

  return (
    <div className="space-y-6">
      <section className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E6F7F6] px-3 py-1 text-sm font-medium text-[#137f79]">
              <Sprout className="h-4 w-4" />
              Pre-replanting wage workflow
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Slaughter Tapping</h1>
            <p className="mt-2 max-w-3xl text-gray-600">
              Record slaughter tapping before replanting, calculate wages from predefined company rates, and keep the payment
              outside bonus and PF linkage as per company norms.
            </p>
          </div>

          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
            {(['All', 'Draft', 'Supervisor Verified', 'Ready for Wage Posting'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={[
                  'rounded-md px-3 py-2 text-sm font-semibold transition-colors',
                  statusFilter === status ? 'bg-white text-[#137f79] shadow-sm' : 'text-gray-600 hover:text-gray-900',
                ].join(' ')}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric title="Trees Covered" value={totals.trees.toLocaleString('en-US')} icon={<Trees />} />
        <Metric title="Latex Output" value={formatKg(totals.latex)} icon={<Sprout />} />
        <Metric title="Calculated Wages" value={formatCurrency(totals.wages)} icon={<Calculator />} />
        <Metric title="Ready Records" value={`${totals.ready} / ${filteredRecords.length}`} icon={<BadgeCheck />} />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_0.75fr]">
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
          <div className="border-b border-gray-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Slaughter Tapping Register</h2>
            <p className="text-sm text-gray-500">Pre-replanting tapping details with fixed-rate wage calculation.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-\[1120px\] w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Tapper</th>
                  <th className="px-4 py-3 font-semibold">Division / Field</th>
                  <th className="px-4 py-3 font-semibold">Replanting Block</th>
                  <th className="px-4 py-3 font-semibold text-right">Trees</th>
                  <th className="px-4 py-3 font-semibold text-right">Latex</th>
                  <th className="px-4 py-3 font-semibold text-right">Scrap</th>
                  <th className="px-4 py-3 font-semibold text-right">Days</th>
                  <th className="px-4 py-3 font-semibold text-right">Tree Wage</th>
                  <th className="px-4 py-3 font-semibold text-right">Output Wage</th>
                  <th className="px-4 py-3 font-semibold text-right">Total Wage</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredRecords.map((record) => {
                  const treeWage = calculateTreeWage(record.treeCount, record.ratePerTree);
                  const outputWage = calculateOutputWage(record.latexKg, record.scrapKg, record.ratePerKg);
                  const totalWage = treeWage + outputWage;

                  return (
                    <tr key={record.id} className="hover:bg-[#F3FBFA]">
                      <td className="px-4 py-4">
                        <span className="block font-medium text-gray-900">{record.tapper}</span>
                        <span className="text-xs text-gray-500">{record.date}</span>
                      </td>
                      <td className="px-4 py-4 text-gray-700">
                        <span className="block font-medium text-gray-900">{record.division}</span>
                        <span className="text-xs text-gray-500">{record.fieldNumber}</span>
                      </td>
                      <td className="px-4 py-4 text-gray-700">{record.replantingBlock}</td>
                      <td className="px-4 py-4 text-right text-gray-700">{record.treeCount.toLocaleString('en-US')}</td>
                      <td className="px-4 py-4 text-right text-gray-700">{formatKg(record.latexKg)}</td>
                      <td className="px-4 py-4 text-right text-gray-700">{formatKg(record.scrapKg)}</td>
                      <td className="px-4 py-4 text-right text-gray-700">{record.tappingDays}</td>
                      <td className="px-4 py-4 text-right text-gray-700">{formatCurrency(treeWage)}</td>
                      <td className="px-4 py-4 text-right text-gray-700">{formatCurrency(outputWage)}</td>
                      <td className="px-4 py-4 text-right font-bold text-gray-900">{formatCurrency(totalWage)}</td>
                      <td className="px-4 py-4">
                        <span className={['rounded-full border px-2.5 py-1 text-xs font-semibold', statusStyles[record.status]].join(' ')}>
                          {record.status}
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
                <h2 className="text-lg font-semibold text-gray-900">Predefined Rate Calculation</h2>
                <p className="text-sm text-gray-500">Fixed rates are applied directly to tree count and output.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              <FormulaItem label="Tree wage" value="Tree count x rate per tree" />
              <FormulaItem label="Output wage" value="(Latex kg + scrap kg) x rate per kg" />
              <FormulaItem label="Payable wage" value="Tree wage + output wage" />
            </div>
          </div>

          <div className="bg-[#F3FBFA] border border-[#BFEDEA] shadow-sm rounded-xl p-5">
            <h2 className="text-lg font-semibold text-gray-900">Company Norms</h2>
            <div className="mt-4 grid grid-cols-1 gap-3">
              <NormItem title="Bonus linkage" value="Not linked" />
              <NormItem title="PF linkage" value="Not linked" />
              <NormItem title="Payroll treatment" value="Separate wage head" />
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
            <h2 className="text-lg font-semibold text-gray-900">Approval Notes</h2>
            <div className="mt-4 space-y-3">
              {filteredRecords.map((record) => (
                <div key={record.id} className="rounded-lg border border-gray-200 p-3">
                  <div className="flex items-start gap-3">
                    {record.status === 'Ready for Wage Posting' ? (
                      <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#20B2AA]" />
                    ) : (
                      <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-500" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{record.replantingBlock}</p>
                      <p className="mt-1 text-sm leading-6 text-gray-600">{record.approvalNote}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Control title="Replanting reference" detail="Each entry is tied to a replanting block before wage posting." />
        <Control title="Fixed-rate wage head" detail="Rates are applied from company norms, without regular tapping bonus rules." />
        <Control title="Bonus/PF exclusion" detail="Slaughter tapping wages are marked outside bonus and PF calculations." />
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

const NormItem = ({ title, value }: { title: string; value: string }) => (
  <div className="flex items-center justify-between rounded-lg bg-white p-3">
    <span className="text-sm font-medium text-gray-600">{title}</span>
    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#137f79]">
      <Ban className="h-4 w-4" />
      {value}
    </span>
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
