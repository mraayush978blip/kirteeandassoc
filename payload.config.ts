import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import path from 'path';
import sharp from 'sharp';

import { Users } from './payload/collections/Users';
import { Products } from './payload/collections/Products';
import { Categories } from './payload/collections/Categories';
import { Media } from './payload/collections/Media';
import { Submissions } from './payload/collections/Submissions';

import { SiteSettings } from './payload/globals/SiteSettings';
import { HomePage } from './payload/globals/HomePage';
import { ContactPage } from './payload/globals/ContactPage';

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— Kirtee & Associates CMS',
    },
  },
  collections: [Users, Products, Categories, Media, Submissions],
  globals: [SiteSettings, HomePage, ContactPage],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'kirtee_assoc_super_secure_secret_key_2026_spec',
  typescript: {
    outputFile: path.resolve(process.cwd(), 'types/payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: (process.env.DATABASE_URI || process.env.DATABASE_URL || 'postgres://postgres:postgres@127.0.0.1:5432/kirtee_assoc')
        .replace(/[?&]sslmode=[^&]+/g, '')
        .replace(/\?$/, ''),
      ssl: {
        rejectUnauthorized: false,
      },
    },
  }),
  sharp,
});
