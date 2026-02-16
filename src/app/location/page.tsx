'use client';

import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

export default function LocationPage() {
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
            <MapPin className="h-10 w-10 text-primary-500" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Find Dermatology Centers
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Locate nearby dermatology centers and hospitals for professional consultation
          </p>
        </div>

        {/* Map Section */}
        <Card>
          <CardHeader>
            <CardTitle>Dermatology Centers in Lahore</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative w-full h-[600px] bg-gray-100 dark:bg-gray-800 rounded-b-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d13619.34087363667!2d74.34701655!3d31.418665800000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1654412860063!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0"
              />
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>How to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Zoom in/out to find dermatology centers near your location</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Click on markers to view hospital names and contact information</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Get directions by clicking "Directions" on any location</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Check the Rates page for pricing information</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

