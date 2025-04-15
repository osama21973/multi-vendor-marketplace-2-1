
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';
import PageLayout from '../../components/layout/PageLayout';
import ProductCard from '../../components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../../contexts/LanguageContext';
import { Store, Mail } from 'lucide-react';

const StoreDetails = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  
  // Fetch store details
  const { data: store, isLoading: storeLoading } = useQuery({
    queryKey: ['store', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select(`
          *,
          store_categories(name_en, name_ar)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching store:', error);
        throw error;
      }
      
      return data;
    },
  });
  
  // Fetch store products
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['storeProducts', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', id)
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching store products:', error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!id,
  });
  
  // Loading state
  if (storeLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-200 w-1/3 mb-4 rounded"></div>
            <div className="h-4 bg-gray-200 w-1/4 mb-8 rounded"></div>
            
            <div className="h-8 bg-gray-200 w-1/4 mb-6 rounded"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-72 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  // Not found state
  if (!store) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Store Not Found</h2>
          <p className="mb-8">The store you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/stores">Browse Stores</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }
  
  const storeName = language === 'ar' ? store.name_ar : store.name_en;
  const categoryName = store.store_categories ? 
    (language === 'ar' ? store.store_categories.name_ar : store.store_categories.name_en) : 
    '';

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Store Header */}
        <div className="bg-gray-50 p-8 rounded-lg mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Store Logo */}
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow">
              {store.logo_url ? (
                <img 
                  src={store.logo_url} 
                  alt={storeName}
                  className="max-w-full max-h-full object-contain rounded-full"
                />
              ) : (
                <div className="text-4xl font-bold text-gray-300">
                  {storeName.charAt(0)}
                </div>
              )}
            </div>
            
            {/* Store Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{storeName}</h1>
              {categoryName && (
                <p className="text-gray-600 mb-4">{categoryName}</p>
              )}
              
              {/* Contact/Follow Actions */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact
                </Button>
                <Button variant="outline" size="sm">
                  <Store className="h-4 w-4 mr-2" />
                  Follow
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Products Section */}
        <h2 className="text-2xl font-bold mb-6">Products</h2>
        
        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-72 bg-gray-100 animate-pulse rounded"></div>
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              No products available
            </h3>
            <p className="text-gray-500">
              This store hasn't added any products yet.
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default StoreDetails;
