// types/transformers.d.ts
declare global {
    interface Window {
      transformers: {
        pipeline: (
          task: string,
          model: string,
          options?: any
        ) => Promise<(data: Float32Array, options: { pooling: 'mean' }) => Promise<{ data: Float32Array }>>;
      };
    }
  }
  
  export {};