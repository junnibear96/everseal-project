'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import axios from 'axios';
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

    // Real Data State
    const [stats, setStats] = useState({ totalScans: 0, successRate: 0, threatsDetected: 0 });
    const [logs, setLogs] = useState<any[]>([]);

    // Minting State
    const [mintUrl, setMintUrl] = useState('');
    const [mintingLoading, setMintingLoading] = useState(false);

    const fetchData = async () => {
        try {
            // const token = localStorage.getItem('everseal_token');
            // const config = { headers: { Authorization: `Bearer ${token}` } };
            // For now, consistent with Controller (Public for easier demo or add Auth header if Guard enabled)

            const statsRes = await axios.get('http://localhost:4000/verify/stats');
            setStats(statsRes.data);

            const logsRes = await axios.get('http://localhost:4000/verify/logs');
            setLogs(logsRes.data);

            const chartRes = await axios.get('http://localhost:4000/verify/chart');
            // If backend returns empty logs (start of day), maybe we should pre-fill previous days? 
            // The backend logic generates 7 days even if empty, so it's fine.
            setChartData(chartRes.data);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        }
    };

    useEffect(() => {
        // Initial Fetch
        fetchData();

        // Polling every 2 seconds for "Real-time" effect
        const interval = setInterval(fetchData, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleMint = async () => {
        setMintingLoading(true);
        try {
            // Generate a random high counter to ensure it's valid
            const randomCounter = Math.floor(Math.random() * 1000) + 100;
            const res = await axios.post('http://localhost:4000/verify/sign', {
                uid: '042A5C9A1B3D80', // Demo Default Tag
                counter: randomCounter
            });
            setMintUrl(res.data.url);
        } catch (e) {
            console.error(e);
        } finally {
            setMintingLoading(false);
        }
    };

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
                                value={stats.totalScans.toLocaleString()}
                                icon={Activity}
                                colorClass="bg-blue-500"
                                subtext="Real-time data"
                            />
                            <KpiCard
                                title="Success Rate"
                                value={`${stats.successRate}%`}
                                icon={ShieldCheck}
                                colorClass="bg-green-500"
                                subtext="Based on verified tags"
                            />
                            <KpiCard
                                title="Threats Detected"
                                value={stats.threatsDetected}
                                icon={ShieldAlert}
                                colorClass="bg-red-500"
                                subtext="Invalid or Replay attempts"
                            />
                        </div>

                        {/* 2. Chart Section */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">Weekly Authentication Traffic (Simulated)</h2>
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

                        {/* 2.5 Quick Actions (Minting) */}
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg p-6 text-white flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold">Generate Valid Test Tag</h2>
                                <p className="text-indigo-100 text-sm mt-1">Create a fresh, signed NFC URL for testing verification.</p>
                                {mintUrl && (
                                    <div className="mt-4 bg-white/10 p-3 rounded-lg border border-white/20 backdrop-blur-sm">
                                        <p className="font-mono text-xs break-all">{mintUrl}</p>
                                        <a
                                            href={mintUrl}
                                            target="_blank"
                                            className="inline-block mt-2 text-xs font-bold uppercase tracking-wider bg-white text-indigo-600 px-3 py-1 rounded hover:bg-indigo-50"
                                        >
                                            Open Link
                                        </a>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleMint}
                                disabled={mintingLoading}
                                className="bg-white text-indigo-600 font-bold py-3 px-6 rounded-lg shadow-md hover:bg-slate-50 transition-colors disabled:opacity-50"
                            >
                                {mintingLoading ? 'Generating...' : 'Mint New URL'}
                            </button>
                        </div>

                        {/* 3. Recent Logs Table */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-gray-50/50">
                                <h2 className="text-lg font-bold text-slate-800">Recent Security Logs</h2>
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
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
                                        {logs.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="text-center py-8 text-slate-400">
                                                    No scans detected yet. Waiting for interaction...
                                                </td>
                                            </tr>
                                        ) : (
                                            logs.map((log) => (
                                                <tr key={log.id} className="hover:bg-slate-50 transition-colors animate-fade-in-down">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <StatusBadge status={log.status} />
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600">
                                                        {format(new Date(log.timestamp), 'MMM dd, HH:mm:ss')}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-700 font-mono text-xs">
                                                        {log.tagUid || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-500">
                                                        {log.ipAddress || '127.0.0.1'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-slate-300">-</span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
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
