
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '../components/layout/PageLayout';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import CategoriesSection from '../components/home/CategoriesSection';
import StatsSection from '../components/home/StatsSection';
import CTASection from '../components/home/CTASection';
import ProductCarousel from '../components/products/ProductCarousel';
import TopStores from '../components/stores/TopStores';
import { supabase } from '../integrations/supabase/client';

const Index = () => {
  // Fetch featured products
  const { data: featuredProducts } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('published', true)
        .order('rating', { ascending: false })
        .limit(8);
      
      if (error) {
        console.error('Error fetching featured products:', error);
        throw error;
      }
      
      return data || [];
    },
  });
  
  // Fetch top stores
  const { data: topStores } = useQuery({
    queryKey: ['topStores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('is_active', true)
        .limit(6);
      
      if (error) {
        console.error('Error fetching top stores:', error);
        throw error;
      }
      
      return data || [];
    },
  });

  // Fetch stats data
  const { data: stats } = useQuery({
    queryKey: ['marketplaceStats'],
    queryFn: async () => {
      // Get product count
      const { count: productCount, error: productError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
        
      // Get vendor (stores) count
      const { count: vendorCount, error: vendorError } = await supabase
        .from('stores')
        .select('*', { count: 'exact', head: true });
      
      // Get customer count (users with role 'customer')
      const { count: customerCount, error: customerError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'customer');
      
      if (productError || vendorError || customerError) {
        console.error('Error fetching stats:', { productError, vendorError, customerError });
        return null;
      }
      
      return {
        productCount: productCount || 0,
        vendorCount: vendorCount || 0,
        customerCount: customerCount || 0,
      };
    },
  });

  return (
    <PageLayout>
      <HeroSection />
      <FeaturesSection />
      
      {/* Featured Products */}
      {featuredProducts && featuredProducts.length > 0 && (
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
            <ProductCarousel products={featuredProducts} />
          </div>
        </section>
      )}
      
      <CategoriesSection />
      
      {/* Top Stores */}
      {topStores && topStores.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Featured Stores</h2>
            <TopStores stores={topStores} />
          </div>
        </section>
      )}
      
      <StatsSection customStats={stats} />
      <CTASection />
    </PageLayout>
  );
};

export default Index;
