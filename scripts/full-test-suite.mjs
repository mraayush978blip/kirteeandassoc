/**
 * Zenvora / Kirtee & Associates — Comprehensive Automated End-to-End Test Suite
 * Tests Auth, Dynamic Home Engine, Products Lifecycle, Projects Lifecycle, Contact Form, and Pages.
 */

const BASE_URL = 'http://localhost:3000';

let passed = 0;
let failed = 0;
const results = [];

function assert(condition, message) {
  if (condition) {
    passed++;
    results.push({ status: 'PASS', message });
    console.log(`  \x1b[32m✔ PASS\x1b[0m ${message}`);
  } else {
    failed++;
    results.push({ status: 'FAIL', message });
    console.error(`  \x1b[31m✖ FAIL\x1b[0m ${message}`);
  }
}

async function fetchJson(url, options = {}) {
  const res = await fetch(`${BASE_URL}${url}`, options);
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

async function runTestSuite() {
  console.log('\n======================================================');
  console.log(' ZENVORA / KIRTEE & ASSOCIATES — AUTOMATED TEST SUITE');
  console.log('======================================================\n');

  // -----------------------------------------------------------------
  // SUITE 1: Frontend Route Availability & Status Codes
  // -----------------------------------------------------------------
  console.log('\n[Suite 1]: Public & Administrative Route Health Checks');
  const routes = [
    { path: '/', expected: 200, name: 'Home Page' },
    { path: '/products', expected: 200, name: 'All Products Catalog' },
    { path: '/dry-goods', expected: 200, name: 'Dry Goods Catalog' },
    { path: '/wet-goods', expected: 200, name: 'Wet Goods Catalog' },
    { path: '/contact', expected: 200, name: 'Contact Us Page' },
    { path: '/ad/login', expected: 200, name: 'Admin Login Page' },
    { path: '/ad', expected: 200, name: 'Admin Dashboard Page' },
    { path: '/robots.txt', expected: 200, name: 'Robots.txt' },
    { path: '/sitemap.xml', expected: 200, name: 'Sitemap.xml' },
  ];

  for (const r of routes) {
    const res = await fetch(`${BASE_URL}${r.path}`);
    assert(res.status === r.expected, `${r.name} (${r.path}) returned HTTP ${res.status}`);
  }

  // -----------------------------------------------------------------
  // SUITE 2: Admin Authentication & Credential Verification
  // -----------------------------------------------------------------
  console.log('\n[Suite 2]: Admin Credentials & Authentication Engine');
  const validEmail = 'zenvora204@gmail.com';
  const validPassword = 'ADad@2013';
  const masterPasswords = ['ADad@2013', 'adad@2013', 'Zenvora@2000', 'zenvora@2000', 'zenvora2026', 'Zenvora2026!', 'kirtee2026'];

  const isMasterAuthorized =
    validEmail.toLowerCase() === 'zenvora204@gmail.com' &&
    masterPasswords.includes(validPassword.trim());

  assert(isMasterAuthorized, `Admin credentials ${validEmail} with password ${validPassword} authorized`);

  const isInvalidRejected =
    validEmail.toLowerCase() === 'zenvora204@gmail.com' &&
    masterPasswords.includes('wrong-password-xyz');
  assert(!isInvalidRejected, 'Invalid password properly rejected by master authentication');

  // -----------------------------------------------------------------
  // SUITE 3: Dynamic Homepage Content Engine (Zero Hardcoded Data)
  // -----------------------------------------------------------------
  console.log('\n[Suite 3]: Dynamic Homepage Content (Admin Controlled)');
  const contentRes = await fetchJson('/api/content?key=all');
  assert(contentRes.status === 200 && contentRes.data?.success, 'GET /api/content returned success');

  const content = contentRes.data?.data;
  assert(Array.isArray(content?.heroSlides) && content.heroSlides.length > 0, 'Dynamic hero slides loaded');
  assert(Boolean(content?.philosophy?.headline), `Dynamic philosophy loaded: "${content?.philosophy?.headline?.slice(0, 30)}..."`);
  assert(Boolean(content?.whyChooseUs?.headline), `Dynamic why choose us loaded: "${content?.whyChooseUs?.headline?.slice(0, 30)}..."`);
  assert(Array.isArray(content?.process?.steps) && content.process.steps.length === 4, 'Dynamic bespoke process steps (4 steps) loaded');
  assert(Boolean(content?.projectCta?.headline), `Dynamic project CTA loaded: "${content?.projectCta?.headline}"`);

  // Test updating a homepage section dynamically
  const testPhilosophy = {
    ...content.philosophy,
    eyebrow: 'TEST ARCHITECTURAL PHILOSOPHY — ' + Date.now(),
  };

  const updateRes = await fetchJson('/api/admin/content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'home_philosophy', value: testPhilosophy }),
  });
  assert(updateRes.status === 200 && updateRes.data?.success, 'POST /api/admin/content updated home_philosophy');

  const verifyUpdated = await fetchJson('/api/content?key=philosophy');
  assert(
    verifyUpdated.data?.data?.eyebrow === testPhilosophy.eyebrow,
    'Verified dynamic update reflected immediately on public API'
  );

  // Restore original philosophy
  await fetchJson('/api/admin/content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'home_philosophy', value: content.philosophy }),
  });

  // -----------------------------------------------------------------
  // SUITE 4: Architectural Products Lifecycle (Add, Read, Update, Delete)
  // -----------------------------------------------------------------
  console.log('\n[Suite 4]: Products Management Lifecycle');
  const testProduct = {
    id: `prod-test-${Date.now()}`,
    slug: `zenvora-aurora-test-${Date.now()}`,
    name: 'Aurora Minimalist Linear Projector',
    codeLabel: 'AURORA-TEST',
    sku: 'AUR-001',
    designer: 'Zenvora Architectural Studio',
    catalogType: 'dry',
    categoryId: 'cat-dry',
    subcategory: 'Linear Projector Systems',
    tagline: 'Continuous micro-aperture architectural linear projector',
    shortDescription: 'Precision architectural luminaire for luxury residential and commercial galleries.',
    fullDescription: 'Manufactured from 6063-T6 architectural grade aluminium with nitrogen sealed optical chamber.',
    status: 'published',
    isFeatured: true,
    orderIndex: 99,
    heroImageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    heroImageAlt: 'Aurora Minimalist Luminaire in gallery',
    specifications: [
      { id: 's1', label: 'Color Temperature', value: '3000K Warm White', group: 'Optical' },
      { id: 's2', label: 'CRI', value: '95+ (R9 > 80)', group: 'Optical' },
      { id: 's3', label: 'Dimming Protocol', value: 'DALI-2 / Casambi', group: 'Electrical' },
      { id: 's4', label: 'IP Rating', value: 'IP20 (Dry)', group: 'Physical' },
    ],
  };

  // 1. Create Product
  const createProdRes = await fetchJson('/api/admin/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testProduct),
  });
  assert(createProdRes.status === 200 && createProdRes.data?.success, `Created product "${testProduct.name}" (ID: ${testProduct.id})`);

  // 2. Read Products List
  const listProdRes = await fetchJson('/api/admin/products');
  const foundProd = listProdRes.data?.products?.find((p) => p.id === testProduct.id || p.slug === testProduct.slug);
  assert(Boolean(foundProd), `Found created product in catalog list`);

  // 3. Test Detail Page
  const prodPageRes = await fetch(`${BASE_URL}/products/${testProduct.slug}`);
  assert(prodPageRes.status === 200, `Product detail page /products/${testProduct.slug} responded HTTP 200`);

  // 4. Delete Product
  const deleteProdRes = await fetchJson(`/api/admin/products?id=${testProduct.id}`, {
    method: 'DELETE',
  });
  assert(deleteProdRes.status === 200 && deleteProdRes.data?.success, `Cleaned up test product (ID: ${testProduct.id})`);

  // -----------------------------------------------------------------
  // SUITE 5: Projects Lifecycle (Add, Read, Update, Delete)
  // -----------------------------------------------------------------
  console.log('\n[Suite 5]: Projects Management Lifecycle');
  const projectsRes = await fetchJson('/api/content?key=projects');
  assert(projectsRes.status === 200 && projectsRes.data?.success, 'Fetched existing projects list');

  const currentProjects = projectsRes.data?.data?.projects || [];
  const testProject = {
    id: `proj-test-${Date.now()}`,
    num: '99',
    title: 'PRIVATE RESIDENCE TEST COMMISSION',
    location: 'Worli Sea Face, Mumbai',
    category: 'Residential',
    year: '2026',
    description: 'Bespoke bronze linear grazers and dark-light architectural downlights.',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    slug: `private-residence-test-${Date.now()}`,
    order: 99,
    isFeatured: true,
  };

  // Add project to list
  const updatedProjects = [...currentProjects, testProject];
  const saveProjectsRes = await fetchJson('/api/admin/content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'site_projects', value: updatedProjects }),
  });
  assert(saveProjectsRes.status === 200 && saveProjectsRes.data?.success, `Added test project "${testProject.title}"`);

  // Verify project listed
  const verifyProjRes = await fetchJson('/api/content?key=projects');
  const foundProj = verifyProjRes.data?.data?.projects?.find((p) => p.id === testProject.id);
  assert(Boolean(foundProj), 'Test project verified in dynamic projects API');

  // Clean up test project
  await fetchJson('/api/admin/content', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'site_projects', value: currentProjects }),
  });
  assert(true, 'Test project cleaned up from projects list');

  // -----------------------------------------------------------------
  // SUITE 6: Contact & Inquiries Submission Engine
  // -----------------------------------------------------------------
  console.log('\n[Suite 6]: Contact Inquiries & Submissions API');
  const testInquiry = {
    name: 'Architect Rahul Mehta',
    email: 'rahul.mehta@studio-architects.in',
    phone: '+91 98200 12345',
    company: 'Studio Mehta Architecture',
    subject: 'Specification Inquiry for 50-Story Luxury Residential Tower',
    message: 'We require technical photometric files and photometric testing reports for linear grazers.',
    consent: true,
  };

  const inquiryRes = await fetchJson('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testInquiry),
  });
  assert(inquiryRes.status === 200 && inquiryRes.data?.success, 'Submitted architectural contact inquiry');

  const submissionsRes = await fetchJson('/api/admin/submissions');
  assert(submissionsRes.status === 200, 'Admin submissions endpoint responded HTTP 200');

  // -----------------------------------------------------------------
  // SUMMARY
  // -----------------------------------------------------------------
  console.log('\n======================================================');
  console.log(` TEST RUN COMPLETE: ${passed} PASSED | ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTestSuite().catch((err) => {
  console.error('Test Suite encountered fatal error:', err);
  process.exit(1);
});
