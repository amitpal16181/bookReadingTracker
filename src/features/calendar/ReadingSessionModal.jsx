import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { format, eachDayOfInterval, isSameDay } from 'date-fns';
import { cn } from '../../lib/utils';

const ReadingSessionModal = ({ isOpen, onClose, selectedDate = null }) => {
    const { books, addLog } = useApp();
    const [formData, setFormData] = useState({
        bookId: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        pagesRead: '',
        notes: ''
    });

    const [includedDays, setIncludedDays] = useState([]);

    // Reset or initialize when opening
    useEffect(() => {
        if (isOpen) {
            const initialDate = selectedDate ? new Date(selectedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
            setFormData(prev => ({
                ...prev,
                startDate: initialDate,
                endDate: initialDate,
                pagesRead: '',
                notes: ''
            }));
        }
    }, [isOpen, selectedDate]);

    // Recalculate included days when range changes
    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);

            if (start <= end) {
                // Limit range to prevent massive arrays (e.g. max 60 days)
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays > 60) {
                    // Too long, just ignore or handle gracefully? 
                    // For now let's just default to start date
                    setIncludedDays([formData.startDate]);
                    return;
                }

                try {
                    const days = eachDayOfInterval({ start, end });
                    const dateStrings = days.map(d => format(d, 'yyyy-MM-dd'));
                    setIncludedDays(dateStrings);
                } catch (e) {
                    setIncludedDays([]);
                }
            } else {
                setIncludedDays([]);
            }
        }
    }, [formData.startDate, formData.endDate]);

    if (!isOpen) return null;

    const toggleDay = (dateStr) => {
        setIncludedDays(prev => {
            if (prev.includes(dateStr)) {
                return prev.filter(d => d !== dateStr);
            } else {
                return [...prev, dateStr].sort();
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.bookId) return;

        if (includedDays.length === 0) {
            alert("Please select at least one day.");
            return;
        }

        // Distribute pages logic
        const totalPages = formData.pagesRead ? Number(formData.pagesRead) : 0;
        const dayCount = includedDays.length;

        // We want to distribute `totalPages` across `dayCount` days.
        // e.g. 10 pages, 3 days => 3, 3, 4
        let basePages = 0;
        let remainder = 0;

        if (totalPages > 0) {
            basePages = Math.floor(totalPages / dayCount);
            remainder = totalPages % dayCount;
        }

        includedDays.forEach((dateStr, index) => {
            // Add remainder to the last few days or just the last one?
            // Let's add 1 to the first 'remainder' days to spread it out essentially.
            const extra = index < remainder ? 1 : 0;
            const pagesForToday = basePages + extra;

            addLog({
                bookId: formData.bookId,
                date: dateStr,
                pagesRead: pagesForToday,
                notes: formData.notes
            });
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 flex-shrink-0">
                    <h3 className="text-lg font-bold text-slate-800">Log Reading Session</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Select Book</label>
                        <select
                            required
                            value={formData.bookId}
                            onChange={e => setFormData({ ...formData, bookId: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-white"
                        >
                            <option value="">-- Choose a book --</option>
                            {books.map(b => (
                                <option key={b.id} value={b.id}>{b.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">From Date</label>
                            <input
                                required
                                type="date"
                                value={formData.startDate}
                                onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">To Date</label>
                            <input
                                required
                                type="date"
                                value={formData.endDate}
                                min={formData.startDate}
                                onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Day selection grid */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-slate-700">Days Included</label>
                            <div className="text-xs text-slate-400">{includedDays.length} days selected</div>
                        </div>
                        <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto custom-scrollbar p-1">
                            {(() => {
                                // Re-generate range for display to ensure order
                                const start = new Date(formData.startDate);
                                const end = new Date(formData.endDate);
                                if (start > end) return <span className="text-xs text-red-400">Invalid range</span>;

                                // Limit display
                                const diffTime = Math.abs(end - start);
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                if (diffDays > 60) return <span className="text-xs text-slate-400">Range too large to select individual days. All days included.</span>;

                                const range = eachDayOfInterval({ start, end });
                                return range.map(d => {
                                    const dStr = format(d, 'yyyy-MM-dd');
                                    const isSelected = includedDays.includes(dStr);
                                    return (
                                        <button
                                            key={dStr}
                                            type="button"
                                            onClick={() => toggleDay(dStr)}
                                            className={cn(
                                                "px-2 py-1 rounded text-xs border transition-all",
                                                isSelected ? "bg-indigo-100 border-indigo-200 text-indigo-700 font-medium" : "bg-white border-slate-200 text-slate-400 hover:border-slate-300"
                                            )}
                                            title={format(d, 'EEEE, MMMM do')}
                                        >
                                            {format(d, 'MMM d')}
                                        </button>
                                    )
                                })
                            })()}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 text-center">Click dates to remove/add them from this session log.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Total Pages to Log</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.pagesRead}
                            onChange={e => setFormData({ ...formData, pagesRead: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                            placeholder="e.g. 25 (will be distributed)"
                        />
                        {includedDays.length > 1 && formData.pagesRead > 0 && (
                            <p className="text-xs text-slate-400 mt-1">
                                ~{Math.round(formData.pagesRead / includedDays.length)} pages per day
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                        <textarea
                            rows={2}
                            value={formData.notes}
                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all resize-none"
                            placeholder="Any thoughts?"
                        />
                    </div>
                </form>

                <div className="pt-4 p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 flex-shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={books.length === 0 || includedDays.length === 0}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Log {includedDays.length} Sessions
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReadingSessionModal;
