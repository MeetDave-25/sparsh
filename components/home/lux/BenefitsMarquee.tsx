import styles from './BenefitsMarquee.module.css';

const ITEMS = ['100% Soy Wax', 'Hand-poured', '40+ Hour Burn', 'Skin-safe Fragrance', 'Custom Orders', 'Pay After Approval', 'Made in India'];

export default function BenefitsMarquee() {
  const row = (
    <div className={styles.row}>
      {ITEMS.map((item) => (
        <span key={item} className={styles.item}>
          {item}
          <span className={styles.star} aria-hidden="true">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={styles.strip} data-nav="dark">
      <p className="visually-hidden">{ITEMS.join(', ')}</p>
      <div className={styles.track} aria-hidden="true">
        {row}
        {row}
      </div>
    </div>
  );
}
