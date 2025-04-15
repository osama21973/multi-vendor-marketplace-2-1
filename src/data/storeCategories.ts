
export interface StoreCategory {
  id: number;
  nameEn: string;
  nameAr: string;
  isTemplate: boolean;
  icon?: string;
}

export const storeCategories: StoreCategory[] = [
  { id: 1, nameEn: 'Electronics & Gadgets', nameAr: 'الإلكترونيات والأجهزة الذكية', isTemplate: true, icon: 'smartphone' },
  { id: 2, nameEn: 'Fashion & Apparel', nameAr: 'الموضة والملابس', isTemplate: true, icon: 'shirt' },
  { id: 3, nameEn: 'Home & Garden', nameAr: 'المنزل والحديقة', isTemplate: true, icon: 'home' },
  { id: 4, nameEn: 'Grocery & Food', nameAr: 'البقالة والأغذية', isTemplate: true, icon: 'shopping-basket' },
  { id: 5, nameEn: 'Health & Beauty', nameAr: 'الصحة والتجميل', isTemplate: true, icon: 'heart-pulse' },
  { id: 6, nameEn: 'Automotive Parts', nameAr: 'قطع غيار السيارات', isTemplate: true, icon: 'car' },
  { id: 7, nameEn: 'Toys & Games', nameAr: 'ألعاب وترفيه', isTemplate: true, icon: 'gamepad-2' },
  { id: 8, nameEn: 'Books & Media', nameAr: 'الكتب والوسائط', isTemplate: true, icon: 'book-open' },
  { id: 9, nameEn: 'Sports & Outdoor Equipment', nameAr: 'الرياضة والمعدات الخارجية', isTemplate: true, icon: 'dumbbell' },
  { id: 10, nameEn: 'Office Supplies', nameAr: 'لوازم المكتب', isTemplate: true, icon: 'briefcase' },
  { id: 11, nameEn: 'Baby & Maternity', nameAr: 'مستلزمات الأطفال والأمومة', isTemplate: true, icon: 'baby' },
  { id: 12, nameEn: 'Pet Care', nameAr: 'مستلزمات الحيوانات الأليفة', isTemplate: true, icon: 'paw-print' },
  { id: 13, nameEn: 'Luxury Goods', nameAr: 'السلع الفاخرة', isTemplate: true, icon: 'crown' },
  { id: 14, nameEn: 'DIY & Hardware', nameAr: 'الأدوات ومواد البناء', isTemplate: true, icon: 'hammer' },
  { id: 15, nameEn: 'Jewelry & Watches', nameAr: 'المجوهرات والساعات', isTemplate: true, icon: 'watch' },
  { id: 16, nameEn: 'Furniture', nameAr: 'الأثاث', isTemplate: true, icon: 'armchair' },
  { id: 17, nameEn: 'Pharmacy', nameAr: 'الصيدلية', isTemplate: true, icon: 'pill' },
  { id: 18, nameEn: 'Stationery', nameAr: 'القرطاسية', isTemplate: true, icon: 'pen-tool' },
  { id: 19, nameEn: 'Art & Crafts', nameAr: 'الفنون والحرف اليدوية', isTemplate: true, icon: 'palette' },
  { id: 20, nameEn: 'Electrical Appliances', nameAr: 'الأجهزة الكهربائية', isTemplate: true, icon: 'plug' },
  { id: 21, nameEn: 'Greeting cards, party supplies', nameAr: 'بطاقات المعايدة، مستلزمات الحفلات', isTemplate: true, icon: 'gift' },
  { id: 22, nameEn: 'Farming equipment, livestock supplies', nameAr: 'معدات الزراعة، مستلزمات الماشية', isTemplate: true, icon: 'tractor' },
  { id: 23, nameEn: 'Software subscriptions, streaming platforms', nameAr: 'اشتراكات البرمجيات، منصات البث', isTemplate: true, icon: 'video' },
  { id: 24, nameEn: 'Flight bookings, vacation rentals', nameAr: 'حجوزات الطيران، تأجير العطلات', isTemplate: true, icon: 'plane' },
  { id: 25, nameEn: 'Heavy machinery, plumbing supplies', nameAr: 'المعدات الثقيلة، مستلزمات السباكة', isTemplate: true, icon: 'wrench' },
  { id: 26, nameEn: 'Wellness items, specialized apparel', nameAr: 'منتجات العافية، الملابس المتخصصة', isTemplate: true, icon: 'lotus' },
  { id: 27, nameEn: 'Skincare treatments, spas', nameAr: 'علاجات البشرة، المنتجعات الصحية', isTemplate: true, icon: 'crystal' },
  { id: 28, nameEn: 'Food & Beverage', nameAr: 'الطعام والمشروبات', isTemplate: true, icon: 'utensils' },
  { id: 29, nameEn: 'E-sports & Gaming Merchandise', nameAr: 'منتجات الرياضات الإلكترونية والألعاب', isTemplate: true, icon: 'trophy' },
  { id: 30, nameEn: 'Supermarket', nameAr: 'سوبرماركت', isTemplate: true, icon: 'shopping-cart' },
  { id: 31, nameEn: 'Heavy Machinery', nameAr: 'المعدات الثقيلة', isTemplate: true, icon: 'truck' },
  { id: 32, nameEn: 'Construction Equipment', nameAr: 'معدات البناء', isTemplate: true, icon: 'hard-hat' },
  { id: 33, nameEn: 'Manufacturing Tools', nameAr: 'أدوات التصنيع', isTemplate: true, icon: 'tool' },
  { id: 34, nameEn: 'Industrial Safety Equipment', nameAr: 'معدات السلامة الصناعية', isTemplate: true, icon: 'shield' },
  { id: 35, nameEn: 'Electrical & Power Systems', nameAr: 'الأنظمة الكهربائية والطاقة', isTemplate: true, icon: 'zap' },
  { id: 36, nameEn: 'Agricultural Machinery', nameAr: 'الآلات الزراعية', isTemplate: true, icon: 'wheat' },
  { id: 37, nameEn: 'HVAC Systems', nameAr: 'أنظمة التدفئة والتهوية والتكييف', isTemplate: true, icon: 'thermometer' },
  { id: 38, nameEn: 'Hydraulics & Pneumatics', nameAr: 'الأنظمة الهيدروليكية والهوائية', isTemplate: true, icon: 'gauge' },
  { id: 39, nameEn: 'Welding & Metalworking', nameAr: 'اللحام وتشكيل المعادن', isTemplate: true, icon: 'cog' },
  { id: 40, nameEn: 'Industrial Fasteners', nameAr: 'أدوات التثبيت الصناعية', isTemplate: true, icon: 'link' },
  { id: 41, nameEn: 'Industrial Automation', nameAr: 'الأتمتة الصناعية', isTemplate: true, icon: 'cpu' },
  { id: 42, nameEn: 'Testing & Measurement Equipment', nameAr: 'معدات الاختبار والقياس', isTemplate: true, icon: 'ruler' },
  { id: 43, nameEn: 'Renewable Energy Equipment', nameAr: 'معدات الطاقة المتجددة', isTemplate: true, icon: 'sun' },
  { id: 44, nameEn: 'Pumps & Valves', nameAr: 'المضخات والصمامات', isTemplate: true, icon: 'filter' },
];
