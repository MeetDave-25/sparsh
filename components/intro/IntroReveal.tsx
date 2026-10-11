'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Wordmark from '@/components/brand/Wordmark';
import Mascot from '@/components/mascot/Mascot';
import styles from './IntroReveal.module.css';

const SEEN_KEY = 'sparsh_intro_seen';
const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IRIS = [0.76, 0, 0.24, 1] as const;

// Total time the scene holds before the iris wipe begins, in ms.
const HOLD_UNTIL_EXIT = 6500;
const GREETING = { text: 'Namaste! Welcome in', after: 2100 };

/**
 * A one-time welcome screen for the homepage: under a soft spotlight the
 * wordmark fades in and Sparsh the red panda appears on a gold plinth to wave,
 * following the cursor with its eyes. Visitors can enter straight away, or an
 * iris wipe reveals the page on its own after a few seconds. Plays once per
 * browser session; skipped entirely for reduced-motion users.
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
      // `?welcome` in the URL replays it on demand, e.g. to preview it again.
      const forced = new URLSearchParams(window.location.search).has('welcome');
      decided.current = !forced && (reduceMotion || sessionStorage.getItem(SEEN_KEY)) ? 'skip' : 'play';
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
          role="dialog"
          aria-label="Welcome to SpArsh"
        >
          <motion.div
            className={styles.fade}
            animate={{ opacity: exiting ? 0 : 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.vignette} />
            <motion.div
              className={styles.spotlight}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.6, delay: 0.2 }}
            />

            <div className={styles.scene}>
              <div className={styles.podium}>
                <motion.div
                  className={styles.plinth}
                  initial={{ opacity: 0, scaleX: 0.4 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.4, ease: EASE_OUT }}
                />
                <motion.div
                  className={styles.mascot}
                  initial={{ opacity: 0, y: 40, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1.1, delay: 0.7, ease: EASE_OUT }}
                >
                  <Mascot autoGreet={GREETING} />
                </motion.div>
              </div>

              <motion.div
                className={styles.logoWrap}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.2, ease: EASE_OUT }}
              >
                <Wordmark tone="dark" size="xl" className={styles.wordmark} />
                <div className={styles.shimmer} />
              </motion.div>

              <motion.p
                className={styles.tagline}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.6 }}
              >
                Handcrafted candles &amp; gifts &middot; Made in India
              </motion.p>

              <motion.button
                type="button"
                className={styles.enter}
                onClick={skip}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.9 }}
              >
                Enter the Studio <ArrowRight size={16} />
                <span className={styles.timer} style={{ animationDuration: `${HOLD_UNTIL_EXIT - 1900}ms` }} />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
