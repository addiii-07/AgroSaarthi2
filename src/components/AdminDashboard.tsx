import React, { useState } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../data/mockData';
import {
  ShieldAlert,
  Users,
  Sprout,
  FileCheck,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Activity,
  Bot,
  Layers,
} from 'lucide-react';

interface AdminDashboardProps {
  user: User;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [usersList, setUsersList] = useState<User[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'farmer' | 'officer' | 'admin'>('All');

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.mobile.includes(searchQuery) ||
      u.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'All' || u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const toggleUserStatus = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, district: u.district } : u))
    );
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1 rounded-full flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" /> AgroSarathi Super Admin
            </span>
            <span className="text-xs text-emerald-300 font-mono">System v2.4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">System Management Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Global system monitoring, role access control, and platform activity logs.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-right border border-white/20">
          <div className="text-[10px] text-slate-300">Logged in as</div>
          <div className="font-bold text-sm text-white">{user.fullName}</div>
          <div className="text-[10px] text-amber-300 font-mono">Admin Control Center</div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 space-y-1">
          <div className="text-slate-500 font-medium flex items-center gap-1">
            <Users className="w-4 h-4 text-emerald-600" /> Total Users
          </div>
          <div className="text-2xl font-black font-mono text-slate-900">12,450</div>
          <div className="text-[10px] text-emerald-600 font-semibold">+18% this month</div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 space-y-1">
          <div className="text-slate-500 font-medium flex items-center gap-1">
            <Sprout className="w-4 h-4 text-emerald-600" /> Registered Farms
          </div>
          <div className="text-2xl font-black font-mono text-emerald-800">11,200</div>
          <div className="text-[10px] text-slate-400">Total 38,400 Acres</div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 space-y-1">
          <div className="text-slate-500 font-medium flex items-center gap-1">
            <FileCheck className="w-4 h-4 text-sky-600" /> Scheme Grants
          </div>
          <div className="text-2xl font-black font-mono text-sky-900">₹4.2 Cr</div>
          <div className="text-[10px] text-sky-600 font-semibold">Disbursed via DBT</div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 space-y-1">
          <div className="text-slate-500 font-medium flex items-center gap-1">
            <Bot className="w-4 h-4 text-purple-600" /> AI Queries
          </div>
          <div className="text-2xl font-black font-mono text-purple-900">142,800</div>
          <div className="text-[10px] text-purple-600 font-semibold">Gemini AI Engine</div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-emerald-100 space-y-1">
          <div className="text-slate-500 font-medium flex items-center gap-1">
            <Activity className="w-4 h-4 text-amber-600" /> System Uptime
          </div>
          <div className="text-2xl font-black font-mono text-emerald-800">99.98%</div>
          <div className="text-[10px] text-emerald-600 font-semibold">Cloud Run Online</div>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-emerald-100 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <h2 className="text-sm font-bold text-slate-900 font-serif flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            User Access & Role Management Directory
          </h2>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search user, mobile, district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 font-bold text-slate-700 text-xs"
            >
              <option value="All">All Roles</option>
              <option value="farmer">Farmers Only</option>
              <option value="officer">Govt Officers</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <th className="p-3">User Profile</th>
                <th className="p-3">Mobile Number</th>
                <th className="p-3">Role</th>
                <th className="p-3">District</th>
                <th className="p-3">Primary Crop</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-bold text-slate-900 flex items-center space-x-2">
                    <img
                      src={u.profilePhoto}
                      alt={u.fullName}
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                    <div>
                      <div>{u.fullName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">ID: #{u.id}</div>
                    </div>
                  </td>

                  <td className="p-3 font-mono text-slate-700">+91 {u.mobile}</td>

                  <td className="p-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : u.role === 'officer'
                          ? 'bg-sky-100 text-sky-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>

                  <td className="p-3 text-slate-700">{u.district}</td>
                  <td className="p-3 text-slate-700">{u.primaryCrop}</td>

                  <td className="p-3">
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Active
                    </span>
                  </td>

                  <td className="p-3 text-right">
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className="text-[11px] font-bold text-slate-600 hover:text-slate-900 underline"
                    >
                      Manage Access
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
