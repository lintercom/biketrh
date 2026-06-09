"use client";

import { useMemo, useState } from "react";
import { catalogCategories, defaultCatalogCategory } from "@/lib/catalog";

type CategoryFieldsProps = {
  defaultCategory?: string;
  defaultSubcategory?: string;
};

export function CategoryFields({ defaultCategory = "", defaultSubcategory = "" }: CategoryFieldsProps) {
  const initialCategory = catalogCategories.find((category) => category.label === defaultCategory) ?? null;
  const initialSubcategory =
    initialCategory?.subcategories.some((subcategory) => subcategory.label === defaultSubcategory) ? defaultSubcategory : "";
  const [categoryValue, setCategoryValue] = useState(initialCategory?.label ?? "");
  const [subcategoryValue, setSubcategoryValue] = useState(initialSubcategory);

  const activeCategory = useMemo(
    () => catalogCategories.find((category) => category.label === categoryValue) ?? null,
    [categoryValue]
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label className="text-sm font-semibold text-ink" htmlFor="category">
          Hlavní kategorie
        </label>
        <select
          id="category"
          name="category"
          required
          value={categoryValue}
          onChange={(event) => {
            setCategoryValue(event.target.value);
            setSubcategoryValue("");
          }}
          className="mt-2 w-full px-3 py-3"
        >
          <option value="" disabled>
            Vyberte kategorii
          </option>
          {catalogCategories.map((category) => (
            <option key={category.label} value={category.label}>
              {category.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold text-ink" htmlFor="subcategory">
          Podkategorie
        </label>
        <select
          id="subcategory"
          name="subcategory"
          required
          disabled={!activeCategory}
          value={subcategoryValue}
          onChange={(event) => setSubcategoryValue(event.target.value)}
          className="mt-2 w-full px-3 py-3 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500"
        >
          <option value="" disabled>
            {activeCategory ? "Vyberte podkategorii" : `Nejprve vyberte ${defaultCatalogCategory.label.toLowerCase()}`}
          </option>
          {activeCategory?.subcategories.map((subcategory) => (
            <option key={subcategory.label} value={subcategory.label}>
              {subcategory.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
