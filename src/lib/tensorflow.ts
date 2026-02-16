import * as tf from '@tensorflow/tfjs';
import { Prediction } from '@/types';

export class TensorFlowService {
  private static instance: TensorFlowService;
  private cancerModel: tf.LayersModel | null = null;
  private classifierModel: tf.LayersModel | null = null;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): TensorFlowService {
    if (!TensorFlowService.instance) {
      TensorFlowService.instance = new TensorFlowService();
    }
    return TensorFlowService.instance;
  }

  async loadModels(
    onProgress?: (progress: number, status: string) => void
  ): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Set backend
      await tf.ready();
      onProgress?.(10, 'TensorFlow.js initialized');

      // Load cancer classification model
      onProgress?.(30, 'Loading cancer detection model...');
      this.cancerModel = await tf.loadLayersModel('/tfjs-models/Cancer/model.json');
      
      // Warm up the cancer model
      const dummyInput = tf.zeros([1, 224, 224, 3]);
      this.cancerModel.predict(dummyInput);
      (dummyInput as tf.Tensor).dispose();
      
      onProgress?.(60, 'Loading image validation model...');
      
      // Load classifier model
      this.classifierModel = await tf.loadLayersModel('/tfjs-models/classify/model.json');
      
      // Warm up the classifier model
      const dummyClassifierInput = tf.zeros([1, 128, 128, 1]);
      this.classifierModel.predict(dummyClassifierInput);
      (dummyClassifierInput as tf.Tensor).dispose();
      
      onProgress?.(100, 'Models loaded successfully');
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Error loading models:', error);
      throw new Error(
        'Failed to load AI models. Please check your internet connection and try again.'
      );
    }
  }

  async validateSkinImage(imageElement: HTMLImageElement): Promise<boolean> {
    if (!this.classifierModel) {
      // Attempt to (re)load models on demand
      await this.loadModels();
      if (!this.classifierModel) {
        throw new Error('Classification model not loaded');
      }
    }

    return tf.tidy(() => {
      // Preprocess for grayscale 128x128
      const tensor = tf.browser
        .fromPixels(imageElement)
        .resizeNearestNeighbor([128, 128])
        .mean(2)
        .expandDims(2)
        .expandDims(0)
        .toFloat()
        .div(255.0);

      const prediction = this.classifierModel!.predict(tensor) as tf.Tensor;
      const probabilities = prediction.dataSync();
      
      // If first class probability > 0.5, it's NOT a skin image
      return probabilities[0] <= 0.5;
    });
  }

  async predictCancer(imageElement: HTMLImageElement): Promise<Prediction[]> {
    if (!this.cancerModel) {
      // Attempt to (re)load models on demand
      await this.loadModels();
      if (!this.cancerModel) {
        throw new Error('Cancer detection model not loaded');
      }
    }

    return tf.tidy(() => {
      // Preprocess for MobileNet (224x224, normalized)
      let tensor = tf.browser
        .fromPixels(imageElement)
        .resizeNearestNeighbor([224, 224])
        .toFloat();

      const offset = tf.scalar(127.5);
      tensor = tensor.sub(offset).div(offset).expandDims(0);

      const prediction = this.cancerModel!.predict(tensor) as tf.Tensor;
      const probabilities = Array.from(prediction.dataSync());

      return probabilities
        .map((probability, classId) => ({
          probability,
          classId,
          className: this.getClassName(classId),
        }))
        .sort((a, b) => b.probability - a.probability);
    });
  }

  private getClassName(classId: number): string {
    const classNames: Record<number, string> = {
      0: 'akiec',
      1: 'bcc',
      2: 'bkl',
      3: 'df',
      4: 'mel',
      5: 'nv',
      6: 'vasc',
    };
    return classNames[classId] || 'unknown';
  }

  getModelInfo() {
    return {
      isInitialized: this.isInitialized,
      backend: tf.getBackend(),
      memory: tf.memory(),
    };
  }

  dispose() {
    if (this.cancerModel) {
      this.cancerModel.dispose();
      this.cancerModel = null;
    }
    if (this.classifierModel) {
      this.classifierModel.dispose();
      this.classifierModel = null;
    }
    this.isInitialized = false;
  }
}

export const tensorflowService = TensorFlowService.getInstance();

