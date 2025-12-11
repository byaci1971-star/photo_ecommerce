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
        
        const imageData = await new Promise<string>((resolve, reject) => {
          reader.onload = (e) => {
            const result = e.target?.result as string;
            resolve(result);
          };
          
          reader.onerror = () => {
            reject(new Error(`Failed to read file: ${file.name}`));
          };
          
          reader.readAsDataURL(file);
        });

        try {
          const result = await uploadMutation.mutateAsync({
            imageData,
            fileName: file.name,
            creationType,
          });
          
          if (result.success) {
            uploadedUrls.push(result.url);
          }
        } catch (uploadError) {
          console.error(`Failed to upload ${file.name}:`, uploadError);
          throw uploadError;
        }
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
    const saveMutation = trpc.creations.saveCreation.useMutation();
    try {
      return await saveMutation.mutateAsync({
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
