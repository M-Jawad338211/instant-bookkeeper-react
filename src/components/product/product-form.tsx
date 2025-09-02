/* =====================================================
 Product form (Add/Edit)
 - Product name disabled in edit
 - Totals are ALWAYS read-only
===================================================== */

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProductPayload } from "@/services/product.service";
import type { SKU } from "@/services/sku.service";
import { yupResolver } from "@hookform/resolvers/yup";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { BrandSelect } from "../common/brand-selector";
import { CategorySelect } from "../common/categories-selector";
import { TagInput } from "../common/tag-input";
import { Button } from "../ui/button";
import { CreateSKUFormPopover } from "./create-sku-popover";
import { SKUInput } from "./sku-input";
import { productSchema } from "./validation";

export type DefaultValues = ProductPayload; // May extend in future

export const ProductForm: React.FC<{
  mode: "add" | "edit";
  defaultValues?: DefaultValues;
  presetSKU?: SKU;
  onSubmit: (payload: ProductPayload) => void;
}> = ({ mode, defaultValues, presetSKU, onSubmit }) => {
  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProductPayload>({
    resolver: yupResolver(productSchema),
    defaultValues: {
      ...defaultValues,
      skus: presetSKU ? [presetSKU] : defaultValues?.skus,
    },
  });

  return (
    <form
      id="productForm"
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-12 gap-3"
    >
      {/* Product Name */}
      <div className="col-span-12">
        <Label className="mb-2">Product Name</Label>
        <Input {...register("productName")} disabled={mode === "edit"} />
        {errors.productName && (
          <p className="text-red-500 text-sm">{errors.productName.message}</p>
        )}
      </div>

      {/* Brand */}
      <div className="col-span-12 md:col-span-6">
        <Controller
          name="brandId"
          control={control}
          render={({ field }) => (
            <BrandSelect
              onChange={(brand) => {
                field.onChange(brand?.id);
                setValue("brandName", brand?.brandName || "");
              }}
              value={field.value ? String(field.value) : ""}
            />
          )}
        />
        {errors.brandName && (
          <p className="text-red-500 text-sm">{errors.brandName.message}</p>
        )}
      </div>

      {/* Category */}
      <div className="col-span-12 md:col-span-6">
        <Controller
          name="productCategoryId"
          control={control}
          render={({ field }) => (
            <CategorySelect
              onChange={(category) => {
                field.onChange(category?.id);
                setValue("productCategoryName", category?.categoryName || "");
              }}
              value={field.value ? String(field.value) : ""}
            />
          )}
        />

        {errors.productCategoryId && (
          <p className="text-red-500 text-sm">
            {errors.productCategoryId.message}
          </p>
        )}
      </div>

      {/* SKUs */}
      <div className="col-span-12">
        <Label className="flex items-center justify-between gap-2 mb-2">
          <span>SKUs</span>
          <CreateSKUFormPopover
            trigger={
              <Button size={"sm"} variant={"link"} className="p-0  h-4">
                Create New
              </Button>
            }
          />
        </Label>
        <Controller
          control={control}
          name="skus"
          render={({ field }) => (
            <SKUInput
              value={field.value.map((val) => val.sku)}
              onChange={(values: string[]) =>
                field.onChange(
                  values.map((val) => ({
                    sku: val,
                  }))
                )
              }
            />
          )}
        />
        {errors.skus && (
          <p className="text-red-500 text-sm">At least one SKU is required</p>
        )}
      </div>

      {/* ASINs */}
      <div className="col-span-12">
        <Label className="flex items-center gap-2 mb-2">ASINs</Label>
        <Controller
          control={control}
          name="asins"
          render={({ field }) => (
            <TagInput {...field} placeholder="Add ASIN and press Enter" />
          )}
        />
        {errors.asins && (
          <p className="text-red-500 text-sm">
            {errors.asins.message as string}
          </p>
        )}
      </div>

      {/* UPCs */}
      <div className="col-span-12">
        <Label className="flex items-center gap-2 mb-2">UPCs</Label>
        <Controller
          control={control}
          name="upcs"
          render={({ field }) => (
            <TagInput {...field} placeholder="Add UPC and press Enter" />
          )}
        />
        {errors.upcs && (
          <p className="text-red-500 text-sm">
            {errors.upcs.message as string}
          </p>
        )}
      </div>

      {/* Read-only totals */}
      {/* {mode === "edit" && (
        <>
          <div className="col-span-6">
            <Label className="mb-2">Total Sold (read-only)</Label>
            <Input
              type="number"
              value={defaultValues?.totalSold ?? 0}
              readOnly
              disabled
            />
          </div>
          <div className="col-span-6">
            <Label className="mb-2">Total Profit (read-only)</Label>
            <Input
              type="number"
              value={defaultValues?.totalProfit ?? 0}
              readOnly
              disabled
            />
          </div>
        </>
      )} */}
    </form>
  );
};
