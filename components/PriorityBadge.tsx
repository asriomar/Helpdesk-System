
import React from 'react';
import { TicketPriority } from '../types';

interface PriorityBadgeProps {
  priority: TicketPriority;
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const priorityStyles: { [key in TicketPriority]: string } = {
    [TicketPriority.Low]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    [TicketPriority.Medium]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    [TicketPriority.High]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    [TicketPriority.Urgent]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  };
  
  return (
    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityStyles[priority]}`}>
      {priority}
    </span>
  );
};

export default PriorityBadge;
