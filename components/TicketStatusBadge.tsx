
import React from 'react';
import { TicketStatus } from '../types';

interface TicketStatusBadgeProps {
  status: TicketStatus;
}

const TicketStatusBadge: React.FC<TicketStatusBadgeProps> = ({ status }) => {
  const statusStyles: { [key in TicketStatus]: string } = {
    [TicketStatus.Open]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    [TicketStatus.InProgress]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    [TicketStatus.Resolved]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };

  return (
    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

export default TicketStatusBadge;
