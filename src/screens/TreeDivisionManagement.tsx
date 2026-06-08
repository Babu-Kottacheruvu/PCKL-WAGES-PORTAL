import { useMemo, useState } from 'react';
import type React from 'react';
import { BarChart3, ChevronDown, CircleDollarSign, Leaf, Trees, TrendingUp } from 'lucide-react';
import { divisionMasters, overKiloSlabs } from '../data/treeDivisionData';

const formatNumber = (value: number) => value.toLocaleString('en-US');
const formatArea = (value: number) => `${value.toFixed(1)} ha`;
const formatKg = (value: number) => `${formatNumber(value)} kg`;

export const TreeDivisionManagement = () => {
  const divisions = useMemo(
    () => Array.from(new Set(divisionMasters.map((item) => item.division))),
    [],
  );
  const classes = useMemo(
    () => Array.from(new Set(divisionMasters.map((item) => item.className))),
    [],
  );

  const [selectedDivision, setSelectedDivision] = useState('All Divisions');
  const [selectedClass, setSelectedClass] = useState('All Classes');

  const filteredMasters = useMemo(
    () =>
      divisionMasters.filter((item) => {
        const divisionMatch = selectedDivision === 'All Divisions' || item.division === selectedDivision;
        const classMatch = selectedClass === 'All Classes' || item.className === selectedClass;
        return divisionMatch && classMatch;
      }),
    [selectedClass, selectedDivision],
  );

  const totals = useMemo(
    () =>
      filteredMasters.reduce(
        (summary, item) => ({
          area: summary.area + item.area,
          effectiveArea: summary.effectiveArea + item.effectiveArea,
          tappingTrees: summary.tappingTrees + item.tappingTrees,
          productionTarget: summary.productionTarget + item.productionTarget,
          revisedTarget: summary.revisedTarget + item.revisedTarget,
        }),
        {
          area: 0,
          effectiveArea: 0,
          tappingTrees: 0,
          productionTarget: 0,
          revisedTarget: 0,
        },
      ),
    [filteredMasters],
  );

  return (
    <div className="space-y-6">
      <section className="bg-white border border-gray-200 shadow-sm rounded-xl p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#E6F7F6] px-3 py-1 text-sm font-medium text-[#137f79]">
              <Leaf className="h-4 w-4" />
              Estate master data
            </div>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Tree & Division Management</h1>
            <p className="mt-2 max-w-3xl text-gray-600">
              Division-wise field records for area, tree inventory, targets, tapping system, and PLC over-kilo norms.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FilterSelect
              label="Division"
              value={selectedDivision}
              options={['All Divisions', ...divisions]}
              onChange={setSelectedDivision}
            />
            <FilterSelect
              label="Class"
              value={selectedClass}
              options={['All Classes', ...classes]}
              onChange={setSelectedClass}
            />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric title="Total Area" value={formatArea(totals.area)} icon={<Trees />} />
        <Metric title="Effective Area" value={formatArea(totals.effectiveArea)} icon={<Leaf />} />
        <Metric title="Tapping Trees" value={formatNumber(totals.tappingTrees)} icon={<BarChart3 />} />
        <Metric title="Revised Target" value={formatKg(totals.revisedTarget)} icon={<TrendingUp />} />
      </section>

      <section className="bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden">
        <div className="flex flex-col gap-1 border-b border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Division Master</h2>
            <p className="text-sm text-gray-500">Field, class, YOP, clone, tree count, area, target and tapping details.</p>
          </div>
          <span className="text-sm font-medium text-[#20B2AA]">{filteredMasters.length} records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-\[1180px\] w-full divide-y divide-gray-200 text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Division</th>
                <th className="px-4 py-3 font-semibold">Field</th>
                <th className="px-4 py-3 font-semibold">Class</th>
                <th className="px-4 py-3 font-semibold">YOP</th>
                <th className="px-4 py-3 font-semibold">Clone</th>
                <th className="px-4 py-3 font-semibold text-right">Area</th>
                <th className="px-4 py-3 font-semibold text-right">Tapping Trees</th>
                <th className="px-4 py-3 font-semibold text-right">Non Tapping</th>
                <th className="px-4 py-3 font-semibold text-right">Effective Area</th>
                <th className="px-4 py-3 font-semibold text-right">Production Target</th>
                <th className="px-4 py-3 font-semibold text-right">Revised Target</th>
                <th className="px-4 py-3 font-semibold">Tapping System</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {filteredMasters.map((item) => (
                <tr key={item.id} className="hover:bg-[#F3FBFA]">
                  <td className="px-4 py-4 font-medium text-gray-900">{item.division}</td>
                  <td className="px-4 py-4 text-gray-700">{item.field}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-[#E6F7F6] px-2.5 py-1 text-xs font-semibold text-[#137f79]">
                      {item.className}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-700">{item.yop}</td>
                  <td className="px-4 py-4 text-gray-700">{item.clone}</td>
                  <td className="px-4 py-4 text-right text-gray-700">{formatArea(item.area)}</td>
                  <td className="px-4 py-4 text-right text-gray-700">{formatNumber(item.tappingTrees)}</td>
                  <td className="px-4 py-4 text-right text-gray-700">{formatNumber(item.nonTappingTrees)}</td>
                  <td className="px-4 py-4 text-right text-gray-700">{formatArea(item.effectiveArea)}</td>
                  <td className="px-4 py-4 text-right text-gray-700">{formatKg(item.productionTarget)}</td>
                  <td className="px-4 py-4 text-right font-semibold text-gray-900">{formatKg(item.revisedTarget)}</td>
                  <td className="px-4 py-4 text-gray-700">{item.tappingSystem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-[#E6F7F6] p-3 text-[#20B2AA]">
              <CircleDollarSign className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">PLC Over-Kilo Norms</h2>
              <p className="text-sm text-gray-500">Minimum quantity and slab rate by field and class.</p>
            </div>
          </div>
          <div className="mt-5 rounded-lg border border-[#BFEDEA] bg-[#F3FBFA] p-4">
            <p className="text-sm leading-6 text-gray-700">
              Over-kilo is calculated only after the field/class minimum quantity is met. The matching PLC slab rate is then
              applied to the qualifying quantity range.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {overKiloSlabs.map((slab) => (
            <article key={slab.id} className="bg-white border border-gray-200 shadow-sm rounded-xl p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{slab.field}</p>
                  <p className="mt-1 text-xs font-medium text-[#20B2AA]">{slab.className}</p>
                </div>
                <span className="rounded-full bg-[#E6F7F6] px-2.5 py-1 text-xs font-semibold text-[#137f79]">
                  PLC
                </span>
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-gray-500">Minimum</dt>
                  <dd className="mt-1 font-semibold text-gray-900">{slab.minimumQuantity} kg</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs text-gray-500">Slab</dt>
                  <dd className="mt-1 font-semibold text-gray-900">{slab.slab}</dd>
                </div>
                <div className="col-span-3">
                  <dt className="text-xs text-gray-500">Slab Rate</dt>
                  <dd className="mt-1 text-xl font-bold text-[#137f79]">Rs. {slab.slabRate}/kg</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

const FilterSelect = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) => (
  <label className="block">
    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</span>
    <span className="relative mt-1 block">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-3 pr-10 text-sm font-medium text-gray-800 shadow-sm outline-none transition focus:border-[#20B2AA] focus:ring-2 focus:ring-[#20B2AA]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    </span>
  </label>
);

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
