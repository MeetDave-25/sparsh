'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import styles from './contact.module.css';

type Props = { email: string; heading: string; buttonLabel: string; note: string };

/** Opens the visitor's email app with their message ready to send to the studio. */
export default function ContactForm({ email, heading, buttonLabel, note }: Props) {
  const [opened, setOpened] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get('name') ?? '');
    const from = String(form.get('email') ?? '');
    const subject = String(form.get('subject') ?? '');
    const message = String(form.get('message') ?? '');
    const body = `${message}\n\n— ${name} (${from})`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setOpened(true);
  }

  return (
    <div className={styles.formCard}>
      <h2>{heading}</h2>
      <form className={styles.form} onSubmit={submit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">Name</label>
          <input type="text" id="name" name="name" className="form-input" placeholder="Your name" autoComplete="name" required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="email">Email</label>
          <input type="email" id="email" name="email" className="form-input" placeholder="your@email.com" autoComplete="email" required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="subject">Subject</label>
          <input type="text" id="subject" name="subject" className="form-input" placeholder="What is this regarding?" required />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="message">Message</label>
          <textarea id="message" name="message" className="form-textarea" placeholder="How can we help you?" required />
        </div>

        <button type="submit" className="btn btn-primary btn-lg w-full" id="contact-submit-btn">
          {buttonLabel}
        </button>
        {opened && (
          <p className={styles.formNote} role="status">
            Your email app should open with the message ready. If it didn’t, write to us at <a href={`mailto:${email}`}>{email}</a>.
          </p>
        )}
        {note && (
          <p className={styles.formNote}>
            {note} <Link href="/customize">Open the custom order form</Link>.
          </p>
        )}
      </form>
    </div>
  );
}
