import { useState } from 'react';
import { trpc } from '@/lib/trpc';

interface UploadProgress {
  isUploading: boolean;
  error: string | null;
  uploadedUrls: string[];
}

export function useImageUpload(creationType: 'photo' | 'book' | 'calendar' | 'gift') {
  const [progress, setProgress] = useState<UploadProgress>({
    isUploading: false,
    error: null,
    uploadedUrls: [],
  });

  const uploadMutation = trpc.creations.uploadImage.useMutation();

  const uploadImages = async (files: File[]): Promise<string[]> => {
    setProgress({ isUploading: true, error: null, uploadedUrls: [] });
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const reader = new FileReader();
        
        await new Promise<void>((resolve, reject) => {
          reader.onload = async (e) => {
            try {
              const imageData = e.target?.result as string;
              const result = await uploadMutation.mutateAsync({
                imageData,
                fileName: file.name,
                creationType,
              });
              
              if (result.success) {
                uploadedUrls.push(result.url);
              }
              resolve();
            } catch (error) {
              reject(error);
            }
          };
          
          reader.onerror = () => {
            reject(new Error(`Failed to read file: ${file.name}`));
          };
          
          reader.readAsDataURL(file);
        });
      }

      setProgress({
        isUploading: false,
        error: null,
        uploadedUrls,
      });

      return uploadedUrls;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setProgress({
        isUploading: false,
        error: errorMessage,
        uploadedUrls,
      });
      throw error;
    }
  };

  const saveCreation = async (
    imageUrls: string[],
    configuration: Record<string, any>,
    name?: string
  ) => {
    try {
      const result = await trpc.creations.saveCreation.useMutation();
      return await result.mutateAsync({
        creationType,
        imageUrls,
        configuration,
        name,
      });
    } catch (error) {
      console.error('Failed to save creation:', error);
      throw error;
    }
  };

  return {
    uploadImages,
    saveCreation,
    ...progress,
  };
}
