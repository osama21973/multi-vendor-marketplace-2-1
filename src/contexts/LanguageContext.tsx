
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';
type Direction = 'ltr' | 'rtl';

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Simple translations - we'll expand this later
const translations = {
  en: {
    'app.name': 'MarketHaven',
    'app.tagline': 'Your Ultimate Multi-Vendor Marketplace',
    'nav.home': 'Home',
    'nav.stores': 'Stores',
    'nav.categories': 'Categories',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.signup': 'Sign Up',
    'nav.dashboard': 'Dashboard',
    'hero.title': 'Buy and Sell Anything',
    'hero.subtitle': 'Join thousands of vendors and customers in our growing marketplace',
    'hero.cta': 'Get Started',
    'hero.secondary': 'Explore Stores',
    'features.title': 'Why Choose MarketHaven',
    'features.vendors': 'For Vendors',
    'features.vendors.desc': 'Reach more customers and grow your business',
    'features.customers': 'For Customers',
    'features.customers.desc': 'Shop from thousands of verified vendors',
    'features.platform': 'Powerful Platform',
    'features.platform.desc': 'Secure payments and smooth experience',
    'categories.title': 'Browse Categories',
    'footer.rights': 'All rights reserved',
    'footer.terms': 'Terms & Conditions',
    'footer.privacy': 'Privacy Policy',
  },
  ar: {
    'app.name': 'ماركت هافن',
    'app.tagline': 'منصتك المثالية متعددة البائعين',
    'nav.home': 'الرئيسية',
    'nav.stores': 'المتاجر',
    'nav.categories': 'التصنيفات',
    'nav.about': 'من نحن',
    'nav.contact': 'اتصل بنا',
    'nav.login': 'تسجيل الدخول',
    'nav.signup': 'إنشاء حساب',
    'nav.dashboard': 'لوحة التحكم',
    'hero.title': 'اشترِ وبِع أي شيء',
    'hero.subtitle': 'انضم إلى آلاف البائعين والعملاء في سوقنا المتنامي',
    'hero.cta': 'ابدأ الآن',
    'hero.secondary': 'استكشف المتاجر',
    'features.title': 'لماذا تختار ماركت هافن',
    'features.vendors': 'للبائعين',
    'features.vendors.desc': 'وصول إلى المزيد من العملاء وتنمية أعمالك',
    'features.customers': 'للعملاء',
    'features.customers.desc': 'تسوق من آلاف البائعين الموثوقين',
    'features.platform': 'منصة قوية',
    'features.platform.desc': 'مدفوعات آمنة وتجربة سلسة',
    'categories.title': 'تصفح التصنيفات',
    'footer.rights': 'جميع الحقوق محفوظة',
    'footer.terms': 'الشروط والأحكام',
    'footer.privacy': 'سياسة الخصوصية',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    document.body.dir = direction;
  }, [language, direction]);

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
