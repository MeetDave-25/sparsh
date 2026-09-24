'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import PageHero from '@/components/layout/PageHero';
import TiltCard from '@/components/motion/TiltCard';
import { CheckCircle, Loader, MessageCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { getWhatsAppURL } from '@/lib/whatsapp';
import styles from './CustomizePage.module.css';

type Category = 'candles' | 'resin' | 'jewelry' | 'crafts' | 'hampers';

interface FormData {
  // Step 1 - Product
  category: Category;
  productName: string;
  // Candle options
  candleScent: string;
  candleSize: string;
  candleColor: string;
  candleWick: string;
  // Resin options
  resinColor: string;
  resinShape: string;
  resinInclusions: string;
  // Jewelry options
  jewelryMetal: string;
  jewelryStone: string;
  jewelryEngraving: string;
  // General
  customNote: string;
  // Step 2 - Personalization
  deliveryDate: string;
  specialNotes: string;
  // Step 3 - Contact
  customerName: string;
  email: string;
  phone: string;
}

const categories = [
  { id: 'candles', name: 'Candles', emoji: '🕯️', desc: 'Soy, scented, pillar & more' },
  { id: 'resin', name: 'Resin Art', emoji: '🌸', desc: 'Trays, bookmarks, keychains' },
  { id: 'jewelry', name: 'Jewellery', emoji: '💎', desc: 'Rings, necklaces, bracelets' },
  { id: 'crafts', name: 'Stationery & Crafts', emoji: '✉️', desc: 'Cards, bookmarks, journals' },
  { id: 'hampers', name: 'Gift Hampers', emoji: '🎁', desc: 'Curated sets for any occasion' },
];

const candleScents = ['Rose', 'Lavender', 'Vanilla', 'Jasmine', 'Sandalwood', 'Oud', 'Eucalyptus', 'Chamomile', 'Unscented'];
const candleSizes = ['Small (100g)', 'Medium (200g)', 'Large (400g)', 'Extra Large (600g)'];
const candleColors = ['Blush Pink', 'Ivory White', 'Sage Green', 'Lilac', 'Peach', 'Dusty Blue', 'Gold', 'Black'];
const candleWicks = ['Cotton Wick', 'Wooden Wick', 'Eco Wick'];
const resinColors = ['Pink & Gold', 'Blue & Silver', 'Earth Tones', 'Pastel Rainbow', 'Black & Gold', 'White Marble', 'Custom (describe below)'];
const resinShapes = ['Round', 'Heart', 'Rectangle', 'Hexagon', 'Free Form (tray)'];
const resinInclusions = ['Dried Roses', 'Lavender', 'Mixed Wildflowers', 'Baby\'s Breath', 'Gold Foil', 'Butterflies', 'Custom'];
const jewelryMetals = ['Gold Plated', 'Silver Plated', 'Rose Gold Plated'];
const jewelryStones = ['Rose Quartz', 'Amethyst', 'Clear Quartz', 'Green Aventurine', 'Labradorite', 'Pearl', 'No Stone'];

export default function CustomizePageClient() {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const reduceMotion = useReducedMotion();

  // Track which way the steps move so the 3D page-turn goes forwards or backwards
  const [prevStep, setPrevStep] = useState(step);
  const [direction, setDirection] = useState(1);
  if (step !== prevStep) {
    setDirection(step > prevStep ? 1 : -1);
    setPrevStep(step);
  }

  const stepMotion = reduceMotion
    ? {}
    : {
        custom: direction,
        variants: {
          enter: (d: number) => ({ opacity: 0, rotateY: d * 55, x: d * 60, filter: 'blur(6px)' }),
          center: { opacity: 1, rotateY: 0, x: 0, filter: 'blur(0px)' },
          exit: (d: number) => ({ opacity: 0, rotateY: d * -55, x: d * -60, filter: 'blur(6px)' }),
        },
        initial: 'enter',
        animate: 'center',
        exit: 'exit',
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
        style: { transformPerspective: 1400 },
      };

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>();
  const watchedCategory = watch('category');

  const buildCustomizationSummary = (data: FormData): string => {
    const lines: string[] = [];
    if (data.category === 'candles') {
      if (data.candleScent) lines.push(`Scent: ${data.candleScent}`);
      if (data.candleSize) lines.push(`Size: ${data.candleSize}`);
      if (data.candleColor) lines.push(`Colour: ${data.candleColor}`);
      if (data.candleWick) lines.push(`Wick: ${data.candleWick}`);
    } else if (data.category === 'resin') {
      if (data.resinColor) lines.push(`Colour Palette: ${data.resinColor}`);
      if (data.resinShape) lines.push(`Shape: ${data.resinShape}`);
      if (data.resinInclusions) lines.push(`Inclusions: ${data.resinInclusions}`);
    } else if (data.category === 'jewelry') {
      if (data.jewelryMetal) lines.push(`Metal Finish: ${data.jewelryMetal}`);
      if (data.jewelryStone) lines.push(`Stone: ${data.jewelryStone}`);
      if (data.jewelryEngraving) lines.push(`Engraving: ${data.jewelryEngraving}`);
    }
    if (data.customNote) lines.push(`Additional Notes: ${data.customNote}`);
    return lines.join('\n') || 'No specific customizations noted — will discuss via WhatsApp/email.';
  };

  const onSubmit = async (data: FormData) => {
    setSending(true);
    const summary = buildCustomizationSummary(data);

    const waUrl = getWhatsAppURL({
      customerName: data.customerName,
      phone: data.phone,
      email: data.email,
      productCategory: categories.find(c => c.id === data.category)?.name || data.category,
      productName: data.productName || undefined,
      customizations: summary,
      deliveryDate: data.deliveryDate || undefined,
      specialNotes: data.specialNotes || undefined,
    });

    // Send email
    try {
      await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          customizations: summary,
        }),
      });
    } catch (_) {
      // Email failed but we still open WhatsApp
    }

    setWhatsappUrl(waUrl);
    setSending(false);
    setSubmitted(true);

    // Open WhatsApp
    window.open(waUrl, '_blank');
  };

  if (submitted) {
    return (
      <div className={styles.successPage}>
        <motion.div
          className={styles.successCard}
          initial={reduceMotion ? false : { opacity: 0, rotateX: 40, y: 60, scale: 0.9 }}
          animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformPerspective: 1200 }}
        >
          {!reduceMotion && (
            <div className={styles.burst} aria-hidden="true">
              {Array.from({ length: 14 }, (_, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 0.4, rotate: 0 }}
                  animate={{
                    opacity: 0,
                    x: Math.cos((i / 14) * Math.PI * 2) * 170,
                    y: Math.sin((i / 14) * Math.PI * 2) * 130 - 40,
                    scale: 1.1,
                    rotate: i * 40,
                  }}
                  transition={{ duration: 1.4, delay: 0.35, ease: 'easeOut' }}
                >
                  {i % 2 ? '🌸' : '✦'}
                </motion.span>
              ))}
            </div>
          )}
          <motion.div
            className={styles.successIcon}
            initial={reduceMotion ? false : { scale: 0, rotate: -120 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.25 }}
          >
            <CheckCircle size={48} />
          </motion.div>
          <h1>Order Request Sent! 🌸</h1>
          <p>We&apos;ve received your request and WhatsApp is opening to connect you instantly.
          Our artisan will review and reply within 24 hours.</p>
          <div className={styles.successSteps}>
            <p>📧 Confirmation email sent to your inbox</p>
            <p>📱 WhatsApp message opened for instant chat</p>
            <p>✨ We&apos;ll confirm pricing within 24 hours</p>
          </div>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={`btn btn-primary btn-lg ${styles.successWaBtn}`} id="success-whatsapp-btn">
            <MessageCircle size={18} />
            Open WhatsApp Again
          </a>
          <button onClick={() => { setSubmitted(false); setStep(1); setSelectedCategory(null); }} className="btn btn-secondary" id="submit-another-btn">
            Submit Another Request
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <PageHero
        eyebrow="Personalized Just For You"
        title="Create Your"
        accent="Custom Order"
        subtitle={
          <>
            <em className="hindi-phrase">&ldquo;Bilkul aapke sapnon jaisa&rdquo;</em> — exactly as you imagined. Three quick steps, no payment until we confirm.
          </>
        }
        compact
      />

      <div className="container">
        {/* Step Indicator */}
        <div className={styles.stepIndicator}>
          <div className={styles.progressTrack} aria-hidden="true">
            <motion.div className={styles.progressFill} animate={{ scaleX: (step - 1) / 2 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
          </div>
          {[
            { n: 1, label: 'Product' },
            { n: 2, label: 'Details' },
            { n: 3, label: 'Contact' },
          ].map(s => (
            <div key={s.n} className={styles.stepItem}>
              <motion.div
                className={`${styles.stepCircle} ${step >= s.n ? styles.stepActive : ''} ${step > s.n ? styles.stepDone : ''}`}
                animate={step === s.n && !reduceMotion ? { scale: [1, 1.18, 1] } : { scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {step > s.n ? '✓' : s.n}
              </motion.div>
              <span className={`${styles.stepLabel} ${step >= s.n ? styles.stepLabelActive : ''}`}>{s.label}</span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          {/* STEP 1: Product Selection */}
          <AnimatePresence mode="wait" custom={direction} initial={false}>
          {step === 1 && (
            <motion.div key="step1" className={styles.stepContent} {...stepMotion}>
              <h2 className={styles.stepTitle}>What would you like to create?</h2>

              {/* Category Selection */}
              <div className={styles.formSection}>
                <label className="form-label">Category <span>*</span></label>
                <div className={styles.categoryCards}>
                  {categories.map(cat => (
                    <TiltCard key={cat.id} className={styles.catTilt} max={12}>
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => { setSelectedCategory(cat.id as Category); setValue('category', cat.id as Category); }}
                      className={`${styles.catCard} ${selectedCategory === cat.id ? styles.catCardActive : ''}`}
                      id={`select-cat-${cat.id}`}
                    >
                      <span className={styles.catEmoji}>{cat.emoji}</span>
                      <span className={styles.catName}>{cat.name}</span>
                      <span className={styles.catDesc}>{cat.desc}</span>
                    </button>
                    </TiltCard>
                  ))}
                </div>
                <input type="hidden" {...register('category', { required: true })} />
                {errors.category && <p className="form-error">Please select a category</p>}
              </div>

              {/* Product Name / Reference */}
              <div className="form-group">
                <label className="form-label" htmlFor="productName">Specific product in mind? (optional)</label>
                <input
                  id="productName"
                  type="text"
                  placeholder="e.g. Rose petal soy candle in a glass jar"
                  className="form-input"
                  {...register('productName')}
                />
              </div>

              {/* Category-specific options */}
              {selectedCategory === 'candles' && (
                <div className={styles.optionsGrid}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="candleScent">Preferred Scent</label>
                    <select id="candleScent" className="form-select" {...register('candleScent')}>
                      <option value="">Select scent...</option>
                      {candleScents.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="candleSize">Size</label>
                    <select id="candleSize" className="form-select" {...register('candleSize')}>
                      <option value="">Select size...</option>
                      {candleSizes.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="candleColor">Candle Colour</label>
                    <select id="candleColor" className="form-select" {...register('candleColor')}>
                      <option value="">Select colour...</option>
                      {candleColors.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="candleWick">Wick Type</label>
                    <select id="candleWick" className="form-select" {...register('candleWick')}>
                      <option value="">Select wick...</option>
                      {candleWicks.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {selectedCategory === 'resin' && (
                <div className={styles.optionsGrid}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="resinColor">Colour Palette</label>
                    <select id="resinColor" className="form-select" {...register('resinColor')}>
                      <option value="">Select colours...</option>
                      {resinColors.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="resinShape">Shape / Type</label>
                    <select id="resinShape" className="form-select" {...register('resinShape')}>
                      <option value="">Select shape...</option>
                      {resinShapes.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="resinInclusions">Inclusions / Flowers</label>
                    <select id="resinInclusions" className="form-select" {...register('resinInclusions')}>
                      <option value="">Select inclusions...</option>
                      {resinInclusions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {selectedCategory === 'jewelry' && (
                <div className={styles.optionsGrid}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="jewelryMetal">Metal Finish</label>
                    <select id="jewelryMetal" className="form-select" {...register('jewelryMetal')}>
                      <option value="">Select metal...</option>
                      {jewelryMetals.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="jewelryStone">Stone / Crystal</label>
                    <select id="jewelryStone" className="form-select" {...register('jewelryStone')}>
                      <option value="">Select stone...</option>
                      {jewelryStones.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="jewelryEngraving">Engraving / Initials</label>
                    <input
                      id="jewelryEngraving"
                      type="text"
                      placeholder="e.g. 'A' or 'Love Always'"
                      className="form-input"
                      {...register('jewelryEngraving')}
                    />
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label" htmlFor="customNote">Any additional ideas or references?</label>
                <textarea
                  id="customNote"
                  className="form-textarea"
                  placeholder="Describe your vision — colours, theme, occasion, inspiration... anything helps! You can also share a photo on WhatsApp after."
                  {...register('customNote')}
                />
              </div>

              <div className={styles.stepActions}>
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={() => selectedCategory && setStep(2)}
                  disabled={!selectedCategory}
                  id="step1-next-btn"
                >
                  Continue
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Personalization Details */}
          {step === 2 && (
            <motion.div key="step2" className={styles.stepContent} {...stepMotion}>
              <h2 className={styles.stepTitle}>A little more about your order</h2>

              <div className="form-group">
                <label className="form-label" htmlFor="deliveryDate">When do you need it by? (optional)</label>
                <input
                  id="deliveryDate"
                  type="date"
                  className="form-input"
                  min={new Date().toISOString().split('T')[0]}
                  {...register('deliveryDate')}
                />
                <p className={styles.fieldHint}>🌸 We typically take 5–10 working days for custom orders. Rush orders may have an express fee.</p>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="specialNotes">Special notes or occasion?</label>
                <textarea
                  id="specialNotes"
                  className="form-textarea"
                  placeholder="e.g. 'It&apos;s for my sister&apos;s wedding' or 'Please include a handwritten note saying Happy Birthday Priya!' or 'I want the hamper to be Diwali themed'"
                  {...register('specialNotes')}
                />
              </div>

              <div className={styles.paymentNote}>
                <p><strong>💳 Payment happens AFTER we confirm your order.</strong></p>
                <p>We accept UPI (GPay/PhonePe/Paytm), bank transfer, and cash on delivery (local only). No advance required until we approve.</p>
              </div>

              <div className={styles.stepActions}>
                <button type="button" className="btn btn-secondary btn-lg" onClick={() => setStep(1)} id="step2-back-btn">
                  <ChevronLeft size={18} />
                  Back
                </button>
                <button type="button" className="btn btn-primary btn-lg" onClick={() => setStep(3)} id="step2-next-btn">
                  Continue
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Contact Info */}
          {step === 3 && (
            <motion.div key="step3" className={styles.stepContent} {...stepMotion}>
              <h2 className={styles.stepTitle}>How should we reach you?</h2>

              <div className={styles.optionsGrid}>
                <div className="form-group">
                  <label className="form-label" htmlFor="customerName">Your Name <span>*</span></label>
                  <input
                    id="customerName"
                    type="text"
                    className="form-input"
                    placeholder="Your full name"
                    {...register('customerName', { required: 'Name is required' })}
                  />
                  {errors.customerName && <p className="form-error">{errors.customerName.message}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="phone">WhatsApp / Phone <span>*</span></label>
                  <input
                    id="phone"
                    type="tel"
                    className="form-input"
                    placeholder="+91 98765 43210"
                    {...register('phone', { required: 'Phone number is required' })}
                  />
                  {errors.phone && <p className="form-error">{errors.phone.message}</p>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address <span>*</span></label>
                <input
                  id="email"
                  type="email"
                  className="form-input"
                  placeholder="your@email.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email' }
                  })}
                />
                {errors.email && <p className="form-error">{errors.email.message}</p>}
                <p className={styles.fieldHint}>📧 We&apos;ll send a confirmation email and reply with pricing.</p>
              </div>

              <div className={styles.submitNote}>
                <p>On clicking &apos;Send My Request&apos;:</p>
                <ul>
                  <li>📧 Your order details will be emailed to us</li>
                  <li>💬 WhatsApp will open with your message pre-filled</li>
                  <li>✅ We&apos;ll confirm within 24 hours</li>
                </ul>
              </div>

              <div className={styles.stepActions}>
                <button type="button" className="btn btn-secondary btn-lg" onClick={() => setStep(2)} id="step3-back-btn">
                  <ChevronLeft size={18} />
                  Back
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={sending}
                  id="submit-order-btn"
                >
                  {sending ? <><Loader size={18} className={styles.spinner} /> Sending...</> : <><MessageCircle size={18} /> Send My Request</>}
                </button>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
}
