# Calendar Progress Tracker

A modern, comprehensive web application designed to help book lovers track their reading progress, manage their book collection, and visualize their reading habits through a calendar heatmap.

## Features

-   **Dashboard Overview**: Get high-level statistics about your reading, including total books, books completed, pages read, and a daily inspiration quote.
-   **Book Management**: Add, update, and manage your book collection. Track statuses like "To Read", "Reading", and "Completed".
-   **Reading Logs**: Log your daily reading sessions.
-   **Calendar Heatmap**: Visualize your reading consistency and volume over the year with an interactive heatmap, similar to GitHub's contribution graph.
-   **Responsive Design**: A sleek, modern user interface built with Tailwind CSS that works great on desktop and mobile.

## Technology Stack

-   **Frontend**: React (v19)
-   **Build Tool**: Vite
-   **Styling**: Tailwind CSS
-   **Icons**: Lucide React
-   **Date Management**: date-fns
-   **Tooltip**: react-tooltip

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

-   Node.js (v16 or higher recommended)
-   npm or yarn

### Installation

1.  Clone the repository (or download the source code).
2.  Navigate to the project directory:
    ```bash
    cd bookReadingTracker
    ```
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application

To start the development server:

```bash
npm run dev
```

The application will typically run at `http://localhost:5173`.

## Project Structure

-   `src/components`: Reusable UI components (Layout, Sidebar, etc.).
-   `src/features`: Feature-specific logic.
    -   `books`: Components related to book management (BookList, AddBookModal).
    -   `calendar`: Components for the heatmap and calendar visualization.
-   `src/context`: Global state management (`AppContext`).
-   `src/lib`: Utility functions (`utils.js`).
