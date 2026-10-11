'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import styles from './Mascot.module.css';

const GREETINGS = ['Namaste! 👋', 'Hand-poured, just for you ✨', 'Psst… try the Blossom 🌸', 'Made with love 🧡'];

type Props = {
  className?: string;
  /** Said once on its own, this many ms after mounting. */
  autoGreet?: { text: string; after: number };
};

/**
 * The SpArsh red panda. Its head (a separate layer) and body turn to look at
 * the cursor; with no cursor around it glances about on its own. Hovering it
 * makes it hop and say hello.
 */
export default function Mascot({ className = '', autoGreet }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [greeting, setGreeting] = useState<string | null>(null);

  useEffect(() => {
    if (reduce) return;
    const root = rootRef.current;
    const body = bodyRef.current;
    const head = headRef.current;
    if (!root || !body || !head) return;

    // Where it's looking, -1..1 on each axis; eased toward the target every frame.
    const look = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let lastMove = -Infinity;
    let visible = true;

    const onMove = (e: PointerEvent) => {
      const r = head.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      target.x = Math.max(-1, Math.min(1, (e.clientX - cx) / (window.innerWidth * 0.45)));
      target.y = Math.max(-1, Math.min(1, (e.clientY - cy) / (window.innerHeight * 0.45)));
      lastMove = performance.now();
    };

    let raf = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      // Idle: after a few seconds without the cursor, glance around slowly.
      if (now - lastMove > 3500) {
        const t = now / 1000;
        target.x = Math.sin(t * 0.55) * 0.55 + Math.sin(t * 1.3) * 0.15;
        target.y = Math.sin(t * 0.4 + 1) * 0.3;
      }
      look.x += (target.x - look.x) * 0.08;
      look.y += (target.y - look.y) * 0.08;
      const { x, y } = look;
      body.style.transform = `rotateY(${x * 9}deg) rotateX(${-y * 4}deg) translateX(${x * 4}px)`;
      head.style.transform = `translate(${x * 7}px, ${y * 5}px) rotate(${x * 4}deg)`;
    };

    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(root);
    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
    };
  }, [reduce]);

  useEffect(() => {
    if (!autoGreet) return;
    const t = setTimeout(() => setGreeting(autoGreet.text), autoGreet.after);
    return () => clearTimeout(t);
  }, [autoGreet]);

  const greet = () => setGreeting((g) => {
    const i = g ? (GREETINGS.indexOf(g) + 1) % GREETINGS.length : 0;
    return GREETINGS[i];
  });

  return (
    <div
      ref={rootRef}
      className={`${styles.mascot} ${className}`}
      onPointerEnter={greet}
      onPointerLeave={() => setGreeting(null)}
      onClick={greet}
    >
      {greeting && (
        <p className={styles.bubble} role="status" key={greeting}>
          {greeting}
        </p>
      )}
      <div className={styles.hop}>
        <div ref={bodyRef} className={styles.body}>
          <Image
            src="/brand/panda-body.png"
            alt="Sparsh, the SpArsh red panda mascot, waving hello"
            width={685}
            height={1050}
            sizes="(max-width: 900px) 40vw, 300px"
            className={styles.layer}
            priority
          />
          <div ref={headRef} className={styles.head}>
            <Image src="/brand/panda-head.png" alt="" width={685} height={374} sizes="(max-width: 900px) 40vw, 300px" className={styles.layer} priority />
          </div>
        </div>
      </div>
    </div>
  );
}
