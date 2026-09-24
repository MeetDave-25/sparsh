'use client';

import MediaLibrary from '@/components/admin/content/MediaLibrary';
import styles from '@/components/admin/content/ContentEditor.module.css';

export default function MediaPage() {
  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1>Media Library</h1>
          <p className={styles.muted}>
            Upload photos once, then pick them anywhere: homepage sections or products. Photos are resized for the web and
            location data is removed automatically.
          </p>
        </div>
      </div>
      <div className={styles.sectionPanel}>
        <MediaLibrary allowDelete />
      </div>
    </div>
  );
}
