import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import LeftSidebar from '@/components/LeftSidebar';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdmin = router.pathname.startsWith('/admin');

  // Immediately clear admin auth whenever user is outside /admin or navigates away
  useEffect(() => {
    if (!router.pathname.startsWith('/admin')) {
      document.cookie = 'admin_auth=; path=/; max-age=0;';
      localStorage.removeItem('admin_authenticated');
    }

    const handleRouteChange = (url: string) => {
      if (!url.startsWith('/admin')) {
        document.cookie = 'admin_auth=; path=/; max-age=0;';
        localStorage.removeItem('admin_authenticated');
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col bg-academic-bg text-ink-900 selection:bg-scholar-teal selection:text-white">
      {!isAdmin && <LeftSidebar />}
      <div className={`flex-1 flex flex-col ${!isAdmin ? 'md:pl-16' : ''}`}>
        {!isAdmin && <Navbar />}
        <div className="flex-1">
          <Component {...pageProps} />
        </div>
        {!isAdmin && <Footer />}
      </div>
    </div>
  );
}
