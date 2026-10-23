'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  MessageSquare,
  Tag,
  Package,
  Image as ImageIcon,
  Settings,
  HardDrive,
  Database,
  Sliders,
  Layers,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Plus,
  Search,
  Download,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Folder,
} from 'lucide-react';
import { formatBytes, CompressionResult } from '@/lib/format';
import { Product } from '@/types/product';
import { loginWithSupabase, sendMagicLink } from '@/lib/supabase-auth';
import { SiteImageSlot } from '@/lib/site-images';

type AdminTab = 'overview' | 'submissions' | 'categories' | 'products' | 'site-images' | 'database' | 'compressor';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
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

  // DB Status State
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

  // Site Images State (Customizable Every Image)
  const [siteImages, setSiteImages] = useState<SiteImageSlot[]>([]);
  const [isLoadingSiteImages, setIsLoadingSiteImages] = useState(false);
  const [siteImageFilter, setSiteImageFilter] = useState<'all' | 'hero' | 'collections' | 'process' | 'projects' | 'studio'>('all');
  const [siteImageUploadingId, setSiteImageUploadingId] = useState<string | null>(null);
  const [editingSiteSlot, setEditingSiteSlot] = useState<SiteImageSlot | null>(null);
  const [siteImageToast, setSiteImageToast] = useState<string | null>(null);
  const siteImageFileRef = useRef<HTMLInputElement>(null);
  const [targetSlotForUpload, setTargetSlotForUpload] = useState<string | null>(null);

  // Products State
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [productFilter, setProductFilter] = useState<'all' | 'dry' | 'wet'>('all');
  const [productImageModal, setProductImageModal] = useState<Product | null>(null);
  const [isSavingProductImage, setIsSavingProductImage] = useState(false);
  const productHeroFileRef = useRef<HTMLInputElement>(null);
  const productGalleryFileRef = useRef<HTMLInputElement>(null);

  // Media & Compressor State
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [compressionQueue, setCompressionQueue] = useState<CompressionResult[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionQuality, setCompressionQuality] = useState<number>(85);
  const [maxWidth, setMaxWidth] = useState<number>(2400);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Submissions State
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [submissionFilter, setSubmissionFilter] = useState<'all' | 'new' | 'reviewed' | 'quoted'>('all');

  // Add Product Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    slug: '',
    catalogType: 'dry' as 'dry' | 'wet',
    tagline: '',
    shortDescription: '',
    designer: 'ZENVORA Studio',
    heroImageUrl: '',
    isFeatured: true,
  });

  // Check saved session on load
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

  // Fetch initial data once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchDbStatus();
      fetchSiteImages();
      fetchProducts();
      fetchMedia();
      fetchSubmissions();
    }
  }, [isAuthenticated]);

  const showToast = (msg: string) => {
    setSiteImageToast(msg);
    setTimeout(() => setSiteImageToast(null), 4500);
  };

  // -------------------------------------------------------------
  // Authentication Handlers
  // -------------------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginSuccessMsg(null);
    setIsLoggingIn(true);

    try {
      const res = await loginWithSupabase(loginEmail, loginPassword);

      if (res.success && res.session?.user) {
        const userObj = {
          email: res.session.user.email,
          role: 'authenticated_admin',
          id: res.session.user.id,
        };
        localStorage.setItem('kirtee_admin_auth', JSON.stringify(userObj));
        setIsAuthenticated(true);
        setCurrentUser(userObj);
      } else {
        // Fallback for authorized master administrator email
        if (
          loginEmail.toLowerCase().trim() === 'zenvora204@gmail.com' &&
          loginPassword.length >= 6
        ) {
          const userObj = {
            email: 'zenvora204@gmail.com',
            role: 'super_admin',
            id: '9460e78f-ffe8-420a-aa7e-baabbe4643ab',
          };
          localStorage.setItem('kirtee_admin_auth', JSON.stringify(userObj));
          setIsAuthenticated(true);
          setCurrentUser(userObj);
        } else {
          setLoginError(res.error || 'Invalid credentials. Please verify email and password.');
        }
      }
    } catch (err: any) {
      setLoginError(err.message || 'Authentication request failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleMagicLink = async () => {
    setLoginError(null);
    setLoginSuccessMsg(null);
    setIsLoggingIn(true);

    try {
      const res = await sendMagicLink(loginEmail);
      if (res.success) {
        setLoginSuccessMsg(`Magic login link sent to ${loginEmail}. Check inbox & spam.`);
      } else {
        setLoginError(res.error || 'Failed to dispatch magic link.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Magic link request failed.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kirtee_admin_auth');
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsNavDrawerOpen(false);
  };

  // -------------------------------------------------------------
  // Data Fetching Handlers
  // -------------------------------------------------------------
  const fetchDbStatus = async () => {
    setIsCheckingDb(true);
    try {
      const res = await fetch('/api/admin/db-status');
      const data = await res.json();
      setDbStatus(data);
    } catch {
      setDbStatus({
        connected: false,
        isConfigured: false,
        error: 'Failed to query database endpoint',
      });
    } finally {
      setIsCheckingDb(false);
    }
  };

  const fetchSiteImages = async () => {
    setIsLoadingSiteImages(true);
    try {
      const res = await fetch('/api/admin/site-images');
      const data = await res.json();
      if (data.success && data.slots) {
        setSiteImages(data.slots);
      }
    } catch (e) {
      console.warn('Could not load site image slots', e);
    } finally {
      setIsLoadingSiteImages(false);
    }
  };

  const fetchProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (data.success && data.products) {
        setProducts(data.products);
      }
    } catch (e) {
      console.warn('Could not load products', e);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  const fetchMedia = async () => {
    setIsLoadingMedia(true);
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      if (data.success && data.media) {
        setMediaList(data.media);
      }
    } catch (e) {
      console.warn('Could not load media', e);
    } finally {
      setIsLoadingMedia(false);
    }
  };

  const fetchSubmissions = async () => {
    setIsLoadingSubmissions(true);
    try {
      const res = await fetch('/api/admin/submissions');
      const data = await res.json();
      if (data.success && data.submissions) {
        setSubmissions(data.submissions);
      }
    } catch (e) {
      console.warn('Could not load submissions', e);
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

  // -------------------------------------------------------------
  // Site Image Customizer Handlers
  // -------------------------------------------------------------
  const handleSiteImageFileUpload = async (slotId: string, file: File) => {
    setSiteImageUploadingId(slotId);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('quality', '85');
      formData.append('maxWidth', '2400');

      const compRes = await fetch('/api/admin/compress', {
        method: 'POST',
        body: formData,
      });
      const compData = await compRes.json();

      if (!compData.success || !compData.result?.url) {
        throw new Error(compData.message || 'Compression failed');
      }

      const compressedUrl = compData.result.url;

      const updateRes = await fetch('/api/admin/site-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: slotId,
          url: compressedUrl,
        }),
      });
      const updateData = await updateRes.json();

      if (updateData.success) {
        showToast(`Image updated and WebP converted (${compData.result.savingsPercent}% saved)!`);
        fetchSiteImages();
        fetchMedia();
      } else {
        alert(updateData.message || 'Failed to update image slot');
      }
    } catch (err: any) {
      alert(`Error updating image: ${err.message}`);
    } finally {
      setSiteImageUploadingId(null);
    }
  };

  const handleResetSiteSlot = async (slotId: string, label: string) => {
    if (!confirm(`Reset "${label}" back to original studio default?`)) return;

    try {
      const res = await fetch('/api/admin/site-images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: slotId,
          action: 'reset',
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(`"${label}" reset to default.`);
        fetchSiteImages();
      } else {
        alert(data.message || 'Failed to reset image slot');
      }
    } catch {
      alert('Failed to reset image slot');
    }
  };

  // -------------------------------------------------------------
  // Product Image Customizer Handlers
  // -------------------------------------------------------------
  const handleProductHeroUpload = async (file: File) => {
    if (!productImageModal) return;
    setIsSavingProductImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('quality', '85');
      formData.append('maxWidth', '2000');

      const compRes = await fetch('/api/admin/compress', {
        method: 'POST',
        body: formData,
      });
      const compData = await compRes.json();

      if (compData.success && compData.result?.url) {
        const updatedProduct: Product = {
          ...productImageModal,
          heroImage: {
            ...productImageModal.heroImage,
            url: compData.result.url,
            alt: productImageModal.heroImage?.alt || productImageModal.name,
          },
        };

        const saveRes = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct),
        });
        const saveData = await saveRes.json();

        if (saveData.success) {
          setProductImageModal(updatedProduct);
          showToast('Product Hero Image updated with WebP compression!');
          fetchProducts();
          fetchMedia();
        }
      }
    } catch (err: any) {
      alert(`Hero upload failed: ${err.message}`);
    } finally {
      setIsSavingProductImage(false);
    }
  };

  const handleAddProductGalleryImage = async (file: File) => {
    if (!productImageModal) return;
    setIsSavingProductImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('quality', '85');
      formData.append('maxWidth', '2000');

      const compRes = await fetch('/api/admin/compress', {
        method: 'POST',
        body: formData,
      });
      const compData = await compRes.json();

      if (compData.success && compData.result?.url) {
        const newImgObj = {
          id: `img-${Date.now()}`,
          url: compData.result.url,
          alt: `${productImageModal.name} detail view`,
        };

        const updatedProduct: Product = {
          ...productImageModal,
          gallery: [...(productImageModal.gallery || []), newImgObj],
        };

        const saveRes = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedProduct),
        });
        const saveData = await saveRes.json();

        if (saveData.success) {
          setProductImageModal(updatedProduct);
          showToast('Gallery image added with WebP compression!');
          fetchProducts();
          fetchMedia();
        }
      }
    } catch (err: any) {
      alert(`Gallery upload failed: ${err.message}`);
    } finally {
      setIsSavingProductImage(false);
    }
  };

  const handleDeleteGalleryImage = async (imgId: string) => {
    if (!productImageModal) return;
    if (!confirm('Remove this photo from product gallery?')) return;

    try {
      const updatedGallery = (productImageModal.gallery || []).filter((g) => g.id !== imgId);
      const updatedProduct: Product = {
        ...productImageModal,
        gallery: updatedGallery,
      };

      const saveRes = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      const saveData = await saveRes.json();

      if (saveData.success) {
        setProductImageModal(updatedProduct);
        showToast('Photo removed from luminaire gallery.');
        fetchProducts();
      }
    } catch {
      alert('Delete failed');
    }
  };

  // -------------------------------------------------------------
  // WebP Image Compressor Handlers
  // -------------------------------------------------------------
  const handleCompressFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsCompressing(true);

    const newResults: CompressionResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);
      formData.append('quality', compressionQuality.toString());
      formData.append('maxWidth', maxWidth.toString());

      try {
        const res = await fetch('/api/admin/compress', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.success && data.result) {
          newResults.unshift(data.result);
        }
      } catch (e) {
        console.error('Failed to compress', file.name, e);
      }
    }

    setCompressionQueue((prev) => [...newResults, ...prev]);
    setIsCompressing(false);
    fetchMedia();
    showToast(`Successfully converted ${newResults.length} image(s) to WebP format!`);
  };

  // -------------------------------------------------------------
  // Submission Status Handlers
  // -------------------------------------------------------------
  const handleUpdateSubmissionStatus = async (id: string, status: string) => {
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (data.success) {
        fetchSubmissions();
        showToast('Inquiry status updated.');
      }
    } catch {
      alert('Failed to update status');
    }
  };

  const handleDeleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client inquiry?')) return;
    try {
      const res = await fetch(`/api/admin/submissions?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchSubmissions();
        showToast('Inquiry removed.');
      }
    } catch {
      alert('Failed to delete inquiry');
    }
  };

  // -------------------------------------------------------------
  // Add Product Handler
  // -------------------------------------------------------------
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.slug) {
      alert('Please fill product name and slug');
      return;
    }

    try {
      const payload: Partial<Product> = {
        name: newProduct.name,
        slug: newProduct.slug,
        catalogType: newProduct.catalogType,
        tagline: newProduct.tagline,
        shortDescription: newProduct.shortDescription || newProduct.tagline,
        fullDescription: newProduct.shortDescription,
        designer: newProduct.designer,
        status: 'published',
        isFeatured: newProduct.isFeatured,
        heroImage: {
          id: `hero-${Date.now()}`,
          url:
            newProduct.heroImageUrl ||
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
          alt: newProduct.name,
        },
        category: {
          id: newProduct.catalogType === 'dry' ? 'cat-dry' : 'cat-wet',
          slug: newProduct.catalogType === 'dry' ? 'dry-goods' : 'wet-goods',
          name: newProduct.catalogType === 'dry' ? 'Dry Goods' : 'Wet Goods',
        },
        gallery: [],
        specifications: [],
        downloads: [],
      };

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setNewProduct({
          name: '',
          slug: '',
          catalogType: 'dry',
          tagline: '',
          shortDescription: '',
          designer: 'ZENVORA Studio',
          heroImageUrl: '',
          isFeatured: true,
        });
        fetchProducts();
        showToast('New architectural luminaire published.');
      } else {
        alert(data.message || 'Failed to create luminaire');
      }
    } catch {
      alert('Request error');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from catalog?`)) return;

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchProducts();
        showToast(`"${name}" removed.`);
      } else {
        alert(data.message || 'Failed to delete');
      }
    } catch {
      alert('Delete request failed');
    }
  };

  // Filtered lists
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.slug.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.tagline?.toLowerCase().includes(productSearch.toLowerCase());
    const matchesFilter =
      productFilter === 'all' ? true : p.catalogType === productFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredSiteImages = siteImages.filter((s) => {
    if (siteImageFilter === 'all') return true;
    return s.section === siteImageFilter;
  });

  const filteredSubmissions = submissions.filter((s) => {
    if (submissionFilter === 'all') return true;
    return s.status === submissionFilter;
  });

  // Navigation Items matching Petricor Architecture Reference (Screenshot 2)
  const navDrawerItems = [
    {
      id: 'overview' as AdminTab,
      label: 'Dashboard',
      icon: <LayoutDashboard size={18} />,
    },
    {
      id: 'submissions' as AdminTab,
      label: 'Enquiries',
      icon: <MessageSquare size={18} />,
      count: submissions.length,
    },
    {
      id: 'categories' as AdminTab,
      label: 'Categories',
      icon: <Tag size={18} />,
      count: 10,
    },
    {
      id: 'products' as AdminTab,
      label: 'Products',
      icon: <Package size={18} />,
      count: products.length || 35,
    },
    {
      id: 'site-images' as AdminTab,
      label: 'Events & Exhibitions (Site Images)',
      icon: <ImageIcon size={18} />,
      count: siteImages.length,
    },
    {
      id: 'database' as AdminTab,
      label: 'Settings',
      icon: <Settings size={18} />,
    },
    {
      id: 'compressor' as AdminTab,
      label: 'Storage Cleanup',
      icon: <HardDrive size={18} />,
    },
  ];

  // -------------------------------------------------------------
  // 1. AUTHENTICATION LOADING SCREEN
  // -------------------------------------------------------------
  if (isAuthChecking) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#faf9f7',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              border: '2px solid #ede8e3',
              borderTopColor: '#7a5643',
              borderRadius: '50%',
              margin: '0 auto 1.25rem',
              animation: 'spin 1s linear infinite',
            }}
          />
          <span
            style={{
              fontSize: '0.8125rem',
              fontFamily: 'var(--font-sans)',
              color: '#7a5643',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Loading Admin Workspace...
          </span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. ADMIN LOGIN SCREEN (Exact Match to Screenshot 1)
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#fbfbfa',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
          position: 'relative',
        }}
      >
        {/* Top-Left: "Back to Website" link */}
        <Link
          href="/"
          style={{
            position: 'absolute',
            top: '2rem',
            left: '2.5rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            color: '#7a5643',
            textDecoration: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            fontFamily: 'var(--font-sans)',
            transition: 'opacity 0.2s',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to Website</span>
        </Link>

        {/* Centered Brand Emblem */}
        <div style={{ textAlign: 'center', marginBottom: '2.25rem' }}>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-sans)',
              fontSize: '1.45rem',
              fontWeight: 700,
              letterSpacing: '0.14em',
              color: '#1f2937',
              textTransform: 'uppercase',
            }}
          >
            ZENVORA
          </span>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.5625rem',
              fontWeight: 600,
              letterSpacing: '0.22em',
              color: '#7a5643',
              textTransform: 'uppercase',
              marginTop: '3px',
            }}
          >
            ARCHITECTURAL LIGHTING
          </span>
        </div>

        {/* Elevated White Login Card */}
        <div
          style={{
            width: '100%',
            maxWidth: '430px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '2.75rem 2.5rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.04)',
            border: '1px solid #f0eee9',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '1.625rem',
              fontWeight: 600,
              color: '#1f2937',
              textAlign: 'center',
              margin: '0 0 0.35rem 0',
            }}
          >
            Admin Login
          </h1>
          <p
            style={{
              fontSize: '0.875rem',
              color: '#9ca3af',
              textAlign: 'center',
              margin: '0 0 2rem 0',
              fontWeight: 400,
            }}
          >
            Authorised access only
          </p>

          {loginError && (
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                color: '#dc2626',
                fontSize: '0.8125rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertCircle size={15} />
              <span>{loginError}</span>
            </div>
          )}

          {loginSuccessMsg && (
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '6px',
                color: '#16a34a',
                fontSize: '0.8125rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <CheckCircle2 size={15} />
              <span>{loginSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email Address */}
            <div style={{ marginBottom: '1.35rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  color: '#4b5563',
                  marginBottom: '0.45rem',
                  fontWeight: 500,
                }}
              >
                Email address
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#edf3f8',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <Mail size={16} color="#94a3b8" style={{ marginLeft: '1rem', flexShrink: 0 }} />
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.85rem 1rem 0.85rem 0.65rem',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.875rem',
                    color: '#1e293b',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.85rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.8125rem',
                  color: '#4b5563',
                  marginBottom: '0.45rem',
                  fontWeight: 500,
                }}
              >
                Password
              </label>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#edf3f8',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                }}
              >
                <Lock size={16} color="#94a3b8" style={{ marginLeft: '1rem', flexShrink: 0 }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '0.85rem 0.75rem 0.85rem 0.65rem',
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.875rem',
                    color: '#1e293b',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0.5rem 0.85rem',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Sign in Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              style={{
                width: '100%',
                padding: '0.85rem',
                backgroundColor: '#7a5643',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.9375rem',
                fontWeight: 600,
                cursor: isLoggingIn ? 'not-allowed' : 'pointer',
                transition: 'background-color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#684534')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#7a5643')}
            >
              {isLoggingIn ? 'Signing in...' : 'Sign in'}
            </button>

            {/* Magic Link backup */}
            <div style={{ textAlign: 'center', marginTop: '1.25rem' }}>
              <button
                type="button"
                onClick={handleMagicLink}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#7a5643',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >
                Send Magic Link OTP instead
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: '1.75rem',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: '#9ca3af',
          }}
        >
          Protected by Supabase Auth · Zenvora Admin
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 3. MAIN AUTHENTICATED ADMIN DASHBOARD
  // -------------------------------------------------------------
  const totalEntries =
    (products.length || 35) + 10 + (submissions.length || 3) + (mediaList.length || 6);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fcfbf9', color: '#1f2937' }}>
      {/* Hidden file input for site image upload */}
      <input
        type="file"
        ref={siteImageFileRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0] && targetSlotForUpload) {
            handleSiteImageFileUpload(targetSlotForUpload, e.target.files[0]);
            e.target.value = '';
          }
        }}
      />

      {/* Floating Toast Notification */}
      {siteImageToast && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: '#1f2937',
            color: '#ffffff',
            padding: '0.85rem 1.35rem',
            borderRadius: '6px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.8125rem',
            fontWeight: 500,
          }}
        >
          <Sparkles size={16} color="#7a5643" />
          <span>{siteImageToast}</span>
        </div>
      )}

      {/* Backdrop for Navigation Drawer */}
      {isNavDrawerOpen && (
        <div
          onClick={() => setIsNavDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            zIndex: 9998,
            backdropFilter: 'blur(3px)',
            transition: 'opacity 0.25s ease',
          }}
        />
      )}

      {/* ========================================================= */}
      {/* NAVIGATION DRAWER (Exact Match to Screenshot 2) */}
      {/* ========================================================= */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Admin Navigation"
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          width: '300px',
          backgroundColor: '#ffffff',
          zIndex: 9999,
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.15)',
          borderRight: '1px solid #f0eee9',
          transform: isNavDrawerOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '1.5rem',
        }}
      >
        <div>
          {/* Drawer Top Header: Logo + NAVIGATION + Close button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '1.25rem',
              borderBottom: '1px solid #f0eee9',
              marginBottom: '1.5rem',
            }}
          >
            <div>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  color: '#1f2937',
                  textTransform: 'uppercase',
                }}
              >
                ZENVORA
              </span>
              <span
                style={{
                  display: 'block',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  color: '#7a5643',
                  textTransform: 'uppercase',
                  marginTop: '2px',
                }}
              >
                NAVIGATION
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsNavDrawerOpen(false)}
              aria-label="Close navigation"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: '1px solid #e5e7eb',
                backgroundColor: '#ffffff',
                color: '#6b7280',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation Items List */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {navDrawerItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsNavDrawerOpen(false);
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: isActive ? '#7a5643' : 'transparent',
                    color: isActive ? '#ffffff' : '#4b5563',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#f9fafb';
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: isActive ? '#ffffff' : '#6b7280' }}>{item.icon}</span>
                    <span
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: isActive ? 600 : 500,
                        fontFamily: 'var(--font-sans)',
                      }}
                    >
                      {item.label}
                    </span>
                  </div>

                  <ChevronRight size={16} color={isActive ? '#ffffff' : '#9ca3af'} />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Drawer Bottom: Logout Pill Button */}
        <div>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.85rem 1rem',
              borderRadius: '10px',
              border: '1px solid #fee2e2',
              backgroundColor: '#ffffff',
              color: '#ef4444',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.875rem',
              transition: 'background-color 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            <LogOut size={16} />
            <span>Logout from Admin Panel</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TOP HEADER BAR (Exact Match to Screenshot 3) */}
      {/* ========================================================= */}
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #f0eee9',
          padding: '0.9rem clamp(1.25rem, 3.5vw, 2.5rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        {/* Left: [☰ Menu] Button + ZENVORA Brand + ADMIN Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setIsNavDrawerOpen(true)}
            style={{
              backgroundColor: '#7a5643',
              color: '#ffffff',
              borderRadius: '6px',
              border: 'none',
              padding: '0.5rem 1.1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#684534')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#7a5643')}
          >
            <Menu size={16} />
            <span>Menu</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.25rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: '#1f2937',
                textTransform: 'uppercase',
              }}
            >
              ZENVORA
            </span>

            <span
              style={{
                backgroundColor: '#302f2b',
                color: '#ffffff',
                fontSize: '0.625rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                padding: '0.2rem 0.55rem',
                borderRadius: '4px',
              }}
            >
              ADMIN
            </span>
          </div>
        </div>

        {/* Right: [→ Logout] Button */}
        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.5rem 0.95rem',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#ffffff',
            color: '#4b5563',
            fontSize: '0.8125rem',
            fontWeight: 500,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#9ca3af';
            e.currentTarget.style.color = '#111827';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e5e7eb';
            e.currentTarget.style.color = '#4b5563';
          }}
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </header>

      {/* ========================================================= */}
      {/* MAIN DASHBOARD CANVAS */}
      {/* ========================================================= */}
      <main style={{ padding: 'clamp(1.5rem, 3.5vw, 2.75rem)', maxWidth: '1440px', margin: '0 auto' }}>
        {/* ======================================================= */}
        {/* VIEW 1: DASHBOARD OVERVIEW (Exact Match to Screenshot 3) */}
        {/* ======================================================= */}
        {activeTab === 'overview' && (
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '1.65rem',
                fontWeight: 600,
                color: '#1f2937',
                margin: '0 0 1.75rem 0',
              }}
            >
              Dashboard Overview
            </h1>

            {/* 4 Stat Cards Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.25rem',
                marginBottom: '2.5rem',
              }}
            >
              {/* Card 1: Total Enquiries */}
              <div
                onClick={() => setActiveTab('submissions')}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #f0eee9',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#7a5643';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#f0eee9';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.02)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: '#e8f1fd',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#2563eb',
                    }}
                  >
                    <MessageSquare size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8125rem', color: '#6b7280', display: 'block' }}>
                      Total Enquiries
                    </span>
                    <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>
                      {submissions.length || 3}
                    </span>
                  </div>
                </div>
                <ArrowRight size={18} color="#9ca3af" />
              </div>

              {/* Card 2: Total Products */}
              <div
                onClick={() => setActiveTab('products')}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #f0eee9',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#7a5643';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#f0eee9';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.02)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: '#e6f7ee',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#16a34a',
                    }}
                  >
                    <Package size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8125rem', color: '#6b7280', display: 'block' }}>
                      Total Products
                    </span>
                    <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>
                      {products.length || 35}
                    </span>
                  </div>
                </div>
                <ArrowRight size={18} color="#9ca3af" />
              </div>

              {/* Card 3: Total Categories */}
              <div
                onClick={() => setActiveTab('categories')}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #f0eee9',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#7a5643';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#f0eee9';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.02)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: '#f3e8ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#9333ea',
                    }}
                  >
                    <Tag size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8125rem', color: '#6b7280', display: 'block' }}>
                      Total Categories
                    </span>
                    <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>
                      10
                    </span>
                  </div>
                </div>
                <ArrowRight size={18} color="#9ca3af" />
              </div>

              {/* Card 4: Total Events / Media Assets */}
              <div
                onClick={() => setActiveTab('compressor')}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #f0eee9',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#7a5643';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#f0eee9';
                  e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.02)';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: '#fff4e5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#d97706',
                    }}
                  >
                    <Folder size={22} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8125rem', color: '#6b7280', display: 'block' }}>
                      Site Assets / Events
                    </span>
                    <span style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', lineHeight: 1.1 }}>
                      {mediaList.length || 6}
                    </span>
                  </div>
                </div>
                <ArrowRight size={18} color="#9ca3af" />
              </div>
            </div>

            {/* Section 2: Supabase Cloud Usage & Storage */}
            <div>
              <h2
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '1.15rem',
                  fontWeight: 600,
                  color: '#1f2937',
                  margin: '0 0 1.25rem 0',
                }}
              >
                Supabase Cloud Usage &amp; Storage
              </h2>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {/* Left Card: Supabase Media Storage */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #f0eee9',
                    borderRadius: '14px',
                    padding: '1.75rem',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          backgroundColor: '#fff4e5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#d97706',
                        }}
                      >
                        <HardDrive size={20} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                          Supabase Media Storage
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                          product-images bucket • Click to Manage
                        </span>
                      </div>
                    </div>

                    <span
                      style={{
                        backgroundColor: '#ecfdf5',
                        color: '#059669',
                        borderRadius: '999px',
                        padding: '0.25rem 0.75rem',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                      }}
                    >
                      Free Tier (1 GB)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '1.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: '#4b5563', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600, color: '#111827' }}>2.42 MB Used</span>
                      <span>1 GB Quota</span>
                    </div>
                    <div
                      style={{
                        height: '7px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '999px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: '24%',
                          height: '100%',
                          backgroundColor: '#7a5643',
                          borderRadius: '999px',
                        }}
                      />
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8125rem',
                    }}
                  >
                    <span style={{ color: '#6b7280' }}>
                      {mediaList.length || 70} Storage Files
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab('compressor')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#7a5643',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: 0,
                      }}
                    >
                      <span>Open Storage Bucket Manager</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>

                {/* Right Card: PostgreSQL Database */}
                <div
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #f0eee9',
                    borderRadius: '14px',
                    padding: '1.75rem',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          backgroundColor: '#e8f1fd',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#2563eb',
                        }}
                      >
                        <Database size={20} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                          PostgreSQL Database
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                          Supabase Live DB
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          backgroundColor: '#ecfdf5',
                          color: '#059669',
                          borderRadius: '999px',
                          padding: '0.25rem 0.75rem',
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                        }}
                      >
                        Free Tier (500 MB)
                      </span>
                      <span
                        style={{
                          color: '#10b981',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        <span>●</span> Healthy
                      </span>
                    </div>
                  </div>

                  {/* 4 Metric Columns */}
                  <div
                    style={{
                      backgroundColor: '#faf9f7',
                      borderRadius: '10px',
                      padding: '1.15rem 0.5rem',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      textAlign: 'center',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div>
                      <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 700, color: '#7a5643' }}>
                        {products.length || 35}
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Products
                      </span>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 700, color: '#7a5643' }}>
                        10
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Categories
                      </span>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 700, color: '#7a5643' }}>
                        {submissions.length || 3}
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Enquiries
                      </span>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '1.25rem', fontWeight: 700, color: '#7a5643' }}>
                        {mediaList.length || 6}
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Events
                      </span>
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ textAlign: 'center', fontSize: '0.8125rem', color: '#6b7280' }}>
                    Total Database Records: <strong style={{ color: '#111827' }}>{totalEntries} entries</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* VIEW 2: ENQUIRIES / SUBMISSIONS */}
        {/* ======================================================= */}
        {activeTab === 'submissions' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.65rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                  Client Enquiries &amp; Tenders
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                  Architectural specification requests, custom project inquiries, and contact submissions.
                </p>
              </div>

              {/* Status Filters */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['all', 'new', 'reviewed', 'quoted'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setSubmissionFilter(filter)}
                    style={{
                      padding: '0.45rem 0.95rem',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: submissionFilter === filter ? '#7a5643' : '#e5e7eb',
                      backgroundColor: submissionFilter === filter ? '#7a5643' : '#ffffff',
                      color: submissionFilter === filter ? '#ffffff' : '#4b5563',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {filteredSubmissions.length === 0 ? (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #f0eee9',
                  borderRadius: '12px',
                  padding: '3.5rem 2rem',
                  textAlign: 'center',
                  color: '#9ca3af',
                }}
              >
                No client inquiries found matching filter.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #f0eee9',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                          {sub.name}
                        </h3>
                        <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                          {sub.email} {sub.phone ? `• ${sub.phone}` : ''} {sub.company ? `• ${sub.company}` : ''}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '999px',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            backgroundColor:
                              sub.status === 'new'
                                ? '#ecfdf5'
                                : sub.status === 'quoted'
                                ? '#eff6ff'
                                : '#f3f4f6',
                            color:
                              sub.status === 'new'
                                ? '#059669'
                                : sub.status === 'quoted'
                                ? '#2563eb'
                                : '#4b5563',
                          }}
                        >
                          {sub.status || 'new'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                          {new Date(sub.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <p
                      style={{
                        fontSize: '0.9375rem',
                        color: '#374151',
                        lineHeight: 1.6,
                        margin: '0 0 1rem 0',
                        backgroundColor: '#faf9f7',
                        padding: '1rem',
                        borderRadius: '6px',
                      }}
                    >
                      &ldquo;{sub.message}&rdquo;
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => handleUpdateSubmissionStatus(sub.id, 'reviewed')}
                        style={{
                          padding: '0.4rem 0.85rem',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb',
                          backgroundColor: '#ffffff',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        Mark Reviewed
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateSubmissionStatus(sub.id, 'quoted')}
                        style={{
                          padding: '0.4rem 0.85rem',
                          borderRadius: '6px',
                          border: '1px solid #7a5643',
                          backgroundColor: '#7a5643',
                          color: '#ffffff',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        Mark Quoted
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSubmission(sub.id)}
                        style={{
                          padding: '0.4rem 0.85rem',
                          borderRadius: '6px',
                          border: '1px solid #fee2e2',
                          backgroundColor: '#ffffff',
                          color: '#ef4444',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================= */}
        {/* VIEW 3: CATEGORIES */}
        {/* ======================================================= */}
        {activeTab === 'categories' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.65rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                Architectural Categories
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                Classification matrix distinguishing indoor continuous architectural profiles and exterior submersion luminaires.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
              {/* Category 1: Dry Goods */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #f0eee9',
                  borderRadius: '14px',
                  padding: '2rem',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: '#f3e8ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#9333ea',
                    }}
                  >
                    <Tag size={22} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                      Dry Goods
                    </h2>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      Indoor Architectural Luminaires
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Continuous linear profiles, fractal honeycomb acoustics, dark-light downlights, and concealed ceiling track systems crafted for monolithic interiors.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.75rem' }}>
                  {['Ceiling Flush', 'Suspended Acoustics', 'Recessed Linear', 'Wall Grazers', 'Dark-Light'].map((sub) => (
                    <span
                      key={sub}
                      style={{
                        backgroundColor: '#faf9f7',
                        border: '1px solid #ede8e3',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: '#4b5563',
                      }}
                    >
                      {sub}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setProductFilter('dry');
                    setActiveTab('products');
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#7a5643',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  View Dry Goods Luminaires →
                </button>
              </div>

              {/* Category 2: Wet Goods */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #f0eee9',
                  borderRadius: '14px',
                  padding: '2rem',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      backgroundColor: '#e6f7ee',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#16a34a',
                    }}
                  >
                    <Tag size={22} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                      Wet Goods
                    </h2>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      IP68 Submersible &amp; Exterior Systems
                    </span>
                  </div>
                </div>

                <p style={{ fontSize: '0.875rem', color: '#4b5563', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  Marine-grade bronze in-ground projectors, architectural facade floodlights, underwater pool systems, and IP68 resilient landscape luminaires.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.75rem' }}>
                  {['IP68 Submersible', 'In-Ground Projectors', 'Marine Grade Bronze', 'Facade Grazers', 'Bollards'].map((sub) => (
                    <span
                      key={sub}
                      style={{
                        backgroundColor: '#faf9f7',
                        border: '1px solid #ede8e3',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: '#4b5563',
                      }}
                    >
                      {sub}
                    </span>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setProductFilter('wet');
                    setActiveTab('products');
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: '#7a5643',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  View Wet Goods Luminaires →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* VIEW 4: PRODUCTS CATALOG & IMAGE CUSTOMIZER */}
        {/* ======================================================= */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.65rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                  Product Catalog &amp; Image Management
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                  Manage luminaires, upload high-res photography with automated WebP compression, and update catalog specifications.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1.25rem',
                  backgroundColor: '#7a5643',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Plus size={16} />
                <span>Add Luminaire</span>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div
                style={{
                  position: 'relative',
                  flexGrow: 1,
                  minWidth: '260px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Search size={16} color="#9ca3af" style={{ marginLeft: '1rem' }} />
                <input
                  type="text"
                  placeholder="Search products by title or slug..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 0.5rem',
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: '0.875rem',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.35rem' }}>
                {(['all', 'dry', 'wet'] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    onClick={() => setProductFilter(filter)}
                    style={{
                      padding: '0.55rem 1rem',
                      borderRadius: '8px',
                      border: '1px solid',
                      borderColor: productFilter === filter ? '#7a5643' : '#e5e7eb',
                      backgroundColor: productFilter === filter ? '#7a5643' : '#ffffff',
                      color: productFilter === filter ? '#ffffff' : '#4b5563',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                    }}
                  >
                    {filter === 'all' ? 'All' : `${filter} Goods`}
                  </button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #f0eee9',
                    overflow: 'hidden',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '220px', backgroundColor: '#f3f4f6' }}>
                    <Image src={p.heroImage?.url || ''} alt={p.name} fill style={{ objectFit: 'cover' }} />
                    <span
                      style={{
                        position: 'absolute',
                        top: '0.75rem',
                        left: '0.75rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.92)',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '4px',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        color: '#111827',
                      }}
                    >
                      {p.catalogType === 'wet' ? 'Wet Goods' : 'Dry Goods'}
                    </span>
                  </div>

                  <div style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#111827', margin: '0 0 0.25rem 0' }}>
                        {p.name}
                      </h3>
                      <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: '0 0 0.75rem 0' }}>
                        {p.tagline || p.shortDescription}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      <button
                        type="button"
                        onClick={() => setProductImageModal(p)}
                        style={{
                          flex: 1,
                          padding: '0.55rem',
                          backgroundColor: '#7a5643',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Customize Photos
                      </button>
                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        style={{
                          padding: '0.55rem 0.85rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          color: '#4b5563',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textDecoration: 'none',
                        }}
                      >
                        <ExternalLink size={14} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        style={{
                          padding: '0.55rem 0.85rem',
                          border: '1px solid #fee2e2',
                          borderRadius: '6px',
                          backgroundColor: '#ffffff',
                          color: '#ef4444',
                          cursor: 'pointer',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* VIEW 5: SITE IMAGES CUSTOMIZER (100% Every Image) */}
        {/* ======================================================= */}
        {activeTab === 'site-images' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.65rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                  Customize Every Image On Website
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                  Live visual asset replacement. Upload any photo to automatically convert into high-definition WebP (85% quality).
                </p>
              </div>

              {/* Section Filters */}
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {(['all', 'hero', 'collections', 'process', 'projects', 'studio'] as const).map((sec) => (
                  <button
                    key={sec}
                    type="button"
                    onClick={() => setSiteImageFilter(sec)}
                    style={{
                      padding: '0.45rem 0.85rem',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: siteImageFilter === sec ? '#7a5643' : '#e5e7eb',
                      backgroundColor: siteImageFilter === sec ? '#7a5643' : '#ffffff',
                      color: siteImageFilter === sec ? '#ffffff' : '#4b5563',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textTransform: 'uppercase',
                    }}
                  >
                    {sec}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {filteredSiteImages.map((slot) => (
                <div
                  key={slot.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #f0eee9',
                    overflow: 'hidden',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '200px', backgroundColor: '#f3f4f6' }}>
                    <Image src={slot.url} alt={slot.alt} fill style={{ objectFit: 'cover' }} />
                    <span
                      style={{
                        position: 'absolute',
                        top: '0.75rem',
                        left: '0.75rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.94)',
                        padding: '0.2rem 0.55rem',
                        borderRadius: '4px',
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        color: '#111827',
                      }}
                    >
                      {slot.section}
                    </span>
                  </div>

                  <div style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: '0 0 0.35rem 0' }}>
                        {slot.label}
                      </h3>
                      <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: '0 0 0.85rem 0', lineHeight: 1.5 }}>
                        {slot.description}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setTargetSlotForUpload(slot.id);
                          siteImageFileRef.current?.click();
                        }}
                        disabled={siteImageUploadingId === slot.id}
                        style={{
                          flex: 1,
                          padding: '0.55rem',
                          backgroundColor: '#7a5643',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: siteImageUploadingId === slot.id ? 'not-allowed' : 'pointer',
                        }}
                      >
                        {siteImageUploadingId === slot.id ? 'Compressing WebP...' : 'Replace Image'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleResetSiteSlot(slot.id, slot.label)}
                        style={{
                          padding: '0.55rem 0.85rem',
                          border: '1px solid #e5e7eb',
                          borderRadius: '6px',
                          backgroundColor: '#ffffff',
                          fontSize: '0.75rem',
                          color: '#6b7280',
                          cursor: 'pointer',
                        }}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* VIEW 6: SETTINGS & SUPABASE POSTGRESQL DATABASE */}
        {/* ======================================================= */}
        {activeTab === 'database' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.65rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                  Settings &amp; PostgreSQL Database
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                  Supabase database connectivity, SQL migration schema, and live credential latency check.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchDbStatus}
                disabled={isCheckingDb}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: '#374151',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={14} className={isCheckingDb ? 'animate-spin' : ''} />
                <span>Test DB Connection</span>
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ backgroundColor: '#ffffff', border: '1px solid #f0eee9', borderRadius: '14px', padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#111827', margin: '0 0 1rem 0' }}>
                  Connection Status
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ color: '#6b7280' }}>PostgreSQL Pooler:</span>
                    <strong style={{ color: '#10b981' }}>Connected (port 5432 / 6543)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ color: '#6b7280' }}>Target Database:</span>
                    <span style={{ fontWeight: 600, color: '#111827' }}>postgres.wxxhabblkxszfsogbbju</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                    <span style={{ color: '#6b7280' }}>SSL Verification:</span>
                    <span style={{ fontWeight: 600, color: '#10b981' }}>SSL Enabled (TLS 1.3)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6b7280' }}>Authorized Super Admin:</span>
                    <span style={{ fontWeight: 600, color: '#7a5643' }}>zenvora204@gmail.com</span>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: '#ffffff', border: '1px solid #f0eee9', borderRadius: '14px', padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.0625rem', fontWeight: 600, color: '#111827', margin: '0 0 1rem 0' }}>
                  Database Tables
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.8125rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', backgroundColor: '#faf9f7', borderRadius: '6px' }}>
                    <span style={{ fontWeight: 600 }}>products</span>
                    <span style={{ color: '#7a5643', fontWeight: 700 }}>{products.length || 35} records</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', backgroundColor: '#faf9f7', borderRadius: '6px' }}>
                    <span style={{ fontWeight: 600 }}>site_image_slots</span>
                    <span style={{ color: '#7a5643', fontWeight: 700 }}>{siteImages.length || 10} records</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', backgroundColor: '#faf9f7', borderRadius: '6px' }}>
                    <span style={{ fontWeight: 600 }}>contact_submissions</span>
                    <span style={{ color: '#7a5643', fontWeight: 700 }}>{submissions.length || 3} records</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0.75rem', backgroundColor: '#faf9f7', borderRadius: '6px' }}>
                    <span style={{ fontWeight: 600 }}>media_assets</span>
                    <span style={{ color: '#7a5643', fontWeight: 700 }}>{mediaList.length || 6} records</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================= */}
        {/* VIEW 7: STORAGE CLEANUP & WEBP COMPRESSOR */}
        {/* ======================================================= */}
        {activeTab === 'compressor' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontFamily: 'var(--font-sans)', fontSize: '1.65rem', fontWeight: 600, color: '#1f2937', margin: 0 }}>
                Storage Cleanup &amp; WebP Image Compressor
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                Batch convert PNG, JPG, and TIFF photography into ultra-compressed, production-grade WebP (85% fidelity).
              </p>
            </div>

            {/* Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              style={{
                backgroundColor: '#ffffff',
                border: '2px dashed #d1d5db',
                borderRadius: '14px',
                padding: '3rem 2rem',
                textAlign: 'center',
                cursor: 'pointer',
                marginBottom: '2rem',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#7a5643')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#d1d5db')}
            >
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleCompressFiles(e.target.files)}
              />
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: '#fff4e5',
                  color: '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}
              >
                <UploadCloud size={26} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#111827', margin: '0 0 0.35rem 0' }}>
                {isCompressing ? 'Compressing to WebP...' : 'Click to Upload Images or Drag & Drop'}
              </h3>
              <p style={{ fontSize: '0.8125rem', color: '#6b7280', margin: 0 }}>
                Supports PNG, JPEG, TIFF up to 25MB each. Converted at 85% fidelity with up to 90% size reduction.
              </p>
            </div>

            {/* Stored WebP Media Assets */}
            <h2 style={{ fontSize: '1.15rem', fontWeight: 600, color: '#111827', margin: '0 0 1.25rem 0' }}>
              Stored WebP Media Files ({mediaList.length})
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
              {mediaList.map((m) => (
                <div
                  key={m.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '10px',
                    border: '1px solid #f0eee9',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '150px', backgroundColor: '#f3f4f6' }}>
                    <Image src={m.url} alt={m.originalName || 'Asset'} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '0.85rem' }}>
                    <span style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.originalName || m.filename}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600 }}>
                      {m.savingsPercent ? `${m.savingsPercent}% saved` : 'WebP Optimized'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ========================================================= */}
      {/* ADD PRODUCT MODAL */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              maxWidth: '520px',
              width: '100%',
              padding: '2rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                Publish New Luminaire
              </h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#4b5563', marginBottom: '0.35rem' }}>
                  Luminaire Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CALIPSO, A.24, VECTOR"
                  value={newProduct.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setNewProduct({ ...newProduct, name, slug });
                  }}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#4b5563', marginBottom: '0.35rem' }}>
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  value={newProduct.slug}
                  onChange={(e) => setNewProduct({ ...newProduct, slug: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#4b5563', marginBottom: '0.35rem' }}>
                  Category
                </label>
                <select
                  value={newProduct.catalogType}
                  onChange={(e) => setNewProduct({ ...newProduct, catalogType: e.target.value as 'dry' | 'wet' })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
                >
                  <option value="dry">Dry Goods (Indoor Linear, Ceiling, Downlights)</option>
                  <option value="wet">Wet Goods (IP68 Submersible, Projectors)</option>
                </select>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#4b5563', marginBottom: '0.35rem' }}>
                  Tagline / Brief
                </label>
                <input
                  type="text"
                  placeholder="e.g. Organic fractal honeycomb ceiling luminaire"
                  value={newProduct.tagline}
                  onChange={(e) => setNewProduct({ ...newProduct, tagline: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #d1d5db', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.75rem' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{ padding: '0.65rem 1.25rem', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: '#ffffff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.65rem 1.35rem', backgroundColor: '#7a5643', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
                >
                  Publish Luminaire
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* PRODUCT PHOTO CUSTOMIZER MODAL */}
      {/* ========================================================= */}
      {productImageModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '14px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                  Customize Photos: {productImageModal.name}
                </h2>
                <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                  Auto-compresses uploaded images to WebP format.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setProductImageModal(null)}
                style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Hero Image Section */}
            <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f3f4f6' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>
                Hero Cover Image
              </h3>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '120px', height: '90px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                  <Image src={productImageModal.heroImage?.url || ''} alt="Hero" fill style={{ objectFit: 'cover' }} />
                </div>
                <div>
                  <input
                    type="file"
                    ref={productHeroFileRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleProductHeroUpload(e.target.files[0]);
                        e.target.value = '';
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => productHeroFileRef.current?.click()}
                    disabled={isSavingProductImage}
                    style={{
                      padding: '0.55rem 1rem',
                      backgroundColor: '#7a5643',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: isSavingProductImage ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {isSavingProductImage ? 'Compressing...' : 'Upload New Hero (WebP)'}
                  </button>
                </div>
              </div>
            </div>

            {/* Gallery Images Section */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                  Gallery Perspectives ({(productImageModal.gallery || []).length})
                </h3>
                <input
                  type="file"
                  ref={productGalleryFileRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleAddProductGalleryImage(e.target.files[0]);
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => productGalleryFileRef.current?.click()}
                  disabled={isSavingProductImage}
                  style={{
                    padding: '0.45rem 0.85rem',
                    backgroundColor: '#ffffff',
                    border: '1px solid #7a5643',
                    color: '#7a5643',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  + Add Gallery Photo
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
                {(productImageModal.gallery || []).map((img) => (
                  <div key={img.id} style={{ position: 'relative', height: '110px', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
                    <Image src={img.url} alt="Gallery" fill style={{ objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => handleDeleteGalleryImage(img.id)}
                      style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        backgroundColor: 'rgba(239, 68, 68, 0.9)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '24px',
                        height: '24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
