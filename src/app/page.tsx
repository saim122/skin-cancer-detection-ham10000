'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Shield, Zap, Users, Activity } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { CANCER_CLASSES } from '@/types';
import Image from 'next/image';

const features = [
  {
    icon: Zap,
    title: 'AI-Powered Detection',
    description: 'Advanced deep learning models trained on thousands of dermatoscopic images for accurate classification.',
  },
  {
    icon: Shield,
    title: 'Early Detection',
    description: 'Identify potential skin conditions early when treatment options are most effective.',
  },
  {
    icon: Users,
    title: 'Accessible Healthcare',
    description: 'Get instant preliminary analysis from anywhere, reducing time from detection to diagnosis.',
  },
  {
    icon: Activity,
    title: '7 Condition Types',
    description: 'Classifies skin lesions into 7 different categories with detailed information for each.',
  },
];

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            What Is{' '}
            <span className="gradient-text">Skin Cancer?</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Skin cancer is the out-of-control growth of abnormal cells in the epidermis, the outermost skin layer,
            caused by unrepaired DNA damage that triggers mutations. Our AI-powered tool helps in early detection.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/detector">
              <Button size="lg" className="group">
                Start Analysis
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-100 dark:bg-primary-950 rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary-500" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Conditions Overview */}
      <section className="py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-4">
            Types of Skin Cancer Classification
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12">
            Our AI system can analyze and classify skin lesions into 7 different categories, potentially
            allowing for early skin cancer detection when it is most treatable.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(CANCER_CLASSES).map((condition, index) => (
              <motion.div
                key={condition.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
              >
                <Card hover className="h-full border-t-4" style={{ borderTopColor: condition.color }}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: condition.color }}
                      >
                        {condition.code.toUpperCase()}
                      </div>
                      <span className={`text-xs font-medium ${
                        condition.severity === 'high' ? 'text-danger-500' :
                        condition.severity === 'medium' ? 'text-warning-500' :
                        'text-success-500'
                      }`}>
                        {condition.severity === 'high' ? 'High Risk' :
                         condition.severity === 'medium' ? 'Medium Risk' :
                         'Low Risk'}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{condition.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {condition.description}
                    </p>
                    <div className="space-y-2 text-xs">
                      <div>
                        <strong className="text-gray-900 dark:text-white">Causes:</strong>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">{condition.causes}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <Card className="bg-gradient-to-r from-primary-500 to-primary-700 border-0 text-white">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Analyze Your Skin Lesion?
              </h2>
              <p className="text-lg mb-8 opacity-90">
                Get instant AI-powered analysis and detailed information about skin conditions.
              </p>
              <Link href="/detector">
                <Button size="lg" variant="secondary">
                  Start Free Analysis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}

