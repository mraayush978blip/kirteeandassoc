'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Sliders,
  Package,
  Layers,
  MessageSquare,
  Settings,
  Plus,
  Search,
  Trash2,
  Edit2,
  Eye,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  LogOut,
  Menu,
  X,
  RefreshCw,
  UploadCloud,
  HardDrive,
  Database,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  Lock,
  Mail,
  ChevronDown,
  ChevronUp,
  Crop,
  FileText,
  Phone,
  Send,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';
import { formatBytes } from '@/lib/format';
import { Product, ProductSpecification } from '@/types/product';
import { loginWithSupabase } from '@/lib/supabase-auth';
import {
  HeroSlideConfig,
  ProjectConfig,
  ContactConfig,
  ProjectSettings,
  DEFAULT_HERO_SLIDES,
  DEFAULT_PROJECTS,
  DEFAULT_CONTACT,
  DEFAULT_PROJECT_SETTINGS,
} from '@/lib/site-settings-types';
import { ProductGridBuilder, GridPhotoItem } from '@/components/admin/ProductGridBuilder';
import { ImageCropperModal } from '@/components/admin/ImageCropperModal';

type AdminTab = 'dashboard' | 'home' | 'products' | 'projects' | 'contact' | 'settings';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthChecking, setIsAuthChecking] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<{ email: string; role: string; id?: string } | null>(null);
  const [loginEmail, setLoginEmail] = useState<string>('zenvora204@gmail.com');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccessMsg, setLoginSuccessMsg] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  // General Notification Toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // -------------------------------------------------------------
  // Data States
  // -------------------------------------------------------------
  // 1. Dashboard / DB Status
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    isConfigured: boolean;
    latencyMs?: number;
    database?: string;
    version?: string;
    counts?: { products: number; categories: number; media: number; submissions: number };
    error?: string;
  }>({ connected: false, isConfigured: false });
  const [isCheckingDb, setIsCheckingDb] = useState(false);

  // 2. Home Hero Slides
  const [heroSlides, setHeroSlides] = useState<HeroSlideConfig[]>(DEFAULT_HERO_SLIDES);
  const [isLoadingHero, setIsLoadingHero] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlideConfig | null>(null);
  const [isAddSlideModalOpen, setIsAddSlideModalOpen] = useState(false);
  const [newSlideData, setNewSlideData] = useState<HeroSlideConfig>({
    id: '',
    slotId: '',
    eyebrow: 'ARCHITECTURAL LIGHTING SYSTEMS',
    title: 'LIGHT,\nREFINED.',
    subtitle: 'Bespoke architectural lighting systems engineered for exceptional spaces.',
    ctaText: 'EXPLORE COLLECTIONS',
    ctaHref: '/products',
    imageUrl: '',
    imageAlt: 'Architectural luminaire',
    order: 1,
  });

  // 3. Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productCategoryFilter, setProductCategoryFilter] = useState<'all' | 'dry' | 'wet'>('all');
  const [productSearch, setProductSearch] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [isGridBuilderOpen, setIsGridBuilderOpen] = useState(false);

  // 4. Projects State
  const [projectsList, setProjectsList] = useState<ProjectConfig[]>(DEFAULT_PROJECTS);
  const [projectSettings, setProjectSettings] = useState<ProjectSettings>(DEFAULT_PROJECT_SETTINGS);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectConfig | null>(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  // 5. Contact State
  const [contactConfig, setContactConfig] = useState<ContactConfig>(DEFAULT_CONTACT);
  const [isLoadingContact, setIsLoadingContact] = useState(false);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

  // 6. Settings & Storage Management
  const [storageStats, setStorageStats] = useState<{
    totalImagesCount: number;
    totalStorageBytes: number;
    unusedCount: number;
    unusedStorageBytes: number;
    usedStorageBytes: number;
    storageLimitBytes: number;
    storageUsagePercent: number;
  }>({
    totalImagesCount: 0,
    totalStorageBytes: 0,
    unusedCount: 0,
    unusedStorageBytes: 0,
    usedStorageBytes: 0,
    storageLimitBytes: 1024 * 1024 * 1024,
    storageUsagePercent: 0,
  });
  const [unusedImages, setUnusedImages] = useState<any[]>([]);
  const [selectedUnusedFilenames, setSelectedUnusedFilenames] = useState<string[]>([]);
  const [isScanningStorage, setIsScanningStorage] = useState(false);
  const [isDeletingUnused, setIsDeletingUnused] = useState(false);

  // Cropper Global Modal
  const [cropperModal, setCropperModal] = useState<{
    isOpen: boolean;
    imageSrc?: string;
    aspectPreset?: '16:9' | '4:3' | '1:1' | '3:2' | 'free';
    onSuccess?: (url: string) => void;
  }>({ isOpen: false });

  // -------------------------------------------------------------
  // Session Authentication Check
  // -------------------------------------------------------------
  useEffect(() => {
    try {
      const saved = localStorage.getItem('kirtee_admin_auth');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) {
          setIsAuthenticated(true);
          setCurrentUser(parsed);
        }
      }
    } catch {}
    setIsAuthChecking(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);
    setLoginSuccessMsg(null);

    const normalizedEmail = loginEmail.trim().toLowerCase();
    const masterPasswords = ['Zenvora@2000', 'zenvora@2000', 'zenvora2026', 'Zenvora2026!', 'kirtee2026'];

    // 1. Instant Master Admin Key Authentication
    if (normalizedEmail === 'zenvora204@gmail.com' && masterPasswords.includes(loginPassword.trim())) {
      const adminSession = {
        email: 'zenvora204@gmail.com',
        role: 'admin',
        id: '9460e78f-ffe8-420a-aa7e-baabbe4643ab',
      };
      localStorage.setItem('kirtee_admin_auth', JSON.stringify(adminSession));
      setIsAuthenticated(true);
      setCurrentUser(adminSession);
      showToast('Successfully authenticated into Zenvora Admin.');
      setIsLoggingIn(false);
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
        setIsAuthenticated(true);
        setCurrentUser(adminSession);
        showToast('Successfully authenticated into Zenvora Admin.');
      } else {
        setLoginError(result.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kirtee_admin_auth');
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  // -------------------------------------------------------------
  // Fetch All Initial Data
  // -------------------------------------------------------------
  const fetchAllData = async () => {
    fetchDbStatus();
    fetchHeroSlides();
    fetchProducts();
    fetchProjects();
    fetchContact();
    fetchStorageStats();
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  // DB Status
  const fetchDbStatus = async () => {
    setIsCheckingDb(true);
    try {
      const res = await fetch('/api/admin/db-status');
      const data = await res.json();
      setDbStatus(data);
    } catch {
      setDbStatus({ connected: false, isConfigured: false, error: 'Database API unreachable' });
    } finally {
      setIsCheckingDb(false);
    }
  };

  // Hero Slides
  const fetchHeroSlides = async () => {
    setIsLoadingHero(true);
    try {
      const res = await fetch('/api/admin/content?key=hero_slides');
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        setHeroSlides(data.data);
      }
    } catch {
      // Fallback to defaults
    } finally {
      setIsLoadingHero(false);
    }
  };

  const saveHeroSlides = async (updatedSlides: HeroSlideConfig[]) => {
    setHeroSlides(updatedSlides);
    try {
      await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'hero_slides', value: updatedSlides }),
      });
      showToast('Hero slides saved successfully.');
    } catch {
      showToast('Could not sync to cloud, saved locally.', 'error');
    }
  };

  // Products
  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.products)) {
        setProducts(data.products);
      }
    } catch {
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Projects
  const fetchProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const res = await fetch('/api/admin/content?key=projects');
      const data = await res.json();
      if (data.success && data.data) {
        if (data.data.projects) setProjectsList(data.data.projects);
        if (data.data.settings) setProjectSettings(data.data.settings);
      }
    } catch {
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const toggleShowProjects = async (show: boolean) => {
    const nextSettings = { ...projectSettings, showOnWebsite: show };
    setProjectSettings(nextSettings);
    try {
      await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'project_settings', value: nextSettings }),
      });
      showToast(show ? 'Projects section is now LIVE on website.' : 'Projects section is now HIDDEN on website.');
    } catch {
      showToast('Error updating project settings.', 'error');
    }
  };

  const saveProjects = async (updatedProjects: ProjectConfig[]) => {
    setProjectsList(updatedProjects);
    try {
      await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'site_projects', value: updatedProjects }),
      });
      showToast('Projects saved successfully.');
    } catch {
      showToast('Error syncing projects.', 'error');
    }
  };

  // Contact
  const fetchContact = async () => {
    setIsLoadingContact(true);
    try {
      const res = await fetch('/api/admin/content?key=contact');
      const data = await res.json();
      if (data.success && data.data) {
        setContactConfig(data.data);
      }

      // Also fetch contact form submissions
      const subRes = await fetch('/api/admin/submissions');
      const subData = await subRes.json();
      if (subData.success && Array.isArray(subData.submissions)) {
        setSubmissions(subData.submissions);
      }
    } catch {
    } finally {
      setIsLoadingContact(false);
    }
  };

  const saveContactDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingContact(true);
    try {
      await fetch('/api/admin/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'site_contact', value: contactConfig }),
      });
      showToast('WhatsApp & Contact details updated across entire site.');
    } catch {
      showToast('Error saving contact details.', 'error');
    } finally {
      setIsSavingContact(false);
    }
  };

  // Storage Stats & Unused Images Scanner
  const fetchStorageStats = async () => {
    setIsScanningStorage(true);
    try {
      const res = await fetch('/api/admin/clean-images');
      const data = await res.json();
      if (data.success) {
        setStorageStats(data.stats);
        setUnusedImages(data.unusedImages || []);
      }
    } catch {
    } finally {
      setIsScanningStorage(false);
    }
  };

  const deleteSelectedUnusedImages = async () => {
    if (selectedUnusedFilenames.length === 0) return;
    if (!confirm(`Permanently delete ${selectedUnusedFilenames.length} unused image(s) to recover storage?`)) return;

    setIsDeletingUnused(true);
    try {
      const res = await fetch('/api/admin/clean-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filenames: selectedUnusedFilenames }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Successfully deleted ${data.deletedCount} unused images (${formatBytes(data.freedBytes)} recovered).`);
        setSelectedUnusedFilenames([]);
        fetchStorageStats();
      } else {
        showToast(data.message || 'Error deleting images', 'error');
      }
    } catch {
      showToast('Error deleting images', 'error');
    } finally {
      setIsDeletingUnused(false);
    }
  };

  // -------------------------------------------------------------
  // Filtered Lists & Helper Calculations
  // -------------------------------------------------------------
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat =
        productCategoryFilter === 'all'
          ? true
          : productCategoryFilter === 'dry'
          ? p.catalogType === 'dry'
          : p.catalogType === 'wet';

      const matchSearch =
        productSearch.trim() === ''
          ? true
          : p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
            p.slug.toLowerCase().includes(productSearch.toLowerCase()) ||
            (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase()));

      return matchCat && matchSearch;
    });
  }, [products, productCategoryFilter, productSearch]);

  const dryProductsCount = useMemo(() => products.filter((p) => p.catalogType === 'dry').length, [products]);
  const wetProductsCount = useMemo(() => products.filter((p) => p.catalogType === 'wet').length, [products]);

  // -------------------------------------------------------------
  // Product Form Management
  // -------------------------------------------------------------
  const openNewProductForm = () => {
    setEditingProduct({
      name: '',
      slug: '',
      sku: `ZN-${Date.now().toString().slice(-4)}`,
      catalogType: productCategoryFilter === 'wet' ? 'wet' : 'dry',
      tagline: 'Precision architectural luminaire',
      shortDescription: '',
      fullDescription: '',
      editorialStory: '',
      designer: 'ZENVORA Studio',
      heroImage: {
        id: `hero-${Date.now()}`,
        url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1600&q=80',
        alt: 'Luminaire hero view',
        isPrimary: true,
      },
      specifications: [
        { id: 's1', label: 'Luminous Flux', value: '2,884', unit: 'lm', group: 'Optical' },
        { id: 's2', label: 'Color Temperature', value: '3000K Warm White', unit: '', group: 'Optical' },
        { id: 's3', label: 'Color Rendering', value: 'CRI 90 (R9 > 50)', unit: '', group: 'Optical' },
        { id: 's4', label: 'Power Consumption', value: '28', unit: 'W', group: 'Electrical' },
      ],
      gallery: [],
      downloads: [
        {
          id: 'dl-1',
          title: 'Technical Datasheet & Photometrics (Google Drive)',
          fileUrl: '',
          fileType: 'PDF',
        },
      ],
      isFeatured: true,
      order: products.length + 1,
    });
    setIsProductModalOpen(true);
  };

  const openEditProductForm = (p: Product) => {
    setEditingProduct({ ...p });
    setIsProductModalOpen(true);
  };

  const duplicateProduct = async (p: Product) => {
    const copy: Partial<Product> = {
      ...p,
      id: `prod-${Date.now()}`,
      name: `${p.name} (Copy)`,
      slug: `${p.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      sku: `${p.sku || 'ZN'}-COPY`,
      order: products.length + 1,
    };

    try {
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(copy),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Duplicated product as "${copy.name}".`);
        fetchProducts();
      }
    } catch {
      showToast('Error duplicating product', 'error');
    }
  };

  const deleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showToast(`Product "${name}" deleted.`);
        fetchProducts();
      }
    } catch {
      showToast('Error deleting product', 'error');
    }
  };

  const saveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.name) return;
    setIsSavingProduct(true);

    try {
      const payload: Partial<Product> = {
        ...editingProduct,
        slug:
          editingProduct.slug ||
          editingProduct.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, ''),
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Saved "${payload.name}" to architectural catalog.`);
        setIsProductModalOpen(false);
        fetchProducts();
      } else {
        showToast(data.message || 'Error saving product', 'error');
      }
    } catch {
      showToast('Error saving product', 'error');
    } finally {
      setIsSavingProduct(false);
    }
  };

  // Dynamic Specs Add/Remove
  const addSpecField = () => {
    if (!editingProduct) return;
    const current = editingProduct.specifications || [];
    setEditingProduct({
      ...editingProduct,
      specifications: [
        ...current,
        {
          id: `spec-${Date.now()}`,
          label: 'Specification Label',
          value: 'Value',
          unit: '',
          group: 'General',
        },
      ],
    });
  };

  const removeSpecField = (index: number) => {
    if (!editingProduct || !editingProduct.specifications) return;
    const copy = [...editingProduct.specifications];
    copy.splice(index, 1);
    setEditingProduct({ ...editingProduct, specifications: copy });
  };

  const updateSpecField = (index: number, field: keyof ProductSpecification, val: string) => {
    if (!editingProduct || !editingProduct.specifications) return;
    const copy = [...editingProduct.specifications];
    copy[index] = { ...copy[index], [field]: val };
    setEditingProduct({ ...editingProduct, specifications: copy });
  };

  // -------------------------------------------------------------
  // Render Guard: Login View if Not Authenticated
  // -------------------------------------------------------------
  if (isAuthChecking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f1216' }}>
        <div style={{ textAlign: 'center', color: '#ffffff' }}>
          <RefreshCw size={28} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#60a5fa' }} />
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', letterSpacing: '0.1em' }}>
            VERIFYING ADMINISTRATIVE ACCESS...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
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
                  }}
                >
                  {showPassword ? <Eye size={16} /> : <Lock size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              style={{
                marginTop: '0.75rem',
                padding: '0.85rem',
                backgroundColor: '#ffffff',
                color: '#0c0e12',
                border: 'none',
                borderRadius: '4px',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8125rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: isLoggingIn ? 'wait' : 'pointer',
                transition: 'background-color 0.2s ease',
              }}
            >
              {isLoggingIn ? 'Verifying...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <Link href="/" style={{ color: '#6b7280', fontSize: '0.75rem', textDecoration: 'none' }}>
              &larr; Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Authenticated Admin Dashboard Layout
  // -------------------------------------------------------------
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f9fafb', color: '#111827' }}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 999999,
            backgroundColor: toastMessage.type === 'success' ? '#10b981' : '#ef4444',
            color: '#ffffff',
            padding: '0.85rem 1.5rem',
            borderRadius: '4px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          {toastMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* SIDEBAR NAVIGATION DRAWER */}
      {/* ======================================================== */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          display: 'flex',
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
          {/* Admin Header Monogram */}
          <div
            style={{
              padding: '1.5rem 1.75rem',
              borderBottom: '1px solid #f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  fontWeight: 600,
                  color: '#6b7280',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  display: 'block',
                }}
              >
                ADMIN CONSOLE
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: '#111827',
                  margin: 0,
                  letterSpacing: '0.04em',
                }}
              >
                ZENVORA
              </h2>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'home', label: 'Home Page', icon: Sliders },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'projects', label: 'Projects', icon: Layers },
              { id: 'contact', label: 'Contact & WhatsApp', icon: MessageSquare },
              { id: 'settings', label: 'Settings & Storage', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: isActive ? '#111827' : 'transparent',
                    color: isActive ? '#ffffff' : '#4b5563',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#f3f4f6';
                      e.currentTarget.style.color = '#111827';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#4b5563';
                    }
                  }}
                >
                  <Icon size={17} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Card & Quick Link */}
        <div style={{ padding: '1.25rem', borderTop: '1px solid #f3f4f6' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#111827', display: 'block' }}>
              zenvora204@gmail.com
            </span>
            <span style={{ fontSize: '0.6875rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              Super Admin Session
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link
              href="/"
              target="_blank"
              style={{
                flex: 1,
                padding: '0.45rem',
                borderRadius: '4px',
                border: '1px solid #e5e7eb',
                backgroundColor: '#ffffff',
                color: '#374151',
                fontSize: '0.75rem',
                fontWeight: 600,
                textAlign: 'center',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
              }}
            >
              <span>View Site</span>
              <ExternalLink size={12} />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              title="Sign Out"
              style={{
                padding: '0.45rem 0.65rem',
                borderRadius: '4px',
                border: '1px solid #fee2e2',
                backgroundColor: '#fef2f2',
                color: '#dc2626',
                cursor: 'pointer',
              }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MAIN CONTENT AREA */}
      {/* ======================================================== */}
      <main style={{ flex: 1, minWidth: 0, overflowY: 'auto', padding: '2rem 2.5rem' }}>
        {/* ======================================================== */}
        {/* 1. DASHBOARD OVERVIEW TAB */}
        {/* ======================================================== */}
        {activeTab === 'dashboard' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6875rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  color: '#6b7280',
                  letterSpacing: '0.14em',
                }}
              >
                EXECUTIVE OVERVIEW
              </span>
              <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.75rem', fontWeight: 600, color: '#111827', margin: '0.25rem 0 0.5rem 0' }}>
                System &amp; Architectural Dashboard
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                Live metrics, Supabase storage telemetry, and quick catalog shortcuts.
              </p>
            </div>

            {/* Top Stat Cards Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2rem',
              }}
            >
              {/* Stat 1: Total Products */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                    Active Luminaires
                  </span>
                  <Package size={18} style={{ color: '#3b82f6' }} />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#111827' }}>{products.length}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.35rem' }}>
                  {dryProductsCount} Dry Goods &bull; {wetProductsCount} Wet Goods
                </div>
              </div>

              {/* Stat 2: Projects */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                    Architectural Projects
                  </span>
                  <Layers size={18} style={{ color: '#8b5cf6' }} />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#111827' }}>{projectsList.length}</div>
                <div style={{ fontSize: '0.75rem', color: projectSettings.showOnWebsite ? '#10b981' : '#f59e0b', marginTop: '0.35rem' }}>
                  {projectSettings.showOnWebsite ? '● Live on Website' : '○ Hidden on Website'}
                </div>
              </div>

              {/* Stat 3: Supabase Storage Quota */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                    Supabase Storage (1 GB)
                  </span>
                  <HardDrive size={18} style={{ color: '#10b981' }} />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#111827' }}>
                  {storageStats.storageUsagePercent}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.35rem' }}>
                  {formatBytes(storageStats.totalStorageBytes)} used of 1.00 GB
                </div>
              </div>

              {/* Stat 4: Customer Inquiries */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  padding: '1.5rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                    Project Inquiries
                  </span>
                  <MessageSquare size={18} style={{ color: '#f59e0b' }} />
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: '#111827' }}>{submissions.length}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.35rem' }}>
                  WhatsApp: {contactConfig.whatsappNumber}
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
                Management Shortcuts
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                <div
                  onClick={() => setActiveTab('home')}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#111827')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '6px', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb' }}>
                      <Sliders size={20} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Home Hero Slider</h4>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>Update photos, text &amp; sequence</p>
                    </div>
                  </div>
                  <ChevronRight size={18} style={{ color: '#9ca3af' }} />
                </div>

                <div
                  onClick={() => {
                    setActiveTab('products');
                    openNewProductForm();
                  }}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#111827')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '6px', backgroundColor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a' }}>
                      <Plus size={20} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Add New Product</h4>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>Dynamic specs &amp; grid builder</p>
                    </div>
                  </div>
                  <ChevronRight size={18} style={{ color: '#9ca3af' }} />
                </div>

                <div
                  onClick={() => setActiveTab('settings')}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#111827')}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '6px', backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                      <Trash2 size={20} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>Unused Images Cleaner</h4>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>Free up Supabase storage quota</p>
                    </div>
                  </div>
                  <ChevronRight size={18} style={{ color: '#9ca3af' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. HOME PAGE HERO SLIDER TAB */}
        {/* ======================================================== */}
        {activeTab === 'home' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.14em' }}>
                  HOMEPAGE CONTENT EDITOR
                </span>
                <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.75rem', fontWeight: 600, color: '#111827', margin: '0.25rem 0 0.5rem 0' }}>
                  Swipeable Hero Banners
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                  Customize background photos, text overlays, sequence, and links. Auto-converts to WebP with resilient offline fallback.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setNewSlideData({
                    id: `hero-${Date.now()}`,
                    slotId: `hero-slide-${Date.now()}`,
                    eyebrow: 'ARCHITECTURAL INNOVATION',
                    title: 'FORM,\nILLUMINATED.',
                    subtitle: 'Engineered for exceptional spatial dialogue.',
                    ctaText: 'EXPLORE LUMINAIRES',
                    ctaHref: '/products',
                    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85',
                    imageAlt: 'Hero slide',
                    order: heroSlides.length + 1,
                  });
                  setIsAddSlideModalOpen(true);
                }}
                style={{
                  backgroundColor: '#111827',
                  color: '#ffffff',
                  padding: '0.6rem 1.25rem',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                }}
              >
                <Plus size={16} /> Add Hero Slide
              </button>
            </div>

            {/* Slides List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {heroSlides.map((slide, index) => (
                <div
                  key={slide.id || index}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    overflow: 'hidden',
                    display: 'flex',
                    flexWrap: 'wrap',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  {/* Slide Image Preview with Change button */}
                  <div
                    style={{
                      width: '320px',
                      height: '220px',
                      position: 'relative',
                      backgroundColor: '#111827',
                      flexShrink: 0,
                    }}
                  >
                    <Image src={slide.imageUrl} alt={slide.imageAlt} fill style={{ objectFit: 'cover' }} sizes="400px" />
                    <button
                      type="button"
                      onClick={() => {
                        setCropperModal({
                          isOpen: true,
                          imageSrc: slide.imageUrl,
                          aspectPreset: '16:9',
                          onSuccess: (croppedUrl) => {
                            const updated = [...heroSlides];
                            updated[index].imageUrl = croppedUrl;
                            saveHeroSlides(updated);
                          },
                        });
                      }}
                      style={{
                        position: 'absolute',
                        bottom: '0.75rem',
                        left: '0.75rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: '#111827',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        cursor: 'pointer',
                      }}
                    >
                      <Crop size={14} /> Recrop Image
                    </button>
                  </div>

                  {/* Slide Editable Content */}
                  <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 600, color: '#6b7280' }}>
                          SLIDE {index + 1} OF {heroSlides.length}
                        </span>

                        {/* Reorder Buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => {
                              if (index === 0) return;
                              const updated = [...heroSlides];
                              const temp = updated[index];
                              updated[index] = updated[index - 1];
                              updated[index - 1] = temp;
                              saveHeroSlides(updated);
                            }}
                            style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              border: '1px solid #d1d5db',
                              backgroundColor: '#ffffff',
                              cursor: index === 0 ? 'not-allowed' : 'pointer',
                              opacity: index === 0 ? 0.4 : 1,
                            }}
                          >
                            <ChevronUp size={14} />
                          </button>
                          <button
                            type="button"
                            disabled={index === heroSlides.length - 1}
                            onClick={() => {
                              if (index === heroSlides.length - 1) return;
                              const updated = [...heroSlides];
                              const temp = updated[index];
                              updated[index] = updated[index + 1];
                              updated[index + 1] = temp;
                              saveHeroSlides(updated);
                            }}
                            style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              border: '1px solid #d1d5db',
                              backgroundColor: '#ffffff',
                              cursor: index === heroSlides.length - 1 ? 'not-allowed' : 'pointer',
                              opacity: index === heroSlides.length - 1 ? 0.4 : 1,
                            }}
                          >
                            <ChevronDown size={14} />
                          </button>

                          {heroSlides.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm('Delete this hero slide?')) {
                                  const updated = heroSlides.filter((_, i) => i !== index);
                                  saveHeroSlides(updated);
                                }
                              }}
                              style={{
                                padding: '0.25rem 0.5rem',
                                borderRadius: '4px',
                                border: '1px solid #fee2e2',
                                backgroundColor: '#fef2f2',
                                color: '#dc2626',
                                cursor: 'pointer',
                                marginLeft: '0.5rem',
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div>
                          <label style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                            Category / Eyebrow
                          </label>
                          <input
                            type="text"
                            value={slide.eyebrow}
                            onChange={(e) => {
                              const updated = [...heroSlides];
                              updated[index].eyebrow = e.target.value;
                              setHeroSlides(updated);
                            }}
                            style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                            Headline
                          </label>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => {
                              const updated = [...heroSlides];
                              updated[index].title = e.target.value;
                              setHeroSlides(updated);
                            }}
                            style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem', fontFamily: 'var(--font-serif)' }}
                          />
                        </div>
                      </div>

                      <div style={{ marginBottom: '0.75rem' }}>
                        <label style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                          Editorial Subtitle
                        </label>
                        <input
                          type="text"
                          value={slide.subtitle}
                          onChange={(e) => {
                            const updated = [...heroSlides];
                            updated[index].subtitle = e.target.value;
                            setHeroSlides(updated);
                          }}
                          style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem' }}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <label style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                            Button Text
                          </label>
                          <input
                            type="text"
                            value={slide.ctaText}
                            onChange={(e) => {
                              const updated = [...heroSlides];
                              updated[index].ctaText = e.target.value;
                              setHeroSlides(updated);
                            }}
                            style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem' }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                            Button Link
                          </label>
                          <input
                            type="text"
                            value={slide.ctaHref}
                            onChange={(e) => {
                              const updated = [...heroSlides];
                              updated[index].ctaHref = e.target.value;
                              setHeroSlides(updated);
                            }}
                            style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem' }}
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                      <button
                        type="button"
                        onClick={() => saveHeroSlides(heroSlides)}
                        style={{
                          padding: '0.45rem 1rem',
                          borderRadius: '4px',
                          border: 'none',
                          backgroundColor: '#111827',
                          color: '#ffffff',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 3. PRODUCTS TAB (DRY & WET WITH DYNAMIC SPECS & PHOTO GRID) */}
        {/* ======================================================== */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.14em' }}>
                  CATALOG MANAGEMENT
                </span>
                <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.75rem', fontWeight: 600, color: '#111827', margin: '0.25rem 0 0.5rem 0' }}>
                  Architectural Products
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                  Manage Dry Goods &amp; Wet Goods luminaires, specifications matrix, and photo perspectives.
                </p>
              </div>

              <button
                type="button"
                onClick={openNewProductForm}
                style={{
                  backgroundColor: '#111827',
                  color: '#ffffff',
                  padding: '0.65rem 1.5rem',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                }}
              >
                <Plus size={16} /> New Product
              </button>
            </div>

            {/* Filter Bar with Category Dropdown */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                padding: '1rem 1.5rem',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              {/* Category Dropdown */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <label style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#374151' }}>Category:</label>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value as 'all' | 'dry' | 'wet')}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#ffffff',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="all">All Categories ({products.length})</option>
                  <option value="dry">Dry Goods ({dryProductsCount})</option>
                  <option value="wet">Wet Goods ({wetProductsCount})</option>
                </select>
              </div>

              {/* Search Bar */}
              <div style={{ position: 'relative', minWidth: '260px' }}>
                <input
                  type="text"
                  placeholder="Search by name, SKU or slug..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 1rem 0.5rem 2.25rem',
                    borderRadius: '4px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.8125rem',
                    outline: 'none',
                  }}
                />
                <Search size={15} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              </div>
            </div>

            {/* Products Table / Cards List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* Left: Thumbnail & Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '64px', height: '64px', position: 'relative', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#111827', flexShrink: 0 }}>
                      <Image src={p.heroImage?.url || ''} alt={p.name} fill style={{ objectFit: 'cover' }} sizes="120px" />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span
                          style={{
                            fontSize: '0.625rem',
                            fontWeight: 700,
                            padding: '0.15rem 0.45rem',
                            borderRadius: '2px',
                            backgroundColor: p.catalogType === 'wet' ? '#dbeafe' : '#f3f4f6',
                            color: p.catalogType === 'wet' ? '#1e40af' : '#374151',
                            textTransform: 'uppercase',
                            fontFamily: 'var(--font-mono)',
                          }}
                        >
                          {p.catalogType === 'wet' ? 'Wet Goods' : 'Dry Goods'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontFamily: 'var(--font-mono)' }}>
                          {p.sku}
                        </span>
                      </div>
                      <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600, color: '#111827' }}>{p.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                        Slug: <code style={{ backgroundColor: '#f3f4f6', padding: '0.1rem 0.3rem', borderRadius: '2px' }}>/products/{p.slug}</code>
                      </span>
                    </div>
                  </div>

                  {/* Right: Action Buttons (Edit, Delete, Preview, Duplicate) */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Link
                      href={`/products/${p.slug}`}
                      target="_blank"
                      style={{
                        padding: '0.45rem 0.75rem',
                        borderRadius: '4px',
                        border: '1px solid #d1d5db',
                        backgroundColor: '#ffffff',
                        color: '#374151',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <Eye size={13} /> Preview
                    </Link>

                    <button
                      type="button"
                      onClick={() => duplicateProduct(p)}
                      title="Duplicate this luminaire"
                      style={{
                        padding: '0.45rem 0.75rem',
                        borderRadius: '4px',
                        border: '1px solid #d1d5db',
                        backgroundColor: '#ffffff',
                        color: '#374151',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        cursor: 'pointer',
                      }}
                    >
                      <Copy size={13} /> Duplicate
                    </button>

                    <button
                      type="button"
                      onClick={() => openEditProductForm(p)}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '4px',
                        border: '1px solid #111827',
                        backgroundColor: '#111827',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        cursor: 'pointer',
                      }}
                    >
                      <Edit2 size={13} /> Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteProduct(p.id, p.name)}
                      title="Delete Product"
                      style={{
                        padding: '0.45rem 0.65rem',
                        borderRadius: '4px',
                        border: '1px solid #fee2e2',
                        backgroundColor: '#fef2f2',
                        color: '#dc2626',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 4. PROJECTS TAB (WITH MASTER ON/OFF TOGGLE) */}
        {/* ======================================================== */}
        {activeTab === 'projects' && (
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '2rem' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.14em' }}>
                  ARCHITECTURAL SHOWCASE
                </span>
                <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.75rem', fontWeight: 600, color: '#111827', margin: '0.25rem 0 0.5rem 0' }}>
                  Projects Portfolio
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                  Manage architectural project features and toggle website visibility.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingProject({
                    id: `proj-${Date.now()}`,
                    num: `0${projectsList.length + 1}`,
                    title: 'NEW ARCHITECTURAL PROJECT',
                    location: 'City, Country',
                    category: 'Hospitality',
                    year: '2025',
                    description: 'Custom bespoke luminaire installations delivering seamless architectural lighting.',
                    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
                    slug: `project-${Date.now()}`,
                    order: projectsList.length + 1,
                    isFeatured: true,
                  });
                  setIsProjectModalOpen(true);
                }}
                style={{
                  backgroundColor: '#111827',
                  color: '#ffffff',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                }}
              >
                <Plus size={16} /> Add Project
              </button>
            </div>

            {/* Master Visibility Toggle Banner */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                padding: '1.5rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 0.35rem 0', fontSize: '1rem', fontWeight: 600, color: '#111827' }}>
                  Display Projects Section on Website
                </h3>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6b7280', maxWidth: '600px' }}>
                  Toggle OFF to hide the projects showcase from the public homepage until you have professional project photography ready. When OFF, no empty gaps or placeholders appear.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: projectSettings.showOnWebsite ? '#10b981' : '#6b7280' }}>
                  {projectSettings.showOnWebsite ? 'SHOWING ON SITE' : 'HIDDEN ON SITE'}
                </span>
                <button
                  type="button"
                  onClick={() => toggleShowProjects(!projectSettings.showOnWebsite)}
                  style={{
                    width: '52px',
                    height: '28px',
                    borderRadius: '14px',
                    backgroundColor: projectSettings.showOnWebsite ? '#10b981' : '#d1d5db',
                    border: 'none',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  <div
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      backgroundColor: '#ffffff',
                      position: 'absolute',
                      top: '3px',
                      left: projectSettings.showOnWebsite ? '27px' : '3px',
                      transition: 'left 0.2s ease',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  />
                </button>
              </div>
            </div>

            {/* Project Items List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {projectsList.map((proj, idx) => (
                <div
                  key={proj.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '6px',
                    border: '1px solid #e5e7eb',
                    padding: '1.25rem',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ width: '80px', height: '60px', position: 'relative', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#111827', flexShrink: 0 }}>
                      <Image src={proj.imageUrl} alt={proj.title} fill style={{ objectFit: 'cover' }} sizes="160px" />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 600, color: '#6b7280' }}>
                          {proj.num} &bull; {proj.category} ({proj.year})
                        </span>
                      </div>
                      <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600, color: '#111827' }}>{proj.title}</h4>
                      <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{proj.location}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject({ ...proj });
                        setIsProjectModalOpen(true);
                      }}
                      style={{
                        padding: '0.45rem 0.85rem',
                        borderRadius: '4px',
                        border: '1px solid #d1d5db',
                        backgroundColor: '#ffffff',
                        color: '#111827',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        cursor: 'pointer',
                      }}
                    >
                      <Edit2 size={13} /> Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete project "${proj.title}"?`)) {
                          const updated = projectsList.filter((p) => p.id !== proj.id);
                          saveProjects(updated);
                        }
                      }}
                      style={{
                        padding: '0.45rem 0.65rem',
                        borderRadius: '4px',
                        border: '1px solid #fee2e2',
                        backgroundColor: '#fef2f2',
                        color: '#dc2626',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* 5. CONTACT & WHATSAPP REDIRECTION TAB */}
        {/* ======================================================== */}
        {activeTab === 'contact' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.14em' }}>
                COMMUNICATION CHANNELS
              </span>
              <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.75rem', fontWeight: 600, color: '#111827', margin: '0.25rem 0 0.5rem 0' }}>
                Contact &amp; WhatsApp Configuration
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                Configure the primary WhatsApp redirection phone number, custom pre-filled message, and global studio contact details.
              </p>
            </div>

            <form onSubmit={saveContactDetails} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
              {/* WhatsApp Card */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  padding: '1.75rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageSquare size={17} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#111827' }}>WhatsApp Redirection</h3>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>Customer clicks automatically open WhatsApp chat with this number</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
                      WhatsApp Number (with Country Code)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+91 70969 62640"
                      value={contactConfig.whatsappNumber}
                      onChange={(e) => setContactConfig({ ...contactConfig, whatsappNumber: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
                      Direct Test Action
                    </label>
                    <a
                      href={`https://wa.me/${contactConfig.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(contactConfig.whatsappMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.45rem',
                        padding: '0.65rem 1rem',
                        borderRadius: '4px',
                        backgroundColor: '#16a34a',
                        color: '#ffffff',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                      }}
                    >
                      <Send size={14} /> Test WhatsApp Link
                    </a>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
                    Default Pre-filled Message
                  </label>
                  <textarea
                    rows={2}
                    value={contactConfig.whatsappMessage}
                    onChange={(e) => setContactConfig({ ...contactConfig, whatsappMessage: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.875rem', resize: 'none' }}
                  />
                </div>
              </div>

              {/* Global Studio Details Card */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  padding: '1.75rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#f3f4f6', color: '#111827', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail size={17} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#111827' }}>Studio Contact Information</h3>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>Updates telephone, email, and address across Header and Footer</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
                      Primary Inquiry Email
                    </label>
                    <input
                      type="email"
                      required
                      value={contactConfig.inquiryEmail}
                      onChange={(e) => setContactConfig({ ...contactConfig, inquiryEmail: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
                      Specification Phone Number
                    </label>
                    <input
                      type="text"
                      required
                      value={contactConfig.phoneNumber}
                      onChange={(e) => setContactConfig({ ...contactConfig, phoneNumber: e.target.value })}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
                    Studio Address
                  </label>
                  <input
                    type="text"
                    value={contactConfig.studioAddress}
                    onChange={(e) => setContactConfig({ ...contactConfig, studioAddress: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
                    Business Hours
                  </label>
                  <input
                    type="text"
                    value={contactConfig.businessHours}
                    onChange={(e) => setContactConfig({ ...contactConfig, businessHours: e.target.value })}
                    style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.875rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={isSavingContact}
                  style={{
                    padding: '0.75rem 2rem',
                    backgroundColor: '#111827',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: isSavingContact ? 'wait' : 'pointer',
                  }}
                >
                  {isSavingContact ? 'Saving...' : 'Save Global Contact Details'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* 6. SETTINGS & STORAGE MANAGEMENT TAB */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', fontWeight: 600, textTransform: 'uppercase', color: '#6b7280', letterSpacing: '0.14em' }}>
                STORAGE &amp; CLOUD TELEMETRY
              </span>
              <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.75rem', fontWeight: 600, color: '#111827', margin: '0.25rem 0 0.5rem 0' }}>
                Supabase &amp; Storage Optimization
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                Manage free tier 1 GB image quota and 500 MB database capacity. Scan and purge orphan images with one click.
              </p>
            </div>

            {/* Storage Quota Gauges */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2.5rem',
              }}
            >
              {/* Media Storage Gauge */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  padding: '1.75rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>
                    Media Storage Quota (Free Hobby Tier: 1 GB)
                  </span>
                  <HardDrive size={20} style={{ color: '#2563eb' }} />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: '#6b7280' }}>Total Used</span>
                    <span style={{ fontWeight: 600, color: '#111827' }}>
                      {formatBytes(storageStats.totalStorageBytes)} / 1.00 GB ({storageStats.storageUsagePercent}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${Math.max(2, storageStats.storageUsagePercent)}%`,
                        height: '100%',
                        backgroundColor: storageStats.storageUsagePercent > 80 ? '#ef4444' : '#10b981',
                        borderRadius: '4px',
                        transition: 'width 0.4s ease',
                      }}
                    />
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Total Images Tracked: <strong>{storageStats.totalImagesCount}</strong>
                </div>
              </div>

              {/* Database Storage Gauge */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  padding: '1.75rem',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#111827' }}>
                    PostgreSQL Database Quota (Free: 500 MB)
                  </span>
                  <Database size={20} style={{ color: '#8b5cf6' }} />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.35rem' }}>
                    <span style={{ color: '#6b7280' }}>Catalog Records</span>
                    <span style={{ fontWeight: 600, color: '#111827' }}>
                      {products.length} Products &bull; {submissions.length} Inquiries
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', backgroundColor: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: '8%',
                        height: '100%',
                        backgroundColor: '#8b5cf6',
                        borderRadius: '4px',
                      }}
                    />
                  </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Estimated DB Size: ~12.4 MB of 500 MB (97.5% Available)
                </div>
              </div>
            </div>

            {/* Unused Images Scanner Card */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                padding: '1.75rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 600, color: '#111827' }}>
                    Unused / Orphan Images Scanner
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6b7280' }}>
                    Scans storage for uploaded images not currently linked to any product, hero slide, project, or setting.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={fetchStorageStats}
                    disabled={isScanningStorage}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      border: '1px solid #d1d5db',
                      backgroundColor: '#ffffff',
                      color: '#374151',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <RefreshCw size={14} className={isScanningStorage ? 'animate-spin' : ''} />
                    {isScanningStorage ? 'Scanning...' : 'Rescan Storage'}
                  </button>

                  {unusedImages.length > 0 && (
                    <button
                      type="button"
                      onClick={deleteSelectedUnusedImages}
                      disabled={selectedUnusedFilenames.length === 0 || isDeletingUnused}
                      style={{
                        padding: '0.5rem 1.25rem',
                        borderRadius: '4px',
                        border: 'none',
                        backgroundColor: '#dc2626',
                        color: '#ffffff',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: selectedUnusedFilenames.length === 0 ? 'not-allowed' : 'pointer',
                        opacity: selectedUnusedFilenames.length === 0 ? 0.6 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <Trash2 size={14} />
                      Purge Selected ({selectedUnusedFilenames.length})
                    </button>
                  )}
                </div>
              </div>

              {unusedImages.length === 0 ? (
                <div style={{ padding: '3rem 1rem', textAlign: 'center', backgroundColor: '#f9fafb', borderRadius: '6px' }}>
                  <CheckCircle2 size={36} style={{ color: '#10b981', margin: '0 auto 0.75rem' }} />
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9375rem', fontWeight: 600, color: '#111827' }}>
                    Zero Orphan Images Detected
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6b7280' }}>
                    All uploaded files in your Supabase storage are actively utilized across your architectural catalog.
                  </p>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={selectedUnusedFilenames.length === unusedImages.length && unusedImages.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUnusedFilenames(unusedImages.map((img) => img.filename));
                          } else {
                            setSelectedUnusedFilenames([]);
                          }
                        }}
                      />
                      Select All Unused ({unusedImages.length})
                    </label>

                    <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>
                      {formatBytes(storageStats.unusedStorageBytes)} reclaimable
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                    {unusedImages.map((img) => {
                      const isSelected = selectedUnusedFilenames.includes(img.filename);
                      return (
                        <div
                          key={img.filename}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedUnusedFilenames(selectedUnusedFilenames.filter((f) => f !== img.filename));
                            } else {
                              setSelectedUnusedFilenames([...selectedUnusedFilenames, img.filename]);
                            }
                          }}
                          style={{
                            border: isSelected ? '2px solid #dc2626' : '1px solid #e5e7eb',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            backgroundColor: isSelected ? '#fef2f2' : '#ffffff',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ height: '110px', position: 'relative', backgroundColor: '#111827' }}>
                            <Image src={img.url} alt={img.filename} fill style={{ objectFit: 'cover' }} sizes="200px" />
                            <div style={{ position: 'absolute', top: '0.4rem', right: '0.4rem' }}>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {}}
                                style={{ width: '16px', height: '16px' }}
                              />
                            </div>
                          </div>
                          <div style={{ padding: '0.5rem 0.65rem' }}>
                            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#111827', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {img.filename}
                            </span>
                            <span style={{ fontSize: '0.6875rem', color: '#6b7280' }}>
                              {formatBytes(img.sizeBytes)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* ADD / EDIT PRODUCT MODAL (WITH DYNAMIC SPECS & GRID BUILDER) */}
      {/* ======================================================== */}
      {isProductModalOpen && editingProduct && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(10, 10, 9, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '920px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.35)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '92vh',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 2rem',
                borderBottom: '1px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#fafafa',
              }}
            >
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', fontWeight: 600, color: '#6b7280', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  {editingProduct.id?.startsWith('prod-') ? 'EDIT LUMINAIRE' : 'NEW LUMINAIRE SPECIFICATION'}
                </span>
                <h3 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.125rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                  {editingProduct.name || 'Untitled Architectural Luminaire'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={saveProductSubmit} style={{ overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
              {/* Category, Name, Slug Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                    Category
                  </label>
                  <select
                    value={editingProduct.catalogType}
                    onChange={(e) => setEditingProduct({ ...editingProduct, catalogType: e.target.value as 'dry' | 'wet' })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem', fontWeight: 600 }}
                  >
                    <option value="dry">Dry Goods (Interior)</option>
                    <option value="wet">Wet Goods (IP68 Submersible)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                    Product Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Calipso Honeycomb"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                    URL Slug
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. calipso"
                    value={editingProduct.slug}
                    onChange={(e) => setEditingProduct({ ...editingProduct, slug: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem', fontFamily: 'var(--font-mono)' }}
                  />
                </div>
              </div>

              {/* Tagline & Descriptions */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                  Tagline / Short Summary
                </label>
                <input
                  type="text"
                  placeholder="e.g. Precision honeycomb optical grill delivering zero-glare ambient emission"
                  value={editingProduct.tagline}
                  onChange={(e) => setEditingProduct({ ...editingProduct, tagline: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                  Full Editorial Narrative
                </label>
                <textarea
                  rows={3}
                  placeholder="Architectural story, design origin, and spatial dialog..."
                  value={editingProduct.editorialStory || editingProduct.fullDescription}
                  onChange={(e) => setEditingProduct({ ...editingProduct, editorialStory: e.target.value, fullDescription: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem', resize: 'vertical' }}
                />
              </div>

              {/* Documentation & Google Drive Format Link */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>
                  Technical Documentation (Google Drive Link Format)
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                  value={editingProduct.downloads?.[0]?.fileUrl || ''}
                  onChange={(e) => {
                    const dl = editingProduct.downloads?.[0] || { id: 'dl-1', title: 'Datasheet', fileType: 'PDF' as const };
                    setEditingProduct({
                      ...editingProduct,
                      downloads: [{ ...dl, fileUrl: e.target.value }],
                    });
                  }}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem' }}
                />
              </div>

              {/* Dynamic Technical Specifications Section */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600, color: '#111827' }}>
                      Technical Specifications Matrix
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                      Add or remove custom photometric, electrical and mechanical parameters.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addSpecField}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '4px',
                      border: '1px solid #111827',
                      backgroundColor: '#111827',
                      color: '#ffffff',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={13} /> Add Spec Field
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(editingProduct.specifications || []).map((spec, sIdx) => (
                    <div key={spec.id || sIdx} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 36px', gap: '0.5rem', alignItems: 'center' }}>
                      <input
                        type="text"
                        placeholder="Label (e.g. Luminous Flux)"
                        value={spec.label}
                        onChange={(e) => updateSpecField(sIdx, 'label', e.target.value)}
                        style={{ padding: '0.45rem 0.65rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem' }}
                      />
                      <input
                        type="text"
                        placeholder="Value (e.g. 2,884)"
                        value={spec.value}
                        onChange={(e) => updateSpecField(sIdx, 'value', e.target.value)}
                        style={{ padding: '0.45rem 0.65rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem' }}
                      />
                      <input
                        type="text"
                        placeholder="Unit (e.g. lm)"
                        value={spec.unit || ''}
                        onChange={(e) => updateSpecField(sIdx, 'unit', e.target.value)}
                        style={{ padding: '0.45rem 0.65rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => removeSpecField(sIdx)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '4px',
                          border: '1px solid #fee2e2',
                          backgroundColor: '#fef2f2',
                          color: '#dc2626',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Photo Grid Builder Trigger */}
              <div
                style={{
                  border: '1.5px dashed #2563eb',
                  borderRadius: '6px',
                  backgroundColor: '#eff6ff',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '0.9375rem', fontWeight: 600, color: '#1e40af' }}>
                    Architectural Photo Gallery Grid ({editingProduct.gallery?.length || 0} configured)
                  </h4>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#3b82f6' }}>
                    Configure the unique collage grid (templates, cropping ratios, slot (+) add icons).
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsGridBuilderOpen(true)}
                  style={{
                    padding: '0.6rem 1.25rem',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
                  }}
                >
                  <Crop size={15} /> Open Photo Grid Builder
                </button>
              </div>

              {/* Submit Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  style={{ padding: '0.6rem 1.25rem', borderRadius: '4px', border: '1px solid #d1d5db', backgroundColor: '#ffffff', fontSize: '0.8125rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingProduct}
                  style={{
                    padding: '0.6rem 1.75rem',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: '#111827',
                    color: '#ffffff',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: isSavingProduct ? 'wait' : 'pointer',
                  }}
                >
                  {isSavingProduct ? 'Saving...' : 'Save Luminaire to Catalog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* PHOTO GRID BUILDER FULL-SCREEN SUB-PAGE VIEW */}
      {/* ======================================================== */}
      {isGridBuilderOpen && editingProduct && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999999,
            backgroundColor: '#f3f4f6',
            overflowY: 'auto',
            padding: '2rem',
          }}
        >
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <ProductGridBuilder
              productName={editingProduct.name || 'Luminaire'}
              initialPhotos={
                (editingProduct.gallery || []).map((img, i) => ({
                  id: img.id || `slot-${i}`,
                  url: img.url,
                  alt: img.alt || '',
                  tag: `0${i + 1} / ARCHITECTURAL PERSPECTIVE`,
                  caption: img.caption || '',
                }))
              }
              onCancel={() => setIsGridBuilderOpen(false)}
              onSave={(configuredPhotos) => {
                setEditingProduct({
                  ...editingProduct,
                  gallery: configuredPhotos.map((p, idx) => ({
                    id: p.id || `img-${idx}`,
                    url: p.url,
                    alt: p.alt || `${editingProduct.name} perspective ${idx + 1}`,
                    caption: p.caption,
                  })),
                });
                setIsGridBuilderOpen(false);
                showToast(`Saved ${configuredPhotos.length} photos to product gallery.`);
              }}
            />
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ADD / EDIT PROJECT MODAL */}
      {/* ======================================================== */}
      {isProjectModalOpen && editingProject && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(10, 10, 9, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '600px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            }}
          >
            <div style={{ padding: '1.25rem 1.75rem', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f9fafb' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#111827' }}>
                {editingProject.id?.startsWith('proj-') ? 'Edit Project' : 'Add New Architectural Project'}
              </h3>
              <button type="button" onClick={() => setIsProjectModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Project Title</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Location</label>
                  <input
                    type="text"
                    value={editingProject.location}
                    onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Category &amp; Year</label>
                  <input
                    type="text"
                    value={`${editingProject.category || 'Hospitality'} (${editingProject.year || '2025'})`}
                    onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Project Showcase Image URL</label>
                <input
                  type="text"
                  value={editingProject.imageUrl}
                  onChange={(e) => setEditingProject({ ...editingProject, imageUrl: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '0.35rem' }}>Narrative Description</label>
                <textarea
                  rows={2}
                  value={editingProject.description}
                  onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid #d1d5db', fontSize: '0.8125rem', resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid #d1d5db', backgroundColor: '#ffffff', fontSize: '0.8125rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const exists = projectsList.some((p) => p.id === editingProject.id);
                    let updated: ProjectConfig[];
                    if (exists) {
                      updated = projectsList.map((p) => (p.id === editingProject.id ? editingProject : p));
                    } else {
                      updated = [...projectsList, editingProject];
                    }
                    saveProjects(updated);
                    setIsProjectModalOpen(false);
                  }}
                  style={{ padding: '0.5rem 1.5rem', borderRadius: '4px', border: 'none', backgroundColor: '#111827', color: '#ffffff', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Save Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Image Cropper Modal */}
      {cropperModal.isOpen && cropperModal.imageSrc && (
        <ImageCropperModal
          isOpen={cropperModal.isOpen}
          imageUrl={cropperModal.imageSrc}
          aspectRatioPreset={cropperModal.aspectPreset || '16:9'}
          onClose={() => setCropperModal({ isOpen: false })}
          onCropComplete={(res) => {
            if (cropperModal.onSuccess) cropperModal.onSuccess(res.dataUrl);
            setCropperModal({ isOpen: false });
          }}
        />
      )}
    </div>
  );
}
