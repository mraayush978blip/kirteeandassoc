/**
 * Live Verification: Admin Panel -> Frontend Live Sync Test
 * Proves that adding a product or hero slide in the admin panel immediately updates the frontend.
 */

const BASE_URL = 'http://localhost:3000';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  \x1b[32m✔ PASS\x1b[0m ${message}`);
  } else {
    failed++;
    console.error(`  \x1b[31m✖ FAIL\x1b[0m ${message}`);
  }
}

async function run() {
  console.log('\n======================================================');
  console.log(' VERIFYING ADMIN PANEL -> FRONTEND LIVE SYNCHRONIZATION');
  console.log('======================================================\n');

  // 1. Get current hero slides
  console.log('[Test 1]: Fetching original hero slides from frontend API...');
  const resHeroOriginal = await fetch(`${BASE_URL}/api/content?key=hero_slides`);
  const dataHeroOriginal = await resHeroOriginal.json();
  assert(dataHeroOriginal.success && Array.isArray(dataHeroOriginal.data), 'Current hero slides fetched successfully');
  const originalSlides = dataHeroOriginal.data || [];

  // 2. Add a new test hero slide via Admin API
  console.log('\n[Test 2]: Admin creates a new Hero Slide...');
  const testSlideId = `hero-sync-test-${Date.now()}`;
  const testSlide = {
    id: testSlideId,
    slotId: 'hero-sync-slot',
    eyebrow: 'SYNC TEST ARCHITECTURAL LIGHT',
    title: 'NEW HERO SLIDE\nFRONTEND LIVE TEST',
    subtitle: 'This slide was added directly from the admin test harness to verify live frontend rendering.',
    ctaText: 'DISCOVER LIVE TEST',
    ctaHref: '/dry-goods',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85',
    imageAlt: 'Automated test slide',
  };

  const updatedSlides = [testSlide, ...originalSlides];

  const saveSlideRes = await fetch(`${BASE_URL}/api/admin/content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'hero_slides', value: updatedSlides }),
  });
  const saveSlideData = await saveSlideRes.json();
  assert(saveSlideData.success === true, 'Admin successfully saved new Hero Slide');

  // 3. Verify Homepage & API reflect the new hero slide
  console.log('\n[Test 3]: Verifying frontend homepage reflects the new Hero Slide...');
  const resContentApi = await fetch(`${BASE_URL}/api/content?key=hero_slides`, { cache: 'no-store' });
  const dataContentApi = await resContentApi.json();
  const foundInApi = dataContentApi.data?.some((s) => s.id === testSlideId || s.eyebrow === 'SYNC TEST ARCHITECTURAL LIGHT');
  assert(foundInApi, 'New hero slide is immediately returned by /api/content?key=hero_slides');

  const homeHtmlRes = await fetch(`${BASE_URL}/`, { cache: 'no-store' });
  const homeHtml = await homeHtmlRes.text();
  const foundInHtml = homeHtml.includes('SYNC TEST ARCHITECTURAL LIGHT') || homeHtml.includes('NEW HERO SLIDE');
  assert(foundInHtml, 'Homepage SSR HTML contains the new Hero Slide title/eyebrow');

  // 4. Add a new Product via Admin API
  console.log('\n[Test 4]: Admin creates a new Product...');
  const testProductSlug = `sync-luminaire-${Date.now()}`;
  const testProductId = `prod-${testProductSlug}`;
  const testProductName = 'AURA SYNC TEST SPECIFICATION';

  const newProductPayload = {
    id: testProductId,
    slug: testProductSlug,
    sku: 'KA-SYNC-999',
    name: testProductName,
    codeLabel: 'AURA SYNC TEST',
    designer: 'Kirtee Studio Verification',
    catalogType: 'dry',
    tagline: 'Instant Frontend Propagation Test',
    shortDescription: 'Verifying real-time frontend catalog synchronization from admin panel.',
    fullDescription: 'Comprehensive test description for verifying admin to frontend flow.',
    status: 'published',
    order: 0,
    heroImage: {
      id: `img-${testProductSlug}`,
      url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1600&q=80',
      alt: testProductName,
      isPrimary: true,
    },
  };

  const saveProductRes = await fetch(`${BASE_URL}/api/admin/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newProductPayload),
  });
  const saveProductData = await saveProductRes.json();
  assert(saveProductData.success === true, 'Admin successfully saved new Product');

  // 5. Verify Product in Frontend Catalogs (/dry-goods & /products/[slug])
  console.log('\n[Test 5]: Verifying frontend catalog (/dry-goods) reflects the new Product...');
  const dryGoodsRes = await fetch(`${BASE_URL}/dry-goods`, { cache: 'no-store' });
  const dryGoodsHtml = await dryGoodsRes.text();
  const productInDryGoods = dryGoodsHtml.includes(testProductName) || dryGoodsHtml.includes(testProductSlug);
  assert(productInDryGoods, `Frontend /dry-goods page immediately displays "${testProductName}"`);

  console.log('\n[Test 6]: Verifying product detail page (/products/[slug]) loads with HTTP 200...');
  const detailRes = await fetch(`${BASE_URL}/products/${testProductSlug}`, { cache: 'no-store' });
  assert(detailRes.status === 200, `New product detail page (/products/${testProductSlug}) returned HTTP 200`);
  const detailHtml = await detailRes.text();
  assert(detailHtml.includes(testProductName), `Product detail page renders the product name "${testProductName}"`);

  // 6. Cleanup Product
  console.log('\n[Test 7]: Cleaning up test Product via Admin API...');
  const deleteProductRes = await fetch(`${BASE_URL}/api/admin/products?id=${testProductId}`, {
    method: 'DELETE',
  });
  const deleteProductData = await deleteProductRes.json();
  assert(deleteProductData.success === true, 'Admin successfully deleted test product');

  const dryGoodsAfterDelete = await (await fetch(`${BASE_URL}/dry-goods`, { cache: 'no-store' })).text();
  assert(!dryGoodsAfterDelete.includes(testProductSlug), 'Frontend /dry-goods no longer contains deleted product');

  // 7. Cleanup Hero Slide
  console.log('\n[Test 8]: Restoring original Hero Slides via Admin API...');
  const restoreSlideRes = await fetch(`${BASE_URL}/api/admin/content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ key: 'hero_slides', value: originalSlides }),
  });
  const restoreSlideData = await restoreSlideRes.json();
  assert(restoreSlideData.success === true, 'Original Hero Slides restored');

  console.log('\n======================================================');
  console.log(` SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
