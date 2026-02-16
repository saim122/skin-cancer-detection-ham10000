'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Calendar,
  FileText,
  User,
  TrendingUp,
  Download,
  Trash2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { getCurrentUser } from '@/lib/auth-backend';
import { apiClient } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { CANCER_CLASSES } from '@/types';
import { generatePDFReport, generateBatchPDFReport } from '@/lib/pdf-export';
import toast from 'react-hot-toast';
import Link from 'next/link';

function DashboardContent() {
  const [user, setUser] = useState<any>(null);
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserAndScans();
  }, []);

  const loadUserAndScans = async () => {
    try {
      const currentUser = getCurrentUser();
      setUser(currentUser);

      // Load scans from backend
      const response = await apiClient.getScans();
      if (response.success) {
        setScanHistory(response.scans || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load scan history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteScan = async (scanId: string) => {
    if (!confirm('Are you sure you want to delete this scan?')) return;

    try {
      const response = await apiClient.deleteScan(scanId);
      if (response.success) {
        setScanHistory(scanHistory.filter(s => s.id !== scanId));
        toast.success('Scan deleted');
      }
    } catch (error) {
      toast.error('Failed to delete scan');
    }
  };

  const handleClearHistory = async () => {
    if (!confirm('Are you sure you want to clear all scan history? This cannot be undone.')) return;

    try {
      const response = await apiClient.clearAllScans();
      if (response.success) {
        setScanHistory([]);
        toast.success('Scan history cleared');
      }
    } catch (error) {
      toast.error('Failed to clear history');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    totalScans: scanHistory.length,
    highRisk: scanHistory.filter(s => 
      CANCER_CLASSES[s.topPrediction.classId].severity === 'high'
    ).length,
    mediumRisk: scanHistory.filter(s => 
      CANCER_CLASSES[s.topPrediction.classId].severity === 'medium'
    ).length,
    lowRisk: scanHistory.filter(s => 
      CANCER_CLASSES[s.topPrediction.classId].severity === 'low'
    ).length,
  };

  const handleExportAll = async () => {
    if (scanHistory.length === 0) {
      toast.error('No scans to export');
      return;
    }

    try {
      toast.loading('Generating PDF...', { id: 'export-all' });
      await generateBatchPDFReport(scanHistory);
      toast.success('PDF exported successfully!', { id: 'export-all' });
    } catch (error) {
      toast.error('Failed to export PDF', { id: 'export-all' });
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back, {user.firstName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's your skin health analysis dashboard
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Total Scans
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.totalScans}
                  </p>
                </div>
                <div className="p-3 bg-primary-100 dark:bg-primary-950 rounded-lg">
                  <Activity className="h-8 w-8 text-primary-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    High Risk
                  </p>
                  <p className="text-3xl font-bold text-danger-500">
                    {stats.highRisk}
                  </p>
                </div>
                <div className="p-3 bg-danger-100 dark:bg-danger-950 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-danger-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Medium Risk
                  </p>
                  <p className="text-3xl font-bold text-warning-500">
                    {stats.mediumRisk}
                  </p>
                </div>
                <div className="p-3 bg-warning-100 dark:bg-warning-950 rounded-lg">
                  <FileText className="h-8 w-8 text-warning-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Low Risk
                  </p>
                  <p className="text-3xl font-bold text-success-500">
                    {stats.lowRisk}
                  </p>
                </div>
                <div className="p-3 bg-success-100 dark:bg-success-950 rounded-lg">
                  <Calendar className="h-8 w-8 text-success-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link href="/detector">
            <Button>
              <Activity className="h-4 w-4 mr-2" />
              New Scan
            </Button>
          </Link>
          <Button variant="outline" onClick={handleExportAll} disabled={scanHistory.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export All Reports
          </Button>
          <Button variant="outline" onClick={handleClearHistory} disabled={scanHistory.length === 0}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear History
          </Button>
          <Link href="/dashboard/profile">
            <Button variant="outline">
              <User className="h-4 w-4 mr-2" />
              View Profile
            </Button>
          </Link>
        </div>

        {/* Scan History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Scans</CardTitle>
            <CardDescription>
              Your skin analysis history
            </CardDescription>
          </CardHeader>
          <CardContent>
            {scanHistory.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No scans yet. Start your first analysis!
                </p>
                <Link href="/detector">
                  <Button>Start Analysis</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {scanHistory.slice(0, 10).map((scan, index) => {
                  const classData = CANCER_CLASSES[scan.topPrediction.classId];
                  const confidence = (scan.topPrediction.probability * 100).toFixed(2);
                  
                  return (
                    <motion.div
                      key={scan.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={scan.imageDataUrl}
                          alt="Scan"
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {classData.name}
                            </h4>
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: classData.color }}
                            >
                              {confidence}%
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(scan.timestamp)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Patient: {scan.patientData.firstName} (ID: {scan.patientData.patientId})
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={async () => {
                            try {
                              await generatePDFReport(scan);
                              toast.success('PDF exported');
                            } catch (error) {
                              toast.error('Export failed');
                            }
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteScan(scan.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  );
                })}
                
                {scanHistory.length > 10 && (
                  <div className="text-center pt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Showing 10 of {scanHistory.length} scans
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

