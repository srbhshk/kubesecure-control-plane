import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export enum OnboardingStep {
  WELCOME = 0,
  GIT_CONNECTION = 1,
  AGENT_INSTALL = 2,
  ENVIRONMENT_SETUP = 3,
  PROMOTION_PREVIEW = 4,
  COST_VISIBILITY = 5,
  DRIFT_DETECTION = 6,
  COMPLETED = 7,
}

interface OnboardingState {
  currentStep: OnboardingStep;
  isCompleted: boolean;
  setStep: (step: OnboardingStep) => void;
  nextStep: () => void;
  complete: () => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      currentStep: OnboardingStep.WELCOME,
      isCompleted: false,
      setStep: (step) => set({ currentStep: step }),
      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < OnboardingStep.COMPLETED) {
          set({ currentStep: currentStep + 1 });
        }
      },
      complete: () => set({ isCompleted: true, currentStep: OnboardingStep.COMPLETED }),
      reset: () => set({ currentStep: OnboardingStep.WELCOME, isCompleted: false }),
    }),
    {
      name: 'kubesecure-onboarding',
    }
  )
);
