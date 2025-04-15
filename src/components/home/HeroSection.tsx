
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-marketplace-light to-white py-20 md:py-28">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-8 rtl:md:pr-0 rtl:md:pl-8 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-marketplace-dark">
              {t('hero.title')}
            </h1>
            <p className="text-lg text-gray-700 max-w-lg">
              {t('hero.subtitle')}
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse pt-4">
              <Link to="/signup">
                <Button className="bg-marketplace-primary hover:bg-marketplace-secondary text-white px-8 py-6 rounded-lg text-lg">
                  {t('hero.cta')}
                </Button>
              </Link>
              <Link to="/stores">
                <Button variant="outline" className="border-marketplace-primary text-marketplace-primary hover:bg-marketplace-light px-8 py-6 rounded-lg text-lg">
                  {t('hero.secondary')}
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 mt-12 md:mt-0">
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-marketplace-accent rounded-full opacity-60 animate-float"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-marketplace-primary rounded-full opacity-30 animate-float"></div>
              <div className="bg-white rounded-2xl shadow-lg p-6 relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="aspect-square bg-marketplace-light rounded-lg p-4 flex items-center justify-center">
                    <img src="https://images.unsplash.com/photo-1650082088750-28af82b96f85?auto=format&fit=crop&w=200&h=200" alt="Electronics" className="w-full h-full object-cover rounded" />
                  </div>
                  <div className="aspect-square bg-marketplace-light rounded-lg p-4 flex items-center justify-center">
                    <img src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=200&h=200" alt="Fashion" className="w-full h-full object-cover rounded" />
                  </div>
                  <div className="aspect-square bg-marketplace-light rounded-lg p-4 flex items-center justify-center">
                    <img src="https://images.unsplash.com/photo-1565524336597-61e1b8919cfd?auto=format&fit=crop&w=200&h=200" alt="Home & Garden" className="w-full h-full object-cover rounded" />
                  </div>
                  <div className="aspect-square bg-marketplace-light rounded-lg p-4 flex items-center justify-center">
                    <img src="https://images.unsplash.com/photo-1515355758951-ba5f6baafa22?auto=format&fit=crop&w=200&h=200" alt="Health & Beauty" className="w-full h-full object-cover rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
