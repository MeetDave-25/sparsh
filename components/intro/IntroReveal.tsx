'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import styles from './IntroReveal.module.css';

const SEEN_KEY = 'sparsh_intro_seen';
const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IRIS = [0.76, 0, 0.24, 1] as const;

// Total time the scene holds before the iris wipe begins, in ms.
const HOLD_UNTIL_EXIT = 3600;

/**
 * A one-time cinematic opener for the homepage: darkness, a flame ignites, light
 * blooms, the logo forms out of the glow, then an iris wipe reveals the page
 * beneath (which has already finished its own entrance animation while hidden).
 * Plays once per browser session; skipped entirely for reduced-motion users.
 */
export default function IntroReveal() {
  const reduceMotion = useReducedMotion();
  // Default true so the very first client render matches the server (which
  // always "shows" it, having no access to sessionStorage) — no hydration
  // mismatch. A useEffect below immediately hides it again for repeat visits.
  const [show, setShow] = useState(true);
  const [exiting, setExiting] = useState(false);
  // React's Strict Mode (on by default in `next dev`) runs this effect twice
  // on mount — mount, cleanup, mount again — to surface side-effect bugs. The
  // decision ("have we already played this session?") must only be computed
  // once, since the first pass's own sessionStorage write would otherwise
  // read back as "already seen" on the second pass. But the exit *timer*
  // still needs to be (re)created on every pass, including the second one,
  // since Strict Mode's simulated cleanup cancels the first pass's timer —
  // otherwise the intro plays but the iris wipe never fires. Splitting these
  // two concerns is what makes it correct in both dev and production.
  const decided = useRef<'skip' | 'play' | null>(null);

  useEffect(() => {
    if (decided.current === null) {
      decided.current = reduceMotion || sessionStorage.getItem(SEEN_KEY) ? 'skip' : 'play';
      if (decided.current === 'play') sessionStorage.setItem(SEEN_KEY, '1');
    }

    if (decided.current === 'skip') {
      // `show` starts true to match the server's SSR output (which can't see
      // sessionStorage) and is only ever corrected here, once, after mount.
      setShow(false);
      return;
    }

    const exitTimer = setTimeout(() => setExiting(true), HOLD_UNTIL_EXIT);
    return () => clearTimeout(exitTimer);
  }, [reduceMotion]);

  function skip() {
    setExiting(true);
  }

  if (!show) return null;

  return (
    <AnimatePresence onExitComplete={() => setShow(false)}>
      {!exiting && (
        <motion.div
          className={styles.overlay}
          initial={{ clipPath: 'circle(150% at 50% 50%)' }}
          exit={{ clipPath: 'circle(0% at 50% 50%)' }}
          transition={{ duration: 1.1, ease: EASE_IRIS }}
          role="presentation"
          aria-hidden="true"
        >
          <motion.div
            className={styles.fade}
            animate={{ opacity: exiting ? 0 : 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.vignette} />

            {/* Anchors the flame/glow to the logo mark's own box, so the light
                source always sits right behind the wordmark — not the overlay's
                geometric center, which drifts once the rule and tagline below
                pull the whole block's centered flex group off-centre. */}
            <div className={styles.stage}>
              <motion.div
                className={styles.flame}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT }}
              />

              <motion.div
                className={styles.glow}
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.85 }}
                transition={{ duration: 1.3, delay: 0.4, ease: EASE_OUT }}
              />

              <motion.div
                className={styles.logoWrap}
                initial={{ opacity: 0, scale: 0.88, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.1, delay: 0.85, ease: EASE_OUT }}
              >
                <Image
                  src="/brand/sparsh-logo.png"
                  alt="SpArsh Divine Art Studio"
                  width={550}
                  height={367}
                  priority
                  className={styles.logoImg}
                />
                <div className={styles.shimmer} />
              </motion.div>
            </div>

            <motion.div
              className={styles.rule}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.7, ease: EASE_OUT }}
            />

            <motion.p
              className={styles.tagline}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 2.0 }}
            >
              Handcrafted &middot; Hand&#8209;poured &middot; Dil Se
            </motion.p>

            <motion.button
              type="button"
              className={styles.skip}
              onClick={skip}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              Skip
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
