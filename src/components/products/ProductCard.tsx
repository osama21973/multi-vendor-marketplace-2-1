
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../../contexts/LanguageContext';
import { ShoppingCart } from 'lucide-react';

interface Product {
  id: string;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  price: number;
  rating?: number;
  stores?: {
    name_en: string;
    name_ar: string;
  };
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { language } = useLanguage();
  
  const productName = language === 'ar' ? product.name_ar : product.name_en;
  const storeName = product.stores ? 
    (language === 'ar' ? product.stores.name_ar : product.stores.name_en) : 
    '';

  return (
    <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
      <Link to={`/products/${product.id}`} className="block">
        <div className="h-48 bg-gray-200"></div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="font-medium line-clamp-2 hover:text-marketplace-primary transition-colors">
            {productName}
          </h3>
        </Link>
        
        {storeName && (
          <p className="text-sm text-gray-500 mt-1">{storeName}</p>
        )}
        
        <div className="mt-2 flex justify-between items-center">
          <span className="font-bold text-marketplace-primary">
            ${product.price.toFixed(2)}
          </span>
          {product.rating !== undefined && (
            <div className="flex items-center">
              <span className="text-yellow-500">★</span>
              <span className="text-sm text-gray-600 ml-1">
                {product.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        
        <Button
          className="w-full mt-4"
          size="sm"
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
