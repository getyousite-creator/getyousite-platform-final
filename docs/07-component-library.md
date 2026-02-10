# الأمر 7: مكتبة المكونات الذكية — 15 مكون أساسي

> **المرجع:** أمر Component Library #7

---

## المكونات الـ 15 الأساسية

### 1. 🏆 بطل الهيرو (Hero Section)
```typescript
{
  type: 'hero',
  variants: ['image-split', 'video-bg', 'text-center', 'gradient-overlay'],
  customizable: {
    headline: string,           // العنوان الرئيسي
    subtitle: string,           // العنوان الفرعي
    cta_text: string,           // نص الزر
    cta_url: string,            // رابط الزر
    background_image: string,   // صورة الخلفية
    text_alignment: 'right' | 'center' | 'left',
    overlay_opacity: number,    // شفافية الطبقة (0-100)
    height: 'full' | 'large' | 'medium',
  },
  ai_selection: 'إذا كان النشاط بصريًا (مطعم/فندق) → image-split | إذا رسمي (محاماة) → text-center'
}
```

### 2. ⚡ شريط الميزات (Features Bar)
```typescript
{
  type: 'features',
  variants: ['3-columns', '4-columns', 'alternating', 'icons-grid'],
  customizable: {
    items: Array<{ icon: string, title: string, description: string }>,
    columns: 2 | 3 | 4,
    icon_style: 'outlined' | 'filled' | 'colored-bg',
    background_color: string,
  },
  ai_selection: 'عدد الأعمدة حسب عدد الميزات المستخلصة من الوصف'
}
```

### 3. 📸 معرض الصور (Gallery)
```typescript
{
  type: 'gallery',
  variants: ['masonry', 'grid', 'carousel', 'lightbox'],
  customizable: {
    images: Array<{ src: string, alt: string, caption?: string }>,
    columns: 2 | 3 | 4,
    gap: 'none' | 'small' | 'medium',
    show_captions: boolean,
    enable_lightbox: boolean,
  },
  ai_selection: 'إذا imageDensity=dominant → masonry | إذا medium → grid-3'
}
```

### 4. 📋 قائمة الخدمات/المنتجات (Services List)
```typescript
{
  type: 'services',
  variants: ['cards-grid', 'list-detailed', 'pricing-table', 'tabs'],
  customizable: {
    items: Array<{ name: string, description: string, price?: string, image?: string }>,
    show_prices: boolean,
    layout: 'grid' | 'list',
    card_style: 'elevated' | 'bordered' | 'flat',
  },
  ai_selection: 'إذا كان النشاط يحتاج أسعار → pricing-table | غير ذلك → cards-grid'
}
```

### 5. 📞 نموذج الاتصال (Contact Form)
```typescript
{
  type: 'contact-form',
  variants: ['simple', 'with-map', 'split-layout', 'floating'],
  customizable: {
    fields: Array<{ name: string, type: 'text' | 'email' | 'phone' | 'textarea', required: boolean }>,
    show_map: boolean,
    map_address: string,
    phone_number: string,
    email: string,
    social_links: Record<string, string>,
  },
  ai_selection: 'إذا كان نشاط محلي (مطعم/عيادة) → with-map | غير ذلك → simple'
}
```

### 6. 👥 قائمة الفريق (Team Grid)
```typescript
{
  type: 'team',
  variants: ['photo-cards', 'minimal-list', 'circular-avatars', 'hover-reveal'],
  customizable: {
    members: Array<{ name: string, role: string, photo: string, bio?: string }>,
    columns: 2 | 3 | 4,
    show_social: boolean,
    photo_shape: 'circle' | 'square' | 'rounded',
  },
  ai_selection: 'إذا طلب العميل "صور الطهاة/الفريق" → photo-cards'
}
```

### 7. 🎯 دعوة للإجراء (CTA Section)
```typescript
{
  type: 'cta',
  variants: ['full-width-gradient', 'split-image', 'minimal-text', 'countdown'],
  customizable: {
    headline: string,
    description: string,
    button_text: string,
    button_url: string,
    background: 'gradient' | 'solid' | 'image',
    urgency: boolean,  // إذا true → يضيف "لفترة محدودة"
  },
  ai_selection: 'دائمًا يُضاف قبل الـ Footer'
}
```

### 8. ⭐ آراء العملاء (Testimonials)
```typescript
{
  type: 'testimonials',
  variants: ['carousel', 'grid-cards', 'single-spotlight', 'masonry-quotes'],
  customizable: {
    reviews: Array<{ name: string, role: string, text: string, rating: number, avatar?: string }>,
    show_ratings: boolean,
    auto_play: boolean,
    style: 'quoted' | 'card' | 'bubble',
  },
  ai_selection: 'إذا كان صناعة خدمات → carousel | B2B → grid-cards'
}
```

### 9. ❓ الأسئلة الشائعة (FAQ Accordion)
```typescript
{
  type: 'faq',
  variants: ['accordion', 'two-columns', 'tabbed', 'search-enabled'],
  customizable: {
    items: Array<{ question: string, answer: string }>,
    initial_open: number, // أول سؤال مفتوح
    search_enabled: boolean,
  },
  ai_selection: 'تُضاف تلقائيًا إذا كان النشاط يحتاج شرح (طبي/قانوني/تقني)'
}
```

