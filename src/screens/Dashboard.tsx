import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Activity, Users, Settings, Database, ClipboardList, Briefcase, Calculator, Scale, Trees } from 'lucide-react';

export const Dashboard = () => {
  const { user } = useAuth();

  // Define some role-specific content just to show it works
  const roleContent = () => {
    switch (user?.role) {
      case 'System Admin':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Widget title="User Management" icon={<Users />} count="1,240" />
            <Widget title="System Health" icon={<Activity />} count="98%" />
            <Widget title="Tree & Division" icon={<Trees />} count="5 fields" />
            <Widget title="Weighment" icon={<Scale />} count="5 entries" />
            <Widget title="Tapping Ops" icon={<ClipboardList />} count="5 records" />
            <Widget title="Settings" icon={<Settings />} count="12 configs" />
          </div>
        );
      case 'Head Office Admin':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Widget title="Estate Reports" icon={<ClipboardList />} count="24 pending" />
            <Widget title="Financial Overview" icon={<Database />} count="$1.2M" />
            <Widget title="Weighment" icon={<Scale />} count="2 exceptions" />
            <Widget title="Tapping Ops" icon={<ClipboardList />} count="Rs. 3.8k" />
          </div>
        );
      case 'Estate Manager':
      case 'Field Supervisor':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Widget title="Field Staff" icon={<Briefcase />} count="120 active" />
            <Widget title="Daily Tasks" icon={<ClipboardList />} count="15 pending" />
            <Widget title="Latex & Scrap" icon={<Scale />} count="1.8k kg" />
            <Widget title="Tapping Ops" icon={<ClipboardList />} count="3 present" />
          </div>
        );
      case 'HR Officer':
      case 'Wage Processing Officer':
      case 'Accounts Officer':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Widget title="Payroll Status" icon={<Calculator />} count="Processing" />
            <Widget title="Employee Records" icon={<Users />} count="450" />
            <Widget title="Tapping Wages" icon={<ClipboardList />} count="Review" />
          </div>
        );
      default:
        return (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Welcome, {user?.role}</h3>
            <p className="mt-2 text-gray-600">This is your personalized dashboard view. More features coming soon!</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-lg text-gray-600">
          You are currently logged in as a <span className="font-semibold text-[#20B2AA]">{user?.role}</span>
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Access</h2>
        {roleContent()}
      </div>
    </div>
  );
};

const Widget = ({ title, icon, count }: { title: string, icon: React.ReactNode, count: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center space-x-4">
    <div className="bg-[#E6F7F6] p-3 rounded-lg text-[#20B2AA]">
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{count}</p>
    </div>
  </div>
);
