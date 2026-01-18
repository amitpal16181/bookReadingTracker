import React from 'react';
import { format } from 'date-fns';
import { useApp } from '../../context/AppContext';
import { BookOpen, Trash2 } from 'lucide-react';

const DayView = ({ date }) => {
    const { logs, books, deleteLog } = useApp();
    const dateStr = format(date, 'yyyy-MM-dd');

    const dayLogs = logs.filter(log => log.date === dateStr);

    return (
        <div className="max-w-3xl mx-auto h-full">
            <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-slate-800">{format(date, 'EEEE')}</h3>
                <p className="text-slate-500 text-lg">{format(date, 'MMMM do, yyyy')}</p>
            </div>

            <div className="space-y-4">
                {dayLogs.length === 0 ? (
                    <div className="text-center py-16 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="text-slate-300" size={32} />
                        </div>
                        <p className="text-slate-500 font-medium">No reading recorded for this day.</p>
                        <p className="text-sm text-slate-400 mt-1">Use "Log Reading Session" to add an entry.</p>
                    </div>
                ) : (
                    dayLogs.map(log => {
                        const book = books.find(b => b.id === log.bookId);
                        if (!book) return null;

                        return (
                            <div key={log.id} className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-6 items-start transition-all hover:shadow-md relative">
                                <div
                                    className="w-3 h-full rounded-full self-stretch flex-shrink-0"
                                    style={{ backgroundColor: book.color }}
                                />

                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-xl font-bold text-slate-800">{book.title}</h4>
                                        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 font-medium capitalize">
                                            {book.status}
                                        </span>
                                    </div>
                                    <p className="text-slate-500 mb-4 font-medium">{book.author}</p>

                                    <div className="flex gap-6 text-sm text-slate-600 bg-slate-50 p-4 rounded-xl">
                                        {log.pagesRead > 0 && (
                                            <div>
                                                <span className="block text-xs text-slate-400 uppercase tracking-wider font-bold">Read</span>
                                                <span className="font-semibold text-lg">{log.pagesRead} <span className="text-sm font-normal">pages</span></span>
                                            </div>
                                        )}
                                        {log.notes && (
                                            <div className="flex-1">
                                                <span className="block text-xs text-slate-400 uppercase tracking-wider font-bold">Notes</span>
                                                <p className="italic mt-1">"{log.notes}"</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    onClick={() => deleteLog(log.id)}
                                    className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="Delete entry"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default DayView;
