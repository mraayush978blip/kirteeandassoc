/**
 * Kirtee & Associates — end-to-end API test suite.
 * Run the app first (`npm run dev` or `npm start`), then:  npm run test:e2e
 * Admin credentials are read from .env.local (ADMIN_EMAIL / ADMIN_PASSWORD).
 */
import { BASE_URL, loginAdmin } from './_auth.mjs';

let passed = 0;
let failed = 0;
function assert(cond, msg) {
  if (cond) { passed++; console.log(`  \x1b[32m✔\x1b[0m ${msg}`); }
  else { failed++; console.error(`  \x1b[31m✖ FAIL\x1b[0m ${msg}`); }
}
async function call(path, { method = 'GET', body, cookie, headers = {}, raw } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    redirect: 'manual',
    headers: { ...(body && !raw ? { 'Content-Type': 'application/json' } : {}), ...(cookie ? { Cookie: cookie } : {}), ...headers },
    body: raw ?? (body !== undefined ? JSON.stringify(body) : undefined),
  });
  let json = null;
  try { json = await res.clone().json(); } catch {}
  return { status: res.status, json, res };
}

const ADMIN_GETS = ['/api/admin/content', '/api/admin/products', '/api/admin/submissions', '/api/admin/media', '/api/admin/site-images', '/api/admin/clean-images', '/api/admin/db-status'];

