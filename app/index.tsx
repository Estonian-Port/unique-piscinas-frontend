import { useEffect } from 'react';
import { router } from 'expo-router';

export default function Index() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  return null;
}