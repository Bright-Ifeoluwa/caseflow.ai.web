import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Scale, 
  BookOpen, 
  FileText, 
  LayoutDashboard, 
  LogOut,
  Shield,
  Gavel,
  Library,
  FileSearch,
  PenTool,
  Megaphone
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const navItems = [
    { path: '/app', icon: Search, label: 'Research' },
    { path: '/app/statutes', icon: BookOpen, label: 'Statutes' },
    { path: '/app/predictor', icon: Scale, label: 'Outcome Predictor' },
    { path: '/app/briefs', icon: FileText, label: 'Brief Generator' },
    { path: '/app/library', icon: Library, label: 'Research Library' },
    { path: '/app/analysis', icon: FileSearch, label: 'Document Analysis' },
    { path: '/app/drafter', icon: PenTool, label: 'Process Drafter' },
    { path: '/app/marketing', icon: Megaphone, label: 'Publicity Studio' },
    { path: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  ];

  return (
    <div className="min-h-screen flex bg-[#E4E3E0] text-[#141414] font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#141414] flex flex-col fixed h-full bg-[#E4E3E0] z-20 print:hidden">
        <div className="p-6 border-b border-[#141414]">
          <Link to="/app" className="flex items-center gap-3">
            <Scale className="w-8 h-8" />
            <span className="font-bold tracking-tighter text-2xl">CASEFLOW</span>
          </Link>
          <p className="text-[10px] font-mono uppercase opacity-50 mt-1">Nigerian Legal Intelligence</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group",
                location.pathname === item.path 
                  ? "bg-[#141414] text-[#E4E3E0]" 
                  : "hover:bg-[#141414]/5"
              )}
            >
              <item.icon className={cn("w-5 h-5", location.pathname === item.path ? "text-[#E4E3E0]" : "opacity-50 group-hover:opacity-100")} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#141414] space-y-4">
          <div className="flex items-center gap-3 px-2">
            <img 
              src={auth.currentUser?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=DemoUser'} 
              className="w-10 h-10 rounded-full border border-[#141414] bg-white" 
              referrerPolicy="no-referrer" 
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate">{auth.currentUser?.displayName || 'Demo User'}</p>
              <p className="text-[10px] opacity-50 truncate uppercase font-mono">Professional Tier</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 p-2 text-[10px] font-bold uppercase tracking-widest border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] transition-all rounded"
          >
            <LogOut className="w-3 h-3" />
            {auth.currentUser ? 'End Session' : 'Exit Demo'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col print:ml-0 print:w-full">
        <Outlet />
      </main>
    </div>
  );
}
