
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';
import PageLayout from '../../components/layout/PageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '../../contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const StoreList = () => {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Fetch store categories
  const { data: categories } = useQuery({
    queryKey: ['storeCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('store_categories')
        .select('*')
        .order('name_en', { ascending: true });
      
      if (error) {
        console.error('Error fetching store categories:', error);
        throw error;
      }
      
      return data || [];
    },
  });
  
  // Fetch stores with filtering
  const { data: stores, isLoading } = useQuery({
    queryKey: ['stores', searchTerm, selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from('stores')
        .select(`
          *,
          store_categories(name_en, name_ar)
        `)
        .eq('is_active', true);
      
      // Apply text search if present
      if (searchTerm) {
        if (language === 'en') {
          query = query.ilike('name_en', `%${searchTerm}%`);
        } else {
          query = query.ilike('name_ar', `%${searchTerm}%`);
        }
      }
      
      // Apply category filter if selected
      if (selectedCategory && selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching stores:', error);
        throw error;
      }
      
      return data || [];
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is triggered by state changes
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Stores</h1>
        
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <form onSubmit={handleSearch} className="flex gap-2 flex-1">
            <Input
              placeholder="Search stores..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </form>
          
          {/* Category Filter */}
          <div className="w-full md:w-64">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {language === 'ar' ? category.name_ar : category.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Store Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-60 bg-gray-100 animate-pulse rounded-md"></div>
            ))}
          </div>
        ) : stores && stores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <Link to={`/stores/${store.id}`} key={store.id}>
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
                  <div className="h-40 bg-gray-100 flex items-center justify-center">
                    {store.logo_url ? (
                      <img 
                        src={store.logo_url} 
                        alt={language === 'ar' ? store.name_ar : store.name_en}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-4xl font-bold text-gray-300">
                        {(language === 'ar' ? store.name_ar : store.name_en).charAt(0)}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-lg mb-1">
                      {language === 'ar' ? store.name_ar : store.name_en}
                    </h3>
                    {store.store_categories && (
                      <p className="text-sm text-gray-500">
                        {language === 'ar' ? 
                          store.store_categories.name_ar : 
                          store.store_categories.name_en}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600">
              No stores found
            </h3>
            <p className="mt-2 text-gray-500">
              Try adjusting your search criteria
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default StoreList;
