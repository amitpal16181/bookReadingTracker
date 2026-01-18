import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateId } from '../lib/utils';

const AppContext = createContext();

export const useApp = () => {
    return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
    // Load initial state from LocalStorage
    const [books, setBooks] = useState(() => {
        const saved = localStorage.getItem('cpt_books');
        return saved ? JSON.parse(saved) : [];
    });

    const [logs, setLogs] = useState(() => {
        const saved = localStorage.getItem('cpt_logs');
        return saved ? JSON.parse(saved) : [];
    });

    // Persist to LocalStorage whenever state changes
    useEffect(() => {
        localStorage.setItem('cpt_books', JSON.stringify(books));
    }, [books]);

    useEffect(() => {
        localStorage.setItem('cpt_logs', JSON.stringify(logs));
    }, [logs]);

    // --- Book Actions ---
    const addBook = (bookData) => {
        const newBook = {
            id: generateId(),
            status: 'toread',
            ...bookData
        };
        setBooks(prev => [...prev, newBook]);
    };

    const updateBook = (id, updates) => {
        setBooks(prev => prev.map(book => book.id === id ? { ...book, ...updates } : book));
    };

    const deleteBook = (id) => {
        setBooks(prev => prev.filter(book => book.id !== id));
        setLogs(prev => prev.filter(log => log.bookId !== id));
    };

    // --- Log Actions ---
    const addLog = (logData) => {
        setLogs(prev => {
            // Check for existing log for this book and date
            const existingIndex = prev.findIndex(l => l.bookId === logData.bookId && l.date === logData.date);
            let nextLogs;

            if (existingIndex >= 0) {
                // Update existing
                nextLogs = [...prev];
                // Determine if we should ADD to the existing pages or OVERWRITE?
                // If I say "I read 20 pages today", and then "I read 10 pages today", do I mean 30 total or did I correct it to 10?
                // Usually logging twice means "I read more".
                // But the previous "Update existing" code just overwrote properties.
                // Let's make it additive for 'pagesRead' if it's a new action, 
                // BUT the modal usually sets the absolute value for the day.
                // The request said "Exact once and no more", which implies 1 entry per day.
                // If I use the modal to set pages, I probably expect that value to be THE value.
                // So overwriting is safer for "correction".
                // However, if the user distributes pages, they might call addLog multiple times... wait, distribution is unique dates.
                // So overwriting is fine.

                nextLogs[existingIndex] = { ...nextLogs[existingIndex], ...logData, id: nextLogs[existingIndex].id };
            } else {
                // Add new
                const newLog = {
                    id: generateId(),
                    ...logData
                };
                nextLogs = [...prev, newLog];
            }

            // Check for auto-completion status
            // We can't call setBooks inside setLogs reducer.
            // So we should trigger a check in useEffect or outside.
            // But we need the NEW logs to know if we finished.
            // Let's use a timeout or useEffect dependency.
            return nextLogs;
        });
    };

    // Auto-status effect
    useEffect(() => {
        books.forEach(book => {
            if (book.status !== 'completed' && book.pageCount > 0) {
                const bookLogs = logs.filter(l => l.bookId === book.id);
                const totalRead = bookLogs.reduce((acc, l) => acc + (l.pagesRead || 0), 0);
                if (totalRead >= book.pageCount) {
                    // Update to completed
                    // Use functional update to avoid dependency cycles if possible, or just call updateBook specialized
                    setBooks(prev => prev.map(b => b.id === book.id ? { ...b, status: 'completed' } : b));
                }
            }
        });
    }, [logs, books]);

    const deleteLog = (id) => {
        setLogs(prev => prev.filter(log => log.id !== id));
    };

    // --- Data Management (Export/Import) ---
    const exportData = () => {
        const data = {
            books,
            logs,
            exportedAt: new Date().toISOString(),
            version: 1
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reading-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const importData = (jsonData) => {
        try {
            if (jsonData.books && Array.isArray(jsonData.books)) {
                setBooks(jsonData.books);
            }
            if (jsonData.logs && Array.isArray(jsonData.logs)) {
                setLogs(jsonData.logs);
            }
            return { success: true };
        } catch (error) {
            console.error("Import failed:", error);
            return { success: false, error };
        }
    };

    const value = {
        books,
        logs,
        addBook,
        updateBook,
        deleteBook,
        addLog,
        deleteLog,
        exportData,
        importData
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};
