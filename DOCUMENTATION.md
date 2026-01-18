# Project Documentation

This document provides a detailed explanation of the files, variables, contexts, and packages used in the **Book Reading Tracker** application.

## 1. Project Overview

The application is a React-based web app built with Vite. It allows users to track their book reading progress. It uses local storage (via `AppContext`) to persist data about books and reading logs.

## 2. Directory Structure & Key Files

### Root Directory
-   `package.json`: Defines the project dependencies and scripts.
-   `vite.config.js`: Configuration for the Vite build tool.
-   `tailwind.config.js`: Configuration for Tailwind CSS (colors, content paths).
-   `index.html`: The entry point HTML file.

### `src/` Directory
-   `main.jsx`: The entry point for the React application. Renders the `App` component.
-   `App.jsx`: The main application component. It handles the high-level routing (switching between Dashboard, Reading List, and Calendar views) and wraps the app in the `AppProvider`.

### `src/context/`
-   **`AppContext.jsx`**: This is the core of the state management.
    -   **Exports**: `AppProvider`, `useApp` (custom hook).
    -   **State**:
        -   `books`: Array of book objects.
        -   `logs`: Array of reading log objects.
    -   **Functions**:
        -   `addBook(book)`: Adds a new book.
        -   `updateBook(id, updates)`: Updates an existing book.
        -   `addLog(log)`: Adds a reading log entry.
        -   `deleteLog(date, bookId)`: Removes specific logs.

### `src/features/`
This directory contains the main feature modules.

#### `books/`
-   **`BookList.jsx`**: Displays the list of books. Allows filtering by status.
-   **`AddBookModal.jsx`** (Assumed): Modal for adding new books.

#### `calendar/`
-   **`CalendarView.jsx`**: The main view for the calendar feature.
-   **`YearHeatmap.jsx`**: Visualizes reading activity over a year (likely using a grid of blocks colored by intensity).
-   **`ReadingSessionModal.jsx`**: Modal to log a reading session for a specific date.

### `src/lib/`
-   **`utils.js`**: Contains helper functions (e.g., class name merging, date formatting).

## 3. Key Data Structures (Variables)

### Book Object
Represents a single book.
```javascript
{
  id: string,          // Unique identifier (UUID or timestamp)
  title: string,       // Title of the book
  author: string,      // Author's name
  pageCount: number,   // Total pages
  status: string,      // 'toread', 'reading', 'completed'
  coverColor: string,  // Color code for the book cover UI
  createdAt: string    // ISO date string
}
```

### Log Object
Represents a reading session.
```javascript
{
  id: string,
  bookId: string,      // Reference to the book being read
  date: string,        // ISO date string (YYYY-MM-DD)
  pagesRead: number,   // Number of pages read in this session
  startPage: number,   // (Optional) Starting page number
  endPage: number      // (Optional) Ending page number
}
```

## 4. Dependencies & Packages

-   **react / react-dom**: Core React library for building the UI.
-   **vite**: Fast build tool and development server.
-   **tailwindcss**: Utility-first CSS framework for styling.
-   **lucide-react**: A library of beautiful, consistent icons (e.g., `Book`, `Calendar`, `TrendingUp`).
-   **date-fns**: A modern JavaScript date utility library. Used for manipulating dates (formatting, adding days, comparing).
-   **react-tooltip**: Used to show tooltips (likely on the calendar heatmap) to display details when hovering over a specific day.
-   **clsx / tailwind-merge**: Utilities for constructing `className` strings conditionally and merging Tailwind classes without conflicts.

## 5. Styling & Theme
The application uses a modern, clean design with a focus on "Glassmorphism" (translucent backgrounds, blurs) and gradients.
-   **Colors**: Primarily Slate, Indigo, Violet, and semantic colors (Blue, Green, Purple, Orange) for statuses.
-   **Fonts**: Uses system defaults or a sans-serif font configured in Tailwind.
