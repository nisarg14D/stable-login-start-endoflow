// in src/components/layout/dentist/TopNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, UserCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { signOut } from '@/app/(login)/actions'; // We will use this for the logout button

const navLinks = [
  { href: '/dentist/dashboard', label: "Today's View" },
  { href: '/patients', label: 'Patients' },
  // Add other main tabs here later
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <h1 className="text-xl font-semibold">ENDOFLOW</h1>
      <nav className="hidden md:flex md:items-center md:gap-5 md:text-sm lg:gap-6 ml-6">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className={cn(
              'transition-colors hover:text-foreground',
              pathname === link.href
                ? 'text-foreground font-semibold'
                : 'text-muted-foreground'
            )}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <form action={signOut}>
          <Button variant="ghost" size="icon" className="rounded-full">
            <UserCircle className="h-6 w-6" />
            <span className="sr-only">Sign Out</span>
          </Button>
        </form>
      </div>
    </header>
  );
}