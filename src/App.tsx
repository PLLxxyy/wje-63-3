import { useEffect } from 'react';
import { useBenchStore } from './store/useBenchStore';
import Home from '@/pages/Home';

export default function App() {
  const { loadFromStorage } = useBenchStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return <Home />;
}
