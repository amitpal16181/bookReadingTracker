import React, { useState } from 'react';
import { Calendar as CalIcon, ChevronLeft, ChevronRight, Grid, List } from 'lucide-react';
import { format, addMonths, subMonths, addYears, subYears } from 'date-fns';
import { cn } from '../../lib/utils';
import YearHeatmap from './YearHeatmap';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import ReadingSessionModal from './ReadingSessionModal';

const VIEWS = {
    MONTH: 'month',
    WEEK: 'week',
    DAY: 'day',
    YEAR: 'year',
};

const CalendarView = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState(VIEWS.MONTH);
    const [isLogModalOpen, setLogModalOpen] = useState(false);

    const handlePrev = () => {
        if (view === VIEWS.MONTH) setCurrentDate(subMonths(currentDate, 1));
        else if (view === VIEWS.YEAR) setCurrentDate(subYears(currentDate, 1));
        else if (view === VIEWS.WEEK) setCurrentDate(date => new Date(date.setDate(date.getDate() - 7)));
        else setCurrentDate(date => new Date(date.setDate(date.getDate() - 1)));
    };

    const handleNext = () => {
        if (view === VIEWS.MONTH) setCurrentDate(addMonths(currentDate, 1));
        else if (view === VIEWS.YEAR) setCurrentDate(addYears(currentDate, 1));
        else if (view === VIEWS.WEEK) setCurrentDate(date => new Date(date.setDate(date.getDate() + 7)));
        else setCurrentDate(date => new Date(date.setDate(date.getDate() + 1)));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="flex bg-slate-100 rounded-lg p-1">
                        <button
                            onClick={() => setView(VIEWS.DAY)}
                            className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-all", view === VIEWS.DAY ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700")}
                        >
                            Day
                        </button>
                        <button
                            onClick={() => setView(VIEWS.WEEK)}
                            className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-all", view === VIEWS.WEEK ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700")}
                        >
                            Week
                        </button>
                        <button
                            onClick={() => setView(VIEWS.MONTH)}
                            className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-all", view === VIEWS.MONTH ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700")}
                        >
                            Month
                        </button>
                        <button
                            onClick={() => setView(VIEWS.YEAR)}
                            className={cn("px-3 py-1.5 rounded-md text-sm font-medium transition-all", view === VIEWS.YEAR ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700")}
                        >
                            Year
                        </button>
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={handlePrev} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer">
                            <ChevronLeft size={20} />
                        </button>
                        <h2 className="text-lg font-bold text-slate-800 min-w-[140px] text-center">
                            {view === VIEWS.YEAR ? format(currentDate, 'yyyy') : format(currentDate, 'MMMM yyyy')}
                        </h2>
                        <button onClick={handleNext} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 cursor-pointer">
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <button
                    onClick={() => setLogModalOpen(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95"
                >
                    Log Reading Session
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 min-h-[500px]">
                {view === VIEWS.DAY && (
                    <DayView date={currentDate} />
                )}
                {view === VIEWS.WEEK && (
                    <WeekView date={currentDate} />
                )}
                {view === VIEWS.MONTH && (
                    <MonthView date={currentDate} />
                )}
                {view === VIEWS.YEAR && (
                    <YearHeatmap year={currentDate.getFullYear()} />
                )}
            </div>

            <ReadingSessionModal
                isOpen={isLogModalOpen}
                onClose={() => setLogModalOpen(false)}
                selectedDate={currentDate}
            />
        </div>
    );
};

export default CalendarView;
