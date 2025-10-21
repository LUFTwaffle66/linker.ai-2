import { DollarSign, Clock, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import type { Project } from '@/types/browse';

interface ProjectOverviewCardProps {
  project: Project;
}

export function ProjectOverviewCard({ project }: ProjectOverviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Project Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium mb-2">{project.title}</h3>
          <Badge variant="outline">{project.category}</Badge>
        </div>

        <Separator />

        <div className="space-y-3 text-sm">
          <ProjectDetail
            icon={<DollarSign className="w-4 h-4" />}
            text={project.budget}
          />
          <ProjectDetail
            icon={<Clock className="w-4 h-4" />}
            text={project.timeline}
          />
          <ProjectDetail
            icon={<Calendar className="w-4 h-4" />}
            text={`Posted ${project.postedDate}`}
          />
        </div>

        <Separator />

        <div>
          <p className="text-sm text-muted-foreground mb-3">Required Skills:</p>
          <div className="flex flex-wrap gap-2">
            {project.skills.map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ProjectDetailProps {
  icon: React.ReactNode;
  text: string;
}

function ProjectDetail({ icon, text }: ProjectDetailProps) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      {icon}
      <span>{text}</span>
    </div>
  );
}
