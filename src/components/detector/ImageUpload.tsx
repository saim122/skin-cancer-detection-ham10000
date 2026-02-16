'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { validateImage } from '@/lib/utils';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onImageSelect: (file: File, dataUrl: string) => void;
  selectedImage?: string;
  onClear: () => void;
}

export function ImageUpload({ onImageSelect, selectedImage, onClear }: ImageUploadProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];
      const validation = validateImage(file);

      if (!validation.valid) {
        toast.error(validation.error || 'Invalid image');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        onImageSelect(file, reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!selectedImage ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div
              {...getRootProps()}
              className={`
                relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer
                ${
                  isDragActive
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20'
                    : isDragReject
                    ? 'border-danger-500 bg-danger-50 dark:bg-danger-950/20'
                    : 'border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500'
                }
              `}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <Upload className="h-16 w-16 text-gray-400" />
                  {isDragActive && (
                    <motion.div
                      className="absolute -inset-2 bg-primary-500/20 rounded-full blur-lg"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-900 dark:text-white">
                    {isDragActive ? 'Drop image here' : 'Drag & drop your image here'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    or click to browse
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    Supported formats: JPEG, PNG (max 5MB)
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative group"
          >
            <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700">
              <img
                src={selectedImage}
                alt="Selected skin lesion"
                className="w-full h-auto max-h-96 object-contain bg-gray-50 dark:bg-gray-900"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={onClear}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove Image
                </Button>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center">
                <ImageIcon className="h-4 w-4 mr-2" />
                <span>Image selected</span>
              </div>
              <Button variant="ghost" size="sm" onClick={onClear}>
                Change Image
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

