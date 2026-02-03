'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import {
    LayoutDashboard,
    ShieldCheck,
    ShieldAlert,
    Activity,
    Package,
    Settings,
    Menu,
    X,
    Search,
    CheckCircle,
    AlertTriangle,
    XCircle,
    ExternalLink,
} from 'lucide-react';
import { format, subDays } from 'date-fns';

// --- Mock Data Generator ---

// Generate last 7 days data
const generateChartData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
        const date = subDays(new Date(), i);
        data.push({
            date: format(date, 'MMM dd'),
            valid: Math.floor(Math.random() * 50) + 20, // 20-70 valid scans
            warning: Math.floor(Math.random() * 10) + 1, // 1-10 warnings
        });
    }
    return data;
};

// Mock Recent Logs
const MOCK_LOGS = [
    { id: 1, tagId: '04...80', status: 'VALID', timestamp: new Date(Date.now() - 1000 * 60 * 5), ip: '192.168.1.1', tx: 'A1B2...C3D4' },
    { id: 2, tagId: '04...A1', status: 'INVALID', timestamp: new Date(Date.now() - 1000 * 60 * 12), ip: '45.32.11.90', tx: null },
    { id: 3, tagId: '04...B2', status: 'DUPLICATED', timestamp: new Date(Date.now() - 1000 * 60 * 30), ip: '203.11.55.2', tx: null },
    { id: 4, tagId: '04...80', status: 'VALID', timestamp: new Date(Date.now() - 1000 * 60 * 45), ip: '192.168.1.1', tx: 'E5F6...7890' },
    { id: 5, tagId: '04...C3', status: 'VALID', timestamp: new Date(Date.now() - 1000 * 60 * 120), ip: '89.11.22.33', tx: '99AA...BBCC' },
    { id: 6, tagId: '04...D4', status: 'INVALID', timestamp: new Date(Date.now() - 1000 * 60 * 150), ip: '121.55.10.1', tx: null },
    { id: 7, tagId: '04...E5', status: 'VALID', timestamp: new Date(Date.now() - 1000 * 60 * 200), ip: '10.0.0.5', tx: '1122...3344' },
];

export default function AdminDashboard() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        // Mount-time data generation (fixes hydration mismatch for dates)
        setChartData(generateChartData());
    }, []);

    // --- Components ---

    const KpiCard = ({ title, value, icon: Icon, colorClass, subtext }: any) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-start space-x-4">
            <div className={`p-3 rounded-lg ${colorClass}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
                {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
            </div>
        </div>
    );

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'VALID':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" /> Valid
                    </span>
                );
            case 'DUPLICATED':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                        <AlertTriangle className="w-3 h-3 mr-1" /> Replay
                    </span>
                );
            case 'INVALID':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" /> Invalid
                    </span>
                );
            default:
                return <span className="text-gray-500">{status}</span>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">

            {/* Sidebar (Desktop) */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white transition-transform transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 lg:static lg:inset-0`}
            >
                <div className="flex items-center justify-between p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold tracking-wider flex items-center">
                        <ShieldCheck className="w-6 h-6 mr-2 text-indigo-400" />
                        EVERSEAL
                    </h1>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    <a href="#" className="flex items-center px-4 py-3 bg-indigo-600 rounded-lg text-white shadow-lg shadow-indigo-500/30">
                        <LayoutDashboard className="w-5 h-5 mr-3" />
                        Dashboard
                    </a>
                    <a href="#" className="flex items-center px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <Package className="w-5 h-5 mr-3" />
                        Products
                    </a>
                    <a href="#" className="flex items-center px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <ShieldAlert className="w-5 h-5 mr-3" />
                        Security Logs
                    </a>
                    <a href="#" className="flex items-center px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
                        <Settings className="w-5 h-5 mr-3" />
                        Settings
                    </a>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen overflow-hidden">

                {/* Top Header */}
                <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 lg:px-8">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600">
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center bg-slate-100 rounded-full px-4 py-2 w-full max-w-sm mx-auto lg:mx-0 lg:ml-4">
                        <Search className="w-4 h-4 text-slate-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search Log ID, Product, or Hash..."
                            className="bg-transparent border-none outline-none text-sm w-full placeholder-slate-400"
                        />
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs ring-2 ring-white shadow-sm">
                            AD
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto space-y-6">

                        {/* 1. KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <KpiCard
                                title="Total Scans"
                                value="1,284"
                                icon={Activity}
                                colorClass="bg-blue-500"
                                subtext="+12% from last week"
                            />
                            <KpiCard
                                title="Success Rate"
                                value="94.2%"
                                icon={ShieldCheck}
                                colorClass="bg-green-500"
                                subtext="Stable performance"
                            />
                            <KpiCard
                                title="Threats Detected"
                                value="28"
                                icon={ShieldAlert}
                                colorClass="bg-red-500"
                                subtext="3 Replay Attacks blocked"
                            />
                        </div>

                        {/* 2. Chart Section */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">Weekly Authentication Traffic</h2>
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                        <XAxis
                                            dataKey="date"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748B', fontSize: 12 }}
                                            dy={10}
                                        />
                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: '#64748B', fontSize: 12 }}
                                        />
                                        <Tooltip
                                            cursor={{ fill: '#F1F5F9' }}
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        />
                                        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                                        <Bar name="Valid" dataKey="valid" stackId="a" fill="#3B82F6" radius={[0, 0, 4, 4]} barSize={32} />
                                        <Bar name="Warning/Invalid" dataKey="warning" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={32} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* 3. Recent Logs Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gray-50/50">
                                <h2 className="text-lg font-bold text-slate-800">Recent Security Logs</h2>
                                <button className="text-sm text-indigo-600 font-medium hover:text-indigo-800">View All</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-xs">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold">Status</th>
                                            <th className="px-6 py-3 font-semibold">Date & Time</th>
                                            <th className="px-6 py-3 font-semibold">Tag ID</th>
                                            <th className="px-6 py-3 font-semibold">IP Address</th>
                                            <th className="px-6 py-3 font-semibold">Blockchain TX</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {MOCK_LOGS.map((log) => (
                                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <StatusBadge status={log.status} />
                                                </td>
                                                <td className="px-6 py-4 text-slate-600">
                                                    {format(log.timestamp, 'MMM dd, HH:mm:ss')}
                                                </td>
                                                <td className="px-6 py-4 text-slate-700 font-mono text-xs">
                                                    {log.tagId}
                                                </td>
                                                <td className="px-6 py-4 text-slate-500">
                                                    {log.ip}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {log.tx ? (
                                                        <a
                                                            href="#"
                                                            className="flex items-center text-blue-500 hover:text-blue-700 font-medium text-xs group"
                                                        >
                                                            {log.tx}
                                                            <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </a>
                                                    ) : (
                                                        <span className="text-slate-300">-</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </main>
            </div>
        </div>
    );
}
