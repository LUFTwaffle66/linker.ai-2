import { Paperclip, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AttachmentsSectionProps {
  attachments: File[];
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

export function AttachmentsSection({
  attachments,
  onFileUpload,
  onRemoveFile,
}: AttachmentsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attachments (Optional)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-2 border-dashed rounded-lg p-6 text-center">
          <Paperclip className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-3">
            Add relevant files (portfolio samples, certifications, technical docs)
          </p>
          <label htmlFor="file-upload">
            <Button variant="outline" size="sm" asChild>
              <span className="cursor-pointer">
                <Plus className="w-4 h-4 mr-2" />
                Choose Files
              </span>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            onChange={onFileUpload}
            className="hidden"
          />
        </div>

        {attachments.length > 0 && (
          <div className="space-y-2">
            {attachments.map((file, index) => (
              <AttachmentItem
                key={index}
                file={file}
                onRemove={() => onRemoveFile(index)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface AttachmentItemProps {
  file: File;
  onRemove: () => void;
}

function AttachmentItem({ file, onRemove }: AttachmentItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
      <div className="flex items-center gap-2">
        <Paperclip className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm">{file.name}</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        type="button"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
