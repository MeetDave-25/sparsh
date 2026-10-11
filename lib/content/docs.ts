import blogData from '@/data/blog.json';
import { img, link, normalizeFields, t, type Field } from '@/lib/homeContent';

/*
 * Everything outside the homepage that the admin can edit. Each document is a
 * set of sections; each section is a list of fields that the shared admin
 * editor knows how to render, and that normalizeDoc validates on save.
 * Defaults are what the site showed before any of this was editable.
 */

type Obj = Record<string, unknown>;

export type DocSection = { key: string; title: string; description: string; fields: Field[] };

export type ContentDoc<T> = {
  key: string;
  title: string;
  description: string;
  /** Page to open from the editor's "View" button. */
  viewHref: string;
  sections: DocSection[];
  defaults: T;
  /** Fix-ups after field validation, e.g. filling in missing slugs. */
  finalize?: (doc: T) => T;
};

const bool = (key: string, label: string, help?: string): Field => ({ kind: 'boolean', key, label, help });
const linkItem = (label = 'Label', max = 40): Field[] => [t('label', label, { max }), link('href', 'Link')];

type Link = { label: string; href: string };
type HeroText = { eyebrow: string; title: string; accent: string; subtitle: string };

const heroFields = (withImage = false): Field[] => [
  t('eyebrow', 'Small label above the title', { max: 40 }),
  t('title', 'Title', { max: 60 }),
  t('accent', 'Title, second line (italic)', { max: 60 }),
  t('subtitle', 'Subtitle', { max: 240, multiline: true }),
  ...(withImage ? [img('image', 'Image'), t('imageAlt', 'Image description (for accessibility)', { max: 160 })] : []),
];

/* ---------------------------------- Site ---------------------------------- */

export type SiteSettings = {
  contact: { phoneDisplay: string; whatsappNumber: string; email: string; location: string; hours: string };
  social: { links: { label: string; url: string }[] };
  announcement: { show: boolean; text: string; badge: string };
  navigation: { links: Link[]; ctaLabel: string; ctaHref: string };
  footer: { about: string; tagline: string; shopLinks: Link[]; studioLinks: Link[]; payments: string[]; copyright: string; showAdminLink: boolean };
  features: { welcomeScreen: boolean; whatsappButton: boolean; seasonalDecor: boolean };
  homeSections: {
    marquee: boolean;
    collections: boolean;
    mostLoved: boolean;
    moments: boolean;
    moodSlider: boolean;
    makeItYours: boolean;
    giftBundles: boolean;
    testimonials: boolean;
    bigType: boolean;
  };
};

