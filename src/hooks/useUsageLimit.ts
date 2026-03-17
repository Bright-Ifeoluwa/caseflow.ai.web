import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

export function useUsageLimit() {
  const [count, setCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const limit = 2;

  const today = new Date().toISOString().split('T')[0];
  const userId = auth.currentUser?.uid;
  const docId = `${userId}_${today}`;

  useEffect(() => {
    async function fetchUsage() {
      if (!userId) return;
      try {
        const docRef = doc(db, 'usage', docId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCount(docSnap.data().count);
        } else {
          setCount(0);
        }
      } catch (error) {
        console.error("Error fetching usage:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsage();
  }, [userId, docId]);

  const incrementUsage = async () => {
    if (!userId) return;
    const docRef = doc(db, 'usage', docId);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await updateDoc(docRef, { count: increment(1) });
        setCount(prev => (prev !== null ? prev + 1 : 1));
      } else {
        await setDoc(docRef, { userId, date: today, count: 1 });
        setCount(1);
      }
    } catch (error) {
      console.error("Error incrementing usage:", error);
    }
  };

  const isLimitReached = count !== null && count >= limit;

  return { count, limit, isLimitReached, incrementUsage, loading };
}
