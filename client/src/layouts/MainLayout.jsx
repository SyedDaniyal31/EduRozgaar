import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-bg-main dark:bg-secondary overflow-x-hidden">
      <Navbar />
      <main className="flex-1 min-w-0 w-full">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
}

export function MainLayoutWrapper() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
