'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'dashboard' },
    { name: 'Startups', href: '/startups', icon: 'rocket_launch' },
  ];

  if ((session?.user as any)?.role === 'admin') {
    navigation.push({ name: 'Admin', href: '/admin/users', icon: 'admin_panel_settings' });
  }

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-full w-[280px] bg-surface-container-lowest border-r border-outline-variant shadow-sm flex-col p-6 z-50">
      <Link href="/startups" className="mb-10 px-2 block hover:opacity-80 transition-opacity">
        <img alt="PU-iNCENT Logo" className="h-10 w-auto mb-2 show-in-light" src="/images/logo-light.png" onError={(e) => { e.currentTarget.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuBDw8RG7islAC7a6nT-0wWr4MtgLNuO7ra0O_KkizFiA0MRlf5v8b7PLjcdbppYtD7MCSUgOVNtbKv6ogzV3ZqKlJUCARmPuHjDiBoEqWAtUq9Jv4cf3iqjghXJRg-DCa_xX4hadln40Ei9jaCUVj1qhWvP-J-G-7kd9fl1f82c3CHKhcihzB3pVAj64CMJHPb-sfKoxJzmBOrdOLGGwEqQzsVvR5SSS6GxqlV-WQTn4I9TPjF9TA-puqWETFPRu3RgaP6rh-ihHKnz" }} />
        <img alt="PU-iNCENT Logo" className="h-10 w-auto mb-2 show-in-dark scale-[1.35] origin-left" src="/images/logo-dark.png" onError={(e) => { e.currentTarget.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuBDw8RG7islAC7a6nT-0wWr4MtgLNuO7ra0O_KkizFiA0MRlf5v8b7PLjcdbppYtD7MCSUgOVNtbKv6ogzV3ZqKlJUCARmPuHjDiBoEqWAtUq9Jv4cf3iqjghXJRg-DCa_xX4hadln40Ei9jaCUVj1qhWvP-J-G-7kd9fl1f82c3CHKhcihzB3pVAj64CMJHPb-sfKoxJzmBOrdOLGGwEqQzsVvR5SSS6GxqlV-WQTn4I9TPjF9TA-puqWETFPRu3RgaP6rh-ihHKnz" }} />
        <p className="text-[10px] font-bold tracking-widest text-brand-orange uppercase">Incubation Dashboard</p>
      </Link>
      <nav className="flex-1 space-y-1 sidebar-scroll overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={isActive 
                ? "flex items-center gap-4 px-4 py-3 bg-primary-container text-on-primary-container rounded-lg font-bold scale-[0.98] transition-transform"
                : "flex items-center gap-4 px-4 py-3 text-on-surface-variant hover:bg-surface-variant hover:text-on-surface rounded-lg transition-colors duration-200"
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      {session && (
        <div className="mt-auto pt-6 border-t border-outline-variant">
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold shrink-0">
                {session.user?.email?.[0].toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-on-surface truncate">{session.user?.email}</p>
                <p className="text-[10px] uppercase font-bold text-on-surface-variant">{(session.user as any)?.role}</p>
              </div>
            </div>
            <button 
              onClick={() => signOut()}
              className="w-8 h-8 shrink-0 flex items-center justify-center rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
              title="Logout"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
