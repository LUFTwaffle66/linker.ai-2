'use client';

import { Star, DollarSign, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { BUDGET_RANGES, RATE_RANGES, EXPERIENCE_LEVELS } from '../types';
import type { BrowseFilters, FreelancerFilters } from '../types';

interface BrowseFiltersComponentProps {
  activeTab: 'projects' | 'freelancers';
  filters: BrowseFilters | FreelancerFilters;
  onFiltersChange: (filters: BrowseFilters | FreelancerFilters) => void;
  availableCategories?: string[];
  availableSkills?: string[];
}

export function BrowseFiltersComponent({
  activeTab,
  filters,
  onFiltersChange,
  availableCategories = [],
  availableSkills = []
}: BrowseFiltersComponentProps) {
  const isProjectsTab = activeTab === 'projects';
  const minBudgetOrRateKey = isProjectsTab ? 'minBudget' : 'minRate';
  const maxBudgetOrRateKey = isProjectsTab ? 'maxBudget' : 'maxRate';
  const currentMinBudgetOrRate = (filters as any)[minBudgetOrRateKey];
  const currentMaxBudgetOrRate = (filters as any)[maxBudgetOrRateKey];

  const updateFilters = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const toggleSkill = (skill: string) => {
    const currentSkills = filters.skills || [];
    const newSkills = currentSkills.includes(skill)
      ? currentSkills.filter(s => s !== skill)
      : [...currentSkills, skill];
    updateFilters('skills', newSkills);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        {activeTab === 'projects' && (
          <div>
            <Label className="font-medium">Category</Label>
            <Select
              value={(filters as BrowseFilters).category || 'all'}
              onValueChange={(value) => updateFilters('category', value === 'all' ? undefined : value)}
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {availableCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Budget/Rate Range */}
        <div>
          <Label className="font-medium">
            {activeTab === 'projects' ? (
              <span className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Budget Range
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Hourly Rate
              </span>
            )}
          </Label>
          <Select
            value={
              currentMinBudgetOrRate || currentMaxBudgetOrRate
                ? `${currentMinBudgetOrRate || 0}-${currentMaxBudgetOrRate || 999999}`
                : 'all'
            }
            onValueChange={(value) => {
              if (value === 'all') {
                onFiltersChange({
                  ...filters,
                  [minBudgetOrRateKey]: undefined,
                  [maxBudgetOrRateKey]: undefined
                });
              } else {
                const [min, max] = value.split('-').map(v => v === '999999' ? undefined : parseInt(v));
                onFiltersChange({
                  ...filters,
                  [minBudgetOrRateKey]: min || undefined,
                  [maxBudgetOrRateKey]: max || undefined
                });
              }
            }}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder={activeTab === 'projects' ? 'All Budgets' : 'All Rates'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {activeTab === 'projects' ? 'All Budgets' : 'All Rates'}
              </SelectItem>
              {(activeTab === 'projects' ? BUDGET_RANGES : RATE_RANGES).slice(1).map((range) => (
                <SelectItem
                  key={range.label}
                  value={`${range.min || 0}-${range.max || 999999}`}
                >
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
        {activeTab === 'freelancers' && (
        <div>
          <Label className="font-medium">Location</Label>
          <Input
            placeholder="Enter location..."
            value={(filters as FreelancerFilters).location || ''}
            onChange={(e) => updateFilters('location', e.target.value)}
            className="mt-2"
          />
        </div>
        )}

        {/* Experience Level (for freelancers) */}
        {activeTab === 'freelancers' && (
          <div>
            <Label className="font-medium">
              <span className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                Experience Level
              </span>
            </Label>
            <Select
              value={(filters as FreelancerFilters).minExperience?.toString() || 'all'}
              onValueChange={(value) =>
                updateFilters('minExperience', value === 'all' ? undefined : parseInt(value))
              }
            >
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {EXPERIENCE_LEVELS.map((level) => (
                  <SelectItem key={level.label} value={level.minYears.toString()}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Skills */}
        {availableSkills.length > 0 && (
          <div>
            <Label className="font-medium">Skills & Technologies</Label>
            <div className="mt-3 flex flex-wrap gap-2">
              {availableSkills.slice(0, 15).map((skill) => (
                <Badge
                  key={skill}
                  variant={(filters.skills || []).includes(skill) ? 'default' : 'secondary'}
                  onClick={() => toggleSkill(skill)}
                  className="cursor-pointer"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'freelancers' && (
          <>
            {/* Rating Filter */}
            <div>
              <Label className="font-medium">Minimum Rating</Label>
              <div className="mt-3 space-y-2">
                {[5, 4, 3].map((rating) => (
                  <div key={rating} className="flex items-center space-x-2">
                  <Checkbox
                    id={`rating-${rating}`}
                    checked={(filters as any).minRating === rating}
                    onCheckedChange={(checked) =>
                      updateFilters('minRating', checked ? rating : undefined)
                    }
                  />
                    <Label
                      htmlFor={`rating-${rating}`}
                      className="flex items-center space-x-1 text-sm font-normal cursor-pointer"
                    >
                      <span>{rating}</span>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>& up</span>
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <Label className="font-medium">Availability</Label>
              <div className="mt-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="available"
                    checked={(filters as any).availableOnly || false}
                    onCheckedChange={(checked) => updateFilters('availableOnly', checked)}
                  />
                  <Label htmlFor="available" className="text-sm font-normal cursor-pointer">
                    Available now
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="top-rated"
                    checked={(filters as any).topRatedOnly || false}
                    onCheckedChange={(checked) => updateFilters('topRatedOnly', checked)}
                  />
                  <Label htmlFor="top-rated" className="text-sm font-normal cursor-pointer">
                    Top Rated
                  </Label>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
