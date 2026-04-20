import { useState, useEffect } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

const DEFAULT_FEATURES = {
  crowdControl: true,
  entryGates: true,
  alerts: true,
  analytics: true,
  security: true,
  incidentLog: true
};

export function useFeatures() {
  const [features, setFeatures] = useState(DEFAULT_FEATURES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reference to the global configuration document
    const configRef = doc(db, 'system', 'config');

    const unsubscribe = onSnapshot(configRef, (docSnap) => {
      if (docSnap.exists()) {
        setFeatures(docSnap.data().features || DEFAULT_FEATURES);
      } else {
        // Initialize with defaults if doesn't exist
        setDoc(configRef, { features: DEFAULT_FEATURES });
      }
      setLoading(false);
    }, (err) => {
      console.error("Firestore Error:", err);
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const toggleFeature = async (featureId) => {
    const configRef = doc(db, 'system', 'config');
    const newState = !features[featureId];
    
    try {
      await setDoc(configRef, {
        features: {
          [featureId]: newState
        }
      }, { merge: true });
      return { success: true, newState };
    } catch (err) {
      console.error("Failed to update feature:", err);
      return { success: false, error: err };
    }
  };

  return { features, toggleFeature, loading, error };
}
