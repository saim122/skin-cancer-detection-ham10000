'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, Info, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Prediction, CANCER_CLASSES, ScanResult } from '@/types';
import { cn } from '@/lib/utils';
import { generatePDFReport } from '@/lib/pdf-export';
import toast from 'react-hot-toast';

interface PredictionResultsProps {
  predictions: Prediction[];
  scanResult?: ScanResult;
  onExportPDF?: () => void;
}

export function PredictionResults({ predictions, scanResult, onExportPDF }: PredictionResultsProps) {
  const topPrediction = predictions[0];
  const cancerClass = CANCER_CLASSES[topPrediction.classId];

  const handleExportPDF = async () => {
    if (!scanResult) {
      toast.error('Scan data not available for export');
      return;
    }
    
    try {
      toast.loading('Generating PDF report...', { id: 'pdf-export' });
      await generatePDFReport(scanResult);
      toast.success('PDF report downloaded successfully!', { id: 'pdf-export' });
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to generate PDF report', { id: 'pdf-export' });
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle className="h-6 w-6 text-danger-500" />;
      case 'medium':
        return <Info className="h-6 w-6 text-warning-500" />;
      default:
        return <CheckCircle className="h-6 w-6 text-success-500" />;
    }
  };

  const getSeverityMessage = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'High Risk - Please consult a dermatologist immediately';
      case 'medium':
        return 'Moderate Risk - Medical consultation recommended';
      default:
        return 'Low Risk - Monitor and follow up if changes occur';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Prediction Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-l-4" style={{ borderLeftColor: cancerClass.color }}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getSeverityIcon(cancerClass.severity)}
                <div>
                  <CardTitle>{cancerClass.name}</CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Confidence: {(topPrediction.probability * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {getSeverityMessage(cancerClass.severity)}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                  Description
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {cancerClass.description}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                  Common Causes
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {cancerClass.causes}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                  Risk Factors
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {cancerClass.riskFactors}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">
                  Symptoms
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {cancerClass.symptoms}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* All Predictions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>All Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {predictions.map((prediction, index) => {
                const classData = CANCER_CLASSES[prediction.classId];
                const percentage = (prediction.probability * 100).toFixed(2);
                
                return (
                  <motion.div
                    key={prediction.classId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: classData.color }}
                        />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {classData.name}
                        </span>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {percentage}%
                      </span>
                    </div>
                    <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{ backgroundColor: classData.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="p-4 bg-warning-50 dark:bg-warning-950/20 border border-warning-200 dark:border-warning-800 rounded-lg"
      >
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-warning-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-warning-800 dark:text-warning-200">
              Medical Disclaimer
            </p>
            <p className="text-warning-700 dark:text-warning-300 mt-1">
              This tool is for educational and informational purposes only. It is NOT a substitute
              for professional medical advice, diagnosis, or treatment. Always seek the advice of
              a qualified healthcare provider with any questions regarding a medical condition.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

