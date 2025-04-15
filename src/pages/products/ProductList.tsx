
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import PageLayout from '../../components/layout/PageLayout';
import ProductCard from '../../components/products/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../integrations/supabase/client';
import { Separator } from '@/components/ui/separator';
import { Search } from 'lucide-react';

const ProductList = () => {
  const { t, language } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState<number>(0);
  
  const category = searchParams.get('category') || undefined;
  const storeId = searchParams.get('store') || undefined;

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (category) params.set('category', category);
    if (storeId) params.set('store', storeId);
    setSearchParams(params);
  }, [searchTerm, category, storeId, setSearchParams]);

  // Fetch products with filters
  const { data: products, isLoading } = useQuery({
    queryKey: ['products', searchTerm, category, storeId, priceRange, minRating],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*, stores(name_en, name_ar)')
        .eq('published', true)
        .gte('price', priceRange[0])
        .lte('price', priceRange[1])
        .gte('rating', minRating)
        .order('created_at', { ascending: false });

      // Apply text search if present
      if (searchTerm) {
        if (language === 'en') {
          query = query.ilike('name_en', `%${searchTerm}%`);
        } else {
          query = query.ilike('name_ar', `%${searchTerm}%`);
        }
      }

      // Apply category filter if present
      if (category) {
        // Assuming products have a category field or join to a category table
        // This might need adjustment based on your schema
        query = query.eq('category', category);
      }

      // Apply store filter if present
      if (storeId) {
        query = query.eq('store_id', storeId);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      return data || [];
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already handled by the useEffect
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('Products')}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Filters sidebar */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">{t('Search')}</h3>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder={t('Search products...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button type="submit" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4">{t('Price Range')}</h3>
              <Slider
                defaultValue={[priceRange[0], priceRange[1]]}
                max={1000}
                step={10}
                onValueChange={(values) => setPriceRange([values[0], values[1]])}
              />
              <div className="flex justify-between mt-2 text-sm text-gray-600">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4">{t('Min Rating')}</h3>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    variant={minRating >= rating ? "default" : "outline"}
                    onClick={() => setMinRating(rating)}
                    className="w-10 h-10 p-0"
                  >
                    {rating}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Products grid */}
          <div className="col-span-1 md:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-72 bg-gray-100 animate-pulse rounded-md"></div>
                ))}
              </div>
            ) : products && products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-600">
                  {t('No products found')}
                </h3>
                <p className="mt-2 text-gray-500">
                  {t('Try adjusting your search or filter criteria')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProductList;
