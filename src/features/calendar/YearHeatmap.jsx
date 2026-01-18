import React from 'react';
import { format, eachDayOfInterval, startOfYear, endOfYear, getDay, getDate } from 'date-fns';
import { useApp } from '../../context/AppContext';
import { Tooltip } from 'react-tooltip';

const YearHeatmap = ({ year }) => {
    const { logs, books } = useApp();

    // Calculate date range for the year
    const startDate = startOfYear(new Date(year, 0, 1));
    const endDate = endOfYear(new Date(year, 0, 1));
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    // Map logs to dates for quick lookup
    const logsByDate = logs.reduce((acc, log) => {
        // Assuming log.date is YYYY-MM-DD
        if (!acc[log.date]) {
            acc[log.date] = [];
        }
        acc[log.date].push(log);
        return acc;
    }, {});

    // Helper to get color for a day
    const getDayStyle = (dateStr) => {
        const dayLogs = logsByDate[dateStr] || [];
        if (dayLogs.length === 0) return { backgroundColor: '#f1f5f9' }; // slate-100

        // If multiple books, show the color of the first book or split?
        // Heatmap cells are small, let's use the first book's color.
        const bookId = dayLogs[0].bookId; // Just take the first one
        const book = books.find(b => b.id === bookId);
        return { backgroundColor: book ? book.color : '#cbd5e1' };
    };

    // Group days by week columns
    // GitHub starts week on Sunday. 
    // We need to organize into 7 rows (Sun-Sat) and 53 columns.
    const weeks = [];
    let currentWeek = [];

    // Padding for start of year
    const startDayOfWeek = getDay(startDate); // 0 (Sun) - 6 (Sat)
    for (let i = 0; i < startDayOfWeek; i++) {
        currentWeek.push(null);
    }

    days.forEach(day => {
        currentWeek.push(day);
        if (currentWeek.length === 7) {
            weeks.push(currentWeek);
            currentWeek = [];
        }
    });

    // Padding for end
    if (currentWeek.length > 0) {
        while (currentWeek.length < 7) {
            currentWeek.push(null);
        }
        weeks.push(currentWeek);
    }

    // Transpose: We want rows to be Mon-Sun or Sun-Sat. GitHub is Sun-Sat (Rows) x Weeks (Cols).
    // Actually GitHub renders column by column.
    // Let's render mostly like GitHub: Flex row of columns.

    return (
        <div className="w-full overflow-x-auto">
            <div className="min-w-[800px]">
                <div className="flex gap-1">
                    {/* Day labels column */}
                    <div className="flex flex-col justify-between pr-2 py-4 h-[120px] text-xs text-slate-400">
                        <span>Mon</span>
                        <span>Wed</span>
                        <span>Fri</span>
                    </div>

                    {/* Heatmap Grid */}
                    <div className="flex gap-[3px]">
                        {weeks.map((week, wIndex) => (
                            <div key={wIndex} className="flex flex-col gap-[3px]">
                                {week.map((day, dIndex) => {
                                    if (!day) return <div key={dIndex} className="w-3 h-3" />; // Spacer

                                    const dateStr = format(day, 'yyyy-MM-dd');
                                    const dayLogs = logsByDate[dateStr] || [];
                                    const count = dayLogs.length;

                                    // Determine color
                                    let bgStyle = { backgroundColor: '#f1f5f9' }; // Default
                                    let tooltip = `${dateStr}: No reading`;

                                    if (count > 0) {
                                        const book = books.find(b => b.id === dayLogs[0].bookId);
                                        const bookTitle = book ? book.title : 'Unknown Book';
                                        bgStyle = { backgroundColor: book ? book.color : '#94a3b8' };
                                        tooltip = `${dateStr}: Read ${bookTitle}` + (count > 1 ? ` + ${count - 1} others` : '');
                                    }

                                    return (
                                        <div
                                            key={dateStr}
                                            className="w-3 h-3 rounded-[2px] transition-all hover:ring-2 hover:ring-slate-300 hover:z-10 cursor-pointer"
                                            style={bgStyle}
                                            title={tooltip}
                                        />
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-4 flex items-center justify-end gap-2 text-xs text-slate-500">
                    <span>Less</span>
                    <div className="w-3 h-3 rounded-[2px] bg-slate-100" />
                    <div className="w-3 h-3 rounded-[2px] bg-indigo-200" />
                    <div className="w-3 h-3 rounded-[2px] bg-indigo-400" />
                    <div className="w-3 h-3 rounded-[2px] bg-indigo-600" />
                    <span>More</span>
                    <span className="ml-4 italic text-slate-400">(* Colors correspond to book colors in actual view)</span>
                </div>
            </div>
        </div>
    );
};

export default YearHeatmap;
