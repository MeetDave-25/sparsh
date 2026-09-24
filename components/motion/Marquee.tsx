import styles from './motion.module.css';

/** Endless scrolling ribbon of phrases. Pure CSS, pauses on hover and for reduced-motion users. */
export default function Marquee({ items }: { items: string[] }) {
  const row = (
    <div className={styles.marqueeRow}>
      {items.map((item, i) => (
        <span key={i} className={styles.marqueeItem}>
          {item}
          <span className={styles.marqueeStar} aria-hidden="true">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className={styles.marquee} aria-label={items.join(', ')} role="marquee">
      <div className={styles.marqueeTrack} aria-hidden="true">
        {row}
        {row}
      </div>
    </div>
  );
}
