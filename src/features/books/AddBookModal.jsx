import React, { useState, useEffect } from 'react';
import { X, Check, Palette } from 'lucide-react';
import { cn } from '../../lib/utils';

const PRESET_COLORS = [
    '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981',
    '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef',
    '#f43f5e', '#64748b'
];

const AddBookModal = ({ isOpen, onClose, onSave, initialData = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        category: 'non-academic',
        status: 'toread',
        pageCount: '',
        color: '#3b82f6'
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                title: '',
                author: '',
                category: 'non-academic',
                status: 'toread',
                pageCount: '',
                color: '#3b82f6'
            });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...formData,
            pageCount: Number(formData.pageCount) || 0
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-800">
                        {initialData ? 'Edit Book' : 'Add New Book'}
                    </h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-200 text-slate-500 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Book Title</label>
                        <input
                            required
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                            placeholder="e.g. Atomic Habits"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Author</label>
                        <input
                            required
                            type="text"
                            value={formData.author}
                            onChange={e => setFormData({ ...formData, author: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                            placeholder="e.g. James Clear"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={e => setFormData({ ...formData, status: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-white"
                            >
                                <option value="toread">To Read</option>
                                <option value="reading">Currently Reading</option>
                                <option value="completed">Finished</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all bg-white"
                            >
                                <option value="academic">Academic</option>
                                <option value="non-academic">Non-Academic</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Total Pages</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.pageCount}
                            onChange={e => setFormData({ ...formData, pageCount: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                            placeholder="0"
                        />
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <label className="block text-sm font-bold text-slate-700 mb-2">Color Tag</label>
                        <div className="flex flex-wrap gap-2 mb-3">
                            {PRESET_COLORS.map(c => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, color: c })}
                                    className={cn(
                                        "w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 flex items-center justify-center",
                                        formData.color === c ? "border-slate-800 scale-110" : "border-transparent"
                                    )}
                                    style={{ backgroundColor: c }}
                                >
                                    {formData.color === c && <Check size={14} className="text-white drop-shadow-md" />}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3 pt-2 border-t border-slate-200">
                            <div className="relative">
                                <input
                                    type="color"
                                    value={formData.color}
                                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                                    className="w-10 h-10 p-0 border-0 rounded-lg overflow-hidden cursor-pointer shadow-sm"
                                />
                                <div className="absolute inset-0 pointer-events-none border border-black/10 rounded-lg" />
                            </div>
                            <span className="text-sm text-slate-500">Pick any custom color</span>
                            <div
                                className="ml-auto px-3 py-1 text-xs font-mono bg-white border border-slate-200 rounded-md shadow-sm"
                                style={{ color: formData.color }}
                            >
                                {formData.color}
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg shadow-indigo-200 transition-all active:scale-95"
                        >
                            {initialData ? 'Save Changes' : 'Add Book'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBookModal;
