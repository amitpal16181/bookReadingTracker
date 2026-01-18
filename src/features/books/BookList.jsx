import React, { useState } from 'react';
import { Plus, Search, Filter, Book, MoreVertical, Trash2, Edit, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import AddBookModal from './AddBookModal';

const BookList = () => {
    const { books, logs, addBook, updateBook, deleteBook } = useApp();
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [filter, setFilter] = useState('all'); // all, academic, non-academic
    const [search, setSearch] = useState('');

    const calculateProgress = (bookId) => {
        const bookLogs = logs.filter(l => l.bookId === bookId);
        return bookLogs.reduce((acc, l) => acc + (l.pagesRead || 0), 0);
    };

    const filteredBooks = books.filter(book => {
        const matchesFilter = filter === 'all' || book.category === filter;
        const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) ||
            book.author.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleSaveBook = (bookData) => {
        if (editingBook) {
            updateBook(editingBook.id, bookData);
        } else {
            addBook(bookData);
        }
        setEditingBook(null);
    };

    const openEdit = (book) => {
        setEditingBook(book);
        setModalOpen(true);
    };

    const openAdd = () => {
        setEditingBook(null);
        setModalOpen(true);
    };

    const handleStatusChange = (id, newStatus) => {
        updateBook(id, { status: newStatus });
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search books..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all"
                    />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 focus:ring-2 focus:ring-indigo-100 outline-none"
                    >
                        <option value="all">All Categories</option>
                        <option value="academic">Academic</option>
                        <option value="non-academic">Non-Academic</option>
                    </select>
                    <button
                        onClick={openAdd}
                        className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 text-nowrap"
                    >
                        <Plus size={18} className="mr-2" />
                        Add Book
                    </button>
                </div>
            </div>

            {/* Grid */}
            {filteredBooks.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
                    <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <Book className="text-slate-400" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900">No books found</h3>
                    <p className="text-slate-500 mb-6">Start by adding your first book to the collection.</p>
                    <button onClick={openAdd} className="text-indigo-600 font-medium hover:underline">Add a book now</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredBooks.map(book => (
                        <div
                            key={book.id}
                            className="group relative bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col"
                        >
                            <div className="absolute top-0 left-0 w-1.5 h-full rounded-l-2xl" style={{ backgroundColor: book.color }} />

                            <div className="pl-3 mb-3 flex justify-between items-start">
                                <div>
                                    <span
                                        className="px-2 py-1 rounded-md text-[10px] uppercase tracking-wider font-bold"
                                        style={{ backgroundColor: `${book.color}15`, color: book.color }}
                                    >
                                        {book.category}
                                    </span>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEdit(book)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => deleteBook(book.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="pl-3 flex-1 flex flex-col">
                                <h3 className="font-bold text-slate-800 text-lg leading-tight mb-1 line-clamp-2">{book.title}</h3>
                                <p className="text-slate-500 text-sm mb-4">{book.author}</p>

                                <div className="mt-auto pt-4 border-t border-slate-50 flex flex-col gap-2">
                                    <div className="flex items-center justify-between text-xs text-slate-400 relative">
                                        <div className="relative group/status">
                                            <button className="flex items-center gap-1 capitalize px-2 py-1 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                                                {book.status === 'toread' ? 'To Read' : book.status}
                                                <ChevronDown size={12} />
                                            </button>
                                            {/* Dropdown */}
                                            <div className="absolute bottom-full left-0 mb-2 w-36 bg-white rounded-lg shadow-xl border border-slate-100 overflow-hidden hidden group-hover/status:block z-10">
                                                <button onClick={() => handleStatusChange(book.id, 'toread')} className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700">To Read</button>
                                                <button onClick={() => handleStatusChange(book.id, 'reading')} className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700">Reading</button>
                                                <button onClick={() => handleStatusChange(book.id, 'completed')} className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-700">Finished</button>
                                            </div>
                                        </div>

                                        {book.pageCount > 0 && <span>{book.pageCount} pages</span>}
                                    </div>

                                    {/* Progress Bar */}
                                    {book.pageCount > 0 && (
                                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    backgroundColor: book.color,
                                                    width: book.status === 'completed'
                                                        ? '100%'
                                                        : `${Math.min(100, (calculateProgress(book.id) / book.pageCount) * 100)}%`
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )
            }

            <AddBookModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSaveBook}
                initialData={editingBook}
            />
        </div>
    );
};

export default BookList;
