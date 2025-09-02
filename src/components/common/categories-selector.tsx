import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useCategories } from "@/services/product-hooks";
import { useDebounce } from "use-debounce";
import React, { useState, useCallback } from "react";
import type { ProductCategory } from "../product/types";

type CategorySelectProps = {
  value?: string;
  onChange: (value: ProductCategory | undefined) => void;
};

export function CategorySelect({ value, onChange }: CategorySelectProps) {
  const [open, setOpen] = useState(false);

  const [localSearch, setLocalSearch] = useState("");
  const [debouncedSearch] = useDebounce(localSearch, 500);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useCategories({
      pageNumber: 1,
      pageSize: 50,
      searchTerm: debouncedSearch,
    });

  const categories =
    data?.pages.flatMap((page) => page.productCategories) ?? [];

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (
        scrollHeight - scrollTop <= clientHeight + 40 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  return (
    <div className="col-span-12 md:col-span-3">
      <Label className="mb-2">Category</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              !value && "text-muted-foreground"
            )}
          >
            {value
              ? categories.find((c) => String(c.id) === value)?.categoryName
              : "Select category..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput
              placeholder="Search categories..."
              value={localSearch}
              onValueChange={setLocalSearch}
            />

            <CommandList
              onScroll={handleScroll}
              className="max-h-80 overflow-y-auto"
            >
              <CommandEmpty>
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2 py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading…
                  </span>
                ) : (
                  "No category found."
                )}
              </CommandEmpty>

              <CommandGroup>
                {categories.map((cat) => (
                  <CommandItem
                    key={cat.id}
                    value={cat.categoryName}
                    onSelect={() => {
                      onChange(cat);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === String(cat.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {cat.categoryName}
                  </CommandItem>
                ))}

                {isFetchingNextPage && (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
