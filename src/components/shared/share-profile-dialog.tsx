'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, Check, Twitter, Linkedin, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface ShareProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileUrl: string;
  profileName: string;
  profileTitle: string;
}

export function ShareProfileDialog({
  open,
  onOpenChange,
  profileUrl,
  profileName,
  profileTitle,
}: ShareProfileDialogProps) {
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${profileUrl}`
    : profileUrl;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const shareText = `Check out ${profileName}'s profile - ${profileTitle}`;

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const handleLinkedInShare = () => {
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=420');
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(`Check out ${profileName}'s profile`);
    const body = encodeURIComponent(`${shareText}\n\n${fullUrl}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Profile</DialogTitle>
          <DialogDescription>
            Share {profileName}'s profile with others
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Copy Link */}
          <div className="space-y-2">
            <Label htmlFor="profile-url">Profile Link</Label>
            <div className="flex gap-2">
              <Input
                id="profile-url"
                value={fullUrl}
                readOnly
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Social Share Buttons */}
          <div className="space-y-2">
            <Label>Share on</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleTwitterShare}
                className="w-full"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleLinkedInShare}
                className="w-full"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleEmailShare}
                className="w-full"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
