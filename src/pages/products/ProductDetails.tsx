
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../integrations/supabase/client';
import PageLayout from '../../components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '../../contexts/LanguageContext';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Minus, Plus, ShoppingCart, Store } from 'lucide-react';
import ProductReviews from '../../components/products/ProductReviews';

const ProductDetails = () => {
  const { id } = useParams();
  const { language } = useLanguage();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  // Fetch product details
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          stores(id, name_en, name_ar, logo_url)
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching product:', error);
        throw error;
      }
      
      return data;
    },
  });

  const increaseQuantity = () => {
    if (product?.inventory && quantity < product.inventory) {
      setQuantity(quantity + 1);
    } else {
      toast({
        title: "Maximum quantity reached",
        description: "You've reached the maximum available stock for this product.",
        variant: "destructive",
      });
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const addToCart = () => {
    toast({
      title: "Added to cart",
      description: `${quantity} item(s) added to your cart.`,
    });
    // Actual cart functionality would be implemented here
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 w-2/3 mb-8 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-10 bg-gray-200 w-full rounded"></div>
                <div className="h-6 bg-gray-200 w-1/3 rounded"></div>
                <div className="h-20 bg-gray-200 w-full rounded"></div>
                <div className="h-12 bg-gray-200 w-1/2 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!product) {
    return (
      <PageLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </PageLayout>
    );
  }

  const productName = language === 'ar' ? product.name_ar : product.name_en;
  const productDescription = language === 'ar' ? product.description_ar : product.description_en;
  const storeName = product.stores ? 
    (language === 'ar' ? product.stores.name_ar : product.stores.name_en) : 
    '';

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-gray-100 h-96 flex items-center justify-center">
            <span className="text-gray-400">Product Image</span>
          </div>
          
          {/* Product Information */}
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">{productName}</h1>
            
            {/* Store information */}
            {product.stores && (
              <Link 
                to={`/stores/${product.stores.id}`}
                className="flex items-center text-marketplace-primary hover:underline"
              >
                <Store className="h-4 w-4 mr-2" />
                {storeName}
              </Link>
            )}
            
            {/* Rating */}
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <span 
                  key={i} 
                  className={`text-xl ${i < Math.round(product.rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  ★
                </span>
              ))}
              <span className="ml-2 text-gray-600">({product.rating?.toFixed(1) || '0.0'})</span>
            </div>
            
            {/* Price */}
            <div className="text-3xl font-bold text-marketplace-primary">
              ${product.price.toFixed(2)}
            </div>
            
            {/* Description */}
            {productDescription && (
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-700">{productDescription}</p>
              </div>
            )}
            
            {/* Inventory status */}
            <div className="text-sm">
              {product.inventory > 0 ? (
                <span className="text-green-600">
                  In Stock ({product.inventory} available)
                </span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </div>
            
            {/* Quantity selector */}
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input 
                type="number" 
                min="1" 
                max={product.inventory || 1} 
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-20 text-center"
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={increaseQuantity}
                disabled={product.inventory ? quantity >= product.inventory : true}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Add to cart button */}
            <Button 
              onClick={addToCart} 
              disabled={product.inventory <= 0}
              size="lg"
              className="w-full"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
        
        <Separator className="my-12" />
        
        {/* Product reviews */}
        <ProductReviews productId={product.id} />
      </div>
    </PageLayout>
  );
};

export default ProductDetails;
