'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ProjectCard } from '@/components/browse/project-card';
import { FreelancerCard } from '@/components/browse/freelancer-card';
import { ProjectDetailSheet } from '@/components/browse/project-detail-sheet';
import { FreelancerDetailSheet } from '@/components/browse/freelancer-detail-sheet';
import { BrowseFilters } from '@/components/browse/browse-filters';
import { type Project, type Expert } from '@/types/browse';
import { MOCK_PROJECTS, MOCK_FREELANCERS } from '@/lib/mock-data';
import { paths } from '@/config/paths';

const ITEMS_PER_PAGE = 5;

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Get initial values from URL search params
  const tabParam = searchParams.get('tab');
  const queryParam = searchParams.get('q');

  const [activeTab, setActiveTab] = useState(tabParam === 'freelancers' ? 'freelancers' : 'projects');
  const [searchQuery, setSearchQuery] = useState(queryParam || '');
  const [showFilters, setShowFilters] = useState(false);
  const [projectsPage, setProjectsPage] = useState(1);
  const [freelancersPage, setFreelancersPage] = useState(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedFreelancer, setSelectedFreelancer] = useState<Expert | null>(null);

  // TODO: Replace with actual authentication check
  // For now, set to false to show the auth dialog
  const isAuthenticated = false;

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    updateURL({ tab, q: searchQuery });
  };

  // Update URL search params
  const updateURL = (params: { tab?: string; q?: string }) => {
    const newParams = new URLSearchParams(searchParams.toString());

    if (params.tab) {
      newParams.set('tab', params.tab);
    }

    if (params.q !== undefined) {
      if (params.q) {
        newParams.set('q', params.q);
      } else {
        newParams.delete('q');
      }
    }

    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  // Handle search
  const handleSearch = () => {
    updateURL({ tab: activeTab, q: searchQuery });
  };

  // Sync state with URL params on mount and param changes
  // This constantly monitors URL search params and updates component state accordingly
  useEffect(() => {
    const validTab = tabParam === 'freelancers' || tabParam === 'projects' ? tabParam : 'projects';

    if (validTab !== activeTab) {
      setActiveTab(validTab);
    }

    if (queryParam !== searchQuery) {
      setSearchQuery(queryParam || '');
    }
  }, [tabParam, queryParam]);

  const projects = MOCK_PROJECTS;
  const freelancers = MOCK_FREELANCERS;

  // Separate pagination calculations for projects
  const projectsTotalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const paginatedProjects = projects.slice(
    (projectsPage - 1) * ITEMS_PER_PAGE,
    projectsPage * ITEMS_PER_PAGE
  );

  // Separate pagination calculations for freelancers
  const freelancersTotalPages = Math.ceil(freelancers.length / ITEMS_PER_PAGE);
  const paginatedFreelancers = freelancers.slice(
    (freelancersPage - 1) * ITEMS_PER_PAGE,
    freelancersPage * ITEMS_PER_PAGE
  );

  const handleSubmitProposal = (project: Project) => {
    // Navigate to submit proposal page with project ID
    router.push(paths.app.submitProposal.getHref(project.id));
  };

  const handleSendMessage = (freelancer: Expert) => {
    console.log('Send message to:', freelancer);
    // TODO: Navigate to messages or open messaging interface
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl mb-4">Find Projects & AI Experts</h1>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Search projects, AI services, or experts..."
                className="pl-10 h-12"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
              />
            </div>
            <Button size="lg" className="h-12 px-8" onClick={handleSearch}>
              Search
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-4"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
              <TabsTrigger value="freelancers">AI Experts ({freelancers.length})</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <BrowseFilters activeTab={activeTab} />
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              {/* Projects Tab */}
              <TabsContent value="projects" className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">{projects.length} projects found</p>
                  <Select defaultValue="relevance">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Most Relevant</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="budget-high">Highest Budget</SelectItem>
                      <SelectItem value="budget-low">Lowest Budget</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paginatedProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={setSelectedProject}
                  />
                ))}

                {/* Projects Pagination */}
                {projectsTotalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setProjectsPage((prev) => Math.max(1, prev - 1))}
                          className={
                            projectsPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>
                      {[...Array(projectsTotalPages)].map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setProjectsPage(i + 1)}
                            isActive={projectsPage === i + 1}
                            className="cursor-pointer"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setProjectsPage((prev) => Math.min(projectsTotalPages, prev + 1))}
                          className={
                            projectsPage === projectsTotalPages
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </TabsContent>

              {/* Freelancers Tab */}
              <TabsContent value="freelancers" className="space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">{freelancers.length} experts found</p>
                  <Select defaultValue="relevance">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Most Relevant</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="rate-low">Lowest Rate</SelectItem>
                      <SelectItem value="rate-high">Highest Rate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {paginatedFreelancers.map((freelancer) => (
                  <FreelancerCard
                    key={freelancer.id}
                    freelancer={freelancer}
                    onClick={setSelectedFreelancer}
                  />
                ))}

                {/* Freelancers Pagination */}
                {freelancersTotalPages > 1 && (
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => setFreelancersPage((prev) => Math.max(1, prev - 1))}
                          className={
                            freelancersPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>
                      {[...Array(freelancersTotalPages)].map((_, i) => (
                        <PaginationItem key={i}>
                          <PaginationLink
                            onClick={() => setFreelancersPage(i + 1)}
                            isActive={freelancersPage === i + 1}
                            className="cursor-pointer"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => setFreelancersPage((prev) => Math.min(freelancersTotalPages, prev + 1))}
                          className={
                            freelancersPage === freelancersTotalPages
                              ? 'pointer-events-none opacity-50'
                              : 'cursor-pointer'
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Project Detail Sheet */}
      <ProjectDetailSheet
        project={selectedProject}
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
        onSubmitProposal={handleSubmitProposal}
        isAuthenticated={isAuthenticated}
      />

      {/* Freelancer Detail Sheet */}
      <FreelancerDetailSheet
        freelancer={selectedFreelancer}
        open={!!selectedFreelancer}
        onOpenChange={(open) => !open && setSelectedFreelancer(null)}
        onSendMessage={handleSendMessage}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}
