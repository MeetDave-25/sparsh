// Client-safe: shared by the homepage, the admin editor, and the save API.
// The field schema below drives both the admin form UI and server-side validation.

export type HeroContent = {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  image: string;
  imageAlt: string;
  chipTop: string;
  chipBottom: string;
  trust: string[];
};

export type CraftContent = {
  eyebrow: string;
  headingLead: string;
  headingAccent: string;
  paragraphs: string[];
  linkLabel: string;
  linkHref: string;
  mainImage: string;
  mainAlt: string;
  accentImage: string;
  accentAlt: string;
};

export type Chapter = {
  eyebrow: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  ctaLabel: string;
  ctaHref: string;
};

export type JourneyContent = { eyebrow: string; heading: string; chapters: Chapter[] };

export type ScentItem = { name: string; note: string; desc: string; image: string; tint: string };

export type ScentsContent = { eyebrow: string; heading: string; ctaLabel: string; ctaHref: string; items: ScentItem[] };

export type CategoryItem = { slug: string; name: string; hindi: string; desc: string; image: string; emoji: string };

export type CategoriesContent = { eyebrow: string; heading: string; subtitle: string; items: CategoryItem[] };

export type FeaturedContent = { eyebrow: string; heading: string; tagline: string };

export type CustomOrderContent = {
  badge: string;
  titleLead: string;
  titleAccent: string;
  description: string;
  steps: string[];
  primaryLabel: string;
  whatsappLabel: string;
  emailLabel: string;
  note: string;
};

export type Testimonial = { name: string; location: string; rating: number; text: string; product: string };

export type TestimonialsContent = { eyebrow: string; heading: string; tagline: string; items: Testimonial[] };

export type HomeContent = {
  hero: HeroContent;
  craft: CraftContent;
  journey: JourneyContent;
  scents: ScentsContent;
  categories: CategoriesContent;
  featured: FeaturedContent;
  customOrder: CustomOrderContent;
  testimonials: TestimonialsContent;
};

/* ---------- Field schema ---------- */

export type Field =
  | { kind: 'text'; key: string; label: string; max?: number; multiline?: boolean; help?: string }
  | { kind: 'link'; key: string; label: string }
  | { kind: 'image'; key: string; label: string; help?: string }
  | { kind: 'color'; key: string; label: string }
  | { kind: 'number'; key: string; label: string; min: number; max: number }
  | { kind: 'stringList'; key: string; label: string; itemLabel: string; maxItems: number; max?: number; multiline?: boolean }
  | { kind: 'list'; key: string; label: string; itemLabel: string; titleKey: string; minItems: number; maxItems: number; fields: Field[] };

export type Section = { key: keyof HomeContent; title: string; description: string; fields: Field[] };

const t = (key: string, label: string, opts: { max?: number; multiline?: boolean; help?: string } = {}): Field => ({ kind: 'text', key, label, ...opts });
const link = (key: string, label: string): Field => ({ kind: 'link', key, label });
const img = (key: string, label: string, help?: string): Field => ({ kind: 'image', key, label, help });

