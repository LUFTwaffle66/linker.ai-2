import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectTitle: string;
  clientName: string;
  onBrowseMore: () => void;
  onViewProposals: () => void;
}

export function SuccessDialog({
  open,
  onOpenChange,
  projectTitle,
  clientName,
  onBrowseMore,
  onViewProposals,
}: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">
            Proposal Submitted Successfully!
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Your proposal for "{projectTitle}" has been submitted to {clientName}.
            You'll be notified when the client reviews your proposal.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-col gap-2 mt-4">
          <Button
            size="lg"
            className="w-full"
            onClick={onBrowseMore}
          >
            Browse More Projects
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={onViewProposals}
          >
            View My Proposals
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
