import { createClient } from '@/libs/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Coffee, MessageSquare, LayoutDashboard, Activity, MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SignOutButton from '@/components/auth/sign-out-button';
import { Trans, TransHighlight } from '@/components/general/translation';

interface Props {
  children: React.ReactNode;
}

const menuItems = [
  { href: '/dashboard', key: 'navigation.dashboard', icon: LayoutDashboard },
  { href: '/dashboard/cafes', key: 'navigation.cafes', icon: Coffee },
  { href: '/dashboard/cities', key: 'navigation.cities', icon: MapIcon },
  { href: '/dashboard/queues', key: 'navigation.queues', icon: Activity },
]

export default async function DashboardLayout({ children }: Props) {
  // Check if user is authenticated
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-56 border-r bg-background">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Dashboard</h2>
          </div>
          <nav className="p-2 space-y-1">
            {menuItems.map((item) => (
              <Button variant="ghost" className="w-full justify-start" asChild key={item.href}>
                <Link href={item.href}>
                  {item.icon && <item.icon className="mr-2 h-4 w-4" />}
                  <Trans i18nKey={item.key} />
                </Link>
              </Button>
            ))}
          </nav>
          <div className="mt-auto p-4 border-t">
            <SignOutButton className="w-full" />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="md:flex-1 bg-background">
        <div className="px-6 py-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
} 