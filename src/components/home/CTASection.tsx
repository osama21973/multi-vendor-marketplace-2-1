
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const CTASection = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-br from-marketplace-primary to-marketplace-tertiary rounded-2xl p-8 md:p-12 text-white text-center shadow-lg">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start selling?</h2>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of vendors who are growing their business with our marketplace platform.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 rtl:sm:space-x-reverse">
            <Link to="/signup">
              <Button size="lg" className="bg-white text-marketplace-primary hover:bg-gray-100 px-8">
                Create Your Store
              </Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
