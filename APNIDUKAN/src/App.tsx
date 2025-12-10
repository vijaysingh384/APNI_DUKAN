import { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import Routepages from './pages/Routepages';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ToastContainer } from './components/ui/toast';
import { useAuthStore } from './store/authStore';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    // Check authentication on app load
    checkAuth();
  }, [checkAuth]);

  return (
    <ErrorBoundary>
      <Navbar />
      <Routepages />
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default App;
