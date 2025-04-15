
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name_en: string;
  name_ar: string;
  price: number;
  rating: number;
}

interface ProductCarouselProps {
  products: Product[];
}

const ProductCarousel = ({ products }: ProductCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { language, direction } = useLanguage();
  
  const productsPerPage = 4;
  const totalPages = Math.ceil(products.length / productsPerPage);
  
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };
  
  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };
  
  const currentProducts = products.slice(
    currentIndex * productsPerPage,
    (currentIndex + 1) * productsPerPage
  );
  
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={prevSlide}
          disabled={products.length <= productsPerPage}
          className={direction === 'rtl' ? 'order-2' : ''}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <span className="text-sm text-gray-500">
          {totalPages > 1 ? `${currentIndex + 1} / ${totalPages}` : ''}
        </span>
        
        <Button
          variant="outline"
          size="icon"
          onClick={nextSlide}
          disabled={products.length <= productsPerPage}
          className={direction === 'rtl' ? 'order-1' : ''}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentProducts.map((product) => (
          <Link to={`/products/${product.id}`} key={product.id}>
            <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200"></div>
              <CardContent className="p-4">
                <h3 className="font-medium line-clamp-2">
                  {language === 'ar' ? product.name_ar : product.name_en}
                </h3>
                <div className="mt-2 flex justify-between items-center">
                  <span className="font-bold text-marketplace-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm text-gray-600 ml-1">
                      {product.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductCarousel;
