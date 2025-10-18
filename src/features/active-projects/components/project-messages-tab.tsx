'use client';

import { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Send, Paperclip, X, File, Download } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useProjectMessages, useSendProjectMessage } from '../api/get-project-messages';
import { toast } from 'sonner';

interface ProjectMessagesTabProps {
  projectId: string;
}

export function ProjectMessagesTab({ projectId }: ProjectMessagesTabProps) {
  const [messageInput, setMessageInput] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: messages, isLoading } = useProjectMessages(projectId);
  const sendMessage = useSendProjectMessage();

  const handleSendMessage = () => {
    if (!messageInput.trim() && attachedFiles.length === 0) return;

    sendMessage.mutate(
      {
        projectId,
        content: messageInput,
        attachments: attachedFiles,
      },
      {
        onSuccess: () => {
          setMessageInput('');
          setAttachedFiles([]);
          toast.success('Message sent successfully!');
        },
        onError: () => {
          toast.error('Failed to send message');
        },
      }
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setAttachedFiles((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const removeAttachedFile = (index: number) => {
    setAttachedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading messages...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Messages</CardTitle>
        <CardDescription>Communicate with your team about project details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages Area */}
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {messages?.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'freelancer' ? 'flex-row-reverse' : ''}`}
              >
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarFallback className="text-xs">{message.avatar}</AvatarFallback>
                </Avatar>

                <div
                  className={`flex flex-col max-w-[85%] sm:max-w-[70%] ${
                    message.sender === 'freelancer' ? 'items-end' : ''
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">{message.senderName}</span>
                    <span className="text-xs text-muted-foreground">{message.senderRole}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                  </div>

                  {message.type === 'text' ? (
                    <div
                      className={`rounded-lg px-4 py-2 ${
                        message.sender === 'freelancer'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                  ) : (
                    <div
                      className={`rounded-lg border p-3 bg-background ${
                        message.sender === 'freelancer' ? 'border-primary' : 'border-border'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center flex-shrink-0">
                          <File className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{message.fileName}</p>
                          <p className="text-xs text-muted-foreground">{message.fileSize}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="flex-shrink-0">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Separator />

        {/* Message Input */}
        <div className="space-y-3">
          {/* File Attachments Preview */}
          {attachedFiles.length > 0 && (
            <div className="space-y-2">
              {attachedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <File className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm flex-1 truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachedFile(index)}
                    className="h-6 w-6 p-0 flex-shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-end gap-2">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
            />

            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="w-5 h-5" />
            </Button>

            <Textarea
              placeholder="Type your message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="min-h-[44px] max-h-32 resize-none"
              rows={1}
              disabled={sendMessage.isPending}
            />

            <Button
              onClick={handleSendMessage}
              disabled={(!messageInput.trim() && attachedFiles.length === 0) || sendMessage.isPending}
              className="flex-shrink-0"
            >
              <Send className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">{sendMessage.isPending ? 'Sending...' : 'Send'}</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
