import ProductFilters from "@/components/common/product-filters";
import { AddProduct } from "@/components/product/add-product";
import { AssignProductsModal } from "@/components/product/assign-product";
import { ProductsTable } from "@/components/product/products-table";
import { ViewEditProduct } from "@/components/product/view-product";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/services/product-hooks";
import type { SKU } from "@/services/sku.service";
import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function ProductsPage() {
  const { data, isLoading, isError, error } = useProducts();

  const [editOpen, setEditOpen] = useState(false);
  const [productId, setProductId] = useState<number | null>(null);
  const openEdit = (p: number) => {
    setProductId(p);
    setEditOpen(true);
  };

  const [addOpen, setAddOpen] = useState(false);
  const [presetSKU, setPresetSKU] = useState<SKU | undefined>(undefined);

  const [assignOpen, setAssignOpen] = useState(false);

  const loadingCount = useRef(0);

  useEffect(() => {
    if (isLoading) {
      if (loadingCount.current > 0) return;
      loadingCount.current = 1;
    }
  }, [isLoading]);

  return (
    <div className="space-y-6">
      {/* Title + actions */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">
            Catalog overview, with filters, edit, add & assign.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setAssignOpen(true)}>
            Assign Products
          </Button>
          <Button
            onClick={() => {
              setPresetSKU(undefined);
              setAddOpen(true);
            }}
          >
            <Plus className="mr-2 size-4" /> Add Product
          </Button>
        </div>
      </div>
      {/* Filters */}
      <ProductFilters />
      {/* Table */}
      {isLoading ? (
        <div className="h-96  flex items-center justify-center">
          <p className="font-medium text-muted-foreground text-2xl">
            Loading...
          </p>
        </div>
      ) : !data || isError ? (
        <div className="h-96  flex items-center justify-center">
          <p className="font-medium text-muted-foreground text-lg">
            {isError
              ? error.message
              : "Something went wrong while fetching products"}
          </p>
        </div>
      ) : (
        <div className="relative">
          <ProductsTable data={data} onEdit={openEdit} />
          {isLoading && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center"></div>
          )}
        </div>
      )}

      {/* Modals */}
      <ViewEditProduct
        open={editOpen}
        onOpenChange={setEditOpen}
        productId={productId}
      />
      <AddProduct
        open={addOpen}
        onOpenChange={setAddOpen}
        existingProducts={data?.products || []}
        presetSKU={presetSKU}
        onOpenExisting={(id) => {
          const p = data?.products?.find((x) => x.id === id);
          if (p) {
            setAddOpen(false);
            openEdit(p.id);
          }
        }}
      />
      <AssignProductsModal
        open={assignOpen}
        onOpenChange={setAssignOpen}
        products={data?.products || []}
        onNewFromSKU={(sku) => {
          setPresetSKU({ sku });
          setAddOpen(true);
        }}
      />
    </div>
  );
}
