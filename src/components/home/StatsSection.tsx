
import { useLanguage } from '../../contexts/LanguageContext';

const StatsSection = () => {
  const { direction } = useLanguage();
  
  const stats = [
    { value: '15,000+', label: 'Products' },
    { value: '500+', label: 'Vendors' },
    { value: '50,000+', label: 'Customers' },
    { value: '99.9%', label: 'Satisfaction' },
  ];

  return (
    <section className="bg-marketplace-primary py-16 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                {stat.value}
              </div>
              <div className="text-lg text-white/80">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