export const SITE_DOC: ContentDoc<SiteSettings> = {
  key: 'site',
  title: 'Site Settings',
  description: 'Contact details, menu, footer, announcement bar, and which parts of the site are switched on.',
  viewHref: '/',
  sections: [
    {
      key: 'contact',
      title: 'Contact details',
      description: 'Used everywhere: footer, contact page, WhatsApp buttons and order links.',
      fields: [
        t('phoneDisplay', 'Phone number as shown', { max: 30 }),
        t('whatsappNumber', 'WhatsApp number', { max: 15, help: 'Digits only, with country code and no +, e.g. 918160901481' }),
        t('email', 'Email address', { max: 80 }),
        t('location', 'Location line', { max: 80 }),
        t('hours', 'Opening hours', { max: 60 }),
      ],
    },
    {
      key: 'social',
      title: 'Social media',
      description: 'Icons in the footer and on the contact page. Remove all to hide them.',
      fields: [
        {
          kind: 'list', key: 'links', label: 'Accounts', itemLabel: 'Account', titleKey: 'label', minItems: 0, maxItems: 8,
          fields: [t('label', 'Name (e.g. Instagram)', { max: 30 }), link('url', 'Profile link')],
        },
      ],
    },
    {
      key: 'announcement',
      title: 'Announcement bar',
      description: 'The thin strip at the very top of every page.',
      fields: [
        bool('show', 'Show the announcement bar'),
        t('text', 'Message', { max: 140, help: 'Leave empty to use the active seasonal theme’s message.' }),
        t('badge', 'Homepage badge', { max: 30, help: 'Small pill shown on the homepage. Leave empty to hide it.' }),
      ],
    },
    {
      key: 'navigation',
      title: 'Menu',
      description: 'Links in the top menu and the mobile menu. Add, remove or reorder them.',
      fields: [
        { kind: 'list', key: 'links', label: 'Menu links', itemLabel: 'Link', titleKey: 'label', minItems: 1, maxItems: 9, fields: linkItem('Label', 24) },
        t('ctaLabel', 'Button label', { max: 24 }),
        link('ctaHref', 'Button link'),
      ],
    },
    {
      key: 'footer',
      title: 'Footer',
      description: 'The bottom of every page.',
      fields: [
        t('about', 'About text', { max: 240, multiline: true }),
        t('tagline', 'Tagline (italic)', { max: 60 }),
        { kind: 'list', key: 'shopLinks', label: '“Shop” links', itemLabel: 'Link', titleKey: 'label', minItems: 0, maxItems: 10, fields: linkItem() },
        { kind: 'list', key: 'studioLinks', label: '“Studio” links', itemLabel: 'Link', titleKey: 'label', minItems: 0, maxItems: 10, fields: linkItem() },
        { kind: 'stringList', key: 'payments', label: 'Payment methods', itemLabel: 'Method', maxItems: 8, max: 24 },
        t('copyright', 'Copyright name', { max: 60 }),
        bool('showAdminLink', 'Show the “Studio Admin” link'),
      ],
    },
    {
      key: 'features',
      title: 'Features on / off',
      description: 'Switch whole features on or off across the site.',
      fields: [
        bool('welcomeScreen', 'Welcome screen with the panda', 'Shown once per visit before the homepage.'),
        bool('whatsappButton', 'Floating WhatsApp button'),
        bool('seasonalDecor', 'Seasonal decorations', 'Snow, lights, garlands and other theme effects.'),
      ],
    },
    {
      key: 'homeSections',
      title: 'Homepage sections',
      description: 'Hide or show each part of the homepage. The opening hero, story and scents always show.',
      fields: [
        bool('marquee', 'Scrolling benefits strip'),
        bool('collections', 'Shop by category'),
        bool('mostLoved', 'Most loved pieces'),
        bool('moments', 'Moments photo strip'),
        bool('moodSlider', 'Mood slider'),
        bool('makeItYours', 'Make it yours (custom orders)'),
        bool('giftBundles', 'Gift hampers'),
        bool('testimonials', 'Customer reviews'),
        bool('bigType', 'Big “Hand poured” sign-off'),
      ],
    },
  ],
  defaults: {
    contact: {
      phoneDisplay: '+91 81609 01481',
      whatsappNumber: '918160901481',
      email: 'info@sparshdivineartstudio.com',
      location: 'India 🇮🇳 — Delivering nationwide',
      hours: 'Mon–Sat, 10am–7pm',
    },
    social: {
      links: [
        { label: 'Instagram', url: 'https://instagram.com' },
        { label: 'Facebook', url: 'https://facebook.com' },
      ],
    },
    announcement: { show: true, text: '', badge: 'Custom orders open' },
    navigation: {
      links: [
        { href: '/', label: 'Home' },
        { href: '/products', label: 'Shop' },
        { href: '/customize', label: '✨ Customize' },
        { href: '/about', label: 'Our Story' },
        { href: '/gallery', label: 'Gallery' },
        { href: '/blog', label: 'Journal' },
        { href: '/contact', label: 'Contact' },
      ],
      ctaLabel: 'Custom Order',
      ctaHref: '/customize',
    },
    footer: {
      about: 'Handcrafted with love in India. Every piece carries a story, made with intention and care.',
      tagline: 'Dil se banaya, aapke liye.',
      shopLinks: [
        { label: 'Handmade Candles', href: '/products?category=candles' },
        { label: 'Resin Art', href: '/products?category=resin' },
        { label: 'Jewellery', href: '/products?category=jewelry' },
        { label: 'Stationery & Crafts', href: '/products?category=crafts' },
        { label: 'Gift Hampers', href: '/products?category=hampers' },
        { label: 'Custom Orders ✨', href: '/customize' },
      ],
      studioLinks: [
        { label: 'Our Story', href: '/about' },
        { label: 'Lookbook', href: '/gallery' },
        { label: 'Journal', href: '/blog' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Contact Us', href: '/contact' },
      ],
      payments: ['UPI', 'Bank Transfer', 'COD'],
      copyright: 'Sparsh Divine Art Studio',
      showAdminLink: true,
    },
    features: { welcomeScreen: true, whatsappButton: true, seasonalDecor: true },
    homeSections: {
      marquee: true,
      collections: true,
      mostLoved: true,
      moments: true,
      moodSlider: true,
      makeItYours: true,
      giftBundles: true,
      testimonials: true,
      bigType: true,
    },
  },
  finalize: (doc) => ({
    ...doc,
    contact: { ...doc.contact, whatsappNumber: doc.contact.whatsappNumber.replace(/\D/g, '') || SITE_DOC.defaults.contact.whatsappNumber },
  }),
};

/* ---------------------------------- About --------------------------------- */

export type AboutContent = {
  hero: HeroText & { quote: string; image: string; imageAlt: string };
  story: { eyebrow: string; heading: string; paragraphs: string[]; image: string; imageAlt: string; stampTop: string; stampBottom: string };
  marquee: { words: string[] };
  values: { eyebrow: string; heading: string; items: { emoji: string; title: string; desc: string }[] };
  collections: { eyebrow: string; heading: string; items: { emoji: string; name: string; detail: string }[] };
  cta: { heading: string; tagline: string; primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string };
};

export const ABOUT_DOC: ContentDoc<AboutContent> = {
  key: 'about',
  title: 'About Page',
  description: 'The “Our Story” page.',
  viewHref: '/about',
  sections: [
    {
      key: 'hero',
      title: 'Top banner',
      description: 'The large banner at the top of the page.',
      fields: [
        t('eyebrow', 'Small label above the title', { max: 40 }),
        t('title', 'Title', { max: 60 }),
        t('accent', 'Title, second line (italic)', { max: 60 }),
        t('quote', 'Quote (italic, before the subtitle)', { max: 80 }),
        t('subtitle', 'Subtitle', { max: 200, multiline: true }),
        img('image', 'Image'),
        t('imageAlt', 'Image description (for accessibility)', { max: 160 }),
      ],
    },
    {
      key: 'story',
      title: 'Our story',
      description: 'How it started.',
      fields: [
        t('eyebrow', 'Small label', { max: 40 }),
        t('heading', 'Heading', { max: 60 }),
        { kind: 'stringList', key: 'paragraphs', label: 'Paragraphs', itemLabel: 'Paragraph', maxItems: 6, max: 900, multiline: true },
        img('image', 'Image'),
        t('imageAlt', 'Image description', { max: 160 }),
        t('stampTop', 'Round stamp, small text', { max: 12 }),
        t('stampBottom', 'Round stamp, big text', { max: 16 }),
      ],
    },
    {
      key: 'marquee',
      title: 'Scrolling words',
      description: 'The strip of words that scrolls across the page.',
      fields: [{ kind: 'stringList', key: 'words', label: 'Words', itemLabel: 'Word', maxItems: 10, max: 30 }],
    },
    {
      key: 'values',
      title: 'Our values',
      description: 'The value cards.',
      fields: [
        t('eyebrow', 'Small label', { max: 40 }),
        t('heading', 'Heading', { max: 60 }),
        {
          kind: 'list', key: 'items', label: 'Values', itemLabel: 'Value', titleKey: 'title', minItems: 0, maxItems: 8,
          fields: [t('emoji', 'Emoji', { max: 8 }), t('title', 'Title', { max: 40 }), t('desc', 'Description', { max: 300, multiline: true })],
        },
      ],
    },
    {
      key: 'collections',
      title: 'What we create',
      description: 'The numbered list of collections.',
      fields: [
        t('eyebrow', 'Small label', { max: 40 }),
        t('heading', 'Heading', { max: 60 }),
        {
          kind: 'list', key: 'items', label: 'Collections', itemLabel: 'Collection', titleKey: 'name', minItems: 0, maxItems: 10,
          fields: [t('emoji', 'Emoji', { max: 8 }), t('name', 'Name', { max: 40 }), t('detail', 'Description', { max: 300, multiline: true })],
        },
      ],
    },
    {
      key: 'cta',
      title: 'Closing call to action',
      description: 'The box at the bottom of the page.',
      fields: [
        t('heading', 'Heading', { max: 60 }),
        t('tagline', 'Tagline', { max: 120 }),
        t('primaryLabel', 'First button label', { max: 30 }),
        link('primaryHref', 'First button link'),
        t('secondaryLabel', 'Second button label', { max: 30 }),
        link('secondaryHref', 'Second button link'),
      ],
    },
  ],
  defaults: {
    hero: {
      eyebrow: 'Our Story',
      title: 'Where Every Creation',
      accent: 'Begins with a Feeling',
      quote: 'Har cheez mein ek kahani hai',
      subtitle: '— every creation holds a story.',
      image: '/story/scents-that-stay-2.jpg',
      imageAlt: 'SpArsh Divine Art Studio — scents that stay',
    },
    story: {
      eyebrow: 'Chapter One',
      heading: 'How It Started',
      paragraphs: [
        'Sparsh Divine Art Studio was born from a quiet evening with a half-melted candle, dried flowers, and a heart full of ideas. What started as a personal hobby — pouring soy candles for friends and family — grew into something much bigger: a studio where every piece is made with intention.',
        'We believe that handmade things carry energy. When something is crafted by hand with care, it holds a warmth that factory products simply cannot replicate. That belief drives every candle we pour, every resin piece we set, every piece of jewellery we wire-wrap.',
      ],
      image: '/products/mocha-coffee-latte-2.jpg',
      imageAlt: 'A SpArsh candle glowing on a quiet evening',
      stampTop: 'Est.',
      stampBottom: 'Dil Se',
    },
    marquee: { words: ['Hand-poured', 'Small batch', '100% soy wax', 'Real botanicals', 'Made in India', 'Dil se banaya'] },
    values: {
      eyebrow: 'What We Believe',
      heading: 'Our Values',
      items: [
        { emoji: '🌿', title: 'Natural & Pure', desc: 'We use natural soy wax, cotton wicks, real dried botanicals, and non-toxic materials. What goes into your home should be safe for your family.' },
        { emoji: '💕', title: 'Made with Love', desc: 'Every piece is handcrafted in small batches. We never rush. We believe the love and care we put in can be felt in the final product.' },
        { emoji: '🎨', title: 'Uniquely Yours', desc: 'No two handmade pieces are exactly alike — that’s the beauty of it. When you customize with us, you get something truly one-of-a-kind.' },
        { emoji: '🇮🇳', title: 'Proudly Indian', desc: 'Inspired by Indian florals, festivals, and traditions. Supporting local artisanship and creating livelihood through craft.' },
      ],
    },
    collections: {
      eyebrow: 'Collections',
      heading: 'What We Create',
      items: [
        { emoji: '🕯️', name: 'Handmade Candles', detail: 'Soy wax, beeswax & coconut oil blend candles — scented, decorative, pillar, and container styles. All natural, all beautiful.' },
        { emoji: '🌸', name: 'Resin Art', detail: 'Preserved flower resin trays, bookmarks, keychains, and décor. Every piece has real botanicals frozen in time.' },
        { emoji: '💎', name: 'Handmade Jewellery', detail: 'Crystal rings, pearl necklaces, charm bracelets — each piece handcrafted in gold, silver, or rose gold plate.' },
        { emoji: '✉️', name: 'Stationery & Crafts', detail: 'Handmade greeting cards with pressed flowers, bookmarks, and small craft items that make gifting extra special.' },
        { emoji: '🎁', name: 'Custom Gift Hampers', detail: 'Curated hampers combining our products with premium packaging — perfect for birthdays, anniversaries, Diwali, and weddings.' },
      ],
    },
    cta: {
      heading: 'Ready to Own Something Special?',
      tagline: '“Aapke liye kuch khaas” — Something special, just for you',
      primaryLabel: 'Shop Our Collection',
      primaryHref: '/products',
      secondaryLabel: '✨ Custom Order',
      secondaryHref: '/customize',
    },
  },
};

/* ----------------------------------- FAQ ---------------------------------- */

export type FaqContent = {
  hero: HeroText;
  groups: { items: { category: string; questions: { q: string; a: string }[] }[] };
  help: { heading: string; text: string; buttonLabel: string };
};

export const FAQ_DOC: ContentDoc<FaqContent> = {
  key: 'faq',
  title: 'FAQ Page',
  description: 'Questions and answers, grouped into categories.',
  viewHref: '/faq',
  sections: [
    { key: 'hero', title: 'Top banner', description: 'The banner at the top of the page.', fields: heroFields() },
    {
      key: 'groups',
      title: 'Questions',
      description: 'Add, remove or reorder categories and the questions inside them.',
      fields: [
        {
          kind: 'list', key: 'items', label: 'Categories', itemLabel: 'Category', titleKey: 'category', minItems: 0, maxItems: 12,
          fields: [
            t('category', 'Category name', { max: 60 }),
            {
              kind: 'list', key: 'questions', label: 'Questions', itemLabel: 'Question', titleKey: 'q', minItems: 0, maxItems: 20,
              fields: [t('q', 'Question', { max: 160 }), t('a', 'Answer', { max: 1200, multiline: true })],
            },
          ],
        },
      ],
    },
    {
      key: 'help',
      title: '“Still have questions?” box',
      description: 'The box at the bottom, with a WhatsApp button.',
      fields: [t('heading', 'Heading', { max: 60 }), t('text', 'Text', { max: 200 }), t('buttonLabel', 'Button label', { max: 30 })],
    },
  ],
  defaults: {
    hero: { eyebrow: 'Help Center', title: 'Questions,', accent: 'Answered with Love', subtitle: 'Everything you need to know about our products and process.' },
    groups: {
      items: [
        {
          category: 'Ordering & Customization',
          questions: [
            { q: 'How does the custom order process work?', a: 'First, fill out our Customize form with your preferences. We will review it and reply within 24 hours via email and WhatsApp with pricing and timelines. Once you approve, you can make the payment and we begin crafting your piece!' },
            { q: 'Can I send a reference photo for a custom piece?', a: 'Yes! After you submit the form, we will connect on WhatsApp where you can share reference photos, mood boards, or sketches.' },
            { q: 'How long does a custom order take?', a: 'Typically 5-10 working days, depending on the complexity of the design and curing time (especially for resin art).' },
          ],
        },
        {
          category: 'Shipping & Delivery',
          questions: [
            { q: 'Do you ship across India?', a: 'Yes, we deliver pan-India via trusted courier partners. Shipping takes 3-7 days after dispatch.' },
            { q: 'How much are the delivery charges?', a: 'Delivery is free for orders above ₹999. For orders below that, standard shipping is ₹80.' },
            { q: 'Do you offer international shipping?', a: 'Currently, we only ship within India. We hope to expand internationally soon!' },
          ],
        },
        {
          category: 'Payments & Returns',
          questions: [
            { q: 'What payment methods do you accept?', a: 'We accept UPI (GPay, PhonePe, Paytm), IMPS/NEFT Bank Transfers, and Cash on Delivery (for local orders only).' },
            { q: 'Can I cancel or return a custom order?', a: 'Since custom orders are made specifically for you, we cannot accept returns or cancellations once payment is made and production has started. If an item arrives damaged, please contact us within 24 hours with a video.' },
          ],
        },
        {
          category: 'Product Care',
          questions: [
            { q: 'How do I care for my soy candle?', a: 'Always trim the wick to 1/4 inch before lighting. On the first burn, let the wax melt to the edges of the jar to prevent tunneling. Never leave a burning candle unattended.' },
            { q: 'Will the jewelry tarnish?', a: 'Our jewelry is plated and tarnish-resistant. However, to keep it looking new, avoid contact with perfumes, lotions, and water. Store it in the provided pouch when not in use.' },
          ],
        },
      ],
    },
    help: { heading: 'Still have questions?', text: 'We’re here to help! Reach out to us on WhatsApp or Email.', buttonLabel: 'Chat with Us' },
  },
};

/* --------------------------------- Contact -------------------------------- */

export type ContactContent = {
  hero: HeroText;
  intro: { heading: string; text: string; whatsappNote: string; emailNote: string; locationTitle: string; locationNote: string; socialHeading: string };
  form: { heading: string; buttonLabel: string; note: string };
};

export const CONTACT_DOC: ContentDoc<ContactContent> = {
  key: 'contact',
  title: 'Contact Page',
  description: 'Texts on the contact page. Phone, email and social links come from Site Settings.',
  viewHref: '/contact',
  sections: [
    { key: 'hero', title: 'Top banner', description: 'The banner at the top of the page.', fields: heroFields() },
    {
      key: 'intro',
      title: 'Ways to reach us',
      description: 'The left-hand card.',
      fields: [
        t('heading', 'Heading', { max: 40 }),
        t('text', 'Intro text', { max: 300, multiline: true }),
        t('whatsappNote', 'Note under WhatsApp', { max: 80 }),
        t('emailNote', 'Note under email', { max: 80 }),
        t('locationTitle', 'Location title', { max: 40 }),
        t('locationNote', 'Note under location', { max: 80 }),
        t('socialHeading', 'Social media heading', { max: 40 }),
      ],
    },
    {
      key: 'form',
      title: 'Message form',
      description: 'The form opens the visitor’s email app with their message filled in.',
      fields: [t('heading', 'Heading', { max: 40 }), t('buttonLabel', 'Button label', { max: 30 }), t('note', 'Note under the button', { max: 160 })],
    },
  ],
  defaults: {
    hero: { eyebrow: 'Get In Touch', title: 'Let’s Create', accent: 'Something Together', subtitle: 'We’d love to hear from you! Say hello, ask a question, or discuss a custom order.' },
    intro: {
      heading: 'Let’s Connect',
      text: 'Whether you have a question about an existing order or want to collaborate, our inbox is always open.',
      whatsappNote: 'Fastest response',
      emailNote: 'For collaborations & bulk orders',
      locationTitle: 'India',
      locationNote: 'Online store delivering pan-India',
      socialHeading: 'Follow our journey',
    },
    form: { heading: 'Send a Message', buttonLabel: 'Send Message', note: 'Planning a custom piece?' },
  },
};

/* --------------------------------- Journal -------------------------------- */

export type JournalPost = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  readTime: string;
};

