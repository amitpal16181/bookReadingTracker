import React, { useState } from 'react';
import { BookOpen, Calendar as CalendarIcon, PieChart, Upload, Download, Plus, Menu } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cn } from '../lib/utils';

export const TOOLS = {
    READING_LIST: 'reading-list',
    CALENDAR: 'calendar',
    DASHBOARD: 'dashboard'
};

const Layout = ({ currentView, setCurrentView, children }) => {
    const { exportData, importData } = useApp();
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const json = JSON.parse(event.target.result);
                    importData(json);
                    alert('Data imported successfully!');
                } catch (err) {
                    alert('Failed to import data: ' + err.message);
                }
            };
            reader.readAsText(file);
        }
    };

    const NavItem = ({ view, icon: Icon, label }) => (
        <button
            onClick={() => setCurrentView(view)}
            className={cn(
                "flex items-center w-full px-4 py-3 mb-2 rounded-xl transition-all duration-200 group",
                !isSidebarOpen && "justify-center px-2",
                currentView === view
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
                    : "text-slate-500 hover:bg-slate-100 hover:text-indigo-600"
            )}
            title={!isSidebarOpen ? label : undefined}
        >
            <Icon size={20} className={cn("transition-colors", isSidebarOpen && "mr-3", currentView === view ? "text-indigo-100" : "text-slate-400 group-hover:text-indigo-600")} />
            {isSidebarOpen && <span className="font-medium">{label}</span>}
        </button>
    );

    return (
        <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-20",
                    isSidebarOpen ? "w-64" : "w-20"
                )}
            >
                <div className="p-6 flex items-center justify-between">
                    {isSidebarOpen ? (
                        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            Reading Tracker
                        </h1>
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto" />
                    )}
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                        <Menu size={18} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-4">
                    <NavItem view={TOOLS.DASHBOARD} icon={PieChart} label="Dashboard" />
                    <NavItem view={TOOLS.READING_LIST} icon={BookOpen} label="Reading List" />
                    <NavItem view={TOOLS.CALENDAR} icon={CalendarIcon} label="Calendar" />
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex flex-col gap-2">
                        <label className="flex items-center justify-center w-full p-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors border border-dashed border-slate-300">
                            <Upload size={16} className="mr-2" />
                            {isSidebarOpen && <span>Import JSON</span>}
                            <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                        </label>
                        <button
                            onClick={exportData}
                            className="flex items-center justify-center w-full p-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
                        >
                            <Download size={16} className="mr-2" />
                            {isSidebarOpen && <span>Export JSON</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative">
                <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-slate-800 capitalize">
                        {currentView.replace('-', ' ')}
                    </h2>
                    <div className="flex items-center gap-3">
                        <div className="text-sm text-slate-500">
                            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                            U
                        </div>
                    </div>
                </header>

                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