### 10. 📊 قسم الأرقام/الإحصائيات (Stats Counter)
```typescript
{
  type: 'stats',
  variants: ['counter-row', 'cards-with-icons', 'progress-bars'],
  customizable: {
    stats: Array<{ label: string, value: number, suffix?: string, icon?: string }>,
    animate_on_scroll: boolean,
    background: 'transparent' | 'colored' | 'gradient',
  },
  ai_selection: 'تُضاف إذا كان النشاط يحتاج دليل اجتماعي (عملاء، مشاريع، سنوات)'
}
```

### 11. 🗺️ الموقع على الخريطة (Map Section)
```typescript
{
  type: 'map',
  variants: ['embedded', 'static-image', 'with-directions'],
  customizable: {
    address: string,
    coordinates: { lat: number, lng: number },
    zoom: number,
    show_directions_button: boolean,
    working_hours: Array<{ day: string, hours: string }>,
  },
  ai_selection: 'تُضاف تلقائيًا لأي نشاط محلي (مطعم/عيادة/متجر)'
}
```

### 12. 📰 قسم المدونة المصغر (Blog Preview)
```typescript
{
  type: 'blog-preview',
  variants: ['3-cards', 'list-with-thumbnails', 'featured-plus-grid'],
  customizable: {
    posts_count: 3 | 4 | 6,
    show_date: boolean,
    show_excerpt: boolean,
    card_style: 'elevated' | 'bordered' | 'minimal',
  },
  ai_selection: 'تُضاف إذا اختار العميل صفحة مدونة'
}
```

### 13. 🎨 شريط الشعارات/الشركاء (Logo Bar)
```typescript
{
  type: 'logo-bar',
  variants: ['static-row', 'scrolling', 'grid-logos'],
  customizable: {
    logos: Array<{ src: string, alt: string, url?: string }>,
    title: string, // "شركاؤنا" أو "عملاؤنا"
    grayscale: boolean,
    auto_scroll: boolean,
  },
  ai_selection: 'تُضاف إذا كان B2B أو لديه شراكات'
}
```

### 14. 📅 نموذج الحجز (Booking Form)
```typescript
{
  type: 'booking',
  variants: ['date-time', 'calendar-view', 'simple-request'],
  customizable: {
    fields: ['date', 'time', 'guests', 'name', 'phone', 'notes'],
    available_days: string[], // أيام العمل
    time_slots: string[],     // فترات متاحة
    confirmation_text: string,
  },
  ai_selection: 'تُضاف إذا طلب العميل حجز/مواعيد'
}
```

### 15. 🦶 التذييل الكامل (Footer)
```typescript
{
  type: 'footer',
  variants: ['4-columns', '3-columns', 'minimal-centered', 'mega-footer'],
  customizable: {
    columns: Array<{ title: string, links: Array<{ text: string, url: string }> }>,
    show_social: boolean,
    social_links: Record<string, string>,
    show_newsletter: boolean,
    copyright_text: string,
    background: 'dark' | 'light' | 'gradient',
  },
  ai_selection: 'دائمًا → 4-columns إذا > 5 صفحات | 3-columns إذا أقل'
}
```

---

## خوارزمية الاختيار الذكي:

```typescript
function selectAndConfigureComponents(
  analysis: SiteAnalysis,
  tokens: DesignTokens
): ConfiguredComponent[] {

  const result: ConfiguredComponent[] = [];

  // ═══ المكونات الإجبارية (كل موقع) ═══
  result.push(configureHero(analysis, tokens));
  result.push(configureFeatures(analysis));
  result.push(configureCTA(analysis));
  result.push(configureFooter(analysis));

  // ═══ المكونات الشرطية ═══
  if (analysis.functional_requirements.includes('gallery') || tokens.imageDensity === 'dominant') {
    result.push(configureGallery(analysis, tokens));
  }

  if (analysis.functional_requirements.includes('reservation-form')) {
    result.push(configureBooking(analysis));
  }

  if (analysis.functional_requirements.includes('team-gallery')) {
    result.push(configureTeam(analysis));
  }

  if (analysis.business_type.includes('restaurant') || analysis.business_type.includes('shop')) {
    result.push(configureServices(analysis, { show_prices: true }));
  }

  if (analysis.suggested_pages.includes('contact')) {
    result.push(configureContact(analysis, {
      show_map: isLocalBusiness(analysis),
    }));
  }

  if (analysis.needs_social_proof) {
    result.push(configureTestimonials(analysis));
    result.push(configureStats(analysis));
  }

  if (analysis.suggested_pages.includes('blog')) {
    result.push(configureBlogPreview());
  }

  if (needsExplanation(analysis.business_type)) {
    result.push(configureFAQ(analysis));
  }

  return result;
}
```

---

*نهاية الأمر 7 — مكتبة المكونات الذكية*
