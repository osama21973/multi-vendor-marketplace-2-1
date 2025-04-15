
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '../../contexts/LanguageContext';

interface Store {
  id: string;
  name_en: string;
  name_ar: string;
  logo_url: string | null;
}

interface TopStoresProps {
  stores: Store[];
}

const TopStores = ({ stores }: TopStoresProps) => {
  const { language } = useLanguage();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
      {stores.map((store) => (
        <Link to={`/stores/${store.id}`} key={store.id}>
          <Card className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-32 bg-gray-100 flex items-center justify-center">
              {store.logo_url ? (
                <img 
                  src={store.logo_url} 
                  alt={language === 'ar' ? store.name_ar : store.name_en}
                  className="max-h-full max-w-full object-contain" 
                />
              ) : (
                <div className="text-2xl font-bold text-gray-400">
                  {(language === 'ar' ? store.name_ar : store.name_en).charAt(0)}
                </div>
              )}
            </div>
            <CardContent className="p-4 text-center">
              <h3 className="font-medium">
                {language === 'ar' ? store.name_ar : store.name_en}
              </h3>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export default TopStores;
