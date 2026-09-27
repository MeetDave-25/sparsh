import styles from './Wordmark.module.css';

type Props = {
  /** `light` sits on pale backgrounds (deeper gold), `dark` on dark ones (bright gold). */
  tone?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

/**
 * The SpArsh logo set as real type: a signature script in a gold gradient over
 * spaced small caps. Unlike the thin-stroked PNG, it stays legible on any background.
 */
export default function Wordmark({ tone = 'dark', size = 'md', className = '' }: Props) {
  return (
    <span className={`${styles.mark} ${styles[tone]} ${styles[size]} ${className}`}>
      <span className={styles.script}>SpArsh</span>
      <span className={styles.sub}>Divine Art Studio</span>
    </span>
  );
}