export const HOME_SECTIONS: Section[] = [
  {
    key: 'hero',
    title: 'Hero',
    description: 'The first screen visitors see: headline, buttons and the floating showcase image.',
    fields: [
      t('eyebrow', 'Small badge above headline', { max: 60 }),
      t('titleLine1', 'Headline line 1 (uppercase)', { max: 60 }),
      t('titleLine2', 'Headline line 2 (italic script)', { max: 60 }),
      t('subtitle', 'Subtitle', { max: 220, multiline: true }),
      t('ctaLabel', 'Main button text', { max: 40 }),
      link('ctaHref', 'Main button link'),
      t('secondaryLabel', 'Second button text', { max: 40 }),
      link('secondaryHref', 'Second button link'),
      img('image', 'Showcase image', 'Tall portrait images (2:3) look best.'),
      t('imageAlt', 'Image description (for screen readers)', { max: 160 }),
      t('chipTop', 'Floating tag (top)', { max: 40 }),
      t('chipBottom', 'Floating tag (bottom)', { max: 40 }),
      { kind: 'stringList', key: 'trust', label: 'Trust points under the buttons', itemLabel: 'Point', maxItems: 4, max: 30 },
    ],
  },
  {
    key: 'craft',
    title: 'The Craft',
    description: 'The light cream section with two product photos.',
    fields: [
      t('eyebrow', 'Small label', { max: 40 }),
      t('headingLead', 'Heading', { max: 60 }),
      t('headingAccent', 'Heading accent word (pink italic)', { max: 40 }),
      { kind: 'stringList', key: 'paragraphs', label: 'Paragraphs', itemLabel: 'Paragraph', maxItems: 4, max: 600, multiline: true },
      t('linkLabel', 'Link text', { max: 40 }),
      link('linkHref', 'Link'),
      img('mainImage', 'Main image', 'Portrait (4:5) works best.'),
      t('mainAlt', 'Main image description', { max: 160 }),
      img('accentImage', 'Small round image', 'Shown cropped to a circle.'),
      t('accentAlt', 'Small image description', { max: 160 }),
    ],
  },
  {
    key: 'journey',
    title: 'Story Chapters',
    description: 'Poster images that swing in with a 3D reveal as visitors scroll.',
    fields: [
      t('eyebrow', 'Small label', { max: 40 }),
      t('heading', 'Section heading', { max: 80 }),
      {
        kind: 'list', key: 'chapters', label: 'Chapters', itemLabel: 'Chapter', titleKey: 'title', minItems: 0, maxItems: 6,
        fields: [
          t('eyebrow', 'Chapter label', { max: 40 }),
          t('title', 'Title', { max: 80 }),
          t('body', 'Text', { max: 600, multiline: true }),
          img('image', 'Poster image', 'Tall portrait images (2:3) look best.'),
          t('alt', 'Image description', { max: 160 }),
          t('ctaLabel', 'Link text', { max: 40 }),
          link('ctaHref', 'Link'),
        ],
      },
    ],
  },
  {
    key: 'scents',
    title: '3D Scent Carousel',
    description: 'The pinned section where scents rotate on a 3D ring while scrolling.',
    fields: [
      t('eyebrow', 'Small label', { max: 40 }),
      t('heading', 'Heading', { max: 60 }),
      t('ctaLabel', 'Link text', { max: 40 }),
      link('ctaHref', 'Link'),
      {
        kind: 'list', key: 'items', label: 'Scents', itemLabel: 'Scent', titleKey: 'name', minItems: 3, maxItems: 12,
        fields: [
          t('name', 'Name', { max: 24 }),
          t('note', 'Second word (gold italic)', { max: 30 }),
          t('desc', 'Description', { max: 160, multiline: true }),
          img('image', 'Jar photo', 'Square or portrait product shots work best.'),
          { kind: 'color', key: 'tint', label: 'Glow colour' },
        ],
      },
    ],
  },
  {
    key: 'categories',
    title: 'Shop by Category',
    description: 'Category cards. The first one is shown large.',
    fields: [
      t('eyebrow', 'Small label', { max: 40 }),
      t('heading', 'Heading', { max: 60 }),
      t('subtitle', 'Subtitle', { max: 160 }),
      {
        kind: 'list', key: 'items', label: 'Categories', itemLabel: 'Category', titleKey: 'name', minItems: 1, maxItems: 5,
        fields: [
          t('name', 'Name', { max: 40 }),
          t('slug', 'Category ID used in shop filter', { max: 40, help: 'Must match the product category, e.g. candles' }),
          t('hindi', 'Hindi word', { max: 30 }),
          t('desc', 'Short description', { max: 80 }),
          t('emoji', 'Emoji', { max: 8 }),
          img('image', 'Image'),
        ],
      },
    ],
  },
  {
    key: 'featured',
    title: 'Bestsellers Heading',
    description: 'Heading above the featured products. Products themselves are managed under Products (tick "Featured").',
    fields: [
      t('eyebrow', 'Small label', { max: 40 }),
      t('heading', 'Heading', { max: 60 }),
      t('tagline', 'Tagline', { max: 160 }),
    ],
  },
  {
    key: 'customOrder',
    title: 'Custom Order Banner',
    description: 'The call-to-action block inviting custom orders.',
    fields: [
      t('badge', 'Badge', { max: 40 }),
      t('titleLead', 'Heading', { max: 60 }),
      t('titleAccent', 'Heading accent line', { max: 60 }),
      t('description', 'Description', { max: 400, multiline: true }),
      { kind: 'stringList', key: 'steps', label: 'Steps', itemLabel: 'Step', maxItems: 5, max: 40 },
      t('primaryLabel', 'Main button text', { max: 40 }),
      t('whatsappLabel', 'WhatsApp button text', { max: 40 }),
      t('emailLabel', 'Email button text', { max: 40 }),
      t('note', 'Small note', { max: 160 }),
    ],
  },
  {
    key: 'testimonials',
    title: 'Testimonials',
    description: 'Customer reviews carousel.',
    fields: [
      t('eyebrow', 'Small label', { max: 40 }),
      t('heading', 'Heading', { max: 60 }),
      t('tagline', 'Tagline', { max: 160 }),
      {
        kind: 'list', key: 'items', label: 'Reviews', itemLabel: 'Review', titleKey: 'name', minItems: 0, maxItems: 20,
        fields: [
          t('name', 'Customer name', { max: 60 }),
          t('location', 'City', { max: 40 }),
          { kind: 'number', key: 'rating', label: 'Stars', min: 1, max: 5 },
          t('product', 'Product', { max: 60 }),
          t('text', 'Review', { max: 600, multiline: true }),
        ],
      },
    ],
  },
];