export type JournalContent = { hero: HeroText; posts: { items: JournalPost[] } };

export function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .slice(0, 80);
}

export const JOURNAL_DOC: ContentDoc<JournalContent> = {
  key: 'journal',
  title: 'Journal (Blog)',
  description: 'Write, edit, reorder or delete blog posts. The first post is shown as the featured story.',
  viewHref: '/blog',
  sections: [
    { key: 'hero', title: 'Top banner', description: 'The banner at the top of the Journal page.', fields: heroFields() },
    {
      key: 'posts',
      title: 'Posts',
      description: 'The first post is the big featured story. Separate paragraphs in the article with an empty line.',
      fields: [
        {
          kind: 'list', key: 'items', label: 'Posts', itemLabel: 'Post', titleKey: 'title', minItems: 0, maxItems: 60,
          fields: [
            t('title', 'Title', { max: 120 }),
            t('slug', 'Web address', { max: 80, help: 'Appears as /blog/your-address. Leave empty to make one from the title.' }),
            t('category', 'Category', { max: 40 }),
            img('image', 'Cover image'),
            t('excerpt', 'Short summary', { max: 300, multiline: true }),
            t('content', 'Article', { max: 20000, multiline: true }),
            t('author', 'Author', { max: 60 }),
            t('date', 'Date', { max: 30, help: 'e.g. 2026-10-11' }),
            t('readTime', 'Reading time', { max: 20, help: 'e.g. 4 min read' }),
          ],
        },
      ],
    },
  ],
  defaults: {
    hero: { eyebrow: 'Journal', title: 'Stories &', accent: 'Inspiration', subtitle: 'Care tips, behind the scenes, and our creative journey.' },
    posts: {
      items: blogData.map((p) => ({
        slug: p.slug,
        title: p.title,
        category: p.category,
        excerpt: p.excerpt,
        content: p.content,
        image: p.image,
        author: p.author,
        date: p.date,
        readTime: p.readTime,
      })),
    },
  },
  finalize: (doc) => {
    const used = new Set<string>();
    const items = doc.posts.items.map((p, i) => {
      let slug = slugify(p.slug || p.title) || `post-${i + 1}`;
      while (used.has(slug)) slug = `${slug}-${i + 1}`;
      used.add(slug);
      return { ...p, slug };
    });
    return { ...doc, posts: { items } };
  },
};

