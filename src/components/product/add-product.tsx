/* =====================================================
 Add Product modal (supports preset SKU)
 + NEW: Search existing products at top of dialog
===================================================== */

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { createProduct, type ProductPayload } from "@/services/product.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { ProductForm } from "./product-form";
import { ProductCombobox } from "./product-search";
import type { Product } from "./types";
import { toast } from "sonner";
import type { SKU } from "@/services/sku.service";

const defaultValues = {
  productName: "",
  brandId: 0,
  brandName: "",
  productCategoryId: 0,
  productCategoryName: "",
  asins: [],
  skus: [],
  upcs: [],
  totalSold: 0,
  totalProfit: 0,
};

export const AddProduct: React.FC<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
  existingProducts: Product[];
  presetSKU?: SKU;
  onOpenExisting?: (productId: number) => void;
}> = ({ open, onOpenChange, existingProducts, onOpenExisting, presetSKU }) => {
  const { mutate, isPending } = useMutation({
    mutationKey: ["create-product"],
    mutationFn: createProduct,
  });

  const queryClient = useQueryClient();

  const handleCreateProduct = (payload: ProductPayload) => {
    mutate(payload, {
      onSuccess: () => {
        toast("A new Product has been added", { position: "top-right" });
        onOpenChange(false);
        queryClient.invalidateQueries({ queryKey: ["products"] });
        queryClient.invalidateQueries({ queryKey: ["available-skus"] });
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="Add Product Form" className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>New Product</DialogTitle>
        </DialogHeader>
        {/* Quick check: does it already exist? */}
        <div className="mb-3">
          <Label>Search existing products</Label>
          <div className="mt-1">
            <ProductCombobox
              value={undefined}
              onValueChange={(id) => onOpenExisting?.(id)}
            />
          </div>
        </div>
        <ProductForm
          mode="add"
          presetSKU={presetSKU}
          onSubmit={handleCreateProduct}
          defaultValues={defaultValues}
        />
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button form="productForm" disabled={isPending}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
