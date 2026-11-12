'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Sliders,
  Package,
  Layers,
  Inbox,
  MessageSquare,
  Type,
  Settings,
  LogOut,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'home'
  | 'products'
  | 'projects'
  | 'enquiries'
  | 'contact'
  | 'typography'
  | 'settings';

/** Single source of truth for the admin navigation. */
export const ADMIN_TABS: { id: AdminTab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'home', label: 'Home Page', icon: Sliders },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'projects', label: 'Projects', icon: Layers },
  { id: 'enquiries', label: 'Enquiries', icon: Inbox },
  { id: 'contact', label: 'Contact & WhatsApp', icon: MessageSquare },
  { id: 'typography', label: 'Typography & Fonts', icon: Type },
  { id: 'settings', label: 'Settings & Storage', icon: Settings },
];

interface AdminChromeProps {
  activeTab: AdminTab;
  onNavigate: (tab: AdminTab) => void;
  onLogout: () => void;
  userEmail?: string;
  newEnquiryCount?: number;
  toast: { type: 'success' | 'error'; text: string } | null;
}

const Badge: React.FC<{ count?: number; light?: boolean }> = ({ count, light }) =>
  count ? (
    <span
      style={{
        marginLeft: 'auto',
        minWidth: '20px',
        padding: '0 6px',
        borderRadius: '9999px',
        fontSize: '0.6875rem',
        fontWeight: 700,
        lineHeight: '18px',
        textAlign: 'center',
        backgroundColor: light ? '#ffffff' : '#dc2626',
        color: light ? '#111827' : '#ffffff',
      }}
    >
      {count}
    </span>
  ) : null;

/**
 * Toast + mobile top bar + mobile tab strip + desktop sidebar.
 * Rendered as siblings inside `.admin-root-container` (CSS in styles/globals.css decides
 * which of them is visible at each breakpoint).
 */
export const AdminChrome: React.FC<AdminChromeProps> = ({
  activeTab,
  onNavigate,
  onLogout,
  userEmail,
  newEnquiryCount,
  toast,
}) => {
  return (
    <>
      {toast && (
        <div
          role="status"
          style={{
            position: 'fixed',
            bottom: '1.5rem',
            right: '1.5rem',
            left: 'auto',
            maxWidth: 'calc(100vw - 3rem)',
            zIndex: 999999,
            backgroundColor: toast.type === 'success' ? '#10b981' : '#ef4444',
            color: '#ffffff',
            padding: '0.85rem 1.25rem',
            borderRadius: '6px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Mobile top bar */}
      <header className="admin-mobile-header">
        <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 700, color: '#111827' }}>
          ZENVORA
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link
            href="/"
            target="_blank"
            style={{ padding: '0.4rem 0.7rem', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, color: '#374151', textDecoration: 'none' }}
          >
            View Site
          </Link>
          <button
            type="button"
            onClick={onLogout}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.4rem 0.7rem', border: '1px solid #fee2e2', borderRadius: '6px', backgroundColor: '#fef2f2', color: '#dc2626', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </header>

      {/* Mobile tab strip (scrolls horizontally) */}
      <nav className="admin-mobile-tabs-bar" aria-label="Admin sections">
        {ADMIN_TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              aria-current={active ? 'page' : undefined}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.45rem 0.85rem',
                borderRadius: '9999px',
                border: active ? '1px solid #111827' : '1px solid #e5e7eb',
                backgroundColor: active ? '#111827' : '#ffffff',
                color: active ? '#ffffff' : '#374151',
                fontSize: '0.75rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                flexShrink: 0,
                minHeight: '34px',
              }}
            >
              <Icon size={13} />
              <span>{label.split(' &')[0]}</span>
              {id === 'enquiries' && newEnquiryCount ? <Badge count={newEnquiryCount} light={!active} /> : null}
            </button>
          );
        })}
      </nav>

      {/* Desktop sidebar */}
      <aside
        className="admin-sidebar-desktop"
        style={{
          width: '260px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          height: '100vh',
          zIndex: 50,
          flexShrink: 0,
        }}
      >
        <div>
          <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid #f3f4f6' }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.18em', color: '#6b7280' }}>
              ADMIN CONSOLE
            </span>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.375rem', fontWeight: 700, color: '#111827' }}>
              ZENVORA
            </span>
          </div>
          <nav aria-label="Admin sections" style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {ADMIN_TABS.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onNavigate(id)}
                  aria-current={active ? 'page' : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.7rem 0.9rem',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: active ? '#111827' : 'transparent',
                    color: active ? '#ffffff' : '#4b5563',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <Icon size={17} />
                  <span>{label}</span>
                  {id === 'enquiries' && <Badge count={newEnquiryCount} light={active} />}
                </button>
              );
            })}
          </nav>
        </div>

        <div style={{ padding: '1.25rem', borderTop: '1px solid #f3f4f6' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111827', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {userEmail || 'Admin'}
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              Signed in
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              href="/"
              target="_blank"
              style={{ flex: 1, padding: '0.45rem', borderRadius: '6px', border: '1px solid #e5e7eb', backgroundColor: '#ffffff', color: '#374151', fontSize: '0.75rem', fontWeight: 600, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
            >
              <span>View Site</span>
              <ExternalLink size={12} />
            </Link>
            <button
              type="button"
              onClick={onLogout}
              title="Sign Out"
              aria-label="Sign Out"
              style={{ padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #fee2e2', backgroundColor: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
