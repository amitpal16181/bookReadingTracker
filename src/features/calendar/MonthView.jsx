import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isToday } from 'date-fns';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';

const MonthView = ({ date }) => {
    const { logs, books } = useApp();

    const startDate = startOfMonth(date);
    const endDate = endOfMonth(date);
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const startDay = getDay(startDate); // 0 = Sunday

    // Get logs for the displayed month
    const logsByDate = logs.reduce((acc, log) => {
        if (!acc[log.date]) acc[log.date] = [];
        acc[log.date].push(log);
        return acc;
    }, {});

    // Create padding for start grid
    const padding = Array(startDay).fill(null);

    const allCells = [...padding, ...days];

    return (
        <div className="h-full flex flex-col">
            {/* Week Headers */}
            <div className="grid grid-cols-7 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-slate-400 uppercase tracking-wider py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-px bg-slate-100 border border-slate-100 rounded-lg overflow-hidden flex-1">
                {allCells.map((day, index) => {
                    if (!day) return <div key={`pad-${index}`} className="bg-white min-h-[100px]" />;

                    const dateStr = format(day, 'yyyy-MM-dd');
                    const dayLogs = logsByDate[dateStr] || [];
                    const isCurrentMonth = isSameMonth(day, date);

                    return (
                        <div
                            key={dateStr}
                            className={cn(
                                "bg-white p-2 min-h-[120px] relative hover:bg-slate-50 transition-colors flex flex-col gap-1 overflow-hidden group",
                                !isCurrentMonth && "text-slate-300"
                            )}
                        >
                            <span className={cn(
                                "text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full mb-1",
                                isToday(day) ? "bg-indigo-600 text-white shadow-md" : "text-slate-700"
                            )}>
                                {format(day, 'd')}
                            </span>

                            <div className="flex flex-col gap-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                                {dayLogs.map(log => {
                                    const book = books.find(b => b.id === log.bookId);
                                    if (!book) return null;

                                    return (
                                        <div
                                            key={log.id}
                                            title={`${book.title} (Pages: ${log.pagesRead || 'N/A'})`}
                                            className="text-xs px-2 py-1 rounded-md text-white truncate shadow-sm transition-transform hover:scale-105"
                                            style={{ backgroundColor: book.color }}
                                        >
                                            {book.title}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MonthView;
