import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-luna-bg">
      <Sidebar />
      <main className="lg:ml-64 pb-20 lg:pb-6 px-4 md:px-6 lg:px-8 pt-6 max-w-4xl">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
