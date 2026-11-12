'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Mail, Phone, Trash2, RefreshCw, Search } from 'lucide-react';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  topic?: string | null;
  product?: string | null;
  message: string;
  status?: string | null;
  created_at?: string;
}

const STATUS_LABEL: Record<string, string> = { new: 'New', reviewed: 'Reviewed', quoted: 'Quoted', archived: 'Archived' };
const STATUS_COLOR: Record<string, { bg: string; fg: string }> = {
  new: { bg: '#fee2e2', fg: '#b91c1c' },
  reviewed: { bg: '#dbeafe', fg: '#1d4ed8' },
  quoted: { bg: '#dcfce7', fg: '#15803d' },
  archived: { bg: '#f3f4f6', fg: '#4b5563' },
};

interface Props {
  onStatsChange: (stats: { total: number; newCount: number }) => void;
  showToast: (text: string, type?: 'success' | 'error') => void;
}

export const EnquiriesPanel: React.FC<Props> = ({ onStatsChange, showToast }) => {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'reviewed' | 'quoted' | 'archived'>('all');
  const [search, setSearch] = useState('');

  const publish = useCallback(
    (list: Enquiry[]) =>
      onStatsChange({ total: list.length, newCount: list.filter((x) => (x.status || 'new') === 'new').length }),
    [onStatsChange]
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/submissions?_t=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.submissions)) {
        setItems(data.submissions);
        publish(data.submissions);
      } else {
        showToast(data.message || 'Could not load enquiries.', 'error');
      }
    } catch {
      showToast('Could not load enquiries.', 'error');
    } finally {
      setLoading(false);
    }
  }, [publish, showToast]);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setStatus = async (id: string, status: string) => {
    const res = await fetch('/api/admin/submissions', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    const data = await res.json().catch(() => ({}));
    if (!data.success) return showToast(data.message || 'Could not update status.', 'error');
    const next = items.map((x) => (x.id === id ? { ...x, status } : x));
    setItems(next);
    publish(next);
  };

  const remove = async (id: string, name: string) => {
    if (!confirm(`Delete the enquiry from "${name}" permanently?`)) return;
    const res = await fetch(`/api/admin/submissions?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    const data = await res.json().catch(() => ({}));
    if (!data.success) return showToast(data.message || 'Could not delete enquiry.', 'error');
    const next = items.filter((x) => x.id !== id);
    setItems(next);
    publish(next);
    showToast('Enquiry deleted.');
  };

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((x) => {
      if (filter !== 'all' && (x.status || 'new') !== filter) return false;
      if (!q) return true;
      return [x.name, x.email, x.company, x.topic, x.product, x.message].some((v) => (v || '').toLowerCase().includes(q));
    });
  }, [items, filter, search]);

  const count = (s: string) => items.filter((x) => (x.status || 'new') === s).length;

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.14em' }}>
          CUSTOMER MESSAGES
        </span>
        <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.75rem', fontWeight: 600, color: '#111827', margin: '0.25rem 0 0.5rem' }}>
          Enquiries
        </h1>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
          Messages sent through the website contact form. Mark them as you work through them.
        </p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', marginBottom: '1rem' }}>
        {(['all', 'new', 'reviewed', 'quoted', 'archived'] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              border: '1px solid ' + (filter === f ? '#111827' : '#e5e7eb'),
              background: filter === f ? '#111827' : '#fff',
              color: filter === f ? '#fff' : '#374151',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {f === 'all' ? `All (${items.length})` : `${STATUS_LABEL[f]} (${count(f)})`}
          </button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: 11, color: '#9ca3af' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, message…"
              aria-label="Search enquiries"
              style={{ padding: '0.5rem 0.75rem 0.5rem 2rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.8125rem', minWidth: '220px' }}
            />
          </div>
          <button
            type="button"
            onClick={load}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.5rem 0.9rem', border: '1px solid #d1d5db', borderRadius: '6px', background: '#fff', fontSize: '0.8125rem', cursor: 'pointer' }}
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>Loading enquiries…</p>
      ) : visible.length === 0 ? (
        <div style={{ padding: '2.5rem', textAlign: 'center', color: '#6b7280', border: '1px dashed #d1d5db', borderRadius: '8px', fontSize: '0.875rem' }}>
          {items.length === 0 ? 'No enquiries received yet.' : 'No enquiries match this filter.'}
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {visible.map((x) => {
            const status = x.status || 'new';
            const color = STATUS_COLOR[status] || STATUS_COLOR.archived;
            return (
              <article key={x.id} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <strong style={{ color: '#111827' }}>{x.name}</strong>
                    {x.company ? <span style={{ color: '#6b7280', fontSize: '0.8125rem' }}>{x.company}</span> : null}
                    <span style={{ background: color.bg, color: color.fg, fontSize: '0.6875rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: '9999px', textTransform: 'uppercase' }}>
                      {STATUS_LABEL[status] || status}
                    </span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{x.created_at ? new Date(x.created_at).toLocaleString() : ''}</span>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8125rem', margin: '0.5rem 0', color: '#374151' }}>
                  <a href={`mailto:${x.email}`} style={{ color: '#2563eb', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Mail size={13} /> {x.email}
                  </a>
                  {x.phone ? (
                    <a href={`tel:${x.phone}`} style={{ color: '#2563eb', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Phone size={13} /> {x.phone}
                    </a>
                  ) : null}
                  {x.topic ? <span>Subject: {x.topic}</span> : null}
                  {x.product ? <span>Product: {x.product}</span> : null}
                </div>

                <p style={{ margin: '0 0 0.75rem', fontSize: '0.875rem', color: '#111827', whiteSpace: 'pre-wrap' }}>{x.message}</p>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <label style={{ fontSize: '0.75rem', color: '#6b7280' }} htmlFor={`st-${x.id}`}>Status</label>
                  <select
                    id={`st-${x.id}`}
                    value={status}
                    onChange={(e) => setStatus(x.id, e.target.value)}
                    style={{ padding: '0.35rem 0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '0.8125rem' }}
                  >
                    {Object.entries(STATUS_LABEL).map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => remove(x.id, x.name)}
                    aria-label={`Delete enquiry from ${x.name}`}
                    style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.35rem 0.7rem', border: '1px solid #fee2e2', borderRadius: '6px', background: '#fef2f2', color: '#dc2626', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};
