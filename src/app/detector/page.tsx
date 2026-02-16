'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scan, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { ImageUpload } from '@/components/detector/ImageUpload';
import { PatientForm } from '@/components/detector/PatientForm';
import { PredictionResults } from '@/components/detector/PredictionResults';
import { tensorflowService } from '@/lib/tensorflow';
import { useAppStore } from '@/store/useAppStore';
import { Prediction } from '@/types';
import { apiClient, isAuthenticated } from '@/lib/api';

export default function DetectorPage() {
  const { currentPatient, modelsLoaded, setModelsLoaded, addScanResult } = useAppStore();
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[] | null>(null);
  const [currentScanResult, setCurrentScanResult] = useState<any>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!modelsLoaded && !isLoadingModels) {
      loadModels();
    }
  }, [modelsLoaded, isLoadingModels]);

  const loadModels = async () => {
    setIsLoadingModels(true);
    try {
      await tensorflowService.loadModels((progress, status) => {
        setLoadingProgress(progress);
        setLoadingStatus(status);
      });
      setModelsLoaded(true);
      toast.success('AI models loaded successfully!');
    } catch (error) {
      console.error('Error loading models:', error);
      toast.error('Failed to load AI models. Please refresh the page.');
    } finally {
      setIsLoadingModels(false);
    }
  };

  const handleImageSelect = (file: File, dataUrl: string) => {
    setSelectedFile(file);
    setSelectedImage(dataUrl);
    setPredictions(null);
  };

  const handleClearImage = () => {
    setSelectedImage('');
    setSelectedFile(null);
    setPredictions(null);
  };

  const handlePredict = async () => {
    if (!selectedImage || !modelsLoaded) {
      toast.error('Please upload an image first');
      return;
    }

    setIsPredicting(true);
    setPredictions(null);

    try {
      // Create image element for prediction
      const img = new Image();
      img.src = selectedImage;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      // Validate if it's a skin image
      toast.loading('Validating image...', { id: 'validation' });
      const isValidSkinImage = await tensorflowService.validateSkinImage(img);
      toast.dismiss('validation');

      if (!isValidSkinImage) {
        toast.error('This does not appear to be a skin image. Please upload a valid dermatoscopic image.');
        return;
      }

      // Predict cancer type
      toast.loading('Analyzing skin lesion...', { id: 'prediction' });
      const results = await tensorflowService.predictCancer(img);
      toast.dismiss('prediction');

      setPredictions(results);

      // Save to history
      const scanResult = {
        id: Date.now().toString(),
        timestamp: new Date(),
        patientData: currentPatient,
        predictions: results,
        imageDataUrl: selectedImage,
        isValidSkinImage,
        topPrediction: results[0],
      };
      setCurrentScanResult(scanResult);
      
      // Save to backend if user is logged in
      if (isAuthenticated()) {
        try {
          await apiClient.saveScan(scanResult);
          toast.success('Analysis complete & saved to your account!');
        } catch (error) {
          console.error('Failed to save to backend:', error);
          // Still add to local store as fallback
          addScanResult(scanResult);
          toast.success('Analysis complete! (Not saved to account)');
        }
      } else {
        // Save to localStorage if not logged in
        addScanResult(scanResult);
        toast.success('Analysis complete! Sign in to save your history.');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('Failed to analyze image. Please try again.');
    } finally {
      setIsPredicting(false);
    }
  };

  const handleExportPDF = () => {
    toast.success('PDF export feature coming soon!');
  };

  if (isLoadingModels) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card>
          <CardContent className="py-12">
            <Loading message={loadingStatus} progress={loadingProgress} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Skin Lesion Analyzer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Upload an image of a skin lesion for AI-powered analysis and classification
          </p>
        </div>

        {/* Patient Form */}
        <div className="mb-8">
          <PatientForm onSubmit={() => {}} />
        </div>

        {/* Image Upload & Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left: Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Image</CardTitle>
              <CardDescription>
                Upload a clear image of the skin lesion for analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImageUpload
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
                onClear={handleClearImage}
              />
              
              {selectedImage && (
                <Button
                  onClick={handlePredict}
                  className="w-full mt-6"
                  size="lg"
                  isLoading={isPredicting}
                  disabled={!modelsLoaded || isPredicting}
                >
                  <Scan className="mr-2 h-5 w-5" />
                  {isPredicting ? 'Analyzing...' : 'Analyze Image'}
                </Button>
              )}

              {!modelsLoaded && (
                <div className="mt-4 p-4 bg-warning-50 dark:bg-warning-950/20 border border-warning-200 dark:border-warning-800 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-warning-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-warning-700 dark:text-warning-300">
                      AI models are loading. Please wait...
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right: Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Image Preview</CardTitle>
              <CardDescription>
                Selected image for analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedImage ? (
                <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    ref={imageRef}
                    src={selectedImage}
                    alt="Selected lesion"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gray-50 dark:bg-gray-900 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
                  <p className="text-gray-400 dark:text-gray-600">No image selected</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <AnimatePresence>
          {predictions && predictions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <PredictionResults predictions={predictions} scanResult={currentScanResult} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

