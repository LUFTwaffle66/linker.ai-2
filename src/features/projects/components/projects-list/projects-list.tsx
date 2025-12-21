'use client';

import { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { ProjectCard } from './project-card';
import type { ProjectWithClient } from '../../api/projects';

interface ProjectsListProps {
  projects: ProjectWithClient[];
  currentUserId?: string;
}

const categories = [
  'All Categories',
  'Web Development',
  'Mobile Development',
  'UI/UX Design',
  'Data Science',
  'DevOps',
  'Marketing',
  'Writing',
  'Other',
];

export function ProjectsList({ projects, currentUserId }: ProjectsListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const userProjects = useMemo(
    () =>
      currentUserId
        ? projects.filter(
            (project) =>
              project.client_id === currentUserId || project.hired_freelancer_id === currentUserId
          )
        : projects,
    [projects, currentUserId]
  );

  // Separate projects by status
  const activeProjects = useMemo(
    () => userProjects.filter((p) => p.status === 'in_progress'),
    [userProjects]
  );

  const completedProjects = useMemo(
    () =>
      userProjects.filter(
        (p) =>
          p.status === 'completed' &&
          (!currentUserId || p.client_id === currentUserId || p.hired_freelancer_id === currentUserId)
      ),
    [userProjects, currentUserId]
  );

  // Filter function
  const filterProjects = (projectsList: ProjectWithClient[]) => {
    return projectsList.filter((project) => {
      const matchesSearch =
        searchQuery === '' ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === 'All Categories' || project.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  };

  const filteredActive = useMemo(
    () => filterProjects(activeProjects),
    [activeProjects, searchQuery, selectedCategory]
  );

  const filteredCompleted = useMemo(
    () => filterProjects(completedProjects),
    [completedProjects, searchQuery, selectedCategory]
  );

  const filteredAll = useMemo(() => filterProjects(userProjects), [userProjects, searchQuery, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active ({filteredActive.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({filteredCompleted.length})</TabsTrigger>
          <TabsTrigger value="all">All ({filteredAll.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-6">
          {filteredActive.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery || selectedCategory !== 'All Categories'
                  ? 'No active projects match your filters'
                  : 'No active projects yet'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredActive.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {filteredCompleted.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery || selectedCategory !== 'All Categories'
                  ? 'No completed projects match your filters'
                  : 'No completed projects yet'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCompleted.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          {filteredAll.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {searchQuery || selectedCategory !== 'All Categories'
                  ? 'No projects match your filters'
                  : 'No projects yet'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredAll.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
