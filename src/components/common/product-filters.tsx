import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useDebounce } from "use-debounce";
import { BrandSelect } from "./brand-selector";
import { CategorySelect } from "./categories-selector";
import type { Brand, ProductCategory } from "../product/types";

export default function ProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchValue, setSearchValue] = useState(
    searchParams.get("searchTerm") || ""
  );

  const updateParam = (key: string, value: string | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value) newParams.delete(key);
    else newParams.set(key, value);

    newParams.set("pageNumber", "1");
    setSearchParams(newParams);
  };

  const [debouncedSearch] = useDebounce(searchValue, 500);

  useEffect(() => {
    updateParam("searchTerm", debouncedSearch || undefined);
  }, [debouncedSearch]);

  const brandId = searchParams.get("brandId") || "";
  const categoryId = searchParams.get("productCategoryId") || "";

  return (
    <Card className="rounded-2xl gap-0">
      <CardHeader className="pb-0">
        <CardTitle className="text-base flex items-center gap-2">
          <Filter className="size-4" /> Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="px-6 grid grid-cols-12 gap-3">
        <div className="col-span-12 md:col-span-5">
          <Label className="mb-2">Search</Label>
          <Input
            placeholder="Search name, SKU, ASIN, UPC, brand, category"
            value={searchValue}
            className="placeholder:font-semibold"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <BrandSelect
            key={`brand-${brandId || "all"}`}
            value={brandId || undefined}
            onChange={(brand: Brand | undefined) =>
              updateParam("brandId", String(brand?.id))
            }
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <CategorySelect
            key={`cat-${categoryId || "all"}`}
            value={categoryId || undefined}
            onChange={(category: ProductCategory | undefined) =>
              updateParam("productCategoryId", String(category?.id))
            }
          />
        </div>
        <div className="col-span-12 md:col-span-1 flex items-end">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => {
              setSearchParams({});
              setSearchValue("");
            }}
          >
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