/* --------------------------------- Gallery -------------------------------- */

export type GalleryContent = {
  hero: HeroText;
  photos: { includeBrand: boolean; includeProducts: boolean; items: { image: string; caption: string; group: string }[] };
};

export const GALLERY_DOC: ContentDoc<GalleryContent> = {
  key: 'gallery',
  title: 'Gallery Page',
  description: 'Photos in the Lookbook.',
  viewHref: '/gallery',
  sections: [
    { key: 'hero', title: 'Top banner', description: 'The banner at the top of the page.', fields: heroFields() },
    {
      key: 'photos',
      title: 'Photos',
      description: 'Add your own photos, and choose whether product and studio photos are included automatically.',
      fields: [
        bool('includeBrand', 'Include the built-in studio photos'),
        bool('includeProducts', 'Include photos of every product'),
        {
          kind: 'list', key: 'items', label: 'Extra photos (shown first)', itemLabel: 'Photo', titleKey: 'caption', minItems: 0, maxItems: 100,
          fields: [img('image', 'Photo'), t('caption', 'Caption', { max: 80 }), t('group', 'Filter group (e.g. Candles)', { max: 30 })],
        },
      ],
    },
  ],
  defaults: {
    hero: {
      eyebrow: 'Lookbook',
      title: 'The Gallery',
      accent: 'Moments in Every Flame',
      subtitle: 'Candles, keepsakes and the little worlds we build around them. Tap any photo to see it up close.',
    },
    photos: { includeBrand: true, includeProducts: true, items: [] },
  },
};

