import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/admin-auth';
import { AdminUserProvider } from '@/components/admin/AdminUserContext';

// The session is verified on the server, before anything is rendered:
// no client-side "verifying session" screen, and no flash of the console for signed-out visitors.
export const dynamic = 'force-dynamic';

export default async function AdminConsoleLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const session = verifySessionToken(token);
  if (!session) redirect('/ad/login');
  return <AdminUserProvider email={session.email}>{children}</AdminUserProvider>;
}
