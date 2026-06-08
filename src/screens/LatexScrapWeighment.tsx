import { useMemo, useState } from 'react';
import type React from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardCheck,
  RefreshCcw,
  Scale,
  UploadCloud,
  Usb,
  Wifi,
} from 'lucide-react';
import { collectionStations, weighmentEntries } from '../data/weighmentData';
import type { TransferMode, WeighmentStatus } from '../data/weighmentData';

const formatKg = (value: number) => `${value.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg`;

const statusStyles: Record<WeighmentStatus, string> = {
  Accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Warning: 'bg-amber-50 text-amber-700 border-amber-200',
  Hold: 'bg-red-50 text-red-700 border-red-200',
  'Pending Transfer': 'bg-slate-50 text-slate-700 border-slate-200',
};

export const LatexScrapWeighment = () => {
  const [selectedMode, setSelectedMode] = useState<'All' | TransferMode>('All');

  const filteredEntries = useMemo(
    () => weighmentEntries.filter((entry) => selectedMode === 'All' || entry.mode === selectedMode),
    [selectedMode],
  );

  const totals = useMemo(
    () =>
      filteredEntries.reduce(
        (summary, entry) => ({
          latex: summary.latex + entry.latexWeight,
          scrap: summary.scrap + entry.scrapWeight,
          accepted: summary.accepted + (entry.status === 'Accepted' ? 1 : 0),
          exceptions: summary.exceptions + (entry.status === 'Warning' || entry.status === 'Hold' ? 1 : 0),
        }),
        { latex: 0, scrap: 0, accepted: 0, exceptions: 0 },
      ),
    [filteredEntries],
  );

  return (
    <div className="space-y-6">
      <section className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E6F7F6] px-3 py-1 text-sm font-medium text-[#137f79]">
              <Scale className="h-4 w-4" />
              Electronic weighment integration
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Latex & Scrap Weighment</h1>
            <p className="mt-2 max-w-3xl text-gray-600">
              Capture latex and scrap weights from collection-station devices, transfer readings by USB or internet, and
              validate entries before payroll processing.
            </p>
          </div>

          <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-1">
            {(['All', 'USB', 'Internet'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSelectedMode(mode)}
                className={[
                  'inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition-colors',
                  selectedMode === mode ? 'bg-white text-[#137f79] shadow-sm' : 'text-gray-600 hover:text-gray-900',
                ].join(' ')}
              >
                {mode === 'USB' && <Usb className="h-4 w-4" />}
                {mode === 'Internet' && <Wifi className="h-4 w-4" />}
                {mode === 'All' && <Scale className="h-4 w-4" />}
                {mode}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric title="Latex Captured" value={formatKg(totals.latex)} icon={<Scale />} />
        <Metric title="Scrap Captured" value={formatKg(totals.scrap)} icon={<ClipboardCheck />} />
        <Metric title="Accepted Records" value={String(totals.accepted)} icon={<CheckCircle2 />} />
        <Metric title="Validation Exceptions" value={String(totals.exceptions)} icon={<AlertTriangle />} />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {collectionStations.map((station) => (
          <article key={station.id} className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900">{station.station}</h2>
                <p className="mt-1 text-sm text-gray-500">{station.division}</p>
              </div>
              <span
                className={[
                  'rounded-full border px-2.5 py-1 text-xs font-semibold',
                  station.connection === 'Online'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-red-200 bg-red-50 text-red-700',
                ].join(' ')}
              >
                {station.connection}
              </span>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Device</dt>
                <dd className="mt-1 font-semibold text-gray-900">{station.deviceId}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Transfer</dt>
                <dd className="mt-1 inline-flex items-center gap-1.5 font-semibold text-gray-900">
                  {station.mode === 'USB' ? <Usb className="h-4 w-4 text-[#20B2AA]" /> : <Wifi className="h-4 w-4 text-[#20B2AA]" />}
                  {station.mode}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Last Sync</dt>
                <dd className="mt-1 font-semibold text-gray-900">{station.lastSync}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">Pending</dt>
                <dd className="mt-1 font-semibold text-gray-900">{station.pendingRecords} records</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>

      <section className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        <div className="flex flex-col gap-1 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Captured Weighment Entries</h2>
            <p className="text-sm text-gray-500">Latex and scrap readings imported from USB files or internet-connected devices.</p>
          </div>
          <button
            type="button"
            className="inline-flex w-fit items-center gap-2 rounded-lg bg-[#20B2AA] px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1a9d96]"
          >
            <RefreshCcw className="h-4 w-4" />
            Sync Devices
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1040px] w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Entry ID</th>
                <th className="px-4 py-3 font-semibold">Station</th>
                <th className="px-4 py-3 font-semibold">Division / Field</th>
                <th className="px-4 py-3 font-semibold">Collector</th>
                <th className="px-4 py-3 font-semibold text-right">Latex</th>
                <th className="px-4 py-3 font-semibold text-right">Scrap</th>
                <th className="px-4 py-3 font-semibold">Mode</th>
                <th className="px-4 py-3 font-semibold">Captured At</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Validation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-[#F3FBFA]">
                  <td className="px-4 py-4 font-medium text-gray-900">{entry.id}</td>
                  <td className="px-4 py-4 text-gray-700">{entry.station}</td>
                  <td className="px-4 py-4 text-gray-700">
                    <span className="block font-medium text-gray-900">{entry.division}</span>
                    <span className="text-xs text-gray-500">{entry.field}</span>
                  </td>
                  <td className="px-4 py-4 text-gray-700">{entry.collector}</td>
                  <td className="px-4 py-4 text-right font-semibold text-gray-900">{formatKg(entry.latexWeight)}</td>
                  <td className="px-4 py-4 text-right text-gray-700">{formatKg(entry.scrapWeight)}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E6F7F6] px-2.5 py-1 text-xs font-semibold text-[#137f79]">
                      {entry.mode === 'USB' ? <Usb className="h-3.5 w-3.5" /> : <Wifi className="h-3.5 w-3.5" />}
                      {entry.mode}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-700">{entry.capturedAt}</td>
                  <td className="px-4 py-4">
                    <span className={['rounded-full border px-2.5 py-1 text-xs font-semibold', statusStyles[entry.status]].join(' ')}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-600">{entry.validation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#E6F7F6] p-3 text-[#20B2AA]">
              <UploadCloud className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Transfer Controls</h2>
              <p className="text-sm text-gray-500">USB batch import and internet sync checks before posting weights.</p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            <ControlItem title="USB file validation" detail="Device ID, shift date, checksum and duplicate entry checks are required." />
            <ControlItem title="Internet sync validation" detail="Station token, timestamp drift and packet checksum are verified." />
            <ControlItem title="Weight range control" detail="Latex and scrap weights outside station thresholds are held for review." />
            <ControlItem title="Supervisor approval" detail="Warnings and holds must be cleared before wage calculation uses the record." />
          </div>
        </div>

        <div className="bg-[#F3FBFA] border border-[#BFEDEA] shadow-sm rounded-xl p-5">
          <h2 className="text-lg font-semibold text-gray-900">Posting Readiness</h2>
          <p className="mt-2 text-sm leading-6 text-gray-700">
            Accepted readings are ready for payroll. Pending USB readings remain queued at the collection station until the device
            data is imported and validated.
          </p>
          <div className="mt-5 rounded-lg bg-white p-4">
            <p className="text-sm font-medium text-gray-500">Ready records</p>
            <p className="mt-2 text-3xl font-bold text-[#137f79]">{totals.accepted} / {filteredEntries.length}</p>
          </div>
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
      <div className="rounded-lg bg-[#E6F7F6] p-3 text-[#20B2AA]">{icon}</div>
    </div>
  </div>
);

const ControlItem = ({ title, detail }: { title: string; detail: string }) => (
  <div className="rounded-lg border border-gray-200 p-4">
    <div className="flex items-start gap-3">
      <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#20B2AA]" />
      <div>
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-gray-600">{detail}</p>
      </div>
    </div>
  </div>
);
