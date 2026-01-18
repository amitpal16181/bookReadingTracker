import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Layout, { TOOLS } from './components/Layout';
import BookList from './features/books/BookList';
import CalendarView from './features/calendar/CalendarView';
import { Book, CheckCircle, TrendingUp, Clock, BookOpen, List } from 'lucide-react';

function Dashboard() {
  const { books, logs } = useApp();

  const totalBooks = books.length;
  const booksCompleted = books.filter(b => b.status === 'completed').length;
  const booksReading = books.filter(b => b.status === 'reading').length;
  const booksToRead = books.filter(b => b.status === 'toread').length;
  const totalPagesRead = books.filter(b => b.status === 'completed').reduce((acc, book) => acc + (parseInt(book.pageCount) || 0), 0);

  const quotes = [
    { text: "A reader lives a thousand lives before he dies . . . The man who never reads lives only one.", author: "George R.R. Martin" },
    { text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
    { text: "Reading is essential for those who seek to rise above the ordinary.", author: "Jim Rohn" },
    { text: "Today a reader, tomorrow a leader.", author: "Margaret Fuller" },
    { text: "Books are a uniquely portable magic.", author: "Stephen King" }
  ];

  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  const StatCard = ({ icon: Icon, label, value, colorClass }) => (
    <div
      className={`bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white/20 shadow-xl shadow-slate-200/50 flex flex-col items-start transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/10 group`}
    >
      <div className={`p-3 rounded-xl ${colorClass} bg-opacity-10 mb-4 transition-colors group-hover:scale-110 duration-300`}>
        <Icon size={24} className={colorClass.replace('bg-', 'text-')} />
      </div>
      <span className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">{label}</span>
      <span className="text-3xl font-bold text-slate-800">{value}</span>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">Dashboard Overview</h2>
        <p className="text-slate-500">Track your reading progress and achievements.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard icon={Book} label="Total Books" value={totalBooks} colorClass="bg-blue-500 text-blue-600" />
        <StatCard icon={CheckCircle} label="Completed" value={booksCompleted} colorClass="bg-green-500 text-green-600" />
        <StatCard icon={BookOpen} label="Reading" value={booksReading} colorClass="bg-purple-500 text-purple-600" />
        <StatCard icon={List} label="To Read" value={booksToRead} colorClass="bg-slate-500 text-slate-600" />
        <StatCard icon={TrendingUp} label="Pages Read" value={totalPagesRead} colorClass="bg-orange-500 text-orange-600" />
      </div>

      <div
        className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-10 text-white shadow-2xl shadow-indigo-500/20"
      >
        <div className="relative z-10">
          <h3 className="text-3xl font-bold mb-3">Daily Inspiration</h3>
          <p className="text-indigo-100 text-lg max-w-lg leading-relaxed italic">
            "{quote.text}"
          </p>
          <div className="mt-4 text-indigo-300 font-medium">— {quote.author}</div>
        </div>

        {/* Decorative circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl rounded-bl-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
}

function AppContent() {
  const [currentView, setCurrentView] = useState(TOOLS.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case TOOLS.READING_LIST:
        return <BookList />;
      case TOOLS.CALENDAR:
        return <CalendarView />;
      case TOOLS.DASHBOARD:
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentView={currentView} setCurrentView={setCurrentView}>
      {renderView()}
    </Layout>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
