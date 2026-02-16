'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { HOSPITALS } from '@/types';

export default function RatesPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredHospitals = HOSPITALS.filter(hospital =>
    hospital.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <DollarSign className="h-10 w-10 text-primary-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Hospital Rates
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Compare skin cancer test rates across different hospitals in Lahore
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for hospital names..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Rates Table */}
        <Card>
          <CardHeader>
            <CardTitle>Skin Cancer Test Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900 dark:text-white">
                      Hospital Name
                    </th>
                    <th className="text-right py-4 px-4 font-semibold text-gray-900 dark:text-white">
                      Rate (Rs.)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredHospitals.length > 0 ? (
                    filteredHospitals.map((hospital, index) => (
                      <motion.tr
                        key={hospital.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                      >
                        <td className="py-4 px-4 text-gray-700 dark:text-gray-300">
                          {hospital.name}
                        </td>
                        <td className="py-4 px-4 text-right font-medium text-primary-500">
                          Rs. {hospital.rate.toLocaleString()}
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="py-8 text-center text-gray-500 dark:text-gray-400">
                        No hospitals found matching "{searchTerm}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 p-4 bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 rounded-lg"
        >
          <p className="text-sm text-primary-800 dark:text-primary-200">
            <strong>Note:</strong> Rates are approximate and may vary. Please contact the hospital
            directly for the most accurate and up-to-date pricing information.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

