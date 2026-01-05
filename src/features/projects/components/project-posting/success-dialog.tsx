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
  selectedFreelancersCount: number;
  autoInviteEnabled?: boolean;
  onViewProjects: () => void;
  onPostAnother: () => void;
}

export function SuccessDialog({
  open,
  onOpenChange,
  selectedFreelancersCount,
  autoInviteEnabled,
  onViewProjects,
  onPostAnother,
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
            Project Posted Successfully!
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Your project is now live and visible to qualified AI experts.
            {selectedFreelancersCount > 0 &&
              ` ${selectedFreelancersCount} expert${selectedFreelancersCount !== 1 ? 's have' : ' has'} been invited to submit proposals.`}
            {autoInviteEnabled &&
              " Project posted! We've already notified experts who specialize in this specific task. You don't need to search—just wait for their proposals."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-col gap-2 mt-4">
          <Button size="lg" className="w-full" onClick={onViewProjects}>
            View My Projects
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="w-full"
            onClick={onPostAnother}
          >
            Post Another Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
