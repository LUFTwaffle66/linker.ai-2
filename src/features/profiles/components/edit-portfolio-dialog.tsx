'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl?: string;
}

interface EditPortfolioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues?: PortfolioItem | null;
  onSave: (item: PortfolioItem) => Promise<void>;
}

export function EditPortfolioDialog({
  open,
  onOpenChange,
  initialValues,
  onSave,
}: EditPortfolioDialogProps) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl || '');
  const [tags, setTags] = useState<string[]>(initialValues?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setTitle(initialValues?.title || '');
    setDescription(initialValues?.description || '');
    setImageUrl(initialValues?.imageUrl || '');
    setTags(initialValues?.tags || []);
    setNewTag('');
  }, [initialValues, open]);

  const handleAddTag = () => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a project title');
      return;
    }

    setIsLoading(true);
    try {
      await onSave({
        id: initialValues?.id || crypto.randomUUID(),
        title: title.trim(),
        description: description.trim(),
        tags,
        imageUrl: imageUrl.trim() || undefined,
      });
      toast.success(initialValues ? 'Portfolio item updated!' : 'Portfolio item added!');
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save portfolio item');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {initialValues ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
          </DialogTitle>
          <DialogDescription>
            Showcase your best work and achievements
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Project Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., AI Chatbot for E-commerce"
              maxLength={100}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the project, your role, technologies used, and results achieved..."
              className="min-h-[120px]"
              maxLength={1000}
            />
            <p className="text-sm text-muted-foreground">
              {description.length}/1000 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image-url">Image URL (optional)</Label>
            <Input
              id="image-url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/project-image.jpg"
              type="url"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tag-input">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tag-input"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., GPT-4, React, Python"
                maxLength={30}
              />
              <Button onClick={handleAddTag} variant="outline" type="button">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[60px] p-3 border rounded-md">
              {tags.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tags added</p>
              ) : (
                tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-destructive"
                      type="button"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            type="button"
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading} type="button">
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {initialValues ? 'Update' : 'Add'} Portfolio Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
