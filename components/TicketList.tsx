
import React, { useState, useMemo } from 'react';
import { Ticket, TicketStatus } from '../types';
import TicketStatusBadge from './TicketStatusBadge';
import PriorityBadge from './PriorityBadge';

interface TicketListProps {
  tickets: Ticket[];
  updateTicketStatus: (ticketId: number, status: TicketStatus) => void;
}

const TicketList: React.FC<TicketListProps> = ({ tickets, updateTicketStatus }) => {
  const [filterStatus, setFilterStatus] = useState<TicketStatus | 'all'>('all');
  const [expandedTicketId, setExpandedTicketId] = useState<number | null>(null);

  const filteredTickets = useMemo(() => {
    if (filterStatus === 'all') return tickets;
    return tickets.filter(ticket => ticket.status === filterStatus);
  }, [tickets, filterStatus]);
  
  const handleToggleExpand = (ticketId: number) => {
    setExpandedTicketId(expandedTicketId === ticketId ? null : ticketId);
  }

  return (
    <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-md space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white mb-4 sm:mb-0">All Tickets</h1>
        <div className="flex items-center space-x-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-slate-600 dark:text-slate-300">Filter by status:</label>
            <select
                id="status-filter"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as TicketStatus | 'all')}
                className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
                <option value="all">All</option>
                {Object.values(TicketStatus).map(status => (
                <option key={status} value={status}>{status}</option>
                ))}
            </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr className="border-b dark:border-slate-700">
              <th className="p-3 text-sm font-semibold text-slate-500">ID</th>
              <th className="p-3 text-sm font-semibold text-slate-500">Subject</th>
              <th className="p-3 text-sm font-semibold text-slate-500 hidden md:table-cell">Requester</th>
              <th className="p-3 text-sm font-semibold text-slate-500">Priority</th>
              <th className="p-3 text-sm font-semibold text-slate-500 hidden sm:table-cell">Last Updated</th>
              <th className="p-3 text-sm font-semibold text-slate-500">Status</th>
              <th className="p-3 text-sm font-semibold text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTickets.map(ticket => (
              <React.Fragment key={ticket.id}>
                <tr className="border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="p-3 font-mono text-slate-500">{ticket.id}</td>
                  <td className="p-3 font-medium max-w-xs truncate" title={ticket.subject}>{ticket.subject}</td>
                  <td className="p-3 hidden md:table-cell">{ticket.requester}</td>
                  <td className="p-3"><PriorityBadge priority={ticket.priority} /></td>
                  <td className="p-3 text-sm text-slate-500 hidden sm:table-cell">{ticket.updatedAt.toLocaleString()}</td>
                  <td className="p-3">
                    <select
                      value={ticket.status}
                      onChange={e => updateTicketStatus(ticket.id, e.target.value as TicketStatus)}
                      className="bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md p-1.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {Object.values(TicketStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                   <td className="p-3">
                     <button onClick={() => handleToggleExpand(ticket.id)} className="text-primary-600 dark:text-primary-400 hover:underline text-sm font-medium">
                        {expandedTicketId === ticket.id ? 'Hide' : 'Details'}
                     </button>
                   </td>
                </tr>
                 {expandedTicketId === ticket.id && (
                    <tr className="bg-slate-50 dark:bg-slate-900/50">
                        <td colSpan={7} className="p-4">
                            <div className="space-y-3">
                                <h4 className="font-semibold text-slate-700 dark:text-slate-200">Description</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{ticket.description}</p>
                                {ticket.summary && (
                                  <>
                                     <h4 className="font-semibold text-slate-700 dark:text-slate-200 pt-2 border-t dark:border-slate-700">AI Summary</h4>
                                     <p className="text-sm italic text-slate-500 dark:text-slate-400">{ticket.summary}</p>
                                  </>
                                )}
                            </div>
                        </td>
                    </tr>
                 )}
              </React.Fragment>
            ))}
             {filteredTickets.length === 0 && (
                <tr>
                    <td colSpan={7} className="text-center p-8 text-slate-500">
                        No tickets found for this filter.
                    </td>
                </tr>
             )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketList;
