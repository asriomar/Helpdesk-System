
import React, { useMemo } from 'react';
import { Ticket, TicketStatus, TicketPriority, View } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from './StatCard';
import TicketStatusBadge from './TicketStatusBadge';
import PriorityBadge from './PriorityBadge';

interface DashboardProps {
  tickets: Ticket[];
  onNavigate: (view: View) => void;
}

const COLORS = {
    [TicketStatus.Open]: '#3b82f6',
    [TicketStatus.InProgress]: '#f97316',
    [TicketStatus.Resolved]: '#22c55e',
};

const PRIORITY_COLORS = {
    [TicketPriority.Low]: '#22c55e',
    [TicketPriority.Medium]: '#eab308',
    [TicketPriority.High]: '#f97316',
    [TicketPriority.Urgent]: '#ef4444',
};


const Dashboard: React.FC<DashboardProps> = ({ tickets, onNavigate }) => {

  const stats = useMemo(() => {
    const open = tickets.filter(t => t.status === TicketStatus.Open).length;
    const inProgress = tickets.filter(t => t.status === TicketStatus.InProgress).length;
    const resolved = tickets.filter(t => t.status === TicketStatus.Resolved).length;
    const total = tickets.length;
    return { open, inProgress, resolved, total };
  }, [tickets]);

  const statusData = useMemo(() => [
    { name: TicketStatus.Open, count: stats.open },
    { name: TicketStatus.InProgress, count: stats.inProgress },
    { name: TicketStatus.Resolved, count: stats.resolved },
  ], [stats]);

  const priorityData = useMemo(() => {
    const counts = tickets.reduce((acc, ticket) => {
        acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
        return acc;
    }, {} as Record<TicketPriority, number>);

    return Object.values(TicketPriority).map(p => ({ name: p, count: counts[p] || 0 }));
  }, [tickets]);

  const recentTickets = useMemo(() => {
    return [...tickets]
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 5);
  }, [tickets]);

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Tickets" value={stats.total} />
            <StatCard title="Open" value={stats.open} color="blue" />
            <StatCard title="In Progress" value={stats.inProgress} color="orange" />
            <StatCard title="Resolved" value={stats.resolved} color="green" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-4">Tickets by Priority</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={priorityData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis allowDecimals={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem' }} />
                        <Legend />
                        <Bar dataKey="count" name="Tickets">
                            {priorityData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.name as TicketPriority]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold mb-4">Tickets by Status</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={statusData} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                            {statusData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[entry.name as TicketStatus]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '0.5rem' }} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-semibold">Recent Tickets</h2>
                 <button onClick={() => onNavigate('all-tickets')} className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b dark:border-slate-700">
                            <th className="p-3 text-sm font-semibold text-slate-500">Subject</th>
                            <th className="p-3 text-sm font-semibold text-slate-500 hidden md:table-cell">Requester</th>
                            <th className="p-3 text-sm font-semibold text-slate-500">Status</th>
                            <th className="p-3 text-sm font-semibold text-slate-500 hidden sm:table-cell">Priority</th>
                            <th className="p-3 text-sm font-semibold text-slate-500 hidden lg:table-cell">Last Updated</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentTickets.map(ticket => (
                            <tr key={ticket.id} className="border-b dark:border-slate-700 last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                <td className="p-3 font-medium">{ticket.subject}</td>
                                <td className="p-3 hidden md:table-cell">{ticket.requester}</td>
                                <td className="p-3"><TicketStatusBadge status={ticket.status} /></td>
                                <td className="p-3 hidden sm:table-cell"><PriorityBadge priority={ticket.priority} /></td>
                                <td className="p-3 text-sm text-slate-500 hidden lg:table-cell">{ticket.updatedAt.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default Dashboard;