/* ---------- Defaults (what the site shows until an admin edits it) ---------- */

export const DEFAULT_HOME_CONTENT: HomeContent = {
  hero: {
    eyebrow: 'Handcrafted in India · Dil Se',
    titleLine1: 'Dil Se Banaya,',
    titleLine2: 'Aapke Liye',
    subtitle: 'Handcrafted with love — candles, resin art, jewellery & more, made just for you.',
    ctaLabel: 'Explore Our Collection',
    ctaHref: '/products',
    secondaryLabel: '✨ Custom Order',
    secondaryHref: '/customize',
    image: '/story/wave-wreath-fantasy.jpg',
    imageAlt: 'SpArsh Wave Sea Breeze candle, floating in a wreath of blossoms',
    chipTop: 'Small-batch hand-poured',
    chipBottom: '8 signature scents',
    trust: ['100% Soy Wax', 'Hand-poured', '40+ Hour Burn'],
  },
  craft: {
    eyebrow: 'The Craft',
    headingLead: 'The Art of',
    headingAccent: 'Blossom',
    paragraphs: [
      'Somewhere between the quiet ritual of the pour and the first flicker of the wick, layers of florals steep slowly, wrapped in warm sandalwood and a whisper of gold. Every SpArsh candle is hand-poured in small batches — never rushed, never mass-made.',
      '100% soy wax, cotton wicks, and skin-safe fragrance oils, finished by hand in a jar you’ll want to keep long after the last burn.',
    ],
    linkLabel: 'Discover the Collection',
    linkHref: '/products',
    mainImage: '/products/blossom-1.jpg',
    mainAlt: 'Sparsh Blossom Flower Bouquet soy candle',
    accentImage: '/products/mogra-bloom.jpg',
    accentAlt: 'Sparsh Mogra Bloom soy candle',
  },
  journey: {
    eyebrow: 'The Journey',
    heading: 'More Than a Scent, It’s a Feeling',
    chapters: [
      {
        eyebrow: 'Chapter One',
        title: 'A Ritual, Not a Routine',
        body: 'Warm mocha and coffee latte, wrapped in jasmine. Lit at the end of a long day, it turns any room into a slow morning — the kind you wish lasted longer.',
        image: '/story/mocha-wreath-fantasy.jpg',
        alt: 'SpArsh Mocha Coffee Latte candle wrapped in a wreath of jasmine',
        ctaLabel: 'Shop Mocha Coffee Latte',
        ctaHref: '/products?category=candles',
      },
      {
        eyebrow: 'Chapter Two',
        title: 'Handcrafted With Love, Always',
        body: 'Every SpArsh piece — candle, resin, or jewellery — is made by hand in small batches. Premium ingredients, long-lasting scent, inspired by nature. Never rushed, never mass-made.',
        image: '/story/scents-that-stay-1.jpg',
        alt: 'SpArsh Divine Art Studio — handcrafted with love, inspired by nature',
        ctaLabel: 'Read Our Story',
        ctaHref: '/about',
      },
    ],
  },
  scents: {
    eyebrow: 'Eight Signature Scents',
    heading: 'Find Your Feeling',
    ctaLabel: 'Shop all candles',
    ctaHref: '/products?category=candles',
    items: [
      { name: 'Blossom', note: 'Flower Bouquet', desc: 'Rose, peony and baby’s breath, soft as a first bouquet.', image: '/products/blossom-1.jpg', tint: '#E8A0B4' },
      { name: 'Mocha', note: 'Coffee Latte', desc: 'Roasted coffee, cream and cocoa for slow mornings.', image: '/products/mocha-coffee-latte-1.jpg', tint: '#C49A6C' },
      { name: 'Wave', note: 'Sea Breeze', desc: 'Salt air, driftwood and cool ocean mist.', image: '/products/wave-sea-breeze.jpg', tint: '#8EC5E0' },
      { name: 'White Musk', note: 'Pure', desc: 'Clean musk and white florals, like fresh linen.', image: '/products/white-musk-pure.jpg', tint: '#D8E4EE' },
      { name: 'Mogra', note: 'Bloom', desc: 'Night-blooming jasmine, straight from a summer garden.', image: '/products/mogra-bloom.jpg', tint: '#EDE6D2' },
      { name: 'Lemon', note: 'Fresh', desc: 'Zesty lemon peel and green leaves. Pure sunshine.', image: '/products/lemon-fresh.jpg', tint: '#F2E27A' },
      { name: 'Lavender', note: 'Calm', desc: 'French lavender and chamomile to help you unwind.', image: '/products/lavender-calm.jpg', tint: '#B9A6DE' },
      { name: 'Glow', note: 'Summer Breeze', desc: 'Frangipani, peach and golden-hour warmth.', image: '/products/glow-summer-breeze.jpg', tint: '#F2B27A' },
    ],
  },
  categories: {
    eyebrow: 'Our Collections',
    heading: 'Shop by Category',
    subtitle: 'Five collections, one heart. Every piece handcrafted with love.',
    items: [
      { slug: 'candles', name: 'Handmade Candles', hindi: 'Roshnai', desc: 'Soy, scented & decorative', image: '/products/blossom-1.jpg', emoji: '🕯️' },
      { slug: 'resin', name: 'Resin Art', hindi: 'Shristi', desc: 'Trays, bookmarks & keychains', image: 'https://images.unsplash.com/photo-1615529579399-1e63fd3a9580?w=600&q=80', emoji: '🌸' },
      { slug: 'jewelry', name: 'Jewellery', hindi: 'Zevar', desc: 'Necklaces, rings & bracelets', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=600&q=80', emoji: '💎' },
      { slug: 'crafts', name: 'Stationery & Crafts', hindi: 'Kala', desc: 'Cards, bookmarks & more', image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&q=80', emoji: '✉️' },
      { slug: 'hampers', name: 'Gift Hampers', hindi: 'Tohfa', desc: 'Curated sets for every occasion', image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=600&q=80', emoji: '🎁' },
    ],
  },
  featured: {
    eyebrow: 'Bestsellers',
    heading: 'Most Loved Pieces',
    tagline: '“Aapke pyaaron ke liye, kuch khaas” — Something special for your loved ones',
  },
  customOrder: {
    badge: 'Personalized For You',
    titleLead: 'Make it Yours —',
    titleAccent: 'Bilkul Aapke Liye ✨',
    description: 'Want a soy candle in your favourite scent? A resin tray in your wedding colours? Jewellery with your initials? We craft everything to order. Share your idea, and we’ll bring it to life — with love.',
    steps: ['Tell us what you want', 'We confirm & price it', 'You pay after approval', 'We craft & deliver ✨'],
    primaryLabel: 'Start Custom Order',
    whatsappLabel: 'Chat on WhatsApp',
    emailLabel: 'Send an Email',
    note: 'We respond within 24 hours • No advance payment until we confirm your order 🌸',
  },
  testimonials: {
    eyebrow: 'Customer Love',
    heading: 'What People Say',
    tagline: '“Aapki khushi, hamari taakat” — Your joy is our strength',
    items: [
      { name: 'Priya Sharma', location: 'Mumbai', rating: 5, product: 'Rose Petal Soy Candle', text: 'I ordered a custom soy candle for my mom’s birthday and she absolutely loved it! The scent was perfect, the packaging was beautiful, and the delivery was right on time. Sparsh truly creates magic!' },
      { name: 'Ananya Mehta', location: 'Bengaluru', rating: 5, product: 'Custom Resin Tray', text: 'Got the custom resin tray for my wedding and it was STUNNING. Matched our theme perfectly. The whole process — from placing the order to delivery — was so smooth. Will definitely order again! 🌸' },
      { name: 'Shreya Patel', location: 'Ahmedabad', rating: 5, product: 'Rose Quartz Crystal Ring', text: 'The rose quartz ring is so delicate and beautiful. Got compliments everywhere I went! The quality is amazing for the price. And the team was so responsive on WhatsApp. Loved the whole experience.' },
      { name: 'Kavya Nair', location: 'Kochi', rating: 5, product: 'Dil Se Gift Hamper', text: 'Ordered the Dil Se Hamper for my best friend’s anniversary. She cried happy tears! Everything was packaged so thoughtfully with a handwritten note. This is not just a product — it’s a feeling.' },
      { name: 'Ritu Agarwal', location: 'Jaipur', rating: 5, product: 'Handmade Greeting Cards', text: 'The handmade greeting cards are absolutely gorgeous. I gave them as Diwali gifts and everyone wanted to know where I got them! Going to order for Christmas too. Sparsh is my go-to for gifting.' },
    ],
  },
};

/* ---------- Validation / normalisation ---------- */

const SAFE_LINK = /^(\/(?!\/)|https?:\/\/|mailto:|tel:)/i;
const SAFE_IMAGE = /^(\/(?!\/)|https:\/\/)/i;
const HEX = /^#[0-9a-f]{6}$/i;

type Obj = Record<string, unknown>;

function cleanText(v: unknown, fallback: string, max = 500): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : fallback;
}

function normalizeFields(fields: Field[], input: unknown, fallback: Obj): Obj {
  const src = (input && typeof input === 'object' ? input : {}) as Obj;
  const out: Obj = {};
  for (const f of fields) {
    const v = src[f.key];
    const fb = fallback[f.key];
    switch (f.kind) {
      case 'text':
        out[f.key] = cleanText(v, fb as string, f.max);
        break;
      case 'link': {
        const s = cleanText(v, fb as string, 300);
        out[f.key] = s === '' || SAFE_LINK.test(s) ? s : (fb as string);
        break;
      }
      case 'image': {
        const s = cleanText(v, fb as string, 500);
        out[f.key] = s === '' || SAFE_IMAGE.test(s) ? s : (fb as string);
        break;
      }
      case 'color': {
        const s = cleanText(v, fb as string, 7);
        out[f.key] = HEX.test(s) ? s : (fb as string);
        break;
      }
      case 'number': {
        const n = typeof v === 'number' ? v : Number(v);
        out[f.key] = Number.isFinite(n) ? Math.min(f.max, Math.max(f.min, Math.round(n))) : fb;
        break;
      }
      case 'stringList': {
        out[f.key] = Array.isArray(v)
          ? v.filter((x) => typeof x === 'string').map((x) => (x as string).trim().slice(0, f.max ?? 500)).filter(Boolean).slice(0, f.maxItems)
          : fb;
        break;
      }
      case 'list': {
        if (!Array.isArray(v)) {
          out[f.key] = fb;
          break;
        }
        const itemFallback = ((fb as Obj[])?.[0] ?? {}) as Obj;
        const blank = Object.fromEntries(Object.keys(itemFallback).map((k) => [k, typeof itemFallback[k] === 'number' ? itemFallback[k] : '']));
        out[f.key] = v.slice(0, f.maxItems).map((item) => normalizeFields(f.fields, item, blank));
        break;
      }
    }
  }
  return out;
}

/** Validates untrusted input and fills gaps from defaults, so the homepage always gets a complete object. */
export function normalizeHomeContent(input: unknown): HomeContent {
  const src = (input && typeof input === 'object' ? input : {}) as Obj;
  const out: Obj = {};
  for (const section of HOME_SECTIONS) {
    out[section.key] = normalizeFields(section.fields, src[section.key], DEFAULT_HOME_CONTENT[section.key] as unknown as Obj);
  }
  return out as unknown as HomeContent;
}

/** next/image only optimises local paths and whitelisted hosts; anything else is shown as-is. */
export function isRemoteImage(src: string): boolean {
  return !src.startsWith('/');
}
