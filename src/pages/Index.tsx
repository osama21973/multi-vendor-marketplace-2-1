
import PageLayout from '../components/layout/PageLayout';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import CategoriesSection from '../components/home/CategoriesSection';
import StatsSection from '../components/home/StatsSection';
import CTASection from '../components/home/CTASection';

const Index = () => {
  return (
    <PageLayout>
      <HeroSection />
      <FeaturesSection />
      <CategoriesSection />
      <StatsSection />
      <CTASection />
    </PageLayout>
  );
};

export default Index;
