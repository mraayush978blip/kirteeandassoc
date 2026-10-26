'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { loginWithSupabase } from '@/lib/supabase-auth';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/ad';

  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // If already authenticated, redirect to targetUrl or /ad
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kirtee_admin_auth');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          router.replace(redirectUrl);
          return;
        }
      }
    } catch {}
    setIsCheckingAuth(false);
  }, [router, redirectUrl]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    const normalizedEmail = loginEmail.trim().toLowerCase();
    const masterPasswords = ['ADad@2013', 'adad@2013', 'Zenvora@2000', 'zenvora@2000', 'zenvora2026', 'Zenvora2026!', 'kirtee2026'];

    // 1. Instant Master Admin Key Authentication
    if (normalizedEmail === 'zenvora204@gmail.com' && masterPasswords.includes(loginPassword.trim())) {
      const adminSession = {
        email: 'zenvora204@gmail.com',
        role: 'admin',
        id: '9460e78f-ffe8-420a-aa7e-baabbe4643ab',
      };
      localStorage.setItem('kirtee_admin_auth', JSON.stringify(adminSession));
      router.push(redirectUrl);
      return;
    }

    // 2. Supabase Cloud Auth API Verification
    try {
      const result = await loginWithSupabase(loginEmail, loginPassword);
      if (result.success && result.session?.user) {
        const adminSession = {
          email: result.session.user.email || loginEmail,
          role: 'admin',
          id: result.session.user.id || '9460e78f-ffe8-420a-aa7e-baabbe4643ab',
        };
        localStorage.setItem('kirtee_admin_auth', JSON.stringify(adminSession));
        router.push(redirectUrl);
      } else {
        setLoginError(result.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0c0e12' }}>
        <div style={{ textAlign: 'center', color: '#ffffff' }}>
          <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#60a5fa' }} />
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', letterSpacing: '0.1em' }}>
            VERIFYING ADMINISTRATIVE ACCESS...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0c0e12',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        position: 'relative',
      }}
    >
      {/* Background Ambient Glow */}
      <div
        style={{
          position: 'absolute',
          width: '600px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#161920',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '2.5rem 2rem',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6875rem',
              fontWeight: 600,
              color: '#60a5fa',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '0.5rem',
            }}
          >
            ADMINISTRATIVE SECURITY CONSOLE
          </span>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.875rem',
              color: '#ffffff',
              margin: 0,
              letterSpacing: '0.04em',
            }}
          >
            ZENVORA
          </h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8125rem', color: '#9ca3af', marginTop: '0.35rem' }}>
            Architectural Lighting &amp; Bespoke Specification Engine
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {loginError && (
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '4px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5',
                fontSize: '0.8125rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={16} />
              <span>{loginError}</span>
            </div>
          )}

          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#9ca3af',
                marginBottom: '0.4rem',
              }}
            >
              Admin Email
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                required
                placeholder="admin@zenvora.com"
                autoComplete="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  backgroundColor: '#0c0e12',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              <Mail size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: '#9ca3af',
                marginBottom: '0.4rem',
              }}
            >
              Admin Password / Master Key
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 2.5rem 0.75rem 2.5rem',
                  backgroundColor: '#0c0e12',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              <Lock size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            style={{
              width: '100%',
              padding: '0.875rem',
              backgroundColor: '#ffffff',
              color: '#000000',
              border: 'none',
              borderRadius: '4px',
              fontFamily: 'var(--font-sans)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: isLoggingIn ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem',
              transition: 'background-color 0.2s ease',
            }}
          >
            {isLoggingIn ? (
              <>
                <RefreshCw size={16} className="animate-spin" /> Verifying...
              </>
            ) : (
              <>
                Sign In to Dashboard <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.75rem',
              color: '#6b7280',
              textDecoration: 'none',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#6b7280')}
          >
            &larr; Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0c0e12' }}>
          <div style={{ textAlign: 'center', color: '#ffffff' }}>
            <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#60a5fa' }} />
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', letterSpacing: '0.1em' }}>
              INITIALIZING ADMINISTRATIVE ACCESS...
            </p>
          </div>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
