
import React from 'react';
import { View } from '../types';
import { DashboardIcon, TicketIcon, PlusIcon } from './icons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const navItems = [
    { view: 'dashboard', icon: DashboardIcon, label: 'Dashboard' },
    { view: 'all-tickets', icon: TicketIcon, label: 'All Tickets' },
    { view: 'new-ticket', icon: PlusIcon, label: 'New Ticket' },
  ];

  const baseClasses = "flex items-center w-full p-3 rounded-lg transition-all duration-200 ease-in-out";
  const activeClasses = "bg-primary-500 text-white shadow-md";
  const inactiveClasses = "text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700";

  return (
    <aside className="w-16 sm:w-64 bg-white dark:bg-slate-800 flex-shrink-0 shadow-lg flex flex-col">
      <div className="h-16 flex items-center justify-center sm:justify-start px-4 border-b border-slate-200 dark:border-slate-700">
        <TicketIcon className="h-8 w-8 text-primary-500" />
        <h1 className="hidden sm:block text-xl font-bold ml-3 text-slate-800 dark:text-white">Helpdesk</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => (
          <button
            key={item.view}
            onClick={() => setCurrentView(item.view)}
            className={`${baseClasses} ${currentView === item.view ? activeClasses : inactiveClasses}`}
          >
            <item.icon className="h-6 w-6 flex-shrink-0" />
            <span className="hidden sm:inline-block ml-4 font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
       <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <p className="hidden sm:block text-xs text-center text-slate-400 dark:text-slate-500">
          Powered by Gemini
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
