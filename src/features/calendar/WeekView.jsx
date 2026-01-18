import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from 'date-fns';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import { Trash2 } from 'lucide-react';

const WeekView = ({ date }) => {
    const { logs, books, deleteLog } = useApp();
    const startDate = startOfWeek(date);
    const endDate = endOfWeek(date);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const logsByDate = logs.reduce((acc, log) => {
        if (!acc[log.date]) acc[log.date] = [];
        acc[log.date].push(log);
        return acc;
    }, {});

    return (
        <div className="grid grid-cols-7 gap-4 h-full">
            {days.map(day => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const dayLogs = logsByDate[dateStr] || [];

                return (
                    <div
                        key={dateStr}
                        className={cn(
                            "flex flex-col bg-slate-50 rounded-xl p-3 h-full border border-slate-100 transition-colors",
                            isToday(day) ? "bg-indigo-50/50 border-indigo-100" : "hover:bg-slate-100"
                        )}
                    >
                        <div className="text-center mb-4 pb-2 border-b border-slate-200">
                            <div className="text-xs uppercase text-slate-400 font-semibold">{format(day, 'EEE')}</div>
                            <div className={cn("text-xl font-bold mt-1 inline-block w-8 h-8 rounded-full leading-8", isToday(day) ? "bg-indigo-600 text-white" : "text-slate-700")}>
                                {format(day, 'd')}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 overflow-y-auto custom-scrollbar flex-1">
                            {dayLogs.length === 0 ? (
                                <div className="text-xs text-slate-300 text-center mt-4">No activity</div>
                            ) : (
                                dayLogs.map(log => {
                                    const book = books.find(b => b.id === log.bookId);
                                    if (!book) return null;

                                    return (
                                        <div
                                            key={log.id}
                                            className="group relative p-2 rounded-lg bg-white shadow-sm border-l-4 text-xs"
                                            style={{ borderLeftColor: book.color }}
                                        >
                                            <div className="font-semibold text-slate-700 truncate pr-4">{book.title}</div>
                                            {log.pagesRead > 0 && <div className="text-slate-400 mt-1">{log.pagesRead} pages</div>}
                                            {log.notes && <div className="text-slate-400 mt-1 italic truncate">"{log.notes}"</div>}

                                            <button
                                                onClick={(e) => { e.stopPropagation(); deleteLog(log.id); }}
                                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                                                title="Remove log"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default WeekView;
