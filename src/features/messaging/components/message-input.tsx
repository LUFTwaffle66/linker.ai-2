"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Send } from 'lucide-react';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useSendMessage } from '../hooks';
import { sendMessageSchema, type SendMessageFormData } from '../types';

interface MessageInputProps {
  conversationId: string;
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const sendMessage = useSendMessage();

  const form = useForm<SendMessageFormData>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      conversationId,
      content: '',
      attachments: [],
    },
  });

  const onSubmit = async (data: SendMessageFormData) => {
    if (!data.content.trim()) return;

    setIsSubmitting(true);

    try {
      await sendMessage.mutateAsync(data);
      form.reset({ conversationId, content: '', attachments: [] });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="p-4 border-t bg-background">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="shrink-0"
            onClick={() => {
              // Handle file attachment
              const input = document.createElement('input');
              input.type = 'file';
              input.multiple = true;
              input.onchange = (e) => {
                const files = (e.target as HTMLInputElement).files;
                if (files) {
                  // Handle file upload logic here
                  console.log('Files selected:', files);
                }
              };
              input.click();
            }}
          >
            <Paperclip className="w-4 h-4" />
          </Button>

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Type a message... (Shift+Enter for new line)"
                    className="min-h-[60px] max-h-32 resize-none"
                    onKeyDown={handleKeyDown}
                    disabled={isSubmitting}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" size="icon" className="shrink-0" disabled={isSubmitting}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </Form>
    </div>
  );
}
