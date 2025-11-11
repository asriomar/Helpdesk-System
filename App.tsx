
import React, { useState, useCallback, useMemo } from 'react';
import { Ticket, TicketStatus, TicketPriority, View } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TicketList from './components/TicketList';
import NewTicketForm from './components/NewTicketForm';
import { initialTickets } from './constants';

function App() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const addTicket = useCallback((newTicketData: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newTicket: Ticket = {
      ...newTicketData,
      id: Math.max(0, ...tickets.map(t => t.id)) + 1,
      status: TicketStatus.Open,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setTickets(prevTickets => [newTicket, ...prevTickets]);
    setCurrentView('all-tickets');
  }, [tickets]);

  const updateTicketStatus = useCallback((ticketId: number, status: TicketStatus) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === ticketId ? { ...ticket, status, updatedAt: new Date() } : ticket
      )
    );
  }, []);
  
  const sortedTickets = useMemo(() => {
    return [...tickets].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }, [tickets]);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard tickets={tickets} onNavigate={setCurrentView} />;
      case 'all-tickets':
        return <TicketList tickets={sortedTickets} updateTicketStatus={updateTicketStatus} />;
      case 'new-ticket':
        return <NewTicketForm addTicket={addTicket} />;
      default:
        return <Dashboard tickets={tickets} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
