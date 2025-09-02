import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currency } from "@/lib/utils";
import { Boxes, SquarePen } from "lucide-react";
import React from "react";
import { CompactTags } from "../common/compact-tags";
import type { Product } from "./types";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Badge } from "../ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "react-router";
import type { ProductsResponse } from "@/services/product.service";
import { MAX_VISIBLE_PAGES } from "@/lib/constants";

export const ProductsTable: React.FC<{
  data: ProductsResponse;
  onEdit: (productId: number) => void;
}> = ({ data, onEdit }) => {
  const { products, totalItems } = data;
  const [searchParams, setSearchParams] = useSearchParams();

  const pageNumber = Number(searchParams.get("pageNumber")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || 10;

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const updateParam = (key: string, value: string | number | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value) newParams.delete(key);
    else newParams.set(key, String(value));
    setSearchParams(newParams);
  };

  const changePage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    updateParam("pageNumber", page);
  };

  const { start, end } = getVisiblePages(pageNumber, totalPages);

  return (
    <Card className="rounded-2xl gap-0">
      <CardHeader className="pb-0">
        <CardTitle className="text-base flex items-center gap-2">
          <Boxes className="size-4" /> Products
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-xl">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[260px] w-[380px]">
                  Product Name
                </TableHead>
                <TableHead>SKUs</TableHead>
                <TableHead>ASINs</TableHead>
                <TableHead>UPCs</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Total Sold</TableHead>
                <TableHead className="text-right">Total Profit</TableHead>
                <TableHead className="text-center w-[124px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!products.length && (
                <TableRow>
                  <TableCell colSpan={9} className="text-center p-10">
                    <p className="text-lg font-semibold">No products found</p>
                  </TableCell>
                </TableRow>
              )}
              {products.map((p: Product) => (
                <TableRow key={p.id}>
                  <TableCell>{p.productName}</TableCell>
                  <TableCell>
                    <CompactTags list={p.skus} variant="secondary" />
                  </TableCell>
                  <TableCell className="text-center">
                    {p.asins?.length ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Badge variant="outline" className="cursor-pointer">
                            {p.asins.length}
                          </Badge>
                        </PopoverTrigger>
                        <PopoverContent className="p-2 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {p.asins.map((v) => (
                              <Badge key={v} variant="outline">
                                {v}
                              </Badge>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {p.upcs?.length ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Badge variant="outline" className="cursor-pointer">
                            {p.upcs.length}
                          </Badge>
                        </PopoverTrigger>
                        <PopoverContent className="p-2 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {p.upcs.map((v) => (
                              <Badge key={v} variant="outline">
                                {v}
                              </Badge>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    ) : (
                      "—"
                    )}
                  </TableCell>
                  <TableCell>{p.brandName || "—"}</TableCell>
                  <TableCell>{p.categoryName || "—"}</TableCell>
                  <TableCell className="text-right">
                    {p.totalSold ?? "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    ${currency(p.totalProfit)}
                  </TableCell>
                  <TableCell className="text-center w-[124px]">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-7 text-xs px-2 cursor-pointer"
                      onClick={() => onEdit(p.id)}
                    >
                      <SquarePen />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Rows per page
            </span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                const paramsObj = Object.fromEntries(searchParams.entries());

                setSearchParams({
                  ...paramsObj,
                  pageSize: String(v),
                  pageNumber: "1",
                });
              }}
            >
              <SelectTrigger className="w-[90px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => changePage(pageNumber - 1)}
                  className={
                    pageNumber <= 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {/* Left ellipsis */}
              {start > 1 && (
                <>
                  <PaginationItem>
                    <PaginationLink onClick={() => changePage(1)}>
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {start > 2 && <PaginationEllipsis />}
                </>
              )}

              {/* Visible pages */}
              {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
                (p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      isActive={p === pageNumber}
                      onClick={() => changePage(p)}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              {/* Right ellipsis */}
              {end < totalPages && (
                <>
                  {end < totalPages - 1 && <PaginationEllipsis />}
                  <PaginationItem>
                    <PaginationLink onClick={() => changePage(totalPages)}>
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => changePage(pageNumber + 1)}
                  className={
                    pageNumber >= totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>
    </Card>
  );
};

const getVisiblePages = (page: number, totalPages: number) => {
  const half = Math.floor(MAX_VISIBLE_PAGES / 2);

  let start = Math.max(1, page - half);
  let end = Math.min(totalPages, page + half);

  if (end - start + 1 < MAX_VISIBLE_PAGES) {
    if (start === 1) {
      end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);
    } else if (end === totalPages) {
      start = Math.max(1, end - MAX_VISIBLE_PAGES + 1);
    }
  }

  return { start, end };
};
