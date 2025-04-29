'use client';

import { useState, useEffect } from 'react';

// Este hook maneja la carga del modelo y genera embeddings desde audio
export const useVoiceEmbedding = () => {
  const [extractor, setExtractor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        if (!window.transformers) {
          throw new Error('Transformers.js not loaded');
        }

        console.log('Loading Whisper small EN model...');
        const extractorPipeline = await window.transformers.pipeline(
          'feature-extraction',
          'Xenova/distil-whisper-small.en'
        );
        console.log('Model loaded ✅');
        setExtractor(extractorPipeline);
      } catch (err: any) {
        console.error('Error loading model:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadModel();
  }, []);

  const generateEmbedding = async (float32Array: Float32Array) => {
    if (!extractor) {
      throw new Error('Model not loaded yet');
    }

    // El modelo espera audio como Float32Array a 16kHz
    const result = await extractor(float32Array, { pooling: 'mean' });
    return result.data;
  };

  return { generateEmbedding, loading, error };
};