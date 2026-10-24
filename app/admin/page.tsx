'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/ad');
  }, [router]);

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a09',
        color: '#9ca3af',
        fontFamily: 'var(--font-sans)',
        fontSize: '0.875rem',
      }}
    >
      Redirecting to ZENVORA Management Console (/ad)...
    </div>
  );
}
