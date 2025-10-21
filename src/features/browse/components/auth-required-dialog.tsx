'use client';

import { useRouter } from 'next/navigation';
import { Sparkles, CheckCircle2, Shield, TrendingUp, Zap } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { paths } from '@/config/paths';

interface AuthRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: 'proposal' | 'message';
}

export function AuthRequiredDialog({ open, onOpenChange, action }: AuthRequiredDialogProps) {
  const router = useRouter();

  const actionText = action === 'proposal' ? 'submit proposals' : 'send messages';
  const actionTitle = action === 'proposal' ? 'Submit a Proposal' : 'Send a Message';

  const handleSignup = () => {
    onOpenChange(false);
    router.push(paths.auth.signup.getHref());
  };

  const benefits = [
    {
      icon: <CheckCircle2 className="w-5 h-5 text-primary" />,
      text: action === 'proposal' ? 'Submit proposals and win projects' : 'Connect with top AI experts and clients',
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-primary" />,
      text: 'Build your professional profile and portfolio',
    },
    {
      icon: <Zap className="w-5 h-5 text-primary" />,
      text: 'Access exclusive AI automation opportunities',
    },
    {
      icon: <Shield className="w-5 h-5 text-primary" />,
      text: 'Secure payments with milestone tracking',
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center space-y-2">
            <DialogTitle className="text-2xl font-semibold">Join LinkerAI to {actionTitle}</DialogTitle>
            <DialogDescription className="text-base">
              Create your free account to {actionText} and unlock the full potential of our AI marketplace
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex-shrink-0 mt-0.5">
                {benefit.icon}
              </div>
              <p className="text-sm leading-relaxed">{benefit.text}</p>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <Button onClick={handleSignup} size="lg" className="w-full text-base h-12">
            Create Free Account
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-3">
            Already have an account?{' '}
            <button
              onClick={() => {
                onOpenChange(false);
                router.push(paths.auth.login.getHref());
              }}
              className="text-primary hover:underline font-medium"
            >
              Log in
            </button>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
