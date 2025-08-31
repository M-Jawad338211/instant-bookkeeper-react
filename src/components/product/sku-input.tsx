import { useAvailableSKUs } from "@/services/sku-hooks";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

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
import clsx from "clsx";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useState } from "react";
import { CreateSKUFormPopover } from "./create-sku-popover";

export function SKUInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (values: string[]) => void;
}) {
  const [open, setOpen] = useState(false);
  const { data: skusData, isLoading } = useAvailableSKUs();

  const { availableSkus } = skusData || {};

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={isLoading} asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={clsx(
            "w-full h-auto justify-between hover:bg-background",
            !value.length && "text-muted-foreground"
          )}
        >
          {value.length ? (
            <span className="inline-flex flex-wrap text-left gap-1 w-[90%] overflow-auto scrollbar-hide">
              {value.map((val) => (
                <Badge key={val} variant={"secondary"}>
                  {val}
                  <span
                    role="button"
                    className="ml-1 text-sm opacity-70 hover:opacity-100"
                    onClick={() => onChange(value.filter((x) => x !== val))}
                    aria-label={`remove ${val}`}
                  >
                    ×
                  </span>
                </Badge>
              ))}
            </span>
          ) : (
            "Add SKUs"
          )}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[460px] p-0">
        <Command>
          <CommandInput placeholder="Search SKUs..." />
          <CommandList>
            <CommandEmpty>
              <div className="flex flex-col items-center gap-2 py-4">
                <span>No SKUs found.</span>
                <CreateSKUFormPopover
                  trigger={<Button size="sm">+ Create new SKU</Button>}
                />
              </div>
            </CommandEmpty>

            <CommandGroup>
              {availableSkus?.map((sku) => (
                <CommandItem
                  key={sku.sku}
                  value={sku.sku}
                  onSelect={(currentValue) => {
                    setOpen(false);
                    if (value.includes(currentValue)) {
                      onChange(value.filter((val) => val !== currentValue));
                      return;
                    }
                    onChange([...value, currentValue]);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(sku.sku) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {sku.sku}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
