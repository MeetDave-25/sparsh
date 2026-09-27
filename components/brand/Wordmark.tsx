import styles from './Wordmark.module.css';

type Props = {
  /** `light` sits on pale backgrounds (deeper gold), `dark` on dark ones (bright gold). */
  tone?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
};

/**
 * The real hand-drawn SpArsh logo, used as a mask and filled with a solid gold
 * gradient. The original PNG is pale gold with a white halo that vanishes on
 * light backgrounds; the mask keeps its exact shape but lets us pick the colour.
 */
export default function Wordmark({ tone = 'dark', size = 'md', className = '' }: Props) {
  return (
    <span
      role="img"
      aria-label="SpArsh Divine Art Studio"
      className={`${styles.mark} ${styles[tone]} ${styles[size]} ${className}`}
    />
  );
}
