'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

type SingleValue = string | null | undefined;
type MultipleValue = string[];

type AccordionContextValue = {
  type: 'single' | 'multiple';
  collapsible?: boolean;
  openValues: string[];
  toggle: (value: string) => void;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(null);
const AccordionItemContext = React.createContext<string | null>(null);

function useAccordionContext() {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error('Accordion components must be used within <Accordion>');
  return context;
}

function useAccordionItemContext() {
  const context = React.useContext(AccordionItemContext);
  if (!context) throw new Error('<AccordionItem> components must wrap triggers and content.');
  return context;
}

type AccordionProps = React.HTMLAttributes<HTMLDivElement> & {
  type?: 'single' | 'multiple';
  defaultValue?: SingleValue | MultipleValue;
  value?: SingleValue | MultipleValue;
  onValueChange?: (value: SingleValue | MultipleValue) => void;
  collapsible?: boolean;
};

function toArray(value: SingleValue | MultipleValue | undefined, type: 'single' | 'multiple') {
  if (type === 'single') {
    return typeof value === 'string' ? [value] : [];
  }

  return Array.isArray(value) ? value : [];
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      className,
      children,
      type = 'single',
      defaultValue,
      value,
      onValueChange,
      collapsible = false,
      ...props
    },
    ref,
  ) => {
    const isControlled = value !== undefined;
    const [internalValue, setInternalValue] = React.useState(() =>
      toArray(defaultValue, type),
    );

    const openValues = isControlled ? toArray(value, type) : internalValue;

    const setValues = (next: string[]) => {
      if (!isControlled) {
        setInternalValue(next);
      }

      if (onValueChange) {
        onValueChange(type === 'single' ? (next[0] ?? null) : next);
      }
    };

    const toggle = (item: string) => {
      if (type === 'single') {
        const isOpen = openValues[0] === item;
        const next = isOpen ? (collapsible ? [] : openValues) : [item];
        setValues(next);
        return;
      }

      const isOpen = openValues.includes(item);
      const next = isOpen ? openValues.filter((v) => v !== item) : [...openValues, item];
      setValues(next);
    };

    return (
      <AccordionContext.Provider value={{ type, collapsible, openValues, toggle }}>
        <div ref={ref} className={cn('w-full', className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  },
);
Accordion.displayName = 'Accordion';

type AccordionItemProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
};

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, children, ...props }, ref) => {
    return (
      <AccordionItemContext.Provider value={value}>
        <div
          ref={ref}
          className={cn('border-b border-border/60', className)}
          data-accordion-item
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  },
);
AccordionItem.displayName = 'AccordionItem';

type AccordionTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { openValues, toggle } = useAccordionContext();
    const value = useAccordionItemContext();
    const isOpen = openValues.includes(value);

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'flex w-full items-center justify-between py-4 text-left text-sm font-medium transition-colors hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          className,
        )}
        onClick={() => toggle(value)}
        aria-expanded={isOpen}
        data-state={isOpen ? 'open' : 'closed'}
        {...props}
      >
        <span className="flex-1">{children}</span>
        <ChevronDown
          className={cn(
            'ml-4 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200',
            isOpen && 'rotate-180',
          )}
          aria-hidden
        />
      </button>
    );
  },
);
AccordionTrigger.displayName = 'AccordionTrigger';

type AccordionContentProps = React.HTMLAttributes<HTMLDivElement>;

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    const { openValues } = useAccordionContext();
    const value = useAccordionItemContext();
    const isOpen = openValues.includes(value);

    return (
      <div
        ref={ref}
        className={cn(
          'overflow-hidden text-sm text-muted-foreground data-[state=closed]:hidden',
          className,
        )}
        data-state={isOpen ? 'open' : 'closed'}
        hidden={!isOpen}
        {...props}
      >
        <div className="pb-4 pt-0">{children}</div>
      </div>
    );
  },
);
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger };
