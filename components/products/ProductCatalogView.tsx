'use client';

import React, { useState, useMemo } from 'react';
import { Product, ProductCategory } from '@/types/product';
import { ProductFilterBar } from './ProductFilterBar';
import { ProductGrid } from './ProductGrid';

export interface ProductCatalogViewProps {
  initialProducts: Product[];
  categories: ProductCategory[];
  initialCategory?: string;
}

export const ProductCatalogView: React.FC<ProductCatalogViewProps> = ({
  initialProducts,
  categories,
  initialCategory = 'all',
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredProducts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return initialProducts.filter((product) => {
      // Category check
      if (selectedCategory !== 'all' && product.category.slug !== selectedCategory) {
        return false;
      }
      // Search query check
      if (!q) return true;
      const matchesName = product.name.toLowerCase().includes(q);
      const matchesSku = product.sku.toLowerCase().includes(q);
      const matchesDesc = product.shortDescription.toLowerCase().includes(q);
      const matchesTags = product.tags?.some((t) => t.toLowerCase().includes(q));
      const matchesSpecs = product.specifications.some(
        (s) => s.label.toLowerCase().includes(q) || s.value.toLowerCase().includes(q)
      );
      return matchesName || matchesSku || matchesDesc || matchesTags || matchesSpecs;
    });
  }, [initialProducts, selectedCategory, searchQuery]);

  return (
    <div>
      <ProductFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalCount={filteredProducts.length}
      />

      <ProductGrid
        products={filteredProducts}
        emptyMessage={
          searchQuery
            ? `No luminaires found matching "${searchQuery}".`
            : 'No luminaires currently available in this category.'
        }
      />
    </div>
  );
};
