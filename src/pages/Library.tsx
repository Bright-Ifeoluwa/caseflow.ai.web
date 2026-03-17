import React, { useState, useEffect } from 'react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { FileText, Clock, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function Library() {
  const [briefs, setBriefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBriefs = async () => {
      if (!auth.currentUser) return;
      
      const path = 'briefs';
      try {
        // We might not have a composite index for userId + createdAt, so we fetch by userId and sort in memory.
        const q = query(
          collection(db, path), 
          where('userId', '==', auth.currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Sort by createdAt descending
        results.sort((a: any, b: any) => {
          const timeA = a.createdAt?.toMillis() || 0;
          const timeB = b.createdAt?.toMillis() || 0;
          return timeB - timeA;
        });
        
        setBriefs(results);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, path);
      } finally {
        setLoading(false);
      }
    };

    fetchBriefs();
  }, []);

  return (
    <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tighter">Research Library</h1>
        <p className="text-[#141414]/50 font-medium">Access your previously generated briefs and legal opinions.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#141414]" />
        </div>
      ) : briefs.length === 0 ? (
        <div className="text-center py-20 space-y-4 opacity-50">
          <FileText className="w-16 h-16 mx-auto" />
          <p className="text-lg font-bold">No briefs found in your library.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {briefs.map((brief, index) => (
            <motion.div
              key={brief.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white border-2 border-[#141414] rounded-2xl p-6 hover:shadow-xl transition-all group flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="px-3 py-1 bg-[#141414]/5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                  {brief.domain?.replace('_', ' ') || 'General'}
                </div>
                <Clock className="w-4 h-4 opacity-30" />
              </div>
              
              <h3 className="text-lg font-bold leading-tight mb-2 line-clamp-2">
                {brief.title}
              </h3>
              
              <p className="text-sm text-[#141414]/60 line-clamp-3 mb-6 flex-1">
                {brief.query}
              </p>
              
              <div className="pt-4 border-t border-[#141414]/10 flex items-center justify-between mt-auto">
                <span className="text-[10px] font-mono opacity-50">
                  {brief.createdAt?.toDate().toLocaleDateString() || 'Recent'}
                </span>
                <Link 
                  to={`/briefs`} 
                  state={{ brief }}
                  className="flex items-center gap-1 text-xs font-bold uppercase tracking-widest group-hover:underline"
                >
                  View <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