async function main() {
  console.log(`\nTesting ${BASE_URL}\n`);

  console.log('[1] Public routes');
  for (const [p, ok] of [['/', [200]], ['/products', [200, 307, 308]], ['/dry-goods', [200]], ['/wet-goods', [200]], ['/contact', [200]], ['/ad/login', [200]], ['/robots.txt', [200]], ['/sitemap.xml', [200]], ['/does-not-exist', [404]]]) {
    const r = await fetch(`${BASE_URL}${p}`, { redirect: 'manual' });
    assert(ok.includes(r.status), `${p} -> ${r.status}`);
  }

  console.log('\n[2] Admin API is closed to anonymous users');
  for (const p of ADMIN_GETS) assert((await call(p)).status === 401, `GET ${p} requires auth`);
  for (const [p, m, b] of [['/api/admin/content', 'POST', { key: 'site_contact', value: {} }], ['/api/admin/products', 'POST', { name: 'x' }], ['/api/admin/products?id=x', 'DELETE'], ['/api/admin/clean-images', 'POST', { filenames: ['a.webp'] }], ['/api/admin/site-images', 'POST', { id: 'x' }]]) {
    assert((await call(p, { method: m, body: b })).status === 401, `${m} ${p} requires auth`);
  }
  const forged = await call('/api/admin/products', { cookie: 'kirtee_admin_session=eyJlbWFpbCI6ImV2aWxAeC5jb20ifQ.fake' });
  assert(forged.status === 401, 'forged session cookie rejected');

  console.log('\n[3] Login');
  const bad = await call('/api/admin/login', { method: 'POST', body: { email: process.env.ADMIN_EMAIL || 'zenvora204@gmail.com', password: 'definitely-wrong' } });
  assert(bad.status === 401 || bad.status === 429, `wrong password rejected (${bad.status})`);
  const notAdmin = await call('/api/admin/login', { method: 'POST', body: { email: 'random@example.com', password: 'whatever' } });
  assert(notAdmin.status === 401 || notAdmin.status === 429, 'non-admin email rejected');
  assert((await call('/api/admin/login', { method: 'POST', raw: 'not json', headers: { 'Content-Type': 'application/json' } })).status === 400, 'malformed login body -> 400');
  const { cookie } = await loginAdmin();
  assert(cookie.includes('kirtee_admin_session='), 'login sets session cookie');
  const sess = await call('/api/admin/session', { cookie });
  assert(sess.status === 200 && sess.json?.authenticated, 'session endpoint accepts the cookie');
  for (const p of ADMIN_GETS) { const r = await call(p, { cookie }); assert(r.status === 200, `GET ${p} works when logged in (${r.status})`); }

  console.log('\n[4] Settings API validation');
  assert((await call('/api/admin/content', { method: 'POST', cookie, body: { key: '../../etc/x', value: {} } })).status === 400, 'path-traversal key rejected');
  assert((await call('/api/admin/content', { method: 'POST', cookie, body: { key: 'nope', value: {} } })).status === 400, 'unknown key rejected');
  assert((await call('/api/admin/content', { method: 'POST', cookie, body: { key: 'hero_slides', value: {} } })).status === 400, 'wrong value shape rejected');
  assert((await call('/api/admin/content', { method: 'POST', cookie, raw: '{bad', headers: { 'Content-Type': 'application/json' } })).status === 400, 'malformed JSON -> 400');
  const current = await call('/api/admin/content?key=project_cta', { cookie });
  const cta = (await call('/api/admin/content?key=home_project_cta', { cookie })).json?.data;
  const rt = await call('/api/admin/content', { method: 'POST', cookie, body: { key: 'home_project_cta', value: cta } });
  assert(current.status === 200 && rt.status === 200 && rt.json?.success, 'valid setting round-trips');
  const originalTypo = (await call('/api/admin/content?key=site_typography', { cookie })).json?.data;
  const typo = await call('/api/admin/content', { method: 'POST', cookie, body: { key: 'site_typography', value: { ...originalTypo, headingFont: 'Cinzel</style><script>alert(1)</script>' } } });
  const savedTypo = (await call('/api/admin/content?key=site_typography', { cookie })).json?.data;
  assert(typo.status === 200 && !JSON.stringify(savedTypo).includes('<script>'), 'typography font injection is sanitised');
  // restore the real typography so the test never changes live settings
  await call('/api/admin/content', { method: 'POST', cookie, body: { key: 'site_typography', value: originalTypo } });

  console.log('\n[5] Product validation + lifecycle');
  assert((await call('/api/admin/products', { method: 'POST', cookie, body: {} })).status === 400, 'empty product rejected');
  assert((await call('/api/admin/products', { method: 'POST', cookie, body: { name: 'X', slug: '../../bad<script>' } })).status === 400, 'bad slug rejected');
  assert((await call('/api/admin/products', { method: 'POST', cookie, body: { name: 'X', catalogType: 'zzz' } })).status === 400, 'bad catalogType rejected');
  const slug = `qa-test-${Date.now()}`;
  const created = await call('/api/admin/products', { method: 'POST', cookie, body: { name: 'QA Test Luminaire', slug, catalogType: 'dry' } });
  assert(created.status === 200 && created.json?.success, 'valid product created');
  assert((await call('/api/admin/products', { method: 'POST', cookie, body: { name: 'Dup', slug, catalogType: 'dry' } })).status === 409, 'duplicate slug -> 409');
  const list = (await call('/api/admin/products', { cookie })).json?.products || [];
  const mine = list.find((p) => p.slug === slug);
  assert(!!mine, 'new product appears in catalog');
  const upd = await call('/api/admin/products', { method: 'POST', cookie, body: { ...mine, tagline: 'edited' } });
  assert(upd.status === 200, 'existing product can be edited by id');
  assert((await call(`/api/admin/products?id=${encodeURIComponent(mine?.id || slug)}`, { method: 'DELETE', cookie })).status === 200, 'product deleted');
  assert((await call('/api/admin/products?id=does-not-exist', { method: 'DELETE', cookie })).status === 404, 'deleting a missing product -> 404');

  console.log('\n[6] Uploads + cleaner safety');
  const fd = new FormData();
  fd.append('files', new Blob(['not an image'], { type: 'image/png' }), 'fake.png');
  const fake = await fetch(`${BASE_URL}/api/admin/compress`, { method: 'POST', headers: { Cookie: cookie }, body: fd });
  assert(fake.status === 400, `fake image (spoofed MIME) rejected with 400 (got ${fake.status})`);
  const trav = await call('/api/admin/clean-images', { method: 'POST', cookie, body: { filenames: ['../../package.json'] } });
  assert(trav.json?.deletedCount === 0, 'cleaner refuses path traversal');
  const scan = (await call('/api/admin/clean-images', { cookie })).json;
  assert(!(scan?.unusedImages || []).some((i) => i.filename === 'bespoke-cylinder-luminaire.webp'), 'cleaner does not flag images hard-coded in components');

  console.log('\n[7] Contact form');
  assert((await call('/api/contact', { method: 'POST', raw: 'nope', headers: { 'Content-Type': 'application/json' } })).status === 400, 'malformed JSON -> 400');
  assert((await call('/api/contact', { method: 'POST', body: {} })).status === 400, 'empty submission -> 400');
  assert((await call('/api/contact', { method: 'POST', body: { name: 'a', email: 'bad', message: 'long enough message' } })).status === 400, 'bad email -> 400');
  assert((await call('/api/contact', { method: 'POST', body: { name: 'a', email: 'a@b.co', message: 'short' } })).status === 400, 'short message -> 400');
  assert((await call('/api/contact', { method: 'POST', body: { websiteHoneypot: 'bot' } })).status === 200, 'honeypot silently accepted (nothing stored)');

  console.log('\n[8] Enquiries API + console gate');
  assert((await call('/api/admin/submissions', { method: 'PATCH', body: { id: 'x', status: 'new' } })).status === 401, 'PATCH enquiry requires auth');
  assert((await call('/api/admin/submissions?id=x', { method: 'DELETE' })).status === 401, 'DELETE enquiry requires auth');
  assert((await call('/api/admin/submissions', { method: 'PATCH', cookie, body: { id: 'x', status: 'bogus' } })).status === 400, 'invalid enquiry status rejected');
  assert((await call('/api/admin/submissions', { method: 'PATCH', cookie, body: { id: 'does-not-exist', status: 'reviewed' } })).status === 404, 'unknown enquiry -> 404');
  assert((await call('/api/admin/submissions?id=does-not-exist', { method: 'DELETE', cookie })).status === 404, 'delete unknown enquiry -> 404');
  for (const p of ['/ad', '/ad/products', '/ad/enquiries']) {
    const r = await fetch(`${BASE_URL}${p}`, { redirect: 'manual' });
    assert(r.status === 307 && (r.headers.get('location') || '').includes('/ad/login'), `${p} redirects signed-out visitors to login (server-side)`);
    const r2 = await fetch(`${BASE_URL}${p}`, { redirect: 'manual', headers: { Cookie: cookie } });
    assert(r2.status === 200, `${p} renders for a signed-in admin`);
  }

  console.log('\n[9] Brand & logo');
  const origBrand = (await call('/api/admin/content?key=brand', { cookie })).json?.data;
  assert(origBrand && typeof origBrand.brandName === 'string' && origBrand.brandName.length > 0, 'brand settings load with a default');
  const saveBrand = (v) => call('/api/admin/content', { method: 'POST', cookie, body: { key: 'site_brand', value: v } });
  assert((await saveBrand({ ...origBrand, brandName: '   ' })).status === 400, 'empty brand name rejected');
  assert((await saveBrand({ ...origBrand, logoUrl: 'javascript:alert(1)' })).status === 400, 'javascript: logo URL rejected');
  assert((await saveBrand({ ...origBrand, logoUrl: '//evil.example/x.png' })).status === 400, 'protocol-relative logo URL rejected');
  assert((await saveBrand({ ...origBrand, brandName: 'QA Brand <b>ZZ</b>' })).status === 200, 'valid brand saved');
  const home = await (await fetch(`${BASE_URL}/contact`)).text();
  assert(!home.includes('<b>ZZ</b>'), 'brand name is HTML-escaped on the public site');
  assert((await call('/api/admin/content', { method: 'POST', body: { key: 'site_brand', value: origBrand } })).status === 401, 'brand cannot be changed without login');
  await saveBrand(origBrand); // restore the real value

  console.log('\n[10] Logout');
  await call('/api/admin/logout', { method: 'POST', cookie });
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed ? 1 : 0);
}
main().catch((e) => { console.error(e); process.exit(1); });
