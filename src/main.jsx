import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { GlobalStateProvider } from './context/GlobalStateContext';
import App from './App.jsx';
import ErrorFallback from './components/common/ErrorFallback';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Ensures that React Query's caching and data fetching capabilities are available across all components. */}
    <QueryClientProvider client={queryClient}>
      {/* Catches JavaScript errors anywhere in the child component tree, logs those errors, and displays a fallback UI instead of crashing the whole app. Ensures that errors in fetching or state management are also caught. */}
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        {/* Ensures that the global state is available across all components. */}
        <GlobalStateProvider>
          <App />
        </GlobalStateProvider>
      </ErrorBoundary>
    </QueryClientProvider>
  </React.StrictMode>
);