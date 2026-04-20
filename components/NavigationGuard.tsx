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
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
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
        const [adminDoc, superAdminDoc] = await Promise.all([
          getDoc(doc(db, 'admins', user.uid)),
          getDoc(doc(db, 'super_admins', user.uid))
        ]);
        const isSAdmin = superAdminDoc.exists();
        setIsSuperAdmin(isSAdmin);
        setIsAdmin(adminDoc.exists() || isSAdmin);
      } else {
        setIsAdmin(false);
        setIsSuperAdmin(false);
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

    // Only Super Admin can access hidden pages
    if (isSuperAdmin) return;

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
