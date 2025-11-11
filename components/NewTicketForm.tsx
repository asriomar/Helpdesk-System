
import React, { useState } from 'react';
import { Ticket, TicketPriority } from '../types';
import { getGeminiSuggestion } from '../services/geminiService';
import { SparklesIcon } from './icons';

interface NewTicketFormProps {
  addTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
}

const NewTicketForm: React.FC<NewTicketFormProps> = ({ addTicket }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [requester, setRequester] = useState('');
  const [priority, setPriority] = useState<TicketPriority>(TicketPriority.Medium);
  
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!description.trim()) {
      setError('Please enter a description to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setSummary(null);
    try {
      const result = await getGeminiSuggestion(description);
      if (result) {
        setSummary(result.summary);
        setPriority(result.priority);
      } else {
        setError('Could not analyze the ticket. Please set priority manually.');
      }
    } catch (e) {
      setError('An error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !description || !requester) {
      setError('Please fill out all required fields.');
      return;
    }
    addTicket({ subject, description, requester, priority, summary: summary || undefined });
    // Reset form
    setSubject('');
    setDescription('');
    setRequester('');
    setPriority(TicketPriority.Medium);
    setSummary(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-6">Create New Ticket</h1>
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-md space-y-6">
            
            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="requester" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Requester Name</label>
                    <input type="text" id="requester" value={requester} onChange={e => setRequester(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                </div>
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Subject</label>
                    <input type="text" id="subject" value={subject} onChange={e => setSubject(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm" />
                </div>
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
                <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} required rows={8} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"></textarea>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                    <div className="mb-3 sm:mb-0">
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100">AI Assistance</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Let Gemini suggest a priority and summary.</p>
                    </div>
                    <button type="button" onClick={handleAnalyze} disabled={isLoading} className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-slate-400 disabled:cursor-not-allowed">
                        <SparklesIcon className="h-5 w-5 mr-2"/>
                        {isLoading ? 'Analyzing...' : 'Analyze & Suggest'}
                    </button>
                </div>

                {summary && (
                    <div className="border-t border-slate-200 dark:border-slate-600 pt-4">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">AI Summary:</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400 italic mt-1">{summary}</p>
                    </div>
                )}
            </div>

            <div>
                <label htmlFor="priority" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
                <select id="priority" value={priority} onChange={e => setPriority(e.target.value as TicketPriority)} required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md">
                    {Object.values(TicketPriority).map(p => (
                        <option key={p} value={p}>{p}</option>
                    ))}
                </select>
            </div>

            <div className="flex justify-end">
                <button type="submit" className="px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Create Ticket
                </button>
            </div>
        </form>
    </div>
  );
};

export default NewTicketForm;
