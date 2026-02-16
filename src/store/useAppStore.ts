import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ScanResult, PatientData } from '@/types';

interface AppState {
  // Theme
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;

  // Patient data
  currentPatient: PatientData;
  setPatientData: (data: Partial<PatientData>) => void;
  resetPatientData: () => void;

  // Scan history
  scanHistory: ScanResult[];
  addScanResult: (result: ScanResult) => void;
  clearHistory: () => void;
  deleteScan: (id: string) => void;

  // Model loading state
  modelsLoaded: boolean;
  setModelsLoaded: (loaded: boolean) => void;
}

const initialPatientData: PatientData = {
  firstName: '',
  patientId: '',
  username: '',
  gender: '',
  age: '',
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Theme
      theme: 'light',
      setTheme: (theme) => {
        set({ theme });
        if (typeof window !== 'undefined') {
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        get().setTheme(newTheme);
      },

      // Patient data
      currentPatient: initialPatientData,
      setPatientData: (data) =>
        set((state) => ({
          currentPatient: { ...state.currentPatient, ...data },
        })),
      resetPatientData: () => set({ currentPatient: initialPatientData }),

      // Scan history
      scanHistory: [],
      addScanResult: (result) =>
        set((state) => ({
          scanHistory: [result, ...state.scanHistory].slice(0, 50), // Keep last 50 scans
        })),
      clearHistory: () => set({ scanHistory: [] }),
      deleteScan: (id) =>
        set((state) => ({
          scanHistory: state.scanHistory.filter((scan) => scan.id !== id),
        })),

      // Model state
      modelsLoaded: false,
      setModelsLoaded: (loaded) => set({ modelsLoaded: loaded }),
    }),
    {
      name: 'skin-health-storage',
      partialize: (state) => ({
        theme: state.theme,
        scanHistory: state.scanHistory,
        modelsLoaded: state.modelsLoaded,
      }),
    }
  )
);

