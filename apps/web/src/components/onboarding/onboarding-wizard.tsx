'use client';

import { useOnboardingStore, OnboardingStep } from '@/lib/store/onboarding.store';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { WelcomeStep } from './welcome-step';
import { GitConnectionStep } from './git-connection-step';
import { AgentInstallStep } from './agent-install-step';
import { EnvironmentSetupStep } from './environment-setup-step';
import { PromotionPreviewStep } from './promotion-preview-step';
import { CostVisibilityStep } from './cost-visibility-step';
import { DriftDetectionStep } from './drift-detection-step';

export function OnboardingWizard() {
  const { currentStep, nextStep, setStep, isCompleted } = useOnboardingStore();

  const steps = [
    { title: 'Welcome', description: 'Get started with KubeSecure', component: WelcomeStep },
    { title: 'Connect Git', description: 'Link your repository', component: GitConnectionStep },
    { title: 'Install Agent', description: 'Connect your cluster', component: AgentInstallStep },
    {
      title: 'Setup Environment',
      description: 'Create your first environment',
      component: EnvironmentSetupStep,
    },
    {
      title: 'Promotion Preview',
      description: 'See your first promotion',
      component: PromotionPreviewStep,
    },
    {
      title: 'Cost Visibility',
      description: 'Understand your spending',
      component: CostVisibilityStep,
    },
    { title: 'Drift Detection', description: 'Stay in sync', component: DriftDetectionStep },
  ];

  const ActiveStep = steps[currentStep]?.component;

  if (!ActiveStep || isCompleted) return null;

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex justify-between items-center mb-2">
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <span className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <CardDescription>{steps[currentStep].description}</CardDescription>
          <Progress value={progress} className="h-2 mt-4" />
        </CardHeader>
        <CardContent className="py-6">
          <ActiveStep />
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => setStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            Back
          </Button>
          <Button onClick={nextStep}>
            {currentStep === steps.length - 1 ? 'Complete' : 'Continue'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
