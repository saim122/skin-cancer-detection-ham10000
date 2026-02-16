import * as tf from '@tensorflow/tfjs';

export interface CancerClass {
  id: number;
  code: string;
  name: string;
  description: string;
  causes: string;
  riskFactors: string;
  symptoms: string;
  color: string;
  severity: 'low' | 'medium' | 'high';
}

export interface Prediction {
  className: string;
  probability: number;
  classId: number;
}

export interface PatientData {
  firstName: string;
  patientId: string;
  username: string;
  gender: 'M' | 'F' | '';
  age: string;
}

export interface ScanResult {
  id: string;
  timestamp: Date | string; // Date object or ISO string from localStorage
  patientData: PatientData;
  predictions: Prediction[];
  imageDataUrl: string;
  isValidSkinImage: boolean;
  topPrediction: Prediction;
}

export interface ModelState {
  cancerModel: tf.LayersModel | null;
  classifierModel: tf.LayersModel | null;
  isLoading: boolean;
  loadingProgress: number;
  error: string | null;
}

export interface ToastConfig {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export const CANCER_CLASSES: Record<number, CancerClass> = {
  0: {
    id: 0,
    code: 'akiec',
    name: 'Actinic Keratoses',
    description: 'Actinic keratoses describes lesions on the outer skin layer caused by too much exposure to ultraviolet rays.',
    causes: 'Sun exposure, indoor tanning, extensive exposure to X-rays',
    riskFactors: 'People with fair skin, freckles, blonde or red hair and blue, green or gray eyes',
    symptoms: 'Typically occur on the face, lips, ears, bald scalp, shoulders, neck and back of the hands',
    color: '#f59e0b',
    severity: 'medium'
  },
  1: {
    id: 1,
    code: 'bcc',
    name: 'Basal Cell Carcinoma',
    description: 'Basal cell carcinoma is a cancer that grows on parts of your skin that get a lot of sun.',
    causes: 'Combination of cumulative and intense, occasional sun exposure',
    riskFactors: 'Anyone with a history of sun exposure',
    symptoms: 'Typically occur on the sun-exposed areas of the body',
    color: '#f97316',
    severity: 'medium'
  },
  2: {
    id: 2,
    code: 'bkl',
    name: 'Benign Keratosis',
    description: 'Seborrheic keratoses are noncancerous skin growths that some people develop as they age.',
    causes: 'The exact cause is not known',
    riskFactors: 'People over 50',
    symptoms: 'Typically occur on the face, chest, shoulders or back',
    color: '#22c55e',
    severity: 'low'
  },
  3: {
    id: 3,
    code: 'df',
    name: 'Dermatofibroma',
    description: 'Dermatofibromas are harmless round, red-brownish skin growths most commonly found on the arms and legs.',
    causes: 'May be caused by an adverse reaction to a small injury, such as a bug bite',
    riskFactors: 'More frequent in women and people with compromised immune systems',
    symptoms: 'Can develop anywhere on the body but most often on lower legs, upper arms or upper back',
    color: '#10b981',
    severity: 'low'
  },
  4: {
    id: 4,
    code: 'mel',
    name: 'Melanoma',
    description: 'Melanoma is the most serious type of skin cancer, develops in melanocytes that produce melanin.',
    causes: 'Exposure to ultraviolet (UV) radiation from sunlight or tanning lamps and beds',
    riskFactors: 'People with fair skin, freckles, blonde or red hair, multiple moles, family history',
    symptoms: 'Can appear anywhere on the body, changes in existing moles or new pigmented growths',
    color: '#ef4444',
    severity: 'high'
  },
  5: {
    id: 5,
    code: 'nv',
    name: 'Melanocytic Nevi',
    description: 'Melanocytic nevi are benign neoplasms composed of melanocytes, the pigment-producing cells.',
    causes: 'Genetics, sunlight, hormones',
    riskFactors: 'People over 30',
    symptoms: 'Can appear anywhere on the body, but more often on trunk or limbs',
    color: '#14b8a6',
    severity: 'low'
  },
  6: {
    id: 6,
    code: 'vasc',
    name: 'Vascular Lesions',
    description: 'The most common vascular lesions are hemangiomas and angiomas - benign proliferations of blood vessels.',
    causes: 'Genetics, sunlight, hormones',
    riskFactors: 'People over 30',
    symptoms: 'Can occur throughout the whole body, 60% located in head and neck region',
    color: '#06b6d4',
    severity: 'low'
  }
};

export const HOSPITALS = [
  { name: 'King Edward Hospital', rate: 1200 },
  { name: 'Jinnah Hospital', rate: 2500 },
  { name: 'Fatima Memorial Hospital', rate: 3000 },
  { name: 'Ganga Ram Hospital', rate: 1800 },
  { name: 'Defense Hospital', rate: 2000 },
  { name: 'Shalimar Hospital', rate: 1800 },
  { name: "Doctor's Hospital", rate: 2500 },
  { name: 'Lahore Care Hospital', rate: 2200 },
];

