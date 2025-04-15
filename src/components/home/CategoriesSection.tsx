
import { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { storeCategories } from '../../data/storeCategories';
import { Icon } from 'lucide-react';

const CategoriesSection = () => {
  const { t, language } = useLanguage();
  const [visibleCategories, setVisibleCategories] = useState(8);

  const displayedCategories = storeCategories.slice(0, visibleCategories);
  
  const getCategoryName = (category: typeof storeCategories[0]) => {
    return language === 'en' ? category.nameEn : category.nameAr;
  };

  const loadMore = () => {
    setVisibleCategories(prev => Math.min(prev + 8, storeCategories.length));
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-marketplace-dark mb-4">
            {t('categories.title')}
          </h2>
          <div className="w-24 h-1 bg-marketplace-primary mx-auto"></div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
          {displayedCategories.map((category) => (
            <div 
              key={category.id}
              className="bg-white rounded-xl p-6 flex flex-col items-center shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
            >
              <div className="bg-marketplace-light h-12 w-12 rounded-full flex items-center justify-center mb-4">
                {category.icon && (
                  <img 
                    src={`/icons/${category.icon}.svg`} 
                    alt={getCategoryName(category)} 
                    className="h-6 w-6"
                  />
                )}
              </div>
              <h3 className="text-center text-gray-800 font-medium">
                {getCategoryName(category)}
              </h3>
            </div>
          ))}
        </div>

        {visibleCategories < storeCategories.length && (
          <div className="mt-10 text-center">
            <button
              onClick={loadMore}
              className="px-6 py-2 rounded-lg bg-marketplace-primary text-white hover:bg-marketplace-secondary transition-colors"
            >
              Load More Categories
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
