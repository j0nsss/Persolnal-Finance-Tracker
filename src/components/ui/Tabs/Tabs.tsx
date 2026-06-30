import * as RadixTabs from "@radix-ui/react-tabs";
import { cn } from "../../../lib/utils";

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  tabs: { value: string; label: string }[];
  className?: string;
}

export function Tabs({ value, onValueChange, tabs, className }: TabsProps) {
  return (
    <RadixTabs.Root value={value} onValueChange={onValueChange}>
      <RadixTabs.List
        className={cn(
          "flex border-b-3 border-base-ink",
          className,
        )}
      >
        {tabs.map((tab) => (
          <RadixTabs.Trigger
            key={tab.value}
            value={tab.value}
            className={cn(
              "font-display font-bold text-sm px-5 py-3 border-b-3 -mb-[3px] transition-colors",
              "data-[state=active]:border-base-ink data-[state=inactive]:border-transparent",
              "data-[state=active]:bg-accent-lime data-[state=inactive]:bg-transparent",
              "data-[state=inactive]:hover:bg-base-ink/5",
            )}
          >
            {tab.label}
          </RadixTabs.Trigger>
        ))}
      </RadixTabs.List>
    </RadixTabs.Root>
  );
}
