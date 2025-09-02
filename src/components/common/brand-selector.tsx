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
import { useBrands } from "@/services/product-hooks";
import { useDebounce } from "use-debounce";
import React, { useState, useCallback } from "react";
import clsx from "clsx";
import type { Brand } from "../product/types";

type BrandSelectProps = {
  value?: string;
  onChange: (value: Brand | undefined) => void;
};

export function BrandSelect({ value, onChange }: BrandSelectProps) {
  const [open, setOpen] = useState(false);

  const [localSearch, setLocalSearch] = useState("");
  const [debouncedSearch] = useDebounce(localSearch, 500);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useBrands({
      pageNumber: 1,
      pageSize: 50,
      searchTerm: debouncedSearch,
    });

  const brands = data?.pages.flatMap((page) => page.brands) ?? [];

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
      <Label className="mb-2">Brand</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={clsx(
              "w-full justify-between",
              !value && "text-muted-foreground"
            )}
          >
            {value
              ? brands.find((b) => String(b.id) === value)?.brandName
              : "Select brand..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Command>
            <CommandInput
              placeholder="Search brands..."
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
                  "No brand found."
                )}
              </CommandEmpty>

              <CommandGroup>
                {brands.map((brand) => (
                  <CommandItem
                    key={brand.id}
                    value={brand.brandName}
                    onSelect={() => {
                      onChange(brand);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === String(brand.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {brand.brandName}
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
