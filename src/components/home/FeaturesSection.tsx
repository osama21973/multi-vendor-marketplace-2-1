
import { useLanguage } from '../../contexts/LanguageContext';
import { Store, ShoppingCart, LayoutDashboard } from 'lucide-react';

const FeaturesSection = () => {
  const { t } = useLanguage();

  const features = [
    {
      title: t('features.vendors'),
      description: t('features.vendors.desc'),
      icon: <Store className="h-12 w-12 text-marketplace-primary" />,
      benefits: [
        "Create and customize your store",
        "Reach more customers",
        "Process orders and manage inventory",
        "Track sales and performance"
      ]
    },
    {
      title: t('features.customers'),
      description: t('features.customers.desc'),
      icon: <ShoppingCart className="h-12 w-12 text-marketplace-primary" />,
      benefits: [
        "Browse products from multiple vendors",
        "Secure checkout and payment",
        "Track orders and delivery",
        "Rate and review products"
      ]
    },
    {
      title: t('features.platform'),
      description: t('features.platform.desc'),
      icon: <LayoutDashboard className="h-12 w-12 text-marketplace-primary" />,
      benefits: [
        "Multi-language support",
        "Secure payment processing",
        "Advanced search and filters",
        "Analytics and reporting"
      ]
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-marketplace-dark mb-4">
            {t('features.title')}
          </h2>
          <div className="w-24 h-1 bg-marketplace-primary mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="bg-marketplace-light inline-block p-3 rounded-lg mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-marketplace-dark">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {feature.description}
              </p>
              <ul className="space-y-3">
                {feature.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg 
                      className="h-5 w-5 text-marketplace-primary mt-0.5 mr-2 rtl:mr-0 rtl:ml-2" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
