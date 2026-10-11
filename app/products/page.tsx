import React from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Architectural Catalogue | Kirtee & Associates',
  description: 'Explore the portfolio of architectural luminaires by Kirtee & Associates.',
};

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  const category = resolvedSearchParams?.category;

  if (category === 'wet' || category === 'wet-goods') {
    redirect('/wet-goods');
  }

  // Default to dry-goods as requested in the reference structure
  redirect('/dry-goods');
}
