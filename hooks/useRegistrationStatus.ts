'use client';

import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Reads the live registration status from Firestore (settings/registration),
 * the same source of truth used by the /apply flow. Defaults to `true`
 * (open) until the first snapshot resolves, matching existing behavior
 * elsewhere in the app.
 */
export function useRegistrationStatus() {
  const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(true);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'settings', 'registration'),
      (snapshot) => {
        if (snapshot.exists()) {
          setIsRegistrationOpen(snapshot.data().isOpen ?? snapshot.data().isAllowed ?? true);
        }
      },
      (error) => {
        console.error('Error fetching registration status:', error);
      }
    );
    return () => unsub();
  }, []);

  return isRegistrationOpen;
}
