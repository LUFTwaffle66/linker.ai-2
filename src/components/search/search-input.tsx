'use client';

import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  showSearchButton?: boolean;
  showClearButton?: boolean;
  inputClassName?: string;
  autoFocus?: boolean;
  disabled?: boolean;
}

/**
 * SearchInput Component
 *
 * A reusable search input component with support for:
 * - Search icon
 * - Clear button
 * - Enter key to search
 * - Optional search button
 *
 * Future improvements (see SEARCH_IMPROVEMENT_PLAN.md):
 * - Debouncing
 * - Auto-suggestions
 * - Recent searches
 * - Voice search
 * - Fuzzy search
 */
export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = 'Search...',
  className,
  showSearchButton = true,
  showClearButton = true,
  inputClassName,
  autoFocus = false,
  disabled = false,
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch(value);
    }
  };

  const handleClear = () => {
    onChange('');
    onSearch('');
  };

  const handleSearchClick = () => {
    onSearch(value);
  };

  return (
    <div className={cn('flex gap-3', className)}>
      {/* Search Input Container */}
      <div className="flex-1 relative">
        {/* Search Icon */}
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 pointer-events-none" />

        {/* Input Field */}
        <Input
          type="text"
          placeholder={placeholder}
          className={cn(
            'pl-10 h-12',
            showClearButton && value ? 'pr-10' : '',
            inputClassName
          )}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoFocus={autoFocus}
          disabled={disabled}
        />

        {/* Clear Button */}
        {showClearButton && value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Search Button (Optional) */}
      {showSearchButton && (
        <Button
          size="lg"
          className="h-12 px-8"
          onClick={handleSearchClick}
          disabled={disabled}
        >
          Search
        </Button>
      )}
    </div>
  );
}

/**
 * SearchInputCompact Component
 *
 * A compact version without the search button
 */
export function SearchInputCompact(props: Omit<SearchInputProps, 'showSearchButton'>) {
  return <SearchInput {...props} showSearchButton={false} />;
}
