'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function NavigationGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [hiddenPages, setHiddenPages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Listen for hidden pages
    const unsubscribeHidden = onSnapshot(doc(db, 'settings', 'navigation'), (doc) => {
      if (doc.exists()) {
        setHiddenPages(doc.data().hiddenRoutes || []);
      }
    });

    // 2. Check admin status
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        setIsAdmin(adminDoc.exists());
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => {
      unsubscribeHidden();
      unsubscribeAuth();
    };
  }, []);

  useEffect(() => {
    if (loading) return;

    // Admin can access everything
    if (isAdmin) return;

    // Check if current path is hidden
    // We check if the path starts with any of the hidden routes (to cover sub-pages for e.g. /apply)
    const isHidden = hiddenPages.some(route => 
      pathname === route || pathname.startsWith(route + '/')
    );

    if (isHidden) {
      router.push('/');
    }
  }, [pathname, hiddenPages, isAdmin, loading, router]);

  return <>{children}</>;
}
