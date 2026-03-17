import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';

export function useWaitlist(user: User | null) {
  const [onWaitlist, setOnWaitlist] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkWaitlist() {
      if (!user?.email) {
        setOnWaitlist(false);
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'waitlist', user.email.toLowerCase());
        const docSnap = await getDoc(docRef);
        setOnWaitlist(docSnap.exists());
      } catch (error) {
        console.error("Error checking waitlist:", error);
        setOnWaitlist(false);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      checkWaitlist();
    } else {
      setOnWaitlist(false);
      setLoading(false);
    }
  }, [user]);

  return { onWaitlist, loading };
}
