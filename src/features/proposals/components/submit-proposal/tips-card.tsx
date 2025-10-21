import { Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PROPOSAL_TIPS = [
  'Personalize your cover letter to this specific project',
  'Highlight relevant experience and similar projects',
  'Be realistic with timeline and budget estimates',
  'Break down complex projects into clear milestones',
  'Attach portfolio samples or case studies',
] as const;

export function TipsCard() {
  return (
    <Card className="bg-primary/5 border-primary/20">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="w-5 h-5 text-primary" />
          Tips for Success
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {PROPOSAL_TIPS.map((tip, index) => (
          <p key={index}>✓ {tip}</p>
        ))}
      </CardContent>
    </Card>
  );
}