/* -------------------------------- Registry -------------------------------- */

export const CONTENT_DOCS = {
  site: SITE_DOC,
  about: ABOUT_DOC,
  faq: FAQ_DOC,
  contact: CONTACT_DOC,
  journal: JOURNAL_DOC,
  gallery: GALLERY_DOC,
} as const;

export type DocKey = keyof typeof CONTENT_DOCS;
export type DocContent<K extends DocKey> = (typeof CONTENT_DOCS)[K]['defaults'];

export function isDocKey(key: string): key is DocKey {
  return Object.prototype.hasOwnProperty.call(CONTENT_DOCS, key);
}

/** Validates untrusted input against a document's fields and fills gaps from its defaults. */
export function normalizeDoc<K extends DocKey>(key: K, input: unknown): DocContent<K> {
  const doc = CONTENT_DOCS[key] as unknown as ContentDoc<Obj>;
  const src = (input && typeof input === 'object' ? input : {}) as Obj;
  const out: Obj = {};
  for (const section of doc.sections) {
    out[section.key] = normalizeFields(section.fields, src[section.key], doc.defaults[section.key] as Obj);
  }
  return (doc.finalize ? doc.finalize(out) : out) as DocContent<K>;
}

/** WhatsApp chat link for a site's number, optionally with a pre-filled message. */
export function whatsappLink(number: string, text?: string) {
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}
