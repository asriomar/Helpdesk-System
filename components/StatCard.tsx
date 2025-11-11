
import React from 'react';

interface StatCardProps {
  title: string;
  value: number;
  color?: 'blue' | 'orange' | 'green';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, color }) => {
  const colorClasses = {
    blue: 'border-l-blue-500',
    orange: 'border-l-orange-500',
    green: 'border-l-green-500',
  };

  const defaultClasses = 'border-l-slate-500';
  const borderClass = color ? colorClasses[color] : defaultClasses;

  return (
    <div className={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border-l-4 ${borderClass} flex flex-col justify-between transition-transform hover:scale-105`}>
      <h3 className="text-lg font-medium text-slate-500 dark:text-slate-400">{title}</h3>
      <p className="text-4xl font-bold text-slate-800 dark:text-white mt-2">{value}</p>
    </div>
  );
};

export default StatCard;
