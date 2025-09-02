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
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import React, { useState, useCallback } from "react";
import { useInfiniteProducts } from "@/services/product-hooks"; // new hook
import { useDebounce } from "use-debounce";

type ProductComboboxProps = {
  value?: number;
  onValueChange: (value: number) => void;
};

export const ProductCombobox: React.FC<ProductComboboxProps> = ({
  value,

  onValueChange,
}) => {
  const [open, setOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [debouncedSearch] = useDebounce(localSearch, 500);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useInfiniteProducts({
      pageNumber: 1,
      pageSize: 50,
      searchTerm: debouncedSearch,
    });

  const products = data?.pages.flatMap((page) => page.products) ?? [];

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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? products.find((p) => p.id === value)?.productName
            : "Select product..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[460px] p-0">
        <Command>
          <CommandInput
            placeholder="Search products..."
            value={localSearch}
            onValueChange={setLocalSearch}
          />
          <CommandList
            onScroll={handleScroll}
            className="max-h-[300px] overflow-y-auto"
          >
            <CommandEmpty>
              {isLoading ? (
                <span className="flex items-center justify-center gap-2 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading…
                </span>
              ) : (
                "No product found."
              )}
            </CommandEmpty>
            <CommandGroup>
              {products.map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.productName}
                  onSelect={() => {
                    onValueChange(product.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === product.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {product.productName}
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
  );
};
