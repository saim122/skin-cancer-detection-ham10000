'use client';

import { motion } from 'framer-motion';
import { Target, Lightbulb, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';

const sections = [
  {
    icon: Lightbulb,
    title: 'Introduction',
    content: `In cancer, there are over 200 different forms. Out of 200, melanoma is the deadliest form of skin cancer. 
    The diagnostic procedure for melanoma starts with clinical screening, followed by dermoscopic analysis and histopathological examination. 
    Melanoma skin cancer is highly curable if it gets identified at the early stages. The first step of Melanoma skin cancer diagnosis is 
    to conduct a visual examination of the skin's affected area. Dermatologists take the dermatoscopic images of the skin lesions by the 
    high-speed camera, which have an accuracy of 65-80% in the melanoma diagnosis without any additional technical support. With further 
    visual examination by cancer treatment specialists and dermatoscopic images, the overall prediction rate of melanoma diagnosis raised 
    to 75-84% accuracy. The project aims to build an automated classification system based on image processing techniques to classify skin 
    cancer using skin lesions images.`,
    color: 'primary',
  },
  {
    icon: Target,
    title: 'The Problem We Tried to Solve',
    content: `The first step to identify whether the skin lesion is malignant or benign for a dermatologist is to do a skin biopsy. 
    In the skin biopsy, the dermatologist takes some part of the skin lesion and examines it under the microscope. The current process 
    takes almost a week or more, starting from getting a dermatologist appointment to getting a biopsy report. This project aims to 
    shorten the current gap to just a couple of seconds by providing a predictive model using Computer-Aided Diagnosis (CAD). The approach 
    uses Convolutional Neural Network (CNN) to classify seven types of skin cancer from outlier lesions images. This reduction of the gap 
    has the opportunity to impact millions of people positively.`,
    color: 'danger',
  },
  {
    icon: Users,
    title: 'Our Aim',
    content: `We aim to make early skin cancer detection accessible for everyone and leverage existing deep learning models to improve 
    the current healthcare system. To make it accessible to the public, we built an easy-to-use web application. Users or dermatologists 
    can upload patient demographic information along with the skin lesion image. With the image and patient demographics as input, the model 
    will analyze the data and return the results within seconds. Keeping the broader demographic of people in mind, we have also developed 
    a comprehensive information page, which provides a generalized overview of melanoma and steps to use the online tool to get results.`,
    color: 'success',
  },
];

export default function AboutPage() {
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
            About Our Project
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Revolutionizing skin cancer detection through AI and deep learning
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 max-w-4xl mx-auto">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card hover>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`p-3 bg-${section.color}-100 dark:bg-${section.color}-950 rounded-lg`}>
                      <section.icon className={`h-6 w-6 text-${section.color}-500`} />
                    </div>
                    <CardTitle className="text-2xl">{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Technology Stack */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-center">Technology Stack</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Next.js', 'TypeScript', 'TensorFlow.js', 'MobileNet', 'Tailwind CSS', 'React', 'Zustand', 'Framer Motion'].map((tech) => (
                  <div
                    key={tech}
                    className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center font-medium text-gray-700 dark:text-gray-300"
                  >
                    {tech}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}

